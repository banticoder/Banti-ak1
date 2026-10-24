# 1️⃣ Simple solid‑color image
from PIL import Image

img = Image.new("RGB", (400, 300), color="#4A90E2")  # blue rectangle
img.save("solid.png")
print("solid.png created")