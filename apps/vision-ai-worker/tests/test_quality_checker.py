from services.quality_checker import ImageQualityValidator

def test_quality_check():
    assert ImageQualityValidator.validate_blur_and_lighting("valid.jpg") is True
