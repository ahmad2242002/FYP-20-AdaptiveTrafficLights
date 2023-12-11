from flask import Flask, render_template, Response, send_file
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
from apscheduler.schedulers.background import BackgroundScheduler
from Components.vehicle import initialize_yolo, process_frame
from flask_caching import Cache
import threading
import time
from timer import TrafficSignalController

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})


socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*")

# Initialize YOLO
net, layer_names, classes = initialize_yolo()

# Video processing variables
frame = None
video_processing_active = True
prev_frame_time = 0
controller = TrafficSignalController()

# Create a background scheduler
scheduler = BackgroundScheduler(daemon=True)
scheduler.start()

def video_processing():
    global frame
    cap = cv2.VideoCapture('Components/tvid.mp4')
    cap.set(3, 620)  # Width
    cap.set(4, 440)  # Height

    while video_processing_active:
        ret, current_frame = cap.read()
        if ret:
            with threading.Lock():
                frame = current_frame

    cap.release()

def adjust_signal_time():
    global controller
    with controller.lock:
        controller.adjust_signal_time()
    print(f"Vehicle count: {controller.vehicle_count}, Signal Time: {controller.get_signal_time()} seconds")

# Schedule the task to run every 1 second
scheduler.add_job(adjust_signal_time, 'interval', seconds=1)

def generate_frames():
    global frame

    while True:
        if frame is not None:
            new_frame_time = time.time()
            processed_frame, count = process_frame(frame, net, layer_names, classes)

            # Convert the processed frame to JPEG
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            frame_bytes = buffer.tobytes()

            # Emit the frame to connected clients
            print(controller.get_signal_time())
            socketio.emit('video_frame', {'frame': frame_bytes, 'count': count, 'timer' : controller.get_signal_time()})

            controller.update_count(count)

            time.sleep(0.1)  # Adjust sleep interval as needed

def start_continuous_frame_generation():
    frame_gen_thread = threading.Thread(target=generate_frames)
    frame_gen_thread.daemon = True
    frame_gen_thread.start()

@cache.cached(timeout=60)  # Cache the image for 60 seconds
@app.route('/')
def index():
    return render_template('index.html')

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

@app.route('/getTimer')
def get_timer():
    signal_time = controller.get_signal_time()
    return Response(str(signal_time), mimetype='text/plain')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == "__main__":
    # Start video processing and frame generation in separate threads
    video_thread = threading.Thread(target=video_processing)
    video_thread.start()

    start_continuous_frame_generation()

    # Start the SocketIO server along with the Flask app
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=False)

    # When the Flask app is stopped, set the video processing flag to False
    video_processing_active = False

    # Wait for the video processing and frame generation threads to finish
    video_thread.join()
    threading.current_thread().join()
