'use client'
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Component, useState } from "react";
import Sidebar from "../../components/sidebar";
import Videoanalysis from '@/components/videoanalysis';
import Manual from "../manual/page";
export default function Dashboard(){
  const [showmenu, setShowMenu] = useState(null);
  const [active, setActive] = useState('analysis');
  const handleMenuBarClick = () => {
    setShowMenu(null);
  };
  const { status, data: session } = useSession();
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
            <Videoanalysis role = {session?.user?.image}  ></Videoanalysis>
            : 
            active === 'manual' ?
            <Manual></Manual>
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