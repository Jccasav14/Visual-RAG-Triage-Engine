class ImageProcessor:
    @staticmethod
    def preprocess_image(image_path: str):
        print(f"[IMAGE PROCESSOR] Normalizing image resolution and color channels for {image_path}")
        return {"width": 224, "height": 224, "channels": 3}
