
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Videoanalysis() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [status, setStatus] = useState(null);
  const [timer, setTimer] = useState(null);
  const [source, setSource] = useState(null)
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io.connect('http://192.168.18.17:5000');
    // Event listener to capture count from the video feed
    socket.on('video_frame', (data) => {
      console.log('Received video_frame:', data);
      // Convert ArrayBuffer to Base64
      const base64Data = arrayBufferToBase64(data.frame);

       // Create an image element and set its source to the Base64 data
      setSource('data:image/jpeg;base64,' + base64Data)
      setTimer(data.timer)
        if (data.timer <= 0) {
          setStatus(0)
        } else if (data.timer <= 4) {
          setStatus(1)
        } else {
          setStatus(2)
        }
      console.log(timer)
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

  return (
    <div className="w-full h-screen text-black">
      <div className="text-black text-center text-5xl mt-10 font-bold">
        <h1>Vehicle Feeds From Cameras vehicle: {vehicleCount} and timer: {timer}</h1>
        {console.log(status)}
      </div>
      <div className="flex justify-center flex-col items-center">
        <div className="w-1/2 h-1/2 text-black items-center flex flex-col p-10">
          <div className="flex space-x-5">
            <img
              id="video-feed"
              src={source}
              alt="Video Feed"
            />
            <div className="flex flex-col space-y-2 w-auto p-2 h-fit bg-black rounded-lg border-2">
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
            </div>
          </div>
        </div>
        <div className="flex text-black w-2/3 mt-10 space-x-5">
          <button className="bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">
            Camera 1
          </button>
          <button className="bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">
            Camera 2
          </button>
          <button className="bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">
            Camera 3
          </button>
          <button className="bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">
            Camera 4
          </button>
        </div>
      </div>
    </div>
  );
}

export default Videoanalysis;
