#!/bin/bash

# Smart Pig DeFi Kubernetes Deployment Script
# Usage: ./k8s-deploy.sh [deploy|update|status|logs|clean]

set -e

NAMESPACE="smart-pig-defi"
FRONTEND_IMAGE="ghcr.io/guilhermejansen/smart-pig-defi-frontend"
BACKEND_IMAGE="ghcr.io/guilhermejansen/smart-pig-defi-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
}

check_namespace() {
    if ! kubectl get namespace $NAMESPACE &> /dev/null; then
        print_warning "Namespace $NAMESPACE does not exist, creating it..."
        kubectl create namespace $NAMESPACE
    fi
}

deploy() {
    print_status "Starting deployment to Kubernetes..."
    
    check_kubectl
    check_namespace
    
    # Apply configurations in order
    print_status "Applying namespace..."
    kubectl apply -f k8s/namespace.yaml
    
    print_status "Applying ConfigMap..."
    kubectl apply -f k8s/configmap.yaml
    
    print_status "Applying Secrets..."
    kubectl apply -f k8s/secrets.yaml
    
    print_status "Deploying PostgreSQL..."
    kubectl apply -f k8s/postgres-deployment.yaml
    
    print_status "Deploying Redis..."
    kubectl apply -f k8s/redis-deployment.yaml
    
    print_status "Waiting for database to be ready..."
    kubectl wait --for=condition=ready pod -l app=smart-pig-postgres -n $NAMESPACE --timeout=300s
    
    print_status "Deploying Backend..."
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/backend-service.yaml
    
    print_status "Waiting for backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=smart-pig-backend -n $NAMESPACE --timeout=300s
    
    print_status "Deploying Frontend..."
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/frontend-service.yaml
    
    print_status "Applying Ingress..."
    kubectl apply -f k8s/ingress.yaml
    
    print_success "Deployment completed successfully!"
    
    print_status "Checking deployment status..."
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE
    kubectl get ingress -n $NAMESPACE
}

update() {
    print_status "Updating deployment with latest images..."
    
    # Get current Git commit hash for image tagging
    GIT_COMMIT=$(git rev-parse --short HEAD)
    
    # Update image tags in deployments
    kubectl set image deployment/smart-pig-frontend frontend=$FRONTEND_IMAGE:$GIT_COMMIT -n $NAMESPACE
    kubectl set image deployment/smart-pig-backend backend=$BACKEND_IMAGE:$GIT_COMMIT -n $NAMESPACE
    
    # Wait for rollout to complete
    kubectl rollout status deployment/smart-pig-frontend -n $NAMESPACE
    kubectl rollout status deployment/smart-pig-backend -n $NAMESPACE
    
    print_success "Update completed successfully!"
}

status() {
    print_status "Checking deployment status..."
    
    echo -e "\n${YELLOW}Pods:${NC}"
    kubectl get pods -n $NAMESPACE -o wide
    
    echo -e "\n${YELLOW}Services:${NC}"
    kubectl get services -n $NAMESPACE
    
    echo -e "\n${YELLOW}Ingress:${NC}"
    kubectl get ingress -n $NAMESPACE
    
    echo -e "\n${YELLOW}Deployments:${NC}"
    kubectl get deployments -n $NAMESPACE
    
    echo -e "\n${YELLOW}ConfigMaps:${NC}"
    kubectl get configmaps -n $NAMESPACE
    
    echo -e "\n${YELLOW}Secrets:${NC}"
    kubectl get secrets -n $NAMESPACE
}

logs() {
    print_status "Fetching application logs..."
    
    echo -e "\n${YELLOW}Frontend Logs:${NC}"
    kubectl logs -l app=smart-pig-frontend -n $NAMESPACE --tail=50
    
    echo -e "\n${YELLOW}Backend Logs:${NC}"
    kubectl logs -l app=smart-pig-backend -n $NAMESPACE --tail=50
    
    echo -e "\n${YELLOW}Database Logs:${NC}"
    kubectl logs -l app=smart-pig-postgres -n $NAMESPACE --tail=20
}

clean() {
    print_warning "This will delete all resources in the $NAMESPACE namespace!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Kubernetes resources..."
        kubectl delete namespace $NAMESPACE
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

health_check() {
    print_status "Performing health checks..."
    
    # Check if pods are running
    FRONTEND_READY=$(kubectl get pods -l app=smart-pig-frontend -n $NAMESPACE -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}')
    BACKEND_READY=$(kubectl get pods -l app=smart-pig-backend -n $NAMESPACE -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}')
    
    if [[ "$FRONTEND_READY" == "True" ]]; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not ready"
    fi
    
    if [[ "$BACKEND_READY" == "True" ]]; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not ready"
    fi
    
    # Test endpoints if ingress is available
    INGRESS_IP=$(kubectl get ingress smart-pig-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [[ -n "$INGRESS_IP" ]]; then
        print_status "Testing endpoints..."
        if curl -f http://$INGRESS_IP/health &> /dev/null; then
            print_success "Frontend endpoint is accessible"
        else
            print_warning "Frontend endpoint is not accessible"
        fi
    fi
}

case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    update)
        update
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    clean)
        clean
        ;;
    health)
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|update|status|logs|clean|health}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application to Kubernetes"
        echo "  update  - Update deployment with latest images"
        echo "  status  - Show deployment status"
        echo "  logs    - Show application logs"
        echo "  clean   - Remove all resources"
        echo "  health  - Perform health checks"
        exit 1
        ;;
esac