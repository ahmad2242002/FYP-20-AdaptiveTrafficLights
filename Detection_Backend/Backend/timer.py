
import time
import threading

class TrafficSignalController:
    def __init__(self,maxtimer):
        self.vehicle_count = 0
        self.signal_time = 10
        self.consumed_signal_time = 0
        self.start_time = time.time()
        self.check = 0
        self.max_time = maxtimer
        self.max_vehicle = 1
        self.min_time = 5
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
        if self.signal_time == 0:
            self._signal_time = 0
        if self.vehicle_count > self.max_vehicle and self.check == 0:
            self.signal_time = 10
            self.check = 1
        elif self.check == 1 and self.vehicle_count > self.max_vehicle:
            self.signal_time = 10
        elif self.signal_time > 3 and current_time - self.start_time > self.min_time:
            if self.check == 1:
                self.check = 2
            self.signal_time = 4
        if current_time - self.start_time > self.max_time  and self.signal_time > 4:
            self.check = 2
            self.signal_time = 4
        if self.signal_time <=4 and self.signal_time >=0:
            self.signal_time = max(0, self.signal_time - 1)
        
    def reset_controller(self, maxtimer):
        with self.lock:
            self.vehicle_count = 0
            self.signal_time = 10
            self.consumed_signal_time = 0
            self.start_time = time.time()
            self.check = 0
            self.min_time = 5
            self.max_time = maxtimer

    def get_signal_time(self):
        with self.lock:
            return self.signal_time
