import cv2
import numpy as np
import os

def initialize_yolo():
    # Get the absolute path to the directory containing this script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct absolute paths to YOLO files
    weights_path = os.path.join(script_dir, "../Model/yolov3_tiny_training_150000.weights")
    cfg_path = os.path.join(script_dir, "../Model/yolov3_tiny_training.cfg")
    coco_names_path = os.path.join(script_dir, "../Model/coco.names")

    # Read YOLO files
    net = cv2.dnn.readNet(weights_path, cfg_path)
    layer_names = net.getUnconnectedOutLayersNames()

    # Load classes
    classes = []
    with open(coco_names_path, "r") as f:
        classes = [line.strip() for line in f]

    return net, layer_names, classes

total = 0
def process_frame(frame, net, layer_names, classes):
    height, width, channels = frame.shape

    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(layer_names)

    class_ids = []
    confidences = []
    boxes = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if (confidence > 0.6) : 
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.35, 0.35)
    total = 0
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            total = total+1
            label = str(classes[class_ids[i]])
            confidence = confidences[i]
            color = (0, 255, 0)
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, label + " " + str(round(confidence, 2)), (x, y - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            cv2.putText(frame, f'Number of Vehicles: {total}', (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)

    return frame, total

#def main():
 #   net, layer_names, classes = initialize_yolo()

    # Video capture
  #  cap = cv2.VideoCapture("tvid.mp4") 
    # Alternatively, you can capture video from a webcam
    # cap = cv2.VideoCapture(0)

   # while True:
    #    ret, frame = cap.read()

     #   if not ret:
      #      break  # Break the loop if the video is finished

       # processed_frame = process_frame(frame, net, layer_names, classes)

        #cv2.imshow("Vehicle Detection", processed_frame)

        # Break the loop if 'q' is pressed
#        if cv2.waitKey(1) & 0xFF == ord('q'):
 #           break

    # Release the camera and close the OpenCV window
  #  cap.release()
   # cv2.destroyAllWindows()

#if __name__ == "__main__":
 #   main()

