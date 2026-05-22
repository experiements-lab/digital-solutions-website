.PHONY: up down restart logs ps migrate add-client list-clients list-users shell-hydra shell-kratos secrets help

HYDRA_ADMIN  = http://localhost:4445
HYDRA_PUBLIC = http://localhost:4444

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

up: ## Start the full auth stack (builds images if needed)
	docker compose up --build -d
	@echo ""
	@echo "  Auth stack running:"
	@echo "  Hydra public   → http://localhost:4444"
	@echo "  Kratos UI      → http://localhost:4455"
	@echo "  Mailhog        → http://localhost:8025"
	@echo ""

down: ## Stop and remove containers (data volume preserved)
	docker compose down

destroy: ## Stop containers AND delete the data volume (full reset)
	docker compose down -v

restart: ## Restart all services
	docker compose restart

logs: ## Tail logs from all services
	docker compose logs -f

ps: ## Show container status
	docker compose ps

migrate: ## Re-run database migrations (safe to run repeatedly)
	docker compose run --rm hydra-migrate
	docker compose run --rm kratos-migrate

# ── OAuth2 Client Management ──────────────────────────────────────────────────

add-client: ## Register a new OAuth2 client (interactive)
	@read -p "App name: " name; \
	read -p "Redirect URI (e.g. http://localhost:3001/auth/callback): " uri; \
	docker compose exec hydra \
	  hydra create client \
	    --endpoint $(HYDRA_ADMIN) \
	    --name "$$name" \
	    --grant-type authorization_code,refresh_token \
	    --response-type code \
	    --scope openid,offline,email,profile \
	    --redirect-uri "$$uri" \
	    --token-endpoint-auth-method client_secret_post \
	    --format json | tee /dev/stderr | python3 -c \
	  "import sys,json; d=json.load(sys.stdin); print('\n  client_id:     '+d['client_id']+'\n  client_secret: '+d['client_secret']+'\n')"

list-clients: ## List all registered OAuth2 clients
	docker compose exec hydra hydra list clients --endpoint $(HYDRA_ADMIN)

delete-client: ## Delete an OAuth2 client (usage: make delete-client ID=<client_id>)
	docker compose exec hydra hydra delete client $(ID) --endpoint $(HYDRA_ADMIN)

# ── User / Identity Management ────────────────────────────────────────────────

list-users: ## List all registered identities (emails + IDs)
	@curl -s http://localhost:4434/admin/identities | \
	  python3 -c "import sys,json; [print(u['id'][:8]+'...  '+u['traits'].get('email','')) for u in json.load(sys.stdin)]"

get-user: ## Get full identity by ID (usage: make get-user ID=<identity_id>)
	@curl -s http://localhost:4434/admin/identities/$(ID) | python3 -m json.tool

delete-user: ## Delete identity by ID (usage: make delete-user ID=<identity_id>)
	curl -X DELETE http://localhost:4434/admin/identities/$(ID)

# ── Token Testing ─────────────────────────────────────────────────────────────

test-flow: ## Run an interactive OAuth2 auth-code flow in the browser (needs a registered client)
	@read -p "Client ID: " id; \
	read -p "Client Secret: " secret; \
	docker compose exec hydra \
	  hydra perform authorization-code \
	    --endpoint $(HYDRA_PUBLIC) \
	    --client-id "$$id" \
	    --client-secret "$$secret" \
	    --port 5555 \
	    --scope openid,offline,email,profile

introspect: ## Introspect an access token (usage: make introspect TOKEN=<token>)
	docker compose exec hydra hydra introspect token \
	  --endpoint $(HYDRA_PUBLIC) $(TOKEN)

# ── Utilities ─────────────────────────────────────────────────────────────────

secrets: ## Generate secure secrets for .env (run once at setup)
	@echo "HYDRA_SYSTEM_SECRET=$$(openssl rand -hex 32)"
	@echo "HYDRA_COOKIE_SECRET=$$(openssl rand -hex 32)"
	@echo "KRATOS_COOKIE_SECRET=$$(openssl rand -hex 32)"

shell-hydra:  ## Open a shell in the Hydra container
	docker compose exec hydra sh

shell-kratos: ## Open a shell in the Kratos container
	docker compose exec kratos sh
