#!/bin/bash
echo "Bootstrapping Visual-RAG Triage Engine..."
docker-compose -f docker/docker-compose.yml up -d
echo "Infrastructure containers started successfully."
