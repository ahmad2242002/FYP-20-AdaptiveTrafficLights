"use client";
import React, { Component, useState, useEffect } from "react";
import stlcsLogo from "@/images/stlcs.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faUser,
  faEnvelope,
  faEye,
  faPhone,
  faEyeSlash,
  faImagePortrait,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
export default function Signup() {
  const [showButton, setShowButton] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState("show");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleButtonClick = (buttonValue) => {
    
    if (showPass == "show") setShowPass("hide");
    else setShowPass("show");
    setShowButton(buttonValue);
  };
  const router = useRouter();
  const changePage = () => {
    router.push("/dashboard");
  };

  const [formData, setFormData] = useState({});
  async function handleSubmit(event) {
    event.preventDefault()
    if (message === "Strong") {
      try {
        setIsLoading(true)
        console.log(formData)
        const response = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify(formData),
        });

        if (!response.ok) {
          event.preventDefault()
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        try {
          alert("check")
          const response = await fetch('http://localhost:3000/api/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log(data.message); // Welcome email sent successfully
          } else {
            console.error(data.error); // Error message if the request fails
          }
        } catch (error) {
          console.error('Error sending welcome email:', error);
        }
        // Reset form fields on successful registration
        setFormData({});
        setPassword('')
        setIsLoading(false)
        // Handle successful registration (redirect, show success message, etc.)
        router.push("/")
        console.log("User registered successfully");
      } catch (error) {
        // Handle registration error
        event.preventDefault()
        
        setError(true)
      } finally {
        event.preventDefault()
        // Reset loading state
        setIsLoading(false);
      }
    } else {
      alert("Password is Week");
      
      event.preventDefault();
    }
  }

  const handlePassword = (passwordValue) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length == 5
        ? "Strong"
        : verifiedList.length >= 2
        ? "Medium"
        : "Weak";

    setPassword(passwordValue);
    setMessage(strength);

    console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  };

  const getActiveColor = (type) => {
    if (type === "Strong") return "#8BC926";
    if (type === "Medium") return "#FEBD01";
    return "#FF0054";
  };
  const { status } = useSession();
  return (
    <>
      {status !== "authenticated" ? (
        <div className="bg-[#E3FDFD] w-full h-screen relative flex justify-center items-center overflow-hidden ">
          {isLoading ? (
            <div className=" flex items-center space-x-3 bg-teal-300 p-4 rounded-xl ">
              <div className="processing-spinner"></div>
              <p className=" text-xl font-bold">SIGNING UP</p>
            </div>
          ) : error ? (
            <div
              className=" flex items-center space-x-3 bg-red-400 p-4 rounded-xl text-white hover:cursor-pointer "
              onClick={() => {
                setError(false);
              }}
            >
              <p className=" text-xl font-bold">Failed to Sign Up Try Again</p>
            </div>
          ) : (
            <div className="w-96 lg:w-2/3 h-4/5 xl:h-auto m-2 grid grid-cols-1 lg:grid-cols-2 rounded-3xl shadow-sm drop-shadow-lg shadow-black border-slate-300 overflow-y-auto bg-[#CBF1F5] scrollbar-hide">
              <div className=" rounded-s-3xl relative bg-[#A6E3E9] flex justify-center items-center">
                <Image
                  className=""
                  height={500}
                  width={500}
                  src={stlcsLogo}
                  alt="image"
                  quality={100}
                ></Image>
              </div>
              <form
                onSubmit={handleSubmit}
                className=" flex flex-col pb-5 px-10  lg:px-20 items-center justify-center space-y-2 text-black"
              >
                <h1 className=" text-4xl mt-10 mb-6 font-bold text-gray-700">
                  Sign UP
                </h1>
                <div className=" flex bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    icon={faUser}
                    className=" text-slate-600"
                  ></FontAwesomeIcon>
                  <input
                    required
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder="Enter your name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  ></input>
                </div>
                <div className=" flex bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className=" text-slate-600"
                  ></FontAwesomeIcon>
                  <input
                    required
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder="Enter your email"
                    type="email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  ></input>
                </div>
                <div className="flex bg-white my-1 border-2 hover:scale-105 justify-center items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    icon={faImagePortrait}
                    className=" text-slate-600 text-xl flex self-center"
                  ></FontAwesomeIcon>
                  <input
                    required
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder="Enter your CNIC"
                    onChange={(e) =>
                      setFormData({ ...formData, cnic: e.target.value })
                    }
                  ></input>
                </div>
                <div className=" flex text-black bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    onClick={() => {
                      showPass === "show"
                        ? handleButtonClick("text")
                        : handleButtonClick("password");
                    }}
                    icon={showPass === "show" ? faEyeSlash : faEye}
                    className=" text-slate-600"
                  ></FontAwesomeIcon>
                  <input
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder="Enter your password"
                    type={showButton === "password" ? "password" : "text"}
                    required
                    value={password}
                    onChange={(e) => {
                      handlePassword(e.target.value);
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  ></input>
                </div>
                <div className=" w-full">
                  {password.length !== 0 ? (
                    <p
                      className="message"
                      style={{ color: getActiveColor(message) }}
                    >
                      Your password is {message}
                    </p>
                  ) : null}
                </div>
                <button
                  className=" bg-[#71C9CE] my-3 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105  border-[#A6E3E9] rounded-xl"
                  type="submit"
                >
                  Sign Up
                </button>
                <div className=" space-y-2 flex flex-col items-center">
                  <p className=" font-semibold text-gray-800 text-sm">
                    Already Have Account?{" "}
                    <Link
                      href="./"
                      className=" hover:cursor-pointer   ms-2 text-gray-900 font-bold"
                    >
                      SignIn
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        router.push("/dashboard")
      )}
    </>
  );
}
