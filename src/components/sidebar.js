import React, { Component } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faDatabase, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import gridicon from "@/images/gridicon.png";

import { signIn, signOut, useSession } from "next-auth/react";
import layout from "@/images/layout.png";
import layout1 from "@/images/layout2.png";
import Link from "next/link";
function Sidebar({active}) {
  {
    return (
      <div className=" h-screen hidden md:grid grid-col-1 w-60 shadow-lg text-black shadow-black bg-[#CBF1F5] ">
        <div className=" flex flex-col">
          <div className="max-lg:ps-4 lg:ps-10 pt-10 space-x-2 flex  items-center  text-xl font-bold">
            <FontAwesomeIcon
              icon={faCube}
              className=" text-slate-900"
            ></FontAwesomeIcon>
            <div >STLCS</div>
          </div>
          <div className=" items-center  pt-14 ">
            <div className={`max-lg:ps-4 ${active ==='analysis' ? 'bg-[#A6E3E9]' : ''} lg:ps-10 py-3 space-x-2 flex  items-center hover:bg-[#A6E3E9] focus:bg-[#A6E3E9] hover:cursor-pointer text-lg`}>
              <Image
                height={25}
                width={25}
                src={gridicon}
                alt="grid icon "
              ></Image>
              <div>Analysis</div>
            </div>
            <div className="max-lg:ps-4 lg:ps-10 py-3 space-x-2 flex  items-center  text-lg hover:bg-[#A6E3E9] focus:bg-[#A6E3E9] hover:cursor-pointer">
              <Image
                height={20}
                width={20}
                src={layout}
                alt="grid icon "
              ></Image>
              <div>Reports</div>
            </div>
            <div className="max-lg:ps-4 lg:ps-10 py-3 space-x-2 flex  items-center  text-lg hover:bg-[#A6E3E9] focus:bg-[#A6E3E9] hover:cursor-pointer ">
              <FontAwesomeIcon
                icon={faDatabase}
                className=" text-slate-500 text-xl"
              ></FontAwesomeIcon>
              <div>Manual Control</div>
            </div>
            <div className="max-lg:ps-4 lg:ps-10 py-3 space-x-2 flex  items-center  text-lg hover:bg-[#A6E3E9] focus:bg-[#A6E3E9] hover:cursor-pointer">
              <FontAwesomeIcon
                icon={faGear}
                className=" text-slate-500 text-xl"
              ></FontAwesomeIcon>
              <div>Setting</div>
            </div>
          </div>
        </div>
        <div className=" bottom-0 left-0 absolute max-lg:ps-4 lg:ps-10 pb-16">
        <div className="space-x-2 flex  items-center  text-lg hover:cursor-pointer" onClick={signOut}>
              <FontAwesomeIcon
                icon={faSignOut}
                className=" text-slate-500 text-xl"
              ></FontAwesomeIcon>
              <div>Log out</div>
            </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
