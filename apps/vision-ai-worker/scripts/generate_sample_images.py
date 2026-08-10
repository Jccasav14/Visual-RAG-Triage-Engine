from PIL import Image

def generate_blank_test_image(filename="sample.png"):
    img = Image.new('RGB', (224, 224), color = 'red')
    img.save(filename)
    print(f"Generated sample image {filename}")

if __name__ == "__main__":
    generate_blank_test_image()
