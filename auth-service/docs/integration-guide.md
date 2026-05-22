# Integrating Your App with the Auth Service

This guide covers how any application connects to the auth service.
The auth service speaks standard OAuth2/OIDC — every major language has
a library that handles the protocol for you.

---

## Step 1 — Register your app as an OAuth2 client

Run this once per application:

```bash
make add-client
# Prompts for app name and redirect URI
# Returns client_id and client_secret — save these
```

---

## Step 2 — Implement the Authorization Code flow

### What it looks like from the user's perspective

1. User clicks "Sign in" in your app
2. Browser redirects to the auth service login page
3. User signs in (or creates an account)
4. Browser redirects back to your app with an auth code
5. Your server exchanges the code for tokens
6. Your app has an access token and knows who the user is

### The URLs

| What | URL |
|------|-----|
| Authorization endpoint | `http://localhost:4444/oauth2/auth` |
| Token endpoint         | `http://localhost:4444/oauth2/token` |
| JWKS (token verification) | `http://localhost:4444/.well-known/jwks.json` |
| OIDC discovery         | `http://localhost:4444/.well-known/openid-configuration` |
| Logout                 | `http://localhost:4444/oauth2/sessions/logout` |

Replace `localhost:4444` with your deployed domain in production.

### Recommended scopes

```
openid    — required for ID token
email     — user's email in the token
profile   — user's name in the token
offline   — include refresh token (for long-lived sessions)
```

---

## Integration Examples

### Python / Flask

Use [Authlib](https://docs.authlib.org/en/latest/client/flask.html):

```python
from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)
oauth.register(
    name='auth_service',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    server_metadata_url='http://localhost:4444/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile offline'},
)

@app.route('/login')
def login():
    redirect_uri = url_for('auth_callback', _external=True)
    return oauth.auth_service.authorize_redirect(redirect_uri)

@app.route('/auth/callback')
def auth_callback():
    token = oauth.auth_service.authorize_access_token()
    user  = token['userinfo']  # contains email, name, sub (identity ID)
    session['user'] = user
    return redirect('/')
```

### Node.js / Express

Use [openid-client](https://github.com/panva/node-openid-client):

```js
import { Issuer } from 'openid-client';

const issuer = await Issuer.discover('http://localhost:4444');
const client = new issuer.Client({
  client_id:     'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  redirect_uris: ['http://localhost:3000/auth/callback'],
  response_types: ['code'],
});

// Login route
app.get('/login', (req, res) => {
  const { url, code_verifier, state } = client.authorizationUrl({
    scope: 'openid email profile offline',
    code_challenge_method: 'S256',
  });
  req.session.code_verifier = code_verifier;
  req.session.state = state;
  res.redirect(url);
});

// Callback route
app.get('/auth/callback', async (req, res) => {
  const params = client.callbackParams(req);
  const tokens = await client.callback(
    'http://localhost:3000/auth/callback',
    params,
    { code_verifier: req.session.code_verifier, state: req.session.state }
  );
  const user = tokens.claims(); // { sub, email, name, ... }
  req.session.user = user;
  res.redirect('/');
});
```

### Next.js

Use [NextAuth.js](https://next-auth.js.org/) with a custom provider:

```js
// pages/api/auth/[...nextauth].js
export default NextAuth({
  providers: [
    {
      id: 'auth-service',
      name: 'Auth Service',
      type: 'oauth',
      wellKnown: 'http://localhost:4444/.well-known/openid-configuration',
      clientId:     process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile offline' } },
      profile(profile) {
        return { id: profile.sub, email: profile.email, name: profile.name };
      },
    },
  ],
});
```

---

## What's in the Token

The ID token (JWT) contains:

```json
{
  "sub":   "a1b2c3d4-...",   // Kratos identity ID (stable user ID)
  "email": "user@example.com",
  "name":  { "first": "Jane", "last": "Doe" },
  "iss":   "http://localhost:4444",
  "aud":   ["your-client-id"],
  "exp":   1234567890,
  "iat":   1234567890
}
```

Use `sub` as the user's stable identifier in your database.

---

## Verifying Tokens Without a Round-Trip

Your app can verify access tokens locally using Hydra's JWKS endpoint
— no call to the auth service needed per request:

```python
# Python example using python-jose
from jose import jwt
import requests

jwks = requests.get('http://localhost:4444/.well-known/jwks.json').json()

def verify_token(token):
    return jwt.decode(
        token,
        jwks,
        algorithms=['RS256'],
        audience='your-client-id',
        issuer='http://localhost:4444',
    )
```

Cache the JWKS response (it rarely changes) to avoid fetching it on
every request.

---

## Logout

Redirect the user to:

```
http://localhost:4444/oauth2/sessions/logout
  ?id_token_hint=<id_token>
  &post_logout_redirect_uri=http://yourapp.com/
```

The auth service revokes the session and redirects back to your app.

---

## Production Checklist

- [ ] Replace all `localhost:4444` / `localhost:4455` with your public domains
- [ ] Update `urls.self.issuer` in `hydra/hydra.yml` to the public Hydra URL
- [ ] Update `serve.public.base_url` in `kratos/kratos.yml` to the public Kratos URL
- [ ] Update `selfservice.allowed_return_urls` in `kratos.yml` to include your app domains
- [ ] Set real SMTP credentials (`SMTP_URI` in `.env`)
- [ ] Expose only port 4444 publicly — keep 4445 (Hydra admin) and 4434 (Kratos admin) internal
- [ ] Use `docker compose -f docker-compose.yml -f docker-compose.prod.yml up` (add prod overrides file)
- [ ] Set `log.leak_sensitive_values: false` in kratos.yml (already set)
