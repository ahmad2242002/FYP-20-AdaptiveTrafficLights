'use client'
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Component, useState } from "react";
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
  return (
    <>
      {status === "authenticated" ? (
        <div>
            <h1>Dashboard</h1>
            <button onClick={signOut}>SignOut</button>
        </div>
      ) : (
        router.push("/")
      )}
    </>
  );
}