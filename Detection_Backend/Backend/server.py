from flask import Flask, render_template, Response, send_file, request, jsonify
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
from apscheduler.schedulers.background import BackgroundScheduler
from Components.vehicle import initialize_yolo, process_frame
from flask_caching import Cache
from flask_cors import CORS
import threading
import time
from timer import TrafficSignalController
import os
import sys
import subprocess
app = Flask(__name__)
CORS(app) 
cache = Cache(app, config={'CACHE_TYPE': 'simple'})


socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*")
# Initialize YOLO
net, layer_names, classes = initialize_yolo()

# Video processing variables
frame = None
video_processing_active = True
prev_frame_time = 0
controller = TrafficSignalController(30)
index_vid = 0
prev_index_vid = index_vid
video_processing_initialized = threading.Event()
video_processing_initialized.set()
# Create a background scheduler
scheduler = BackgroundScheduler(daemon=True)
scheduler.start()
#input_array = ["0", "2", "4", "6"]
input_array = ["0", "2", "4", "6", "8"]
#input_array = ["0", "2", "4", "6", "Components/demo.mp4"]
#input_array = ["0", "0", "0", "0"]
timer_signals = [0, 0, 0, 0, 0]
manual_timer_signals = [10, 10, 10, 10, 10]
manual_mode = False
can_shift = False
manual_vid_index = 0
reverse_mode = False
splitPhase = False
prev_manual_vid_index = 0
no_of_Camera = 4
#input_array[index_vid]
def video_processing():
    global frame, check_vid, index_vid,prev_index_vid, manual_mode, manual_vid_index, prev_manual_vid_index
    if manual_mode == False or manual_mode == True:
        print('dsdsa')
        if (input_array[index_vid] == '0' and manual_mode == False)  or (manual_vid_index == 0 and manual_mode == True):
            cap = cv2.VideoCapture(0)
        elif (input_array[index_vid] == '2' and manual_mode == False)  or (manual_vid_index == 2 and manual_mode == True):
            cap = cv2.VideoCapture(2)
        elif (input_array[index_vid] == '4' and manual_mode == False)  or (manual_vid_index == 4 and manual_mode == True): 
            cap = cv2.VideoCapture(4)
        elif (input_array[index_vid] == '6' and manual_mode == False)  or (manual_vid_index == 6 and manual_mode == True):
            cap = cv2.VideoCapture(6)
        elif (input_array[index_vid] == '8' and manual_mode == False)  or (manual_vid_index == 8 and manual_mode == True):
            cap = cv2.VideoCapture(8)
        else:
            cap = cv2.VideoCapture(input_array[index_vid])
        cap.set(3, 620)  # Width
        cap.set(4, 340)  # Height
        video_processing_initialized.wait()  
        while video_processing_active:
            ret, current_frame = cap.read()
            if ret:
                with threading.Lock():
                    frame = current_frame
                    if index_vid != prev_index_vid: # when camera get shift
                    # Release the current capture instance
                        cap.release()
                        # Update the previous index
                        prev_index_vid = index_vid
                        
                        if manual_mode == False:
                            controller.reset_controller(30)
                        else:
                            controller.reset_controller(manual_timer_signals[index_vid])
                            print("resetinggggggggggg1")
                        # Create a new capture instance with the updated index_vid
                        if (input_array[index_vid] == '0' and manual_mode == False) or (manual_vid_index == 0 and manual_mode == True):
                            cap = cv2.VideoCapture(0)
                        elif (input_array[index_vid] == '2' and manual_mode == False) or (manual_vid_index == 2 and manual_mode == True): 
                            cap = cv2.VideoCapture(2)
                        elif (input_array[index_vid] == '4' and manual_mode == False) or (manual_vid_index == 4 and manual_mode == True):
                            cap = cv2.VideoCapture(4)
                        elif (input_array[index_vid] == '6' and manual_mode == False) or (manual_vid_index == 6 and manual_mode == True):
                            cap = cv2.VideoCapture(6)
                        elif (input_array[index_vid] == '8' and manual_mode == False)  or (manual_vid_index == 8 and manual_mode == True):
                            cap = cv2.VideoCapture(8)
                        else:
                            cap = cv2.VideoCapture(input_array[index_vid])
                        cap.set(3, 620)  # Width
                        cap.set(4, 340)  # Height
                    elif (manual_mode == True) and  (manual_vid_index != prev_manual_vid_index):
                        prev_manual_vid_index = manual_vid_index
                        if manual_vid_index == 0:
                            cap = cv2.VideoCapture(0)
                        elif manual_vid_index == 2:
                            cap = cv2.VideoCapture(2)
                        elif manual_vid_index == 4:
                            cap = cv2.VideoCapture(4)
                        elif manual_vid_index == 6:
                            cap = cv2.VideoCapture(6)
                        elif manual_vid_index == 8:
                            cap = cv2.VideoCapture(8)
                        else:
                            cap = cv2.VideoCapture(input_array[index_vid])
                        cap.set(3, 620)  # Width
                        cap.set(4, 340)  # Height
            else:
                # Release the current capture instance
                cap.release()
                print("ret not foundddddddddddddddddddd")
                # Update the previous index
                prev_manual_vid_index = manual_vid_index
                if manual_mode == False:
                    prev_index_vid = index_vid
                    controller.reset_controller(30)
                elif manual_vid_index != prev_manual_vid_index:
                    prev_manual_vid_index = manual_vid_index
                    print("resetinggggggggggg22222222222222222")
                # Create a new capture instance with the updated index_vid
                if (input_array[index_vid] == '0' and manual_mode == False)  or (manual_vid_index == 0 and manual_mode == True):
                    cap = cv2.VideoCapture(0)
                elif (input_array[index_vid] == '2' and manual_mode == False)  or (manual_vid_index == 2 and manual_mode == True):
                    cap = cv2.VideoCapture(2)
                elif (input_array[index_vid] == '4' and manual_mode == False)  or (manual_vid_index == 4 and manual_mode == True):
                    cap = cv2.VideoCapture(4)
                elif (input_array[index_vid] == '6' and manual_mode == False)  or (manual_vid_index == 6 and manual_mode == True):
                    cap = cv2.VideoCapture(6)
                elif (input_array[index_vid] == '8' and manual_mode == False)  or (manual_vid_index == 8 and manual_mode == True):
                    cap = cv2.VideoCapture(8)
                else:
                    cap = cv2.VideoCapture(input_array[index_vid])
                if manual_mode:
                    time.sleep(0.2)
                cap.set(3, 620)  # Width
                cap.set(4, 340)  # Height
        cap.release()

