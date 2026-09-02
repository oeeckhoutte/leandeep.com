# Access Raspberry Pi Camera using Python and OpenCV

- Canonical URL: https://leandeep.com/access-raspberry-pi-camera-using-python-and-opencv/
- Author: Olivier Eeckhoutte
- Published: 2025-04-28T21:55:00+02:00
- Updated: 2025-04-28T21:55:00+02:00
- Language: fr
- Tags: python, Pi, raspberry, opencv
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to install OpenCV on a Raspberry PI using Bookworm.

<br/>

## Prerequisites

**Install dependencies on Raspberry Pi**
```
sudo apt update
sudo apt install python3-picamera2
sudo apt install libcamera-apps
sudo apt install python3-opencv
```

<br/>

**Install dependencies on Macbook**
```
pip install opencv-python numpy
```

<br/>

## Code

```
import cv2
import numpy as np
import time
from datetime import datetime
import os

# ==========================
#   CONSTANTS (Configuration)
# ==========================
BLUR_SIZE = (7, 7)              # Larger → less sensitive (e.g., (7,7) or (9,9))
THRESHOLD_SENSITIVITY = 50       # Higher → less sensitive (e.g., 60, 70)
MIN_CONTOUR_AREA = 2000          # Higher → only detects larger movements
FRAME_WAIT_TIME = 0.1            # Time to wait between frames (in seconds)
SAVE_DIR = "captures"            # Directory to save captured images

# ==========================
#   Camera Initialization
# ==========================
def initialize_camera():
    try:
        from picamera2 import Picamera2
        picam2 = Picamera2()
        config = picam2.create_preview_configuration(main={"format": "RGB888", "size": (640, 480)})
        picam2.configure(config)
        picam2.start()
        time.sleep(2)
        print("[INFO] Raspberry Pi camera initialized.")
        return picam2, True
    except ImportError:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise Exception("[ERROR] Cannot open webcam.")
        time.sleep(2)
        print("[INFO] Webcam initialized.")
        return cap, False

# ==========================
#   Frame Capture
# ==========================
def capture_frame(camera, is_picam):
    if is_picam:
        return camera.capture_array()
    else:
        ret, frame = camera.read()
        if not ret:
            raise Exception("[ERROR] Failed to capture frame.")
        return frame

# ==========================
#   Frame Processing
# ==========================
def process_frame(current_frame, previous_frame, is_picam):
    # Apply Gaussian blur
    current_blurred = cv2.GaussianBlur(current_frame, BLUR_SIZE, 0)
    previous_blurred = cv2.GaussianBlur(previous_frame, BLUR_SIZE, 0)

    # Convert to grayscale
    if is_picam:
        gray_current = cv2.cvtColor(current_blurred, cv2.COLOR_RGB2GRAY)
        gray_previous = cv2.cvtColor(previous_blurred, cv2.COLOR_RGB2GRAY)
    else:
        gray_current = cv2.cvtColor(current_blurred, cv2.COLOR_BGR2GRAY)
        gray_previous = cv2.cvtColor(previous_blurred, cv2.COLOR_BGR2GRAY)

    # Compute difference and threshold
    diff = cv2.absdiff(gray_previous, gray_current)
    _, thresh = cv2.threshold(diff, THRESHOLD_SENSITIVITY, 255, cv2.THRESH_BINARY)
    thresh = cv2.dilate(thresh, None, iterations=2)

    return thresh

# ==========================
#   Movement Detection
# ==========================
def detect_movement(thresh):
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        if cv2.contourArea(contour) >= MIN_CONTOUR_AREA:
            return True
    return False

# ==========================
#   Save Frame
# ==========================
def save_frame(frame, is_picam):
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%d_%H-%M-%S")
    filename = os.path.join(SAVE_DIR, f"capture_{timestamp}.jpg")

    if is_picam:
        frame_to_save = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    else:
        frame_to_save = frame  # Already BGR

    cv2.imwrite(filename, frame_to_save)
    print(f"[INFO] Image saved: {filename}")

# ==========================
#   Main Function
# ==========================
def main():
    os.makedirs(SAVE_DIR, exist_ok=True)

    camera, is_picam = initialize_camera()
    previous_frame = capture_frame(camera, is_picam)

    print("[INFO] Surveillance started... (Press Ctrl+C to exit)")

    try:
        while True:
            current_frame = capture_frame(camera, is_picam)
            thresh = process_frame(current_frame, previous_frame, is_picam)

            if detect_movement(thresh):
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Movement detected!")
                save_frame(current_frame, is_picam)

            previous_frame = current_frame.copy()
            time.sleep(FRAME_WAIT_TIME)

    except KeyboardInterrupt:
        print("\n[INFO] Surveillance stopped by the user.")

    finally:
        if is_picam:
            camera.stop()
        else:
            camera.release()

# ==========================
#   Entry Point
# ==========================
if __name__ == "__main__":
    main()

```

<br/>

- `BLUR_SIZE`: larger → less sensitive (e.g., (7,7) or (9,9))
- `THRESHOLD_SENSITIVITY`: higher → less sensitive (e.g., 60, 70)
- `MIN_CONTOUR_AREA`: higher → only detects larger movements
