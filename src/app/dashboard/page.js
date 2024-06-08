'use client'
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Component, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import Videoanalysis from '@/components/videoanalysis';
import Manual from "../manual/page";
import Settings from '../Settings_admin/page'
import Report from '../reports/page'
import io from "socket.io-client";
export default function Dashboard(){
  
  const [showmenu, setShowMenu] = useState(null);
  const [active, setActive] = useState('analysis');
  const handleMenuBarClick = () => {
    setShowMenu(null);
  };
  const { status, data: session } = useSession();
  const [vehicleCount, setVehicleCount] = useState(0);
  const [stat, setStatus] = useState(null);
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

  const router = useRouter();
  if (typeof window === "undefined") {
    return null; // Return null on the server-side to prevent rendering
  }
  console.log(session)
  console.log(session?.user);
  
  return (
    <>
    {status === "authenticated" ? (
      <div
          className="flex bg-[#E3FDFD] h-screen"
          onClick={() => {
            handleMenuBarClick();
          }}
        >
          <Sidebar role = {session?.user?.image} active={active} setActive = {setActive}></Sidebar>
          {
            active === 'analysis'?
            <Videoanalysis role = {session?.user?.image} setVehicleCount ={setVehicleCount} vehicleCount = {vehicleCount}status = {stat} timer = {timer} signals= {signals} source = {source}></Videoanalysis>
            : 
            active === 'manual' ?
            <Manual></Manual>
            :
            active === 'setting' ?
            <Settings></Settings>
            :
            active === 'reports' ?
            <Report vehicleCount = {vehicleCount}></Report>
            :
            <></>
          }
        </div>
      ) : (
        router.push("/")
      )}
    </>
  );
}