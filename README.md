# Smart Pig DeFi - Complete CI/CD & Deployment Guide

🐷💰 A comprehensive DeFi application with modern CI/CD pipeline, Docker containerization, and Kubernetes deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Kubernetes cluster (for production)
- Make (optional, for convenience)

### Development Setup

1. **Clone and install dependencies**

   ```bash
   git clone <repository>
   cd smart-pig-defi
   make install
   # or manually:
   # cd frontend && npm ci --legacy-peer-deps
   # cd ../backend && npm ci
   ```

2. **Start development environment**

   ```bash
   # Using Make
   make dev

   # Using Docker Compose
   make docker-dev

   # Manual start
   cd backend && npm run start:dev &
   cd frontend && npm run dev
   ```

3. **Run tests**
   ```bash
   make test
   # or separately:
   make test-frontend
   make test-backend
   ```

## 📁 Project Structure

```
smart-pig-defi/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD pipeline
├── frontend/                      # React + Vite + TypeScript
│   ├── src/
│   ├── Dockerfile                 # Production container
│   ├── Dockerfile.dev             # Development container
│   ├── nginx.conf                 # Nginx configuration
│   ├── jest.config.js             # Test configuration
│   └── package.json
├── backend/                       # NestJS + TypeScript
│   ├── src/
│   │   └── health/                # Health check endpoints
│   ├── Dockerfile                 # Production container
│   ├── Dockerfile.dev             # Development container
│   ├── healthcheck.js             # Container health script
│   └── package.json
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── redis-deployment.yaml
│   └── ingress.yaml
├── docker-compose.yml            # Production containers
├── docker-compose.dev.yml        # Development containers
├── docker-compose.override.yml   # Production optimizations
├── Makefile                      # Development commands
├── k8s-deploy.sh                 # Kubernetes deployment script
├── .env.example                  # Environment variables template
└── .env.development              # Development environment
```

## 🛠 Development Commands

### Using Make (Recommended)

```bash
# Setup
make help                    # Show all available commands
make install                 # Install all dependencies
make setup                   # Complete project setup

# Development
make dev                     # Start both frontend and backend
make dev-frontend            # Start only frontend
make dev-backend             # Start only backend

# Testing
make test                    # Run all tests
make test-frontend           # Frontend tests only
make test-backend            # Backend tests only
make test-e2e               # End-to-end tests
make test-watch             # Tests in watch mode

# Code Quality
make lint                    # Run linting
make lint-fix               # Fix linting issues
make security-scan          # Security vulnerability scan

# Building
make build                   # Build both applications
make build-frontend         # Build frontend only
make build-backend          # Build backend only

# Docker Operations
make docker-build           # Build Docker images
make docker-run             # Run production containers
make docker-dev             # Run development containers
make docker-stop            # Stop all containers
make docker-logs            # View container logs
make docker-clean           # Clean Docker resources

# Kubernetes
make k8s-deploy             # Deploy to Kubernetes
make k8s-status             # Check deployment status
make k8s-logs               # View Kubernetes logs
make k8s-clean              # Clean Kubernetes resources

# Database
make db-migrate             # Run migrations
make db-seed                # Seed database
make db-reset               # Reset database

# Utilities
make clean                  # Clean build artifacts
make health-check           # Check application health
make ci                     # Simulate CI/CD locally
```

### Manual Commands

```bash
# Frontend
cd frontend
npm run dev                 # Development server
npm run build               # Production build
npm run test                # Run tests
npm run lint                # Linting

# Backend
cd backend
npm run start:dev           # Development server
npm run build               # Production build
npm run test                # Run tests
npm run test:e2e           # E2E tests
npm run lint                # Linting
```

## 🐳 Docker Usage

### Development Environment

```bash
# Start development with hot reload
docker-compose -f docker-compose.dev.yml up

# Build development images
docker-compose -f docker-compose.dev.yml build

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Environment

```bash
# Start production environment
docker-compose up -d

# Build production images
docker-compose build

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale frontend=3 --scale backend=2
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Ingress controller (nginx-ingress recommended)
- Cert-manager (for SSL certificates)

### Quick Deployment

```bash
# Using the deployment script
chmod +x k8s-deploy.sh
./k8s-deploy.sh deploy

# Check status
./k8s-deploy.sh status

# View logs
./k8s-deploy.sh logs

# Health check
./k8s-deploy.sh health
```

### Manual Deployment

```bash
# Apply manifests in order
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

# Monitor deployment
kubectl get pods -n smart-pig-defi -w
```

### Configuration

1. **Update Secrets**

   ```bash
   # Edit k8s/secrets.yaml with base64 encoded values
   echo -n "your-secret" | base64
   ```

2. **Configure Ingress**

   ```bash
   # Update k8s/ingress.yaml with your domain
   # Install cert-manager for SSL
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
   ```

