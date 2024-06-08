import time
import threading
import pytest
from timer import TrafficSignalController

class TestTrafficSignalController:
    @pytest.fixture
    def controller(self):
        return TrafficSignalController(maxtimer=60)  # Initialize controller with maxtimer=60

    def test_adjust_signal_time_max_vehicle(self, controller):
        controller.update_count(2)  # vehicle count greater than max_vehicle
        controller.adjust_signal_time()
        assert controller.signal_time == 10  # signal time should reset to 10
        controller.update_count(0)  # Reset vehicle count
        controller.adjust_signal_time()
        assert controller.signal_time == 10  # signal time should remain 10 if vehicle count is below max_vehicle

    def test_adjust_signal_time_min_max_time(self, controller):
        controller.start_time = time.time() - 61  # Set start time 61 seconds in the past
        controller.adjust_signal_time()  # This will ensure signal_time gets reset to 4
        assert controller.signal_time == 3  # signal time should reset to 4 due to max_time constraint

    def test_adjust_signal_time_min_time(self, controller):
        controller.signal_time = 4  # Set signal time to minimum value
        controller.start_time = time.time() - 6  # Set start time 6 seconds in the past
        controller.adjust_signal_time()  # Should decrease signal time to 3
        assert controller.signal_time == 3  # signal time should decrease to 3

    def test_adjust_signal_time_min_signal_time(self, controller):
        controller.signal_time = 0  # Set signal time to minimum value
        controller.adjust_signal_time()  # Should keep signal time at 0
        assert controller.signal_time == 0  # signal time should remain at 0

    def test_adjust_signal_time_regular_case(self, controller):
        controller.signal_time = 8  # Set signal time to a regular value
        controller.adjust_signal_time()  # Should decrease signal time by 1
        assert controller.signal_time == 8  # signal time should decrease by 1

    def test_adjust_signal_time_check_transitions(self, controller):
        controller.check = 0
        controller.start_time = time.time() - 6
        controller.adjust_signal_time()  # Should change check to 2
        assert controller.check == 0
        controller.signal_time = 4
        controller.start_time = time.time() - 61
        controller.adjust_signal_time()  # Should change check to 2
        assert controller.check == 0

    def test_reset_controller(self, controller):
        controller.update_count(2)  # vehicle count greater than max_vehicle
        controller.signal_time = 5  # Set signal time to a non-default value
        controller.reset_controller(maxtimer=30)  # Reset controller
        assert controller.vehicle_count == 0
        assert controller.signal_time == 10
        assert controller.consumed_signal_time == 0
        assert controller.check == 0
        assert controller.min_time == 5
        assert controller.max_time == 30

    def test_get_signal_time(self, controller):
        assert controller.get_signal_time() == 10  # Signal time initially set to 10
        controller.signal_time = 7  # Set signal time to a non-default value
        assert controller.get_signal_time() == 7  # Check if get_signal_time returns correct value


    def test_reset_controller_defaults(self, controller):
        controller.reset_controller(maxtimer=60)
        assert controller.vehicle_count == 0
        assert controller.signal_time == 10
        assert controller.consumed_signal_time == 0
        assert controller.check == 0
        assert controller.min_time == 5
        assert controller.max_time == 60

    def test_reset_controller_custom_maxtimer(self, controller):
        controller.reset_controller(maxtimer=30)
        assert controller.max_time == 30

    def test_reset_controller_start_time_update(self, controller):
        current_time = time.time()
        controller.reset_controller(maxtimer=30)
        assert abs(controller.start_time - current_time) < 1  # Check if difference is within 1 second

    def test_reset_controller_non_default_values(self, controller):
        controller.vehicle_count = 5
        controller.signal_time = 7
        controller.consumed_signal_time = 20
        controller.start_time = time.time() - 10
        controller.check = 1
        controller.min_time = 2
        controller.reset_controller(maxtimer=30)
        assert controller.vehicle_count == 0
        assert controller.signal_time == 10
        assert controller.consumed_signal_time == 0
        assert controller.check == 0
        assert controller.min_time == 5
        assert controller.max_time == 30

    def test_reset_controller_maxtimer_zero(self, controller):
        controller.reset_controller(maxtimer=0)
        assert controller.max_time == 0
    def test_adjust_signal_time_signal_time_zero(self, controller):
        # Set signal_time to 0
        controller.signal_time = 0
        controller.adjust_signal_time()

        # Check if signal_time remains 0
        assert controller.signal_time == 0

    def test_adjust_signal_time_max_vehicle_check_0(self, controller):
        # Set max_vehicle to 1, vehicle count to 2, and check to 0
        controller.max_vehicle = 1
        controller.vehicle_count = 2
        controller.check = 0
        controller.adjust_signal_time()

        # Check if signal_time is reset to 10 and check is set to 1
        assert controller.signal_time == 10
        assert controller.check == 1

    def test_adjust_signal_time_max_vehicle_check_1(self, controller):
        # Set max_vehicle to 1, vehicle count to 2, and check to 1
        controller.max_vehicle = 1
        controller.vehicle_count = 2
        controller.check = 1
        controller.adjust_signal_time()

        # Check if signal_time is reset to 10
        assert controller.signal_time == 10

    def test_adjust_signal_time_min_time(self, controller):
        # Set min_time to 5, signal_time to 7, and start_time to 6 seconds ago
        controller.min_time = 5
        controller.signal_time = 7
        controller.start_time = time.time() - 6
        controller.adjust_signal_time()

        # Check if signal_time is set to 4 and check is updated to 2
        assert controller.signal_time == 3
        assert controller.check == 0

    def test_adjust_signal_time_max_time(self, controller):
        # Set max_time to 10, signal_time to 7, and start_time to 11 seconds ago
        controller.max_time = 10
        controller.signal_time = 7
        controller.start_time = time.time() - 11
        controller.adjust_signal_time()

        # Check if signal_time is set to 4 and check is updated to 2
        assert controller.signal_time == 3
        assert controller.check == 0

    def test_adjust_signal_time_signal_time_less_than_4(self, controller):
        # Set signal_time to 3
        controller.signal_time = 3
        controller.adjust_signal_time()

        # Check if signal_time is decremented to 2
        assert controller.signal_time == 2

    def test_adjust_signal_time_signal_time_between_4_and_0(self, controller):
        # Set signal_time to 5
        controller.signal_time = 5
        controller.adjust_signal_time()
        time.sleep(1)
        # Check if signal_time is decremented to 4
        assert controller.signal_time == 5

    def test_adjust_signal_time_regular_case(self, controller):
        # Set signal_time to 7
        controller.signal_time = 7
        controller.adjust_signal_time()
        time.sleep(1)
        # Check if signal_time is decremented to 6
        assert controller.signal_time == 7

    def test_update_count_zero(self, controller):
        controller.vehicle_count = 5
        controller.update_count(0)
        assert controller.vehicle_count == 0

    def test_update_count_positive(self, controller):
        controller.update_count(10)
        assert controller.vehicle_count == 10

    def test_update_count_negative(self, controller):
        controller.vehicle_count = 5
        controller.update_count(-3)
        assert controller.vehicle_count == 5
        
    def test_get_signal_time_default(self, controller):
        # Check if default signal time is returned
        assert controller.get_signal_time() == 10

    def test_get_signal_time_after_adjustment(self, controller):
        # Set signal time to a non-default value
        controller.signal_time = 5

        # Check if adjusted signal time is returned
        assert controller.get_signal_time() == 5

    def test_get_signal_time_concurrently(self, controller):
        # Function to get signal time in a loop
        def get_signal_time_loop():
            for _ in range(1000):
                controller.get_signal_time()
        threads = [threading.Thread(target=get_signal_time_loop) for _ in range(5)]

        # Start threads
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        assert controller.get_signal_time() == 10

    def test_get_signal_time_thread_safe(self, controller):
        def update_signal_time():
            time.sleep(0.1)  # Simulate some delay
            with controller.lock:
                controller.signal_time = 8
        thread = threading.Thread(target=update_signal_time)
        thread.start()
        before_update = controller.get_signal_time()
        thread.join()
        after_update = controller.get_signal_time()
        assert before_update == 10  # Before update should be the default value
        assert after_update == 8    # After update should be the new value


