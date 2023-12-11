
import time
import threading

class TrafficSignalController:
    def __init__(self):
        self.vehicle_count = 0
        self.signal_time = 10
        self.consumed_signal_time = 0
        self.start_time = time.time()

        # Create a lock to ensure safe access to shared data
        self.lock = threading.Lock()

        # Create a thread for adjusting signal time
       

    def update_count(self, count):
        with self.lock:
            self.vehicle_count = count

    def adjust_signal_time_thread(self):
        while True:
            with self.lock:
                self.adjust_signal_time()

    def adjust_signal_time(self):
        current_time = time.time()
        if current_time - self.start_time < 40:
            if self.vehicle_count < 5:
                self.signal_time += 2
            elif 5 <= self.vehicle_count <= 10:
                self.signal_time -= 1
            else:
                self.signal_time = max(5, self.signal_time - 3)
        else:
            self.signal_time -= 1
        if self.signal_time < 0:
            self.signal_time = 0

    def get_signal_time(self):
        with self.lock:
            return self.signal_time
