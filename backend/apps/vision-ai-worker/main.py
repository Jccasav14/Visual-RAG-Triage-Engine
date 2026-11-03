import os
import sys
import uvicorn

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.vision_router import router as vision_router