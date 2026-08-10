from services.classifier_engine import ClassifierEngine

def test_classifier_predict():
    engine = ClassifierEngine()
    res = engine.predict("tkt_1", "http://img.png")
    assert res.confidence_score > 0.9
    assert res.suggested_severity == "HIGH"
