import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TrafficSignals from "./signals";
import { FaRegHandPointLeft,FaRegHandPointRight,FaRegHandPointDown, FaRegHandPointUp  } from "react-icons/fa";
function Videoanalysis({ role }) {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [status, setStatus] = useState(null);
  const [timer, setTimer] = useState(null);
  const [signals, setSignals] = useState([]);
  const [source, setSource] = useState(null);
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
      if (data.timer <= 0) {
        setStatus(0);
      } else if (data.timer <= 4) {
        setStatus(1);
      } else {
        setStatus(2);
      }
      console.log(timer);
      // Update vehicle count based on the received data
      setVehicleCount(data.count);
    });

    // Cleanup socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  
  // useEffect(() => {
  //   // Use the functional form to ensure the state update is based on the previous state
  //   setStatus(() => {
  //     if (timer <= 0) {
  //       return 0
  //     } else if (timer <= 4) {
  //       return 1
  //     } else {
  //       return 2
  //     }
  //   });

  //   // Set up an interval to fetch data every 5 seconds
  //   const intervalId = setInterval(() => {
  //     // Emit a test event to the server (you can replace this with your actual data fetching logic)
  //     // socket.emit('fetch_data', { /* your data parameters */ });
  //   }, 5000);

  //   // Clean up the interval when the component is unmounted
  //   return () => clearInterval(intervalId);
  // }, []);

  return role === "admin" ? (
    <div className="w-full h-screen text-black">
      <div className="text-black text-center text-3xl mt-6 font-bold">
        <h1>Vehicle Feeds From Cameras vehicle</h1>
        {console.log(status)}
      </div>
      <div className="flex justify-center flex-col items-center">
        <div className="w-full text-black items-center flex flex-col p-5">
          <div className="grid text-center   grid-cols-4 items-center">
            <div className=" flex justify-center items-center ">
              <div className="items-center flex-col flex">
              <TrafficSignals
                timer={signals[3] === 1 ? timer : 0}
              ></TrafficSignals>
              <h1 className=" text-black font-semibold text-base">West Signal</h1>
              </div>
              {
                signals[3] === 1 ?
                <div>
                  <FaRegHandPointRight  className=" h-10 w-16"/>
                </div>
                :
                ''
              }
            </div>
            <div className=" flex items-center col-span-2 justify-center flex-col space-y-3">
              <div className=" flex flex-col space-y-2  items-center">
              <TrafficSignals
                timer={signals[0] === 1 ? timer : 0}
              ></TrafficSignals>
              <h1 className=" text-black font-semibold text-base">North Signal</h1>
              {
                signals[0] === 1 ?
                <div>
                  <FaRegHandPointDown  className=" h-8 w-16"/>
                </div>
                :
                ''
              }
              </div>
              <div className="  ">
                <img id="video-feed" src={source} alt="Video Feed" className=" border-4  border-black drop-shadow-xl rounded-xl" />
                <div className="flex justify-between  px-5 w-full">
                  <h1 className=" font-semibold text-base bg-[#71C9CE] rounded-lg p-2 m-2">
                    Vehicle Count {vehicleCount}
                  </h1>
                  <h1 className=" font-semibold text-base bg-[#71C9CE] rounded-lg p-2 m-2">
                    Timer {timer}
                  </h1>
                </div>
              </div>
              <div className=" flex flex-col space-y-2 items-center">
                {
                  signals[2] === 1?
                  <div>
                    <FaRegHandPointUp  className=" h-8 w-16"/>
                  </div>
                  :
                  ''
                }
                <TrafficSignals
                  timer={signals[2] === 1 ? timer : 0}
                ></TrafficSignals>
                <h1 className=" text-black font-semibold text-base">South Signal</h1>
              </div>
  
            </div>
            {/* <div className="flex flex-col space-y-2 w-auto p-2 h-fit bg-black rounded-lg border-2">
              <div
                className={`rounded-full w-7 h-7 ${
                  status === 0 ? 'bg-red-500' : 'bg-red-900'
                }`}
              ></div>
              <div
                className={`rounded-full w-7 h-7 ${
                  status === 1 ? 'bg-yellow-400' : 'bg-yellow-900'
                }`}
              ></div>
              <div
                className={`rounded-full w-7 h-7 ${
                  status === 2 ? 'bg-green-400' : 'bg-green-900'
                }`}
              ></div>
            </div> */}
            <div className=" justify-center items-center flex">
              {
                signals[1] === 1 ?
                <div>
                  <FaRegHandPointLeft  className=" h-10 w-16"/>
                </div>
                :
                ''
              }
             
              <div className="items-center flex flex-col">
              <TrafficSignals
                timer={signals[1] === 1 ? timer : 0}
              ></TrafficSignals>
              <h1 className=" text-black font-semibold text-base">East Signal</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  ) : (
    <></>
  );
}

export default Videoanalysis;
