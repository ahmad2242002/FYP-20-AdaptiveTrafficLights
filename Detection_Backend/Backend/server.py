from flask import Flask, render_template, Response, send_file
import cv2
import numpy as np
from Components.vehicle import initialize_yolo, process_frame 
from flask_caching import Cache
import threading
import time
app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Initialize YOLO
net, layer_names, classes = initialize_yolo()

# Video processing variables
frame = None
video_processing_active = True
prev_frame_time = 0
  
# used to record the time at which we processed current frame 
new_frame_time = 0
def video_processing():
    global frame
    cap = cv2.VideoCapture('Components/tvid.mp4')
    #cap = cv2.VideoCapture(0)
    cap.set(3, 620)  # Width
    cap.set(4, 440)  # Height

    while video_processing_active:
        ret, frame = cap.read()

    cap.release()

# Start video processing in a separate thread
video_thread = threading.Thread(target=video_processing)
video_thread.start()
count = 0
prev_frame_time = 0
skip = 0
# used to record the time at which we processed current frame 
new_frame_time = 0    

def generate_frames():
    prev_frame_time = 0
    global count
    start_time = time.time()
    while True:
        if frame is not None:
            new_frame_time = time.time() 
            if skip%2 == 0:
                 processed_frame, count = process_frame(frame, net, layer_names, classes)

            # Convert the processed frame to JPEG
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            frame_bytes = buffer.tobytes()
            print("count: ", count)
            fps = (1/(new_frame_time-prev_frame_time))
            prev_frame_time = new_frame_time 
            
            fps = str(fps)
            print("FPS:", fps)

            frame_response = (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n' +
                b'Count: ' + str(count).encode('utf-8') + b'\r\n'
            )

            yield frame_response


@cache.cached(timeout=60)  # Cache the image for 60 seconds
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    
@app.route('/testing')
def testing():
    return Response("Hello testing")

@app.route('/get_image')
def get_image():
    # Assuming sample_image.jpg is in the static folder
    return send_file('static/sample.jpg', mimetype='image/jpg')

@app.route('/test_local_image')
def test_local_image():
    # Provide the path to the local image on your server
    image_path = 'static/car.jpg'

    # Read the local image
    img = cv2.imread(image_path)

    # Process the image using the YOLO model
    processed_img, count = process_frame(img, net, layer_names, classes)

    # Convert the processed image to JPEG
    _, buffer = cv2.imencode('.jpg', processed_img)
    img_bytes = buffer.tobytes()

    return Response(img_bytes, mimetype='image/jpeg')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

  
# When the Flask app is stopped, set the video processing flag to False
video_processing_active = False
# Wait for the video processing thread to finish
video_thread.join()
