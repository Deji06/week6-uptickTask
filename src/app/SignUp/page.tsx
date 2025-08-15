"use client";

import type React from "react";
import Image from "next/image";
import { useAuthContextHook } from "../contexts/AuthContext";
import { useState } from "react";
import backGroundImage from "../../../public/pexels-didsss-2969925.jpg";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
// import '@/app'
// import ''

const SignUp = () => {
  const router = useRouter();
  const { loading, setLoading, signUpError, setSignUpError, SignUp } =
    useAuthContextHook();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [userError, setUserError] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [eyeMonitor, setEyeMonitor] = useState(false);

  const validateForm = () => {
    let isvalid = true;
    const errors = { username: "", password: "", email: "" };

    if (formData.username.trim() === "") {
      errors.username = "username is required";
      isvalid = false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "provide valid email address";
      isvalid = false;
    }

    if (formData.password.length < 6) {
      errors.password = "password must be longer than 6 characters";
      isvalid = false;
    }

    setUserError(errors);
    if (!isvalid) {
      setSignUpError(errors.username || errors.email || errors.password);
    }
    return isvalid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!validateForm()) return;
    setLoading(false);

    try {
      setLoading(true);
      const success = await SignUp(
        formData.username,
        formData.email,
        formData.password
      );
      if (success) {
          router.push("/LogIn");
          setFormData({ email: "", password: "", username: "" });
        setSignUpError("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPassword = () => {
    setEyeMonitor(!eyeMonitor);
  };

  return (
    <>
      <div className="bg-[#E5EAED] min-h-screen  flex items-center justify-center sm:py-5 py-20 px-3 md:px-10 ">
        <div className="bg-white rounded-[10px]  md:w-[80%] m-auto shadow-lg  h-fit max-w-[1200px]">
          <div
            className="border-b flex justify-between p-3 animate-slide-in "
            style={{ animationDelay: "0.1s" }}
          >
            <p className="sm:ml-5 sm:text-[20px] font-bold capitalize ">
              {" "}
              Todo app
            </p>
            <div className="flex mr-5 items-center ">
              <p className="text-red-900 text-[12px] md:text-[16px] ">
                already have an account ?
              </p>
              <Link href="/LogIn" className="capitalize font-bold text-[14px]">
                log in
              </Link>
            </div>
          </div>

          <div className="flex h-fit">
            <Image
              src={backGroundImage}
              alt="background image for signup page"
              // width={500}
              // height={10}
              className="border animate-fade-in w-[80%] sm:w-[50%]"
              style={{ objectFit: "cover" }}
            />

            <div className="sm:w-[50%] px-5 m-5  md:pt-5 ">
              <form
                action=""
                className="flex flex-col space-y-5  pb-4 md:pt-5 pt-20"
                onSubmit={handleFormSubmit}
              >
                <div
                  className="animate-slide-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <p className="capitalize font-black  text-[20px]">
                    welcome to my note app!
                  </p>
                  <p className="text-[13px]">
                    {" "}
                    sign up to start using todo app
                  </p>
                </div>
                <div
                  className="flex flex-col gap-y-1 animate-slide-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <label
                    htmlFor=""
                    className="text-[12px] capitalize font-bold"
                  >
                    name
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username:e.target.value})}
                    placeholder="dejee"
                    className="border -2  p-2 rounded-[10px] placeholder:text-black placeholder:text-[13px] text-sm"
                  />
                  {userError.username && (
                    <p className="text-red-900">{userError.username}</p>
                  )}
                </div>
                <div
                  className="flex flex-col gap-y-1 animate-slide-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <label
                    htmlFor=""
                    className="text-[12px] capitalize font-bold"
                  >
                    email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="dejee@gmail.com"
                    className="border -2  p-2 rounded-[10px]  placeholder:text-black placeholder:text-[13px] text-sm"
                  />
                  {userError.email && (
                    <p className="text-red-900">{userError.email}</p>
                  )}
                </div>
                <div
                  className="flex flex-col gap-y-1 animate-slide-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <label
                    htmlFor=""
                    className="text-[12px] capitalize font-bold"
                  >
                    password
                  </label>
                  <div className="border -2  p-2 rounded-[10px] flex items-center justify-between">
                    <input
                      type={eyeMonitor ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter Password"
                      className=" placeholder:text-black placeholder:text-[13px] outline-none w-full text-sm "
                    />
                    <div>
                      {eyeMonitor ? (
                        <IoMdEyeOff
                          onClick={handleViewPassword}
                          className="cursor-pointer"
                        />
                      ) : (
                        <FaEye
                          onClick={handleViewPassword}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                  {userError.password && (
                    <p className="text-red-900">{userError.password}</p>
                  )}
                </div>

                {signUpError &&
                  !userError.username &&
                  !userError.email &&
                  !userError.password && (
                    <p className="text-red-900">{signUpError}</p>
                  )}

                <div className="flex items-center justify-evenly">
                  <button
                    type="submit"
                    className="border w-[80%] px-5 sm:rounded-[30px] rounded-[10px] cursor-pointer py-2 bg-black text-white animate-slide-in"
                    style={{ animationDelay: "0.5s" }}
                    disabled={false}
                  >
                    {loading ? (
                      <ClipLoader size={18} color={"#ffffff"} />
                    ) : (
                      "sign up"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="absolute inset-0 bg-black opacity-10"></div> */}
      </div>
    </>
  );
};

export default SignUp;
