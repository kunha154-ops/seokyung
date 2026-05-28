import cv2
import numpy as np

img = cv2.imread('/Users/geonhagang/.gemini/antigravity/brain/ddc5fc8b-527b-4600-8ff5-df3ff6a620a1/media__1779969646245.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to find white/grey regions (the photos)
_, thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    # The photos are probably roughly 100x120 or larger, but not the whole image
    if 100 < w < 300 and 120 < h < 400:
        boxes.append((x, y, w, h))

# Sort boxes by y first (rows), then by x (cols)
# Top row y should be similar, bottom row y should be similar
top_row = sorted([b for b in boxes if b[1] < 400], key=lambda b: b[0])
bottom_row = sorted([b for b in boxes if b[1] >= 400], key=lambda b: b[0])

all_boxes = top_row + bottom_row

names = [
    "김정일", "황태성", "마석홍", "전수창", "정신조",
    "남궁현우", "김영주", "주영석", "이병구"
]

import os
out_dir = '/Users/geonhagang/seokyung/public/images/officers'

for i, (x, y, w, h) in enumerate(all_boxes):
    if i < len(names):
        name = names[i]
        # We might want to crop a bit inside the box to remove any borders
        # But let's just use the exact box first
        crop_img = img[y:y+h, x:x+w]
        out_path = f"{out_dir}/{name}.png"
        cv2.imwrite(out_path, crop_img)
        print(f"Saved {name} size {w}x{h} at {x},{y}")

print(f"Total boxes found: {len(all_boxes)}")
