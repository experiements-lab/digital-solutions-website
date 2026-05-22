"use strict";

const express = require("express");
const fetch   = require("node-fetch");

const app         = express();
const HYDRA_ADMIN = process.env.HYDRA_ADMIN_URL || "http://hydra:4445";
const PORT        = process.env.PORT || 3000;

// Helper: call Hydra admin API
async function hydra(path, method = "GET", body) {
  const res = await fetch(`${HYDRA_ADMIN}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hydra ${method} ${path} → ${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── GET /consent?consent_challenge=<token> ───────────────────────────────────
// Hydra redirects here after Kratos accepts the login.
// We auto-accept: grant all requested scopes and embed email into the ID token.
// For a first-party service there is nothing to ask the user — they already
// authenticated. Show a consent screen here only if you build a third-party
// OAuth2 marketplace.
app.get("/consent", async (req, res) => {
  const challenge = req.query.consent_challenge;
  if (!challenge) return res.status(400).send("Missing consent_challenge");

  try {
    const consentReq = await hydra(
      `/admin/oauth2/auth/requests/consent?consent_challenge=${challenge}`
    );

    // Skip the consent screen if the user already granted consent previously.
    if (consentReq.skip) {
      const { redirect_to } = await hydra(
        `/admin/oauth2/auth/requests/consent/accept?consent_challenge=${challenge}`,
        "PUT",
        { grant_scope: consentReq.requested_scope, remember: true, remember_for: 3600 }
      );
      return res.redirect(redirect_to);
    }

    const { redirect_to } = await hydra(
      `/admin/oauth2/auth/requests/consent/accept?consent_challenge=${challenge}`,
      "PUT",
      {
        grant_scope:                 consentReq.requested_scope,
        grant_access_token_audience: consentReq.requested_access_token_audience,
        remember:     true,
        remember_for: 3600,
        session: {
          id_token: {
            // Embed the subject (Kratos identity ID) and any context Kratos passed.
            sub:   consentReq.subject,
            email: consentReq.context?.traits?.email,
            name:  consentReq.context?.traits?.name,
          },
        },
      }
    );

    res.redirect(redirect_to);
  } catch (err) {
    console.error("[consent]", err.message);
    res.status(500).send(`Consent error: ${err.message}`);
  }
});

// ── GET /logout?logout_challenge=<token> ────────────────────────────────────
// Hydra redirects here when a client initiates RP-initiated logout.
app.get("/logout", async (req, res) => {
  const challenge = req.query.logout_challenge;
  if (!challenge) return res.redirect(`${process.env.UI_URL || "http://localhost:4455"}/login`);

  try {
    const { redirect_to } = await hydra(
      `/admin/oauth2/auth/requests/logout/accept?logout_challenge=${challenge}`,
      "PUT",
      {}
    );
    res.redirect(redirect_to);
  } catch (err) {
    console.error("[logout]", err.message);
    res.redirect(`${process.env.UI_URL || "http://localhost:4455"}/login`);
  }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Consent app listening on :${PORT}`));
