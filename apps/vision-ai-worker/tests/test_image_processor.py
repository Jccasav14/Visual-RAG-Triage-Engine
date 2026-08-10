from services.image_processor import ImageProcessor

def test_preprocess_image():
    meta = ImageProcessor.preprocess_image("test.jpg")
    assert meta["width"] == 224
    assert meta["channels"] == 3
