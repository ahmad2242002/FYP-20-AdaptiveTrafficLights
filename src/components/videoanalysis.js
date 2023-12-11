import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image'
import ReactPlayer from 'react-player';
function Videoanalysis() {
  const [vehicleCount, setVehicleCount] = useState(0)
  const [status, setStatus] = useState(0)
  const [timer, settimer] = useState(10)
  useEffect(() => {
    const videoElement = document.getElementById('video-feed');

    // Event listener to capture count from the video feed
    videoElement.addEventListener('loadedmetadata', (event) => {
      const countStr = event.detail.split('Count: ')[1];
      const count = parseInt(countStr, 10);
      setVehicleCount(count);
    });

    // Cleanup event listener when component unmounts
    return () => {
      videoElement.removeEventListener('loadedmetadata', () => {});
    };
  }, []); 

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Use the functional form to ensure the state update is based on the previous state
      settimer(prevTimer => {
        if (prevTimer <= 0) {
          setStatus(0)
        } else if (prevTimer <= 4) {
          setStatus(1)
        } else {
          setStatus(2)
        }
        if (prevTimer === 0) {
          return 10;
        }
        return prevTimer-1;
      });
    }
    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className=" w-full h-screen text-black">
      <div className=' text-black  text-center text-5xl mt-10 font-bold'>
          <h1>Vehicle Feeds From Cameras</h1>
          {console.log(status)}
        </div>
    <div className=" flex justify-center flex-col items-center">
      <div className='w-1/2 h-1/2 text-black items-center flex flex-col p-10'> 
        <div className='flex space-x-5'>
          <img id="video-feed" src="http://192.168.18.17:5000/video_feed" alt="Video Feed"/>
          <div className=' flex flex-col space-y-2  w-auto p-2 bg-black rounded-lg border-2'>
            <div className={`rounded-full w-7 h-7 ${status === 0 ? 'bg-red-500' : 'bg-red-900'}`}></div>
            <div className={`rounded-full w-7 h-7 ${status === 1 ? 'bg-yellow-400' : 'bg-yellow-900'}`}></div>
            <div className={`rounded-full w-7 h-7 ${status === 2 ? 'bg-green-400' : 'bg-green-900'}`}></div>
          </div>
        </div>
      </div>
      <div className=' flex text-black w-2/3 mt-10 space-x-5'>
        
        <button  className=" bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">Camera 1</button>
        <button  className=" bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">Camera 2</button>
        <button  className=" bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">Camera 3</button>
        <button  className=" bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl">Camera 4</button>
      </div>
    </div>
    </div>
  )
}

export default Videoanalysis