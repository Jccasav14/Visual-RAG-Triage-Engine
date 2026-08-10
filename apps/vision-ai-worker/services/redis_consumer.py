import time
from config import settings

class RedisStreamConsumer:
    def __init__(self):
        self.running = False

    def start_listening(self):
        self.running = True
        print(f"[VISION AI WORKER] Listening to Redis Streams at {settings.REDIS_HOST}:{settings.REDIS_PORT}")

    def stop(self):
        self.running = False
