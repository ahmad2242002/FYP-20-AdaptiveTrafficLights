import cv2
import numpy as np

def initialize_yolo():
    net = cv2.dnn.readNet("yolov3-tiny.weights", "yolov3-tiny.cfg")
    layer_names = net.getUnconnectedOutLayersNames()

    # Load classes
    classes = []
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f]

    return net, layer_names, classes

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

            if confidence > 0.5:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(classes[class_ids[i]])
            confidence = confidences[i]
            color = (0, 255, 0)
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, label + " " + str(round(confidence, 2)), (x, y - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    return frame

def main():
    net, layer_names, classes = initialize_yolo()

    # Video capture
    cap = cv2.VideoCapture("tvid.mp4") 
    # Alternatively, you can capture video from a webcam
    # cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        if not ret:
            break  # Break the loop if the video is finished

        processed_frame = process_frame(frame, net, layer_names, classes)

        cv2.imshow("Vehicle Detection", processed_frame)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close the OpenCV window
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()

