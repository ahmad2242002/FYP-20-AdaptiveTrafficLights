'use client'
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Component, useState } from "react";
import Sidebar from "../../components/sidebar";
import Videoanalysis from '@/components/videoanalysis'
export default function Dashboard(){
  const [showmenu, setShowMenu] = useState(null);
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
          <Sidebar role = {session?.user?.image} active='analysis'></Sidebar>
            <Videoanalysis role = {session?.user?.image}  ></Videoanalysis>
        </div>
      ) : (
        router.push("/")
      )}
    </>
  );
}