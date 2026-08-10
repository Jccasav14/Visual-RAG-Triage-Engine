#!/bin/bash
echo "Creating K3d cluster for local GitOps testing..."
k3d cluster create visual-rag-cluster --api-port 6550 -p "80:80@loadbalancer" --agents 2
kubectl create namespace visual-rag-system
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "K3d cluster and ArgoCD successfully provisioned."