3. **Set Resource Limits**
   ```bash
   # Adjust resources in deployment files based on your cluster capacity
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Features

- ✅ Automated testing (frontend & backend)
- ✅ Code linting and formatting
- ✅ Security vulnerability scanning
- ✅ Docker image building (multi-arch)
- ✅ Container security scanning
- ✅ Automatic deployment to Kubernetes
- ✅ Environment-specific deployments

### Pipeline Stages

1. **Test Phase**
   - Frontend: Jest tests with coverage
   - Backend: Jest unit tests and e2e tests
   - Linting and type checking

2. **Security Phase**
   - Trivy vulnerability scanning
   - Dependency audit

3. **Build Phase**
   - Multi-stage Docker builds
   - Multi-architecture support (amd64, arm64)
   - Image optimization and caching

4. **Deploy Phase**
   - Kubernetes deployment
   - Health checks and rollback
   - Environment verification

### Environment Setup

1. **GitHub Secrets**

   ```
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=us-west-2
   EKS_CLUSTER_NAME=smart-pig-cluster
   ```

2. **Environment Variables**
   ```bash
   # Copy and customize environment files
   cp .env.example .env
   cp .env.development .env.local
   ```

## 🏗 Architecture

### Frontend (React + Vite)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: TailwindCSS v4
- **Testing**: Jest + React Testing Library
- **Production**: Nginx with security headers

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Architecture**: Modular design with controllers/services
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis for session/data caching
- **Testing**: Jest for unit/integration tests

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with high availability
- **Load Balancing**: Nginx Ingress Controller
- **SSL/TLS**: Cert-manager with Let's Encrypt
- **Monitoring**: Built-in health checks and logging

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**

```bash
VITE_API_URL=https://api.smartpig.com
VITE_STELLAR_NETWORK=public
VITE_HORIZON_URL=https://horizon.stellar.org
```

**Backend (.env)**

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secure-secret
STELLAR_NETWORK=public
REDIS_URL=redis://redis:6379
```

### Security Configuration

1. **Container Security**
   - Non-root users
   - Read-only filesystems
   - Minimal base images
   - Security scanning

2. **Network Security**
   - Nginx security headers
   - CORS configuration
   - Rate limiting
   - SSL/TLS termination

3. **Application Security**
   - JWT authentication
   - Input validation
   - SQL injection prevention
   - XSS protection

## 📊 Monitoring & Health Checks

### Health Endpoints

- `GET /health` - Basic health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
```

### Logging

- Structured JSON logging
- Log aggregation ready
- Configurable log levels
- Request/response logging

## 🚀 Deployment Strategies

### Blue-Green Deployment

```bash
# Deploy to staging
kubectl apply -f k8s/ --dry-run=client

# Switch traffic
kubectl patch service smart-pig-frontend -p '{"spec":{"selector":{"version":"green"}}}'
```

### Rolling Updates

```bash
# Update image
kubectl set image deployment/smart-pig-backend backend=new-image:tag

# Monitor rollout
kubectl rollout status deployment/smart-pig-backend
```

### Canary Deployment

```bash
# Deploy canary version
kubectl apply -f k8s/canary/

# Gradually increase traffic
# Monitor metrics and errors
```

## 🐛 Troubleshooting

### Common Issues

1. **Container Build Fails**

   ```bash
   # Check Docker logs
   docker-compose logs --tail=50

   # Rebuild without cache
   docker-compose build --no-cache
   ```

2. **Kubernetes Pod Crashes**

   ```bash
   # Check pod logs
   kubectl logs -l app=smart-pig-backend -n smart-pig-defi

   # Describe pod for events
   kubectl describe pod <pod-name> -n smart-pig-defi
   ```

3. **Health Check Failures**

   ```bash
   # Test health endpoints
   curl http://localhost:3000/health

   # Check service connectivity
   kubectl exec -it <pod-name> -- curl localhost:3000/health
   ```

### Debug Commands

```bash
# Container debugging
make docker-logs
docker exec -it <container> /bin/sh

# Kubernetes debugging
kubectl exec -it <pod> -n smart-pig-defi -- /bin/sh
kubectl port-forward <pod> 3000:3000 -n smart-pig-defi

# Application debugging
make dev-backend  # Runs with debugger attached
npm run start:debug  # Backend with debugging
```

## 📈 Performance Optimization

### Frontend Optimizations

- Code splitting with React.lazy
- Asset optimization with Vite
- Gzip compression in Nginx
- Browser caching strategies

### Backend Optimizations

- Connection pooling
- Redis caching
- Query optimization
- Response compression

### Infrastructure Optimizations

- Horizontal Pod Autoscaling
- Resource limits and requests
- Load balancing strategies
- CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run the full test suite: `make ci`
5. Submit a pull request

### Development Workflow

```bash
# Start development
make setup
make docker-dev

# Make changes
# ... edit code ...

# Test changes
make test
make lint

# Build and test containers
make docker-build
make health-check

# Deploy to staging
./k8s-deploy.sh deploy
```

test change

# Test commit fix
