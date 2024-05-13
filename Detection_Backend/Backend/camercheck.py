import cv2

# Capture from the first webcam
cap1 = cv2.VideoCapture(6)


while True:
    # Capture frames from the webcams
    ret1, frame1 = cap1.read()
    # Display frames from all webcams
    cv2.imshow('Webcam 1', frame1)
    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture objects and close windows
cap1.release()

cv2.destroyAllWindows()
