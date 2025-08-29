import React from "react";
import image from "/LoginAsImg.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";

function LoginAs() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen py-10">
    {/* Title */}
    <h1 className="text-5xl font-kanit mt-10 font-bold text-[#121A27] drop-shadow-md text-center">
        Student-Professor Portal
    </h1>

    {/* Main Container */}
    <div className="flex w-[80vw] md:w-[700px] h-[450px] shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-300 font-kanit">
        {/* Left Section */}
        <div className="w-full flex flex-col items-center p-4 gap-6 bg-gray-100 md:w-1/2">
            <p className="text-[40px]  font-bold text-[#121A27] mb-4 mt-12">
                Login As
            </p>
            <Link to="/administration/login">
                <Button className="bg-[#121A27] text-white text-lg py-3 px-6 rounded-lg  shadow-md hover:bg-[#1E1E2A] transition duration-300 w-[200px] h-[40px]">
                    Administrator
                </Button>
            </Link>
            <Link to="/professor/login">
                <Button className="bg-[#121A27] text-white text-lg py-3 px-6 rounded-lg  shadow-md hover:bg-[#1E1E2A] transition duration-300 w-[200px] h-[40px]">
                    Professor
                </Button>
            </Link>
            <Link to="/student/login">
                <Button className="bg-[#121A27] text-white text-lg py-3 px-6 rounded-lg  shadow-md hover:bg-[#1E1E2A] transition duration-300 w-[200px] h-[40px]">
                    Student
                </Button>
            </Link>

            <div className="flex items-center mt-8">
                <p className="text-sm ">
                    Administrator, you don’t have an account?{" "}
                    <Link
                        to="/administration/register"
                        className="text-blue-600 text-sm underline"
                    >
                        Signup
                    </Link>
                </p>
            </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block w-1/2">
            <img
                className="object-cover w-full h-full rounded-r-2xl"
                src={image}
                alt="Login Illustration"
            />
        </div>
    </div>
</div>

  );
}

export default LoginAs;
