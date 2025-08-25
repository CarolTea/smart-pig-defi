.PHONY: help install build test lint clean docker-build docker-run docker-dev docker-stop docker-logs deploy k8s-deploy k8s-clean

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)Smart Pig DeFi - Development Commands$(NC)'
	@echo ''
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development setup
install: ## Install dependencies for both frontend and backend
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	cd frontend && npm ci --legacy-peer-deps
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	cd backend && npm ci
	@echo "$(GREEN)✓ Dependencies installed successfully$(NC)"

install-frontend: ## Install only frontend dependencies
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	cd frontend && npm ci --legacy-peer-deps
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

install-backend: ## Install only backend dependencies
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	cd backend && npm ci
	@echo "$(GREEN)✓ Backend dependencies installed$(NC)"

install-docs: ## Install only docs dependencies
	@echo "$(YELLOW)Installing docs dependencies...$(NC)"
	cd docs && npm ci
	@echo "$(GREEN)✓ Docs dependencies installed$(NC)"

install-all: ## Install all dependencies including docs
	@echo "$(YELLOW)Installing all dependencies...$(NC)"
	npm ci
	@echo "$(GREEN)✓ All dependencies installed$(NC)"

# Build commands
build: ## Build both frontend and backend
	@echo "$(YELLOW)Building frontend...$(NC)"
	cd frontend && npm run build
	@echo "$(YELLOW)Building backend...$(NC)"
	cd backend && npm run build
	@echo "$(GREEN)✓ Build completed successfully$(NC)"

build-frontend: ## Build only frontend
	@echo "$(YELLOW)Building frontend...$(NC)"
	cd frontend && npm run build
	@echo "$(GREEN)✓ Frontend build completed$(NC)"

build-backend: ## Build only backend
	@echo "$(YELLOW)Building backend...$(NC)"
	cd backend && npm run build
	@echo "$(GREEN)✓ Backend build completed$(NC)"

build-docs: ## Build only documentation
	@echo "$(YELLOW)Building documentation...$(NC)"
	cd docs && npm run build
	@echo "$(GREEN)✓ Documentation build completed$(NC)"

build-all: ## Build everything including docs
	@echo "$(YELLOW)Building all components...$(NC)"
	npm run build
	@echo "$(GREEN)✓ All builds completed$(NC)"

# Development servers
dev: ## Start both frontend and backend development servers
	@echo "$(YELLOW)Starting development servers...$(NC)"
	cd backend && npm run start:dev &
	cd frontend && npm run dev

dev-frontend: ## Start only frontend development server
	@echo "$(YELLOW)Starting frontend development server...$(NC)"
	cd frontend && npm run dev

dev-backend: ## Start only backend development server
	@echo "$(YELLOW)Starting backend development server...$(NC)"
	cd backend && npm run start:dev

dev-docs: ## Start only docs development server
	@echo "$(YELLOW)Starting docs development server...$(NC)"
	cd docs && npm run start

dev-all: ## Start all development servers
	@echo "$(YELLOW)Starting all development servers...$(NC)"
	npm run dev

# Testing
test: ## Run tests for both frontend and backend
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	cd frontend && npm test -- --coverage --watchAll=false
	@echo "$(YELLOW)Running backend tests...$(NC)"
	cd backend && npm run test:cov
	@echo "$(GREEN)✓ All tests completed$(NC)"

test-frontend: ## Run only frontend tests
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	cd frontend && npm test -- --coverage --watchAll=false
	@echo "$(GREEN)✓ Frontend tests completed$(NC)"

test-backend: ## Run only backend tests
	@echo "$(YELLOW)Running backend tests...$(NC)"
	cd backend && npm run test:cov
	@echo "$(GREEN)✓ Backend tests completed$(NC)"

test-e2e: ## Run end-to-end tests
	@echo "$(YELLOW)Running backend e2e tests...$(NC)"
	cd backend && npm run test:e2e
	@echo "$(GREEN)✓ E2E tests completed$(NC)"

