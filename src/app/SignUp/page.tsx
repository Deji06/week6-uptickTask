"use client";
import type React from "react";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import backGroundImage from "../../../public/pexels-didsss-2969925.jpg";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import {  signUp } from "../action";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const initialState = {
  message: '',
  errors: {},
  success: false
}
  const router = useRouter()
  const [state, formAction] = useFormState(signUp, initialState);
  const [eyeMonitor, setEyeMonitor] = useState(false);
  
 useEffect(() => {
    if (state.success) {
      router.push("/LogIn");
    }
  }, [state.success, router]);
  const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="border w-[80%] px-5 sm:rounded-[30px] rounded-[10px] cursor-pointer py-2 bg-black text-white animate-slide-in"
      style={{ animationDelay: "0.5s" }}
      disabled={pending}
    >
      {pending ? <ClipLoader size={18} color={"#ffffff"} /> : "sign up"}
    </button>
  );
};


  const handleViewPassword = () => {
    setEyeMonitor(!eyeMonitor);
  };

  return (
    <>
    <div className="bg-[#E5EAED] min-h-screen flex items-center justify-center sm:py-5 py-20 px-3 md:px-10">
      <div className="bg-white rounded-[10px] md:w-[80%] m-auto shadow-lg h-fit">
        <div
          className="border-b flex justify-between p-3 items-center animate-slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="sm:ml-5 sm:text-[20px] font-bold capitalize">Todo app</p>
          <div className="flex mr-5 items-center gap-x-2">
            <p className="text-red-900 text-[12px] md:text-[16px]">
              already have an account?
            </p>
            <Link href="/LogIn" className="capitalize font-bold text-[14px] underline">
              login
            </Link>
          </div>
        </div>

        <div className="flex h-fit">
          <div className="relative sm:w-[50%] w-[80%] animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Image
              src={backGroundImage}
              alt="background image for signup page"
              fill={true}
              className="border animate-fade-in w-[80%] sm:w-[50%] object-cover"
            />
          </div>

          <div className="sm:w-[50%] px-5 m-5 md:pt-5">
            <form action={formAction} className="flex flex-col space-y-5 pb-4 md:pt-5 pt-20">
              <div className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
                <p className="capitalize font-black text-[20px]">welcome to my note app!</p>
                <p className="text-[13px]">sign up to start using todo app</p>
              </div>
              <div className="flex flex-col gap-y-1 animate-slide-in" style={{ animationDelay: "0.2s" }}>
                <label htmlFor="username" className="text-[12px] capitalize font-bold">
                  name
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="dejee"
                  className="border p-2 rounded-[10px] placeholder:text-black placeholder:text-[13px] text-sm"
                />
              </div>
              {state.errors?.username && <p className="text-red-900">{state.errors.username}</p>}

              <div className="flex flex-col gap-y-1 animate-slide-in" style={{ animationDelay: "0.3s" }}>
                <label htmlFor="email" className="text-[12px] capitalize font-bold">
                  email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="dejee@gmail.com"
                  className="border p-2 rounded-[10px] placeholder:text-black placeholder:text-[13px] text-sm"
                />
                {state.errors?.email && <p>{state.errors.email}</p>}
              </div>
              <div className="flex flex-col gap-y-1 animate-slide-in" style={{ animationDelay: "0.4s" }}>
                <label htmlFor="password" className="text-[12px] capitalize font-bold">
                  password
                </label>
                <div className="border p-2 rounded-[10px] flex items-center justify-between">
                  <input
                    type={eyeMonitor ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    className="placeholder:text-black placeholder:text-[13px] outline-none w-full text-sm"
                  />
                  <div>
                    {eyeMonitor ? (
                      <IoMdEyeOff onClick={handleViewPassword} className="cursor-pointer" />
                    ) : (
                      <FaEye onClick={handleViewPassword} className="cursor-pointer" />
                    )}
                  </div>
                </div>
              {state.errors?.password && <p className="text-red-900">{state.errors.password}</p>}

              </div>

              {state.errors?.backendError && <p className="text-red-900">{state.errors.backendError}</p>}

              <div className="flex items-center justify-evenly">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      </>
  );
};

export default SignUp;



















