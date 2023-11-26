import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image'
import ReactPlayer from 'react-player';
function Videoanalysis() {
  const [vehicleCount, setVehicleCount] = useState(0)
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

  return (
    <div className=" w-full h-screen text-black">
      <div className=' text-black  text-center text-5xl mt-10 font-bold'>
          <h1>Vehicle Feeds From Cameras</h1>
        </div>
    <div className=" flex justify-center flex-col items-center">
      <div className='text-black flex flex-col p-10'> 
        <div>
          <img id="video-feed" src="http://192.168.18.17:5000/video_feed" alt="Video Feed"/>
        </div>
      </div>
      <h1 className=' text-2xl font-semibold '>Vehicle Count: {vehicleCount}</h1> 
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