test-watch: ## Run tests in watch mode
	@echo "$(YELLOW)Starting test watch mode...$(NC)"
	cd frontend && npm run test:watch &
	cd backend && npm run test:watch

# Linting
lint: ## Run linting for both frontend and backend
	@echo "$(YELLOW)Linting frontend...$(NC)"
	cd frontend && npm run lint
	@echo "$(YELLOW)Linting backend...$(NC)"
	cd backend && npm run lint
	@echo "$(GREEN)✓ Linting completed$(NC)"

lint-frontend: ## Run only frontend linting
	@echo "$(YELLOW)Linting frontend...$(NC)"
	cd frontend && npm run lint
	@echo "$(GREEN)✓ Frontend linting completed$(NC)"

lint-backend: ## Run only backend linting
	@echo "$(YELLOW)Linting backend...$(NC)"
	cd backend && npm run lint
	@echo "$(GREEN)✓ Backend linting completed$(NC)"

lint-fix: ## Fix linting issues
	@echo "$(YELLOW)Fixing frontend linting issues...$(NC)"
	cd frontend && npm run lint -- --fix
	@echo "$(YELLOW)Fixing backend linting issues...$(NC)"
	cd backend && npm run lint -- --fix
	@echo "$(GREEN)✓ Linting fixes applied$(NC)"

# Cleanup
clean: ## Clean node_modules and build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf frontend/node_modules frontend/dist frontend/coverage
	rm -rf backend/node_modules backend/dist backend/coverage
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

clean-frontend: ## Clean only frontend artifacts
	@echo "$(YELLOW)Cleaning frontend artifacts...$(NC)"
	rm -rf frontend/node_modules frontend/dist frontend/coverage
	@echo "$(GREEN)✓ Frontend cleanup completed$(NC)"

clean-backend: ## Clean only backend artifacts
	@echo "$(YELLOW)Cleaning backend artifacts...$(NC)"
	rm -rf backend/node_modules backend/dist backend/coverage
	@echo "$(GREEN)✓ Backend cleanup completed$(NC)"

# Docker commands
docker-build: ## Build Docker images
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Docker images built successfully$(NC)"

docker-build-frontend: ## Build only frontend Docker image
	@echo "$(YELLOW)Building frontend Docker image...$(NC)"
	docker build -t smart-pig-frontend ./frontend
	@echo "$(GREEN)✓ Frontend Docker image built$(NC)"

docker-build-backend: ## Build only backend Docker image
	@echo "$(YELLOW)Building backend Docker image...$(NC)"
	docker build -t smart-pig-backend ./backend
	@echo "$(GREEN)✓ Backend Docker image built$(NC)"

docker-run: ## Run the application with Docker Compose (production)
	@echo "$(YELLOW)Starting production environment...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Production environment started$(NC)"

docker-dev: ## Run development environment with Docker Compose
	@echo "$(YELLOW)Starting development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up
	@echo "$(GREEN)✓ Development environment started$(NC)"

docker-dev-detached: ## Run development environment in detached mode
	@echo "$(YELLOW)Starting development environment (detached)...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)✓ Development environment started$(NC)"

docker-stop: ## Stop Docker containers
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	@echo "$(GREEN)✓ Containers stopped$(NC)"

docker-logs: ## View Docker logs
	@echo "$(YELLOW)Viewing container logs...$(NC)"
	docker-compose logs -f

docker-logs-frontend: ## View frontend container logs
	@echo "$(YELLOW)Viewing frontend logs...$(NC)"
	docker-compose logs -f frontend

docker-logs-backend: ## View backend container logs
	@echo "$(YELLOW)Viewing backend logs...$(NC)"
	docker-compose logs -f backend

docker-clean: ## Clean Docker containers, images, and volumes
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	docker-compose down -v --rmi all --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
	@echo "$(GREEN)✓ Docker cleanup completed$(NC)"

