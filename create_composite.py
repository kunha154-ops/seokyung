import os
from PIL import Image, ImageDraw, ImageFont

files = [
    "media__1779972637327.png", "media__1779972637337.png", "media__1779972637345.png",
    "media__1779972637353.png", "media__1779972637356.png", "media__1779972656396.png",
    "media__1779972656399.png", "media__1779972656402.png", "media__1779972656406.png"
]
dir_path = "/Users/geonhagang/.gemini/antigravity/brain/ddc5fc8b-527b-4600-8ff5-df3ff6a620a1"

images = []
for f in files:
    img_path = os.path.join(dir_path, f)
    if os.path.exists(img_path):
        img = Image.open(img_path)
        img = img.resize((200, 250))
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), f[-7:-4], fill="red")
        images.append((img, f))

# Create a 3x3 grid
composite = Image.new('RGB', (600, 750), (255, 255, 255))
for i, (img, f) in enumerate(images):
    x = (i % 3) * 200
    y = (i // 3) * 250
    composite.paste(img, (x, y))

composite.save("/Users/geonhagang/.gemini/antigravity/brain/ddc5fc8b-527b-4600-8ff5-df3ff6a620a1/artifacts/composite.jpg")
print("Saved to composite.jpg")