def adjust_signal_time():
    global controller
    with controller.lock:
        controller.adjust_signal_time()

# Schedule the task to run every 1 second
scheduler.add_job(adjust_signal_time, 'interval', seconds=1)

def generate_frames():
    global frame, check_vid, index_vid, can_shift, manual_timer_signals, manual_vid_index, input_array, reverse_mode, splitPhase, no_of_Camera 
    check_vid = 0
    check_vid1 = -1
    while True:
        if frame is not None:
            new_frame_time = time.time()
            if manual_mode == False:
                processed_frame, count = process_frame(frame, net, layer_names, classes)
            else:
                processed_frame = frame
            # Convert the processed frame to JPEG
            desired_height = 240
            desired_width = 540
            resized_frame = cv2.resize(processed_frame, (desired_width, desired_height))
            ret, buffer = cv2.imencode('.jpg', resized_frame)
            #ret, buffer = cv2.imencode('.jpg', processed_frame)
            frame_bytes = buffer.tobytes()

            # Emit the frame to connected clients
            if(controller.get_signal_time() <= 0):
                timer_signals[0] = 0;
                timer_signals[1] = 0;
                timer_signals[2] = 0;
                timer_signals[3] = 0;
                timer_signals[4] = 0;
            elif(controller.get_signal_time() <= 4):
                timer_signals[index_vid] = 1;
            if(controller.get_signal_time() == 0 and check_vid == 1):
                check_vid = 0 
                check_vid1 = -1
                with threading.Lock():
                    if reverse_mode == True:
                        index_vid = (index_vid - 1)
                        if index_vid <= -1:
                            if no_of_Camera == 5:
                                index_vid = 4
                            elif no_of_Camera == 3:
                                index_vid = 2
                            else: 
                                index_vid = 3
                    elif splitPhase == True:
                        index_vid = (index_vid + 2)
                        if index_vid == 4:
                            index_vid = 1
                        elif index_vid == 5:
                            index_vid = 0
                    else:
                        index_vid = (index_vid + 1) % no_of_Camera
                    #manual_vid_index = int(input_array[index_vid])
                    if index_vid == 0:
                        can_shift = True
                    else:
                        can_shift = False
                    timer_signals[index_vid] = 1;
                    print("Switching to video index:", index_vid)
            
            if(controller.get_signal_time() >= 4 and check_vid == 0):
                check_vid = 1 
            if(controller.get_signal_time() == 0 and check_vid == 0):
                check_vid = 1 
            socketio.emit('video_frame', {'frame': frame_bytes, 'count': count, 'timer' : controller.get_signal_time(), 'signals': timer_signals, 'manualTimings': manual_timer_signals})
            if manual_mode == False:
                controller.update_count(count)
                print(manual_timer_signals)
            else:
                controller.update_count(10)
            if manual_mode == False:
                time.sleep(0.1)
            else:
                time.sleep(1) # Adjust sleep interval as needed

