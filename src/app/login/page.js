"use client";
import React, { Component, useState } from "react";
import stlcsLogo from "@/images/stlcs.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OTPConfirm from "@/components/OTPConfirm";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Snackbar } from "@mui/material";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
export default function Login() {
  const [showButton, setShowButton] = useState("password");
  const [showPass, setShowPass] = useState("show");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [confirmOtp, setConfirmOtp] = useState(false);
  const [fourDigitCode, setFourDigitCode] = useState("");
  const [sendcode, setsendcode] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  
  const handleButtonClick = (buttonValue) => {
    if (showPass == "show") setShowPass("hide");
    else setShowPass("show");
    setShowButton(buttonValue);
  };
  const router = useRouter();
  const { status } = useSession();

  const [fogetPassword, setForgetPassword] = useState(false);

  const handleSubmit = async (event) => {
    const buttonName = event.nativeEvent.submitter.name;
    if (buttonName === "request") 
    {
      event.preventDefault();
      await generateAndSendOTP();
    } 
    else 
    {
      setIsLoading(true)
      event.preventDefault();
      const credentials = {
        email: email,
        password: password,
      };
      try {
        //Call the signIn function with the credentials object
        const response = await signIn("credentials", { ...credentials });
        console.log(response)
        if (response == null) {
          const errorData = await response.json();
          alert(errorData.error);
          const errorCode = response.status;
          console.log("Error Code:", errorCode);
          setError(true);
        }
        else
        {
          alert(response)
        }
        setIsLoading(false);
        // Handle the response, redirect if needed, etc.
      } catch (error) {
        setError(true);
        console.log("Login error:", error);
        // Handle login error if necessary
      }
    }
  };


  const generateAndSendOTP = async () => {
    let newCode = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
    setFourDigitCode(newCode.toString());
    setShowOtp(true);
  
    // Assuming sendotp is an asynchronous function (e.g., it makes an API call)
    sendotp(newCode.toString());
  
    // The rest of your code to handle the result of sendotp
  };
  
  async function sendotp(code) {
    try {
      setsendcode(code)
      const response = await fetch("http://localhost:3000/api/forgetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, code: code}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Welcome email sent successfully
      } else {
        console.error(data.error); // Error message if the request fails
      }

    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  }


  async function changePassword(event) {
    event.preventDefault();
    if(message === "Strong")
    {
      try {
        const response = await fetch("http://localhost:3000/api/changePassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });
      
        const data = await response.json();
      
        if (response.ok) {
          setOpen(true);
      
          // Wait for 2 seconds before redirecting to '/'
          setTimeout(() => {
            window.location.reload(true)
          }, 2000);
      
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error changing password:", error);
      }
      
    }
    else{
      alert('Password is Week');
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
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {status !== "authenticated" ? (
        <div className="bg-[#E3FDFD] w-full h-screen relative flex justify-center items-center overflow-hidden ">
          {isLoading ? (
            <div className=" flex items-center space-x-3 bg-teal-300 p-4 rounded-xl ">
              <div className="processing-spinner"></div>
              <p className=" text-xl font-bold">SIGNING IN</p>
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
            <div className="scrollbar-hide w-96 lg:w-1/3 h-auto grid grid-cols-1 rounded-3xl shadow-sm drop-shadow-md shadow-cyan border-cyan-500 overflow-y-auto bg-[#CBF1F5] ">
              <div className=" rounded-t-3xl relative bg-[#A6E3E9] flex justify-center items-center">
                <Image
                  className=""
                  height={200}
                  width={200}
                  src={stlcsLogo}
                  alt="image"
                  quality={100}
                ></Image>
              </div>
              <form
                className=" flex flex-col pb-5 px-2  sm:px-5 md:px-10 lg:px-16 items-center  space-y-2  justify-center  "
                onSubmit={handleSubmit}
              >
                <h1 className=" text-4xl mt-5 mb-6 font-bold text-gray-700">
                  {fogetPassword ? "Forget Password ?" : "Sign In"}
                </h1>
                <div className=" text-black flex bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className=" text-slate-600"
                  ></FontAwesomeIcon>
                  <input
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder="Enter your email"
                    type="email"
                    name="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  ></input>
                </div>
                {fogetPassword ===false ?<div className="text-black flex bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    onClick={() => {
                      showPass === "show"
                        ? handleButtonClick("text")
                        : handleButtonClick("password");
                    }}
                    icon={showPass === "show" ? faEyeSlash : faEye}
                    className=" text-slate-600 hover:cursor-pointer"
                  ></FontAwesomeIcon>
                  <input
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder={
                      fogetPassword
                        ? "Enter your new password"
                        : "Enter your password"
                    }
                    name="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type={showButton === "password" ? "password" : "text"}
                  ></input>
                </div>
                :
                ''}

                {fogetPassword&&confirmOtp?<><div className="text-black flex bg-white my-1 border-2 hover:scale-105  items-baseline px-6 py-1 w-full rounded-xl">
                  <FontAwesomeIcon
                    onClick={() => {
                      showPass === "show"
                        ? handleButtonClick("text")
                        : handleButtonClick("password");
                    }}
                    icon={showPass === "show" ? faEyeSlash : faEye}
                    className=" text-slate-600 hover:cursor-pointer"
                  ></FontAwesomeIcon>
                  <input
                    className=" w-full h-10 ps-5 outline-none"
                    placeholder={
                      fogetPassword
                        ? "Enter your new password"
                        : "Enter your password"
                    }
                    name="password"
                    required
                    value={password}
                    onChange={(e) => {
                      handlePassword(e.target.value);
                    }}
                    type={showButton === "password" ? "password" : "text"}
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
                </div></>
                :''}
                {fogetPassword === false ? (
                  <div className=" grid grid-cols-2 text-black w-full pt-5 px-1 ">
                    <div className=" space-x-4  flex items-center justify-start">
                      <input type="checkbox" className=" h-4 w-4" />
                      <span>Remember me</span>
                    </div>
                    <p
                      className=" flex justify-end hover:underline cursor-pointer "
                      onClick={() => {
                        setForgetPassword(true);
                      }}
                    >
                      Forget Password?
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={` mt-10 ${
                    fogetPassword && confirmOtp === false
                      ? "grid grid-cols-2 w-full items-center space-x-2"
                      : "flex w-full"
                  } `}
                >
                  {
                   confirmOtp? 
                   <button
                    className=" bg-[#71C9CE] my-3 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl"
                    name={"changePassword"}
                    onClick={changePassword}
                    >
                    {"Change Password"}
                  </button>
                  :
                  <button
                    className=" bg-[#71C9CE] my-3 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl"
                    name={fogetPassword ? "request" : "signin"}
                    >
                    {fogetPassword ? "Request" : "Sign In"}
                  </button>
                  }
                  {fogetPassword && confirmOtp === false? (
                    <button
                      className=" bg-[#71C9CE] my-1 w-full font-semibold h-12 border-2 active:scale-90 transition duration-200 drop-shadow-sm hover:scale-105 text-black border-[#A6E3E9] rounded-xl"
                      type="submit"
                      onClick={() => {
                        setForgetPassword(false);
                      }}
                    >
                      Cancel
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                <div className=" space-y-2 flex flex-col items-center">
                  <p className=" font-semibold text-gray-800 text-sm">
                    Don&apos;t Have Account?{" "}
                    <Link
                      href="./signup"
                      className=" hover:cursor-pointer   ms-2 text-gray-900 font-bold"
                    >
                      SignUp
                    </Link>
                  </p>
                </div>
              </form>
              {showOtp ? (
                <OTPConfirm
                  setConfirmOtp = {setConfirmOtp}
                  fourDigitCode = {sendcode}
                  showOtp={showOtp}
                  setShowOtp={setShowOtp}
                ></OTPConfirm>
              ) : (
                ""
              )}
            </div>
          )}
          <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', }}>
              Password Change Successfully
            </Alert>
          </Snackbar>
        </div>
      ) : (
        router.push("/dashboard")
      )}
    </>
  );
}
