class ClassificationPublisher:
    @staticmethod
    def publish_result(result_data: dict):
        print(f"[VISION AI PUBLISHER] Emitted classification result for ticket {result_data.get('ticket_id')}")
        return True
