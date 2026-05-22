# Auth Service

A self-hosted, reusable user management service built on [Ory Hydra](https://www.ory.sh/hydra/) (OAuth2/OIDC) and [Ory Kratos](https://www.ory.sh/kratos/) (identity management).

Any application you build registers as an OAuth2 client. The service handles login, signup, email verification, password reset, brute-force protection, and session management. Your applications receive standard JWT tokens — they never touch passwords or user data.

## What You Get

- Email + password authentication (social login configurable later)
- Email verification on signup (6-digit code via email)
- Password recovery via email code
- Brute-force protection (built into Kratos)
- Argon2 password hashing (built into Kratos)
- Standard OAuth2/OIDC tokens usable by any app or language
- Minimal dark-themed self-service UI (login, signup, recovery, verification)
- Dev email UI via Mailhog (no SMTP setup needed locally)

## Quick Start

### 1. Set up secrets

```bash
cd auth-service
cp .env.example .env

# Generate secure secrets
make secrets
# Paste the output values into .env
# Also set POSTGRES_PASSWORD in .env
```

### 2. Start the stack

```bash
make up
```

Services:
| Service | URL |
|---------|-----|
| Login / Signup UI | http://localhost:4455/login |
| Hydra (OAuth2 server) | http://localhost:4444 |
| Mailhog (dev emails) | http://localhost:8025 |

### 3. Register your first app

```bash
make add-client
# Enter app name and callback URL
# Save the returned client_id and client_secret
```

### 4. Integrate

See **[docs/integration-guide.md](docs/integration-guide.md)** for copy-paste examples
in Python/Flask, Node.js/Express, and Next.js.

## Common Commands

```bash
make up            # Start everything
make down          # Stop (data preserved)
make destroy       # Stop + delete all data (full reset)
make logs          # Tail all logs
make add-client    # Register a new app
make list-clients  # Show all registered apps
make list-users    # Show all user emails
make test-flow     # Interactive end-to-end OAuth2 test in browser
make secrets       # Generate .env secret values
make help          # Show all commands
```

## Architecture

```
[Your App] ──OAuth2──► Hydra :4444
                           │ login_challenge
                           ▼
                    Kratos UI :4455  (login/signup pages)
                           │ self-service API
                           ▼
                    Kratos :4433  (identity engine)
                           │ accept login (server-to-server)
                           ▼
                    Hydra :4445 ──► Consent App :3000
                           │
                    tokens issued ──► [Your App]
```

## Moving to Production

1. Update `urls.self.issuer` in `hydra/hydra.yml` to your public Hydra domain
2. Update `serve.public.base_url` in `kratos/kratos.yml` to your public Kratos domain
3. Set real SMTP credentials in `.env` (`SMTP_URI`)
4. Expose only port 4444 publicly — keep admin ports (4445, 4434) firewalled
5. See the production checklist in `docs/integration-guide.md`

## Adding Social Login Later

To add Google or GitHub login, add a provider block under `selfservice.methods.oidc.config.providers`
in `kratos/kratos.yml` and set the client ID/secret. No code changes needed.