def start_continuous_frame_generation():
    frame_gen_thread = threading.Thread(target=generate_frames)
    frame_gen_thread.daemon = True
    frame_gen_thread.start()

def run_flask():
    app.run(host='0.0.0.0', port=5001, use_reloader=False)

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

@app.route('/set_manual', methods=['POST'])
def set_manual():
    print('hello manual call')
    global manual_mode, manual_timer_signals
    data = request.get_json()
    mode = data.get('value')
    timers = data.get('timers')
    print(mode)
    print(timers)
    temp_timers = timers
    signal_intervals_int = [int(interval) for interval in temp_timers]
    manual_timer_signals = signal_intervals_int
    while can_shift == False:
        pass
    if mode == 1:
        manual_mode = True
    else:
        manual_mode = False
    
    print('hello manual call 2')
    return jsonify({'message': 'Variable set successfully'})
    

@app.route('/set_reverse', methods=['GET'])
def set_reverse():
    print('hello Reverse call')
    global reverse_mode, index_vid, no_of_Camera
    while can_shift == False:
        pass
    if reverse_mode == True:
        reverse_mode = False
        index_vid = 0
    else:
        if no_of_Camera == 5:
            index_vid = 4
        elif no_of_Camera == 4:
            index_vid = 3
        elif no_of_Camera == 3:
            index_vid = 2
        reverse_mode = True
    return jsonify({'message': 'Reverse successfully'})
    

@app.route('/set_split_phasing', methods=['GET'])
def set_split_phasing():
    print('hello set_split_phasing call')
    global reverse_mode, index_vid, splitPhase, no_of_Camera
    if no_of_Camera != 4:
        return jsonify({'error': 'Can not apply split on odd cameras'})
    while can_shift == False:
        pass
    index_vid = 0
    if splitPhase == True:
        splitPhase = False
    else:
        splitPhase = True
    return jsonify({'message': 'Split Phase successfully'})
    
@app.route('/set_normal', methods=['GET'])
def set_normal():
    print('hello set_split_phasing call')
    global reverse_mode, index_vid, splitPhase
    while can_shift == False:
        pass
    index_vid = 0    
    splitPhase = False
    reverse_mode = False
    return jsonify({'message': 'Normal Phase successfully'})
    

@app.route('/shift_cam', methods=['POST'])
def shift_cam():
    print('hello manual camera call ')
    global manual_vid_index
    data = request.get_json()
    index = data.get('index')
    #manual_vid_index = int(index)
    manual_vid_index = 0
    print('hello manual camera call ',manual_vid_index)
    return jsonify({'message': 'Camera Change successfully'})

@app.route('/get_mode', methods=['GET'])
def get_mode():
    global manual_mode
    return jsonify({'mode': manual_mode})
    
@app.route('/get_phase', methods=['GET'])
def get_phase():
    global reverse_mode, index_vid, splitPhase
    if reverse_mode == True:
        return jsonify({'phase': 'Clockwise'})
    if splitPhase == True:
        return jsonify({'phase': 'Split-Phase'})    
    return jsonify({'phase': 'Anti-Clockwise'})

    
@app.route('/get_camera_count', methods=['GET'])
def get_camera_count():
    global no_of_Camera
    return jsonify({'count': no_of_Camera})



@app.route('/restart_server', methods=['POST'])
def restart_server():
    global manual_mode, index_vid, prev_index_vid
    if manual_mode == True:
        manual_mode = False
        index_vid = 0
        prev_index_vid = index_vid
    return jsonify({'message': 'Server restarted successfully'})

@app.route('/change_no_camera', methods=['POST'])
def change_no_camera():
    print('hello change_no_camera ')
    global  no_of_Camera, manual_mode, index_vid, prev_index_vid
    while can_shift == False:
        pass
    data = request.get_json()
    no = data.get('no_of_camera')
    
    no_of_Camera = int(no)
    print(no_of_Camera)
    if manual_mode == True:
        manual_mode = False
        index_vid = 0
        prev_index_vid = index_vid
    return jsonify({'message': 'Camera Number successfully'})

if __name__ == "__main__":
    video_thread = threading.Thread(target=video_processing)
    video_thread.start()
    start_continuous_frame_generation()
    video_processing_initialized.set()
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=False)
    # When the Flask app is stopped, set the video processing flag to False
    video_processing_active = False
    video_thread.join()
    
    # Wait for the video processing and frame generation threads to finish
    threading.current_thread().join()
