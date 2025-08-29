import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { FaRegUserCircle } from "react-icons/fa";
import { logoutUser } from "@/redux/appSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

function Navbar() {
  const { user } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(logoutUser());
      localStorage.removeItem("user");
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-gray-50 shadow-md w-full fixed top-0 z-10">
        <div className="flex items-center justify-between h-20 md:h-16 px-4 md:px-8  ">
          {/* Logo Section */}
          <div>
            <h1 className="text-3xl font-bold font-kanit">
              Student-Professor <span className="text-[#25274D]">Portal</span>
            </h1>
          </div>
          
          {/* User Actions */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="hover:opacity-80 transition duration-300">
                  <FaRegUserCircle size={32} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 bg-white shadow-lg rounded-lg p-4">
                <div className="flex flex-col">
                  {/* User Details */}
                  <div>
                    <h4 className="font-inter font-bold">{user?.fullname || "Admin"}</h4>
                    <p className="text-sm text-gray-500 mt-2">
                      {user?.email || user?.instituteMailId || "No email available"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col my-4">
                    {/* Logout */}
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut size={20} />
                      <Link to={"/"}>
                        <Button className="text-sm" variant="link">
                          Log Out
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Spacer to prevent overlap */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
