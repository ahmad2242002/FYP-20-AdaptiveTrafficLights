"use client";
import React, { useState, useEffect , useRef} from "react";
import TrafficSignal from "@/components/signals";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import io from "socket.io-client";
import { Snackbar } from "@mui/material";
const Manual = () => {
  const [signal1, setSignal1] = useState("");
  const [signal2, setSignal2] = useState("");
  const [signal3, setSignal3] = useState("");
  const [signal4, setSignal4] = useState("");
  const [mode, setMode] = useState(0);
  const [status, setStatus] = useState(null);
  const [source, setSource] = useState(null);
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCamIndex, setCurrentCamIndex] = useState(0);
  const currentCamIndexRef = useRef(currentCamIndex);
  const cameraArray = [0, 2, 4, 6];
  const [timer, setTimer] = useState([]);
  const [manualtimer, setManualTimer] = useState([]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const [alerts, setAlerts] = useState({
    message: "",
    type: "success",
    open: false,
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle the submitted values here
    console.log("Signal 1:", signal1);
    console.log("Signal 2:", signal2);
    console.log("Signal 3:", signal3);
    console.log("Signal 4:", signal4);
    if (signal1 > 5 && signal2 > 5 && signal3 > 5 && signal4 > 5) {
      console.log(mode);
      mode === 0 ? ChangeMod() : restartServer();
    } else {
      setAlerts({
        ...alerts,
        message: "Signal time must be above 5 seconds",
        type: "error",
        open: true,
      });
    }
  };

  const handleClose = () => {
    setAlerts({ ...alerts, message: "", open: false, type: "success" });
  };

  function ChangeMod() {
    setIsLoading(true);
    fetch("http://169.254.220.186:5000/set_manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: 1,
        timers: [signal1, signal3, signal4, signal2],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setMode(1);
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        console.log(data.message); // Log the response message
        // You can perform additional actions with the received data here
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  async function fetchMod() {
    try {
      const response = await fetch("http://169.254.220.186:5000/get_mode", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch timer data");
      }
      const data = await response.json();
      setMode(data.mode === false ? 0 : 1);
      if(data.mode)
      {
        setSignal1(manualtimer[0])
        setSignal2(manualtimer[3])
        setSignal3(manualtimer[1])
        setSignal4(manualtimer[2])
      }
    } catch (error) {
      console.error("Error fetching timer data:", error.message);
    }
  }

  useEffect(() => {
    fetchMod();
  }, []);

  async function restartServer() {
    try {
      const response = await fetch(
        "http://169.254.220.186:5000/restart_server",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setMode(0);
        console.log("Server restarted successfully");
      } else {
        console.error(`Failed to restart server: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const currentIndex = currentCamIndexRef.current;
      console.log("index", currentIndex)
      try {
        const response = await fetch("http://169.254.220.186:5000/shift_cam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index: currentIndex}),
        });

        if (response.ok) {
          setCurrentCamIndex(prevIndex => {
            if (prevIndex >= 6) {
              return 0;
            } else {
              return (prevIndex + 2) % 7;
            }
          });
          console.log("Camera Change successful");
        } else {
          console.error(`Failed to change camera: ${response.status}`);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    currentCamIndexRef.current = currentCamIndex;
  }, [currentCamIndex]);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }
  useEffect(() => {
    // Connect to the Socket.IO server

    //const socket = io.connect('http://192.168.18.17:5000');
    const socket = io.connect("http://169.254.220.186:5000");

    // Event listener to capture count from the video feed
    socket.on("video_frame", (data) => {
      console.log("Received video_frame:", data);
      // Convert ArrayBuffer to Base64
      const base64Data = arrayBufferToBase64(data.frame);

      // Create an image element and set its source to the Base64 data
      setSource("data:image/jpeg;base64," + base64Data);
      setSignals(data.signals);
      setTimer(data.timer);
      setManualTimer(data.manualTimings)
    });

    // Cleanup socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    if(mode)
    {
      setSignal1(manualtimer[0])
      setSignal2(manualtimer[3])
      setSignal3(manualtimer[1])
      setSignal4(manualtimer[2])
    }
  },[manualtimer,mode])
  return (
    <div className=" items-center flex justify-center w-full p-10">
      {isLoading ? (
        <div className=" flex items-center space-x-3 bg-teal-300 p-4 rounded-xl ">
          <div className="processing-spinner"></div>
          <p className=" text-xl font-bold">Changing Mod</p>
        </div>
      ) : (
        <div className=" items-center text-center justify-center bg-[#A6E3E9] grid grid-rows-3 m-10 rounded-3xl  h-full p-10">
          <img id="video-feed" src={source} alt="Video Feed" className=" border-4  border-black drop-shadow-xl rounded-xl absolute right-0 top-5 w-96 mr-10" />
          <div className=" flex flex-col items-center space-y-3  h-full   ">
            <div className="mb-4">
              <label
                htmlFor="signal1"
                className="block text-sm font-medium text-gray-600"
              >
                Signal 1 Duration (in seconds)
              </label>
              <input
                type="number"
                id="signal1"
                disabled = {mode == 1? true:false}
                className="w-full h-10 ps-5 outline-none rounded-lg text-black"
                value={signal1}
                onChange={(e) => setSignal1(e.target.value)}
              />
            </div>
            <TrafficSignal timer={signals[0] === 1 ? timer : 0} ></TrafficSignal>
            <div className=" flex space-x-3 items-center">
              <h1 className=" text-black font-semibold text-lg">
                North Signal
              </h1>
              <h1 className=" text-black bg-gray-300 drop-shadow-lg animate-pulse border-2 border-teal-500 px-3 py-1 rounded-lg font-semibold text-lg">
                {signals[0] === 1 ? timer : 0}
              </h1>
            </div>
          </div>
          <div className=" grid grid-cols-5 0 h-full w-full">
            <div className=" flex flex-col items-center space-y-3">
              <div className="mb-4">
                <label
                  htmlFor="signal2"
                  className="block text-sm font-medium text-gray-600"
                >
                  Signal 2 Duration (in seconds)
                </label>
                <input
                  type="number"
                  id="signal2"
                  disabled = {mode == 1? true:false}
                  className="w-full h-10 ps-5 outline-none rounded-lg text-black"
                  value={signal2}
                  onChange={(e) => setSignal2(e.target.value)}
                />
              </div>
              <TrafficSignal  timer={signals[3] === 1 ? timer : 0} ></TrafficSignal>
              <div className=" flex space-x-3 items-center">
                <h1 className=" text-black font-semibold text-lg">
                  West Signal
                </h1>
                <h1 className=" text-black bg-gray-300 drop-shadow-lg animate-pulse border-2 border-teal-500 px-3 py-1 rounded-lg font-semibold text-lg">
                  {signals[3] === 1 ? timer : 0}
                </h1>
              </div>
            </div>
            <div></div>
            <div className=" items-center flex justify-center">
              <button
                className=" bg-[#71C9CE] my-3 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl"
                name={"mode"}
                onClick={handleSubmit}
              >
                {mode === 0 ? "Set Manual Mod" : "Set Adaptive Mod"}
              </button>
            </div>
            <div></div>
            <div className=" flex flex-col items-center space-y-3 ">
              <div className="mb-4">
                <label
                  htmlFor="signal3"
                  className="block text-sm font-medium text-gray-600"
                >
                  Signal 3 Duration (in seconds)
                </label>
                <input
                  type="number"
                  id="signal3"
                  disabled = {mode == 1? true:false}
                  className="w-full h-10 ps-5 outline-none rounded-lg text-black"
                  value={signal3}
                  onChange={(e) => setSignal3(e.target.value)}
                />
              </div>
              <TrafficSignal timer={signals[1] === 1 ? timer : 0}></TrafficSignal>
              <div className=" flex space-x-3 items-center">
                <h1 className=" text-black font-semibold text-lg">
                  East Signal
                </h1>
                <h1 className=" text-black bg-gray-300 drop-shadow-lg animate-pulse border-2 border-teal-500 px-3 py-1 rounded-lg font-semibold text-lg">
                  {signals[1] === 1 ? timer : 0}
                </h1>
              </div>
            </div>
          </div>
          <div className=" flex flex-col items-center space-y-3 mb-10 h-full">
            <div className="mb-4">
              <label
                htmlFor="signal4"
                className="block text-sm font-medium text-gray-600"
              >
                Signal 4 Duration (in seconds)
              </label>
              <input
                type="number"
                id="signal4"
                disabled = {mode == 1? true:false}
                className="w-full h-10 ps-5 outline-none rounded-lg text-black"
                value={signal4}
                onChange={(e) => setSignal4(e.target.value)}
              />
            </div>
            <TrafficSignal  timer={signals[2] === 1 ? timer : 0} ></TrafficSignal>
            <div className=" flex space-x-3 items-center">
              <h1 className=" text-black font-semibold text-lg">
                South Signal
              </h1>
              <h1 className=" text-black bg-gray-300 drop-shadow-lg animate-pulse border-2 border-teal-500 px-3 py-1 rounded-lg font-semibold text-lg">
                {signals[2] === 1 ? timer : 0}
              </h1>
            </div>
          </div>
          {/* <TrafficSignal></TrafficSignal>
            <TrafficSignal></TrafficSignal>
            <TrafficSignal></TrafficSignal> */}
        </div>
      )}
      <Snackbar
        open={alerts.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alerts.type}
          sx={{ width: "100%" }}
        >
          {alerts.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Manual;