# Kubernetes commands
k8s-deploy: ## Deploy to Kubernetes
	@echo "$(YELLOW)Deploying to Kubernetes...$(NC)"
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/secrets.yaml
	kubectl apply -f k8s/postgres-deployment.yaml
	kubectl apply -f k8s/redis-deployment.yaml
	kubectl apply -f k8s/backend-deployment.yaml
	kubectl apply -f k8s/backend-service.yaml
	kubectl apply -f k8s/frontend-deployment.yaml
	kubectl apply -f k8s/frontend-service.yaml
	kubectl apply -f k8s/ingress.yaml
	@echo "$(GREEN)✓ Kubernetes deployment completed$(NC)"

k8s-status: ## Check Kubernetes deployment status
	@echo "$(YELLOW)Checking Kubernetes status...$(NC)"
	kubectl get pods -n smart-pig-defi
	kubectl get services -n smart-pig-defi
	kubectl get ingress -n smart-pig-defi

k8s-logs: ## View Kubernetes logs
	@echo "$(YELLOW)Viewing Kubernetes logs...$(NC)"
	kubectl logs -l app=smart-pig-frontend -n smart-pig-defi --tail=100
	kubectl logs -l app=smart-pig-backend -n smart-pig-defi --tail=100

k8s-clean: ## Clean Kubernetes resources
	@echo "$(YELLOW)Cleaning Kubernetes resources...$(NC)"
	kubectl delete namespace smart-pig-defi
	@echo "$(GREEN)✓ Kubernetes cleanup completed$(NC)"

# Database commands
db-migrate: ## Run database migrations
	@echo "$(YELLOW)Running database migrations...$(NC)"
	cd backend && npm run migration:run
	@echo "$(GREEN)✓ Database migrations completed$(NC)"

db-seed: ## Seed database with initial data
	@echo "$(YELLOW)Seeding database...$(NC)"
	cd backend && npm run seed:run
	@echo "$(GREEN)✓ Database seeding completed$(NC)"

db-reset: ## Reset database (drop and recreate)
	@echo "$(YELLOW)Resetting database...$(NC)"
	cd backend && npm run migration:revert
	cd backend && npm run migration:run
	@echo "$(GREEN)✓ Database reset completed$(NC)"

# Security
security-scan: ## Run security vulnerability scan
	@echo "$(YELLOW)Running security scan...$(NC)"
	cd frontend && npm audit
	cd backend && npm audit
	@echo "$(GREEN)✓ Security scan completed$(NC)"

security-fix: ## Fix security vulnerabilities
	@echo "$(YELLOW)Fixing security vulnerabilities...$(NC)"
	cd frontend && npm audit fix
	cd backend && npm audit fix
	@echo "$(GREEN)✓ Security fixes applied$(NC)"

# Production deployment
deploy: ## Deploy to production (customize as needed)
	@echo "$(YELLOW)Deploying to production...$(NC)"
	make build
	make docker-build
	docker-compose -f docker-compose.yml up -d
	@echo "$(GREEN)✓ Production deployment completed$(NC)"

# Health checks
health-check: ## Check application health
	@echo "$(YELLOW)Checking application health...$(NC)"
	curl -f http://localhost/health || echo "$(RED)Frontend health check failed$(NC)"
	curl -f http://localhost:3000/health || echo "$(RED)Backend health check failed$(NC)"
	@echo "$(GREEN)✓ Health checks completed$(NC)"

# Complete setup
setup: clean install build test ## Complete project setup
	@echo "$(GREEN)✓ Project setup completed successfully$(NC)"

# CI/CD simulation
ci: lint test build ## Simulate CI/CD pipeline locally
	@echo "$(GREEN)✓ CI/CD simulation completed$(NC)"

# Documentation commands
docs-dev: ## Start documentation development server
	@echo "$(YELLOW)Starting documentation server...$(NC)"
	cd docs && npm run start

docs-build: ## Build documentation
	@echo "$(YELLOW)Building documentation...$(NC)"
	cd docs && npm run build
	@echo "$(GREEN)✓ Documentation build completed$(NC)"

docs-deploy: ## Deploy documentation to GitHub Pages
	@echo "$(YELLOW)Deploying documentation...$(NC)"
	cd docs && npm run deploy
	@echo "$(GREEN)✓ Documentation deployed$(NC)"

