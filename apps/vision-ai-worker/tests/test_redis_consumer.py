from services.redis_consumer import RedisStreamConsumer

def test_consumer_lifecycle():
    consumer = RedisStreamConsumer()
    consumer.start_listening()
    assert consumer.running is True
    consumer.stop()
    assert consumer.running is False
