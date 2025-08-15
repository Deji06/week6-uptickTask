"use client"
import React, { useState } from "react";
import { useAuthContextHook } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import Image from 'next/image'
import backGroundImage from "../../../public/pexels-didsss-2969925.jpg";
import ClipLoader from "react-spinners/ClipLoader";
// import "../App.css";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";


const Login = () => {
  const router = useRouter()
  // const { fetchAllTasks } = UseTaskContext();
  const { logInError, Login, setLogInError, loading, setLoading } = useAuthContextHook();
  const [formData, setFormData] = useState({ password: "", email: "" });
  const [userError, setUserError] = useState({ email: "", password: "" });
  const[eyeMonitor, setEyeMonitor] = useState(false)

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "provide valid email";
    }

    if (formData.password.length < 6) {
      errors.password = "password should be more than  6 characters";
    }
    setUserError(errors);
    if (!isValid) {
      setLogInError(errors.email || errors.password);
    }

    return isValid;
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    if (!validateForm()) return;
    e.preventDefault();
    setLogInError(null);
    setLoading(false);
    try {
    const success =  await Login(formData.email, formData.password);
    if(success) {
      router.push("/TaskDashBoard");
      // fetchAllTasks();
    }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPassword = () => {
    setEyeMonitor(!eyeMonitor)
  }
  return (
    <>
      <div className="bg-[#E5EAED] min-h-screen flex items-center justify-center  sm:py-5 py-20 px-3 md:px-10 ">
        <div className="bg-white rounded-[10px]  md:w-[80%] m-auto shadow-lg h-fit ">
          <div
            className="border-b flex items-center justify-between p-3 animate-slide-in"
            style={{ animationDelay: "0.1s" }}
          >
            <p className="sm:ml-5 md:text-[20px] font-bold capitalize "> Todo app</p>
            <div className="flex mr-5 items-center gap-x-2">
              <p className="text-red-900 md:text-[16px]  text-[12px]">Don't have an account?</p>
              <Link href="/SignUp"  className="font-bold text-[14px] underline">
                signUp
              </Link>
            </div>
          </div>
          <div className="flex  h-fit ">
            <div className="relative sm:w-[50%] w-[80%]  animate-fade-in" style={{animationDelay: "0.2s"}}>
              <Image
                src={backGroundImage}
                fill= {true}
                alt="background image for login page"
                className=" border w-[80%] sm:w-[50%] bg-cover animate-fade-in object-cover"
              />
            </div>

            <div className="w-[60%] px-5 m-7 pt-7">
              <form
                action=""
                className="flex flex-col space-y-4 mt-5"
                onSubmit={handleFormSubmit}
              >
                 <div className="animate-slide-in" style={{animationDelay:'0.1s'}}>
                  <p className="capitalize font-black  text-[20px]">welcome to my note app!</p>
                  <p className="text-[13px]"> log in to start using todo app</p>
                </div>
                <div className="flex flex-col gap-y-1 animate-slide-in" style={{animationDelay:'0.2s'}}>
                  <label htmlFor="" className="text-[12px] capitalize font-bold">email</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="dejee@gmail.com"
                    className="border -2  p-2 rounded-[10px] placeholder:text-black placeholder:text-[13px] text-sm"
                    
                  />
                  {userError.email && <p className="text-red-900">{userError.email}</p>}
                </div>

                <div className="flex flex-col gap-y-1 animate-slide-in" style={{animationDelay:'0.2s'}}>
                  <label htmlFor="" className="text-[12px] capitalize font-bold">password</label>
                  <div className="border -2  p-2 rounded-[10px] flex items-center justify-between">
                    <input
                      type={eyeMonitor ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter Password"
                      className=" placeholder:text-black placeholder:text-[13px] outline-none border-none w-full text-sm "
                      
                    />
                    <div>
                      {eyeMonitor ? <IoMdEyeOff  onClick={handleViewPassword} className="cursor-pointer" /> : <FaEye onClick={handleViewPassword} className="cursor-pointer" />   }
                    </div>

                  </div>
                  {userError.password && <p className="text-red-900">{userError.password}</p>}


                </div>
                {logInError && !userError.email && !userError.password && (
                  <p className="text-red-900">{logInError}</p>
                )}
                 <div className="flex items-center justify-evenly">
                  <button
                    type="submit"
                    className="border w-[80%] px-5 md:rounded-[30px] rounded-[10px] cursor-pointer py-2 bg-black text-white animate-slide-in mt-5"
                    style={{animationDelay:'0.5s'}}
                    disabled={false}
                  >
                    {loading ? <ClipLoader size={18} color={"#ffffff"} />  : "log in"}
                  </button>
                </div>
              
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