docs-serve: ## Serve built documentation locally
	@echo "$(YELLOW)Serving documentation...$(NC)"
	cd docs && npm run serve

docs-clean: ## Clean documentation build artifacts
	@echo "$(YELLOW)Cleaning documentation artifacts...$(NC)"
	rm -rf docs/node_modules docs/build docs/.docusaurus
	@echo "$(GREEN)✓ Documentation cleanup completed$(NC)"

# Docker documentation commands
docker-build-docs: ## Build documentation Docker image
	@echo "$(YELLOW)Building docs Docker image...$(NC)"
	docker build -t smart-pig-docs ./docs
	@echo "$(GREEN)✓ Docs Docker image built$(NC)"

docker-logs-docs: ## View docs container logs
	@echo "$(YELLOW)Viewing docs logs...$(NC)"
	docker-compose logs -f docs

# Version management and releases
commit: ## Create a conventional commit using commitizen
	@echo "$(YELLOW)Creating conventional commit...$(NC)"
	npm run commit

version-check: ## Check current version across all packages
	@echo "$(BLUE)Current versions:$(NC)"
	@echo "Root: $(shell node -p \"require('./package.json').version\")"
	@echo "Frontend: $(shell node -p \"require('./frontend/package.json').version\")"
	@echo "Backend: $(shell node -p \"require('./backend/package.json').version\")"
	@echo "Docs: $(shell node -p \"require('./docs/package.json').version\")"

version-sync: ## Synchronize versions across all packages
	@echo "$(YELLOW)Synchronizing versions...$(NC)"
	node scripts/sync-versions.js $(shell node -p \"require('./package.json').version\")
	@echo "$(GREEN)✓ Versions synchronized$(NC)"

changelog: ## Generate changelog
	@echo "$(YELLOW)Generating changelog...$(NC)"
	npm run changelog
	@echo "$(GREEN)✓ Changelog generated$(NC)"

changelog-first: ## Generate initial changelog with all commits
	@echo "$(YELLOW)Generating initial changelog...$(NC)"
	npm run changelog:first
	@echo "$(GREEN)✓ Initial changelog generated$(NC)"

release-dry: ## Dry run semantic release (preview)
	@echo "$(YELLOW)Running semantic release dry run...$(NC)"
	npm run release:dry
	@echo "$(GREEN)✓ Semantic release dry run completed$(NC)"

release: ## Create a new release (automated versioning)
	@echo "$(YELLOW)Creating new release...$(NC)"
	@echo "$(RED)Warning: This will create a new release and push to repository$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \\
	echo; \\
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \\
		npm run release; \\
		echo "$(GREEN)✓ Release created successfully$(NC)"; \\
	else \\
		echo "$(YELLOW)Release cancelled$(NC)"; \\
	fi

release-alpha: ## Create an alpha pre-release
	@echo "$(YELLOW)Creating alpha pre-release...$(NC)"
	git checkout -b alpha
	npm run release
	git checkout main
	@echo "$(GREEN)✓ Alpha release created$(NC)"

release-beta: ## Create a beta pre-release
	@echo "$(YELLOW)Creating beta pre-release...$(NC)"
	git checkout -b develop
	npm run release
	git checkout main
	@echo "$(GREEN)✓ Beta release created$(NC)"

# Git hooks and validation
install-hooks: ## Install Git hooks
	@echo "$(YELLOW)Installing Git hooks...$(NC)"
	npm run prepare
	@echo "$(GREEN)✓ Git hooks installed$(NC)"

validate-commit: ## Validate commit message format
	@echo "$(YELLOW)Validating last commit message...$(NC)"
	npx commitlint --from HEAD~1 --to HEAD --verbose
	@echo "$(GREEN)✓ Commit message validated$(NC)"

validate-branch: ## Validate current branch for release
	@echo "$(YELLOW)Validating branch for release...$(NC)"
	@BRANCH=$$(git rev-parse --abbrev-ref HEAD); \\
	if [ "$$BRANCH" = "main" ] || [ "$$BRANCH" = "develop" ]; then \\
		echo "$(GREEN)✓ Branch $$BRANCH is valid for release$(NC)"; \\
	else \\
		echo "$(RED)✗ Branch $$BRANCH is not valid for release. Use main or develop.$(NC)"; \\
		exit 1; \\
	fi

# Complete release workflow
pre-release: ## Complete pre-release workflow (tests, linting, build)
	@echo "$(BLUE)Starting pre-release workflow...$(NC)"
	make ci
	make version-check
	make validate-branch
	@echo "$(GREEN)✓ Pre-release workflow completed$(NC)"

full-release: ## Complete release workflow with validation
	@echo "$(BLUE)Starting full release workflow...$(NC)"
	make pre-release
	make release-dry
	@echo "$(YELLOW)Ready for release. Run 'make release' to proceed.$(NC)"

# Tag management
tag-list: ## List all tags
	@echo "$(BLUE)Release tags:$(NC)"
	git tag -l --sort=-version:refname

tag-latest: ## Show latest tag
	@echo "$(BLUE)Latest tag:$(NC)"
	git describe --tags --abbrev=0

# Cleanup with version preservation
clean-all: ## Clean everything including docs
	@echo "$(YELLOW)Cleaning all artifacts...$(NC)"
	rm -rf frontend/node_modules frontend/dist frontend/coverage
	rm -rf backend/node_modules backend/dist backend/coverage
	rm -rf docs/node_modules docs/build docs/.docusaurus
	rm -rf node_modules
	@echo "$(GREEN)✓ Complete cleanup completed$(NC)"

# Quality gates
quality-gate: ## Run all quality checks
	@echo "$(BLUE)Running quality gates...$(NC)"
	make lint
	make test
	make security-scan
	make build-all
	@echo "$(GREEN)✓ All quality gates passed$(NC)"

# Development workflow helpers
ready-to-commit: ## Prepare code for commit (format, lint, test)
	@echo "$(BLUE)Preparing code for commit...$(NC)"
	npm run format
	make lint-fix
	make test
	@echo "$(GREEN)✓ Code ready for commit$(NC)"

ready-to-push: ## Prepare for push (full validation)
	@echo "$(BLUE)Preparing for push...$(NC)"
	make ready-to-commit
	make build-all
	@echo "$(GREEN)✓ Code ready for push$(NC)"

# AWS deployment helpers
aws-check: ## Check if AWS deployment is enabled
	@echo "$(BLUE)Checking AWS deployment status...$(NC)"
	@if [ -z "$$AWS_ACCESS_KEY_ID" ]; then \\
		echo "$(YELLOW)⚠️  AWS credentials not configured$(NC)"; \\
		echo "$(CYAN)To enable AWS deployment:$(NC)"; \\
		echo "1. Set up AWS account and EKS cluster"; \\
		echo "2. Add GitHub repository variable: ENABLE_AWS_DEPLOYMENT=true"; \\
		echo "3. Add AWS secrets to GitHub repository"; \\
	else \\
		echo "$(GREEN)✓ AWS credentials configured$(NC)"; \\
	fi

aws-setup-help: ## Show AWS setup instructions
	@echo "$(BLUE)AWS Deployment Setup Instructions:$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Create AWS Account and EKS Cluster:$(NC)"
	@echo "   aws configure"
	@echo "   eksctl create cluster --name smart-pig-cluster --region us-west-2"
	@echo ""
	@echo "$(YELLOW)2. Add GitHub Repository Variable:$(NC)"
	@echo "   Go to Settings > Secrets and variables > Actions > Variables"
	@echo "   Add: ENABLE_AWS_DEPLOYMENT = true"
	@echo ""
	@echo "$(YELLOW)3. Add GitHub Secrets:$(NC)"
	@echo "   AWS_ACCESS_KEY_ID"
	@echo "   AWS_SECRET_ACCESS_KEY"
	@echo "   AWS_REGION"
	@echo "   EKS_CLUSTER_NAME"
	@echo ""
	@echo "$(GREEN)Once configured, releases will automatically deploy to Kubernetes!$(NC)"