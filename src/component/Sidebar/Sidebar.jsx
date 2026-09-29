import { Link, useLocation } from "react-router-dom";
import { FaHome, FaRegBookmark, FaRegUser } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlinePayment, MdOutlinePolicy, MdOutlinePrivacyTip } from "react-icons/md";
import { RiFeedbackLine } from "react-icons/ri";
import { CgMail } from "react-icons/cg";
import { useState } from "react"; // Import useState

import SidebarItem from "../Setting/SidebarItem";

import LogoutSection from "../Setting/LogoutSection";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";
import { SlArrowDown } from "react-icons/sl";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GiProgression } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { SiAdblock } from "react-icons/si";
import { FiUsers } from "react-icons/fi";
import { PiUsersThreeLight } from "react-icons/pi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/feature/auth/authSlice";
import { GoBook } from "react-icons/go";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Track the dropdown state
const user = useAppSelector(selectCurrentUser)
console.log("current user----------->",user);
console.log("setting dropdown--->",isSettingsOpen);
  // Helper function to check if the current path is active
  const isActive = (path) => currentPath === path;

  // Handle toggling of the settings dropdown
  const toggleSettingsDropdown = () => {
 console.log('hitted')
    setIsSettingsOpen(!isSettingsOpen);
  };
const isSettingsActive = currentPath.startsWith("/setting");
  return (
    <div
      className={`px-3 bg-[#ffffff]  h-[1000px] font-title ${
        isOpen ? "translate-x-0 top-0 left-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-[#0D0D0D] focus:outline-none p-2 rounded-full"
      >
        <IoCloseSharp />
      </button>

      {/* Sidebar Menu */}
      <ul className="pl-5 text-[10px]">
        {/* Dashboard */}
        <SidebarItem
          to="/"
          icon={<FaHome className="w-5 h-5" />}
          label="Dashboard"
          isActive={isActive("/")}
        />

        {/* User Management */}
        <SidebarItem
          to="/userManagement"
          icon={<FaRegUser className="w-5 h-5" />}
          label="User Management"
          isActive={isActive("/userManagement")}
        />

        {/* All Owner Details */}
        <SidebarItem
          to="/allOwner"
          icon={<MdOutlinePayment className="w-5 h-5" />}
          label="All Owner Details"
          isActive={isActive("/allOwner")}
        />

        {/* All Provider Details */}
        <SidebarItem
          to="/allProviders"
          icon={<CgMail className="w-5 h-5" />}
          label="All Provider Details"
          isActive={isActive("/allProviders")}
        />

        {/* Request Overview */}
        <SidebarItem
          to="/requestOverview"
          icon={<GiProgression className="w-5 h-5" />}
          label="Request Overview"
          isActive={isActive("/requestOverview")}
        />

        {/* Transaction History */}
        <SidebarItem
          to="/transactionHistory"
          icon={<GrTransaction  className="w-5 h-5" />}
          label="Transaction History"
          isActive={isActive("/transactionHistory")}
        />

        {/* All Category */}
        <SidebarItem
          to="/allCategory"
          icon={<HiOutlineSquares2X2  className="w-5 h-5" />}
          label="All Category"
          isActive={isActive("/allCategory")}
        />

        {/* Payment Tracking */}
        <SidebarItem
          to="/paymentTracking"
          icon={<MdOutlinePayment className="w-5 h-5" />}
          label="Payment Tracking"
          isActive={isActive("/paymentTracking")}
        />

        {/* Account Suspension */}
        <SidebarItem
          to="/accountSuspension"
          icon={<SiAdblock  className="w-5 h-5" />}
          label="Account Suspension"
          isActive={isActive("/accountSuspension")}
        />

        {/* Referral Program */}
        {/* <SidebarItem
          to="/referralProgram"
          icon={<FiUsers  className="w-5 h-5" />}
          label="Referral Program"
          isActive={isActive("/referralProgram")}
        /> */}

        {/* Profile Status */}
        <SidebarItem
          to="/profileStatus"
          icon={<PiUsersThreeLight className="w-5 h-5" />}
          label="Profile Status"
          isActive={isActive("/profileStatus")}
        />
        {/* Knowledge Hub */}
        <SidebarItem
          to="/knowledge"
          icon={<GoBook  className="w-5 h-5" />}
          label="Knowledge Hub"
          isActive={isActive("/knowledge")}
        />

           {/* Settings */}
        <div className="relative mt-3">
          {" "}
          {/* relative container for absolute child */}
          <Link to={'/setting/updateProfile'}>
            <button
              onClick={toggleSettingsDropdown}
              className={`flex w-full justify-between items-center gap-2 mt-1 cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out ${
                isSettingsActive
                  ? "bg-[#1B2D51] text-[#ffffff] px-3 pb-2 rounded-2xl"
                  : "text-[#0F0B18]"
              } relative`} // position relative here too for any absolute children
            >
              {/* Absolutely positioned colored bar */}
              {isSettingsActive && (
                <div
                  className="bg-[#1B2D51] w-[3%] -left-6 top-0 absolute h-14 text-white"
                  style={{ transform: "translateX(-100%)" }}
                ></div>
              )}

              <li
                className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out w-[98%]`}
              >
                <IoMdSettings className={`w-5 h-5 ${isSettingsActive?'text-white':'text-[#0F0B18]'} `} />
                <p className={`text-lg ${isSettingsActive?'text-white':'text-[#0F0B18]'}`}>Settings</p>

                <SlArrowDown 
                  className={`w-5 h-5 text-right ml-5 hover:-rotate-180 text-white 
                    
                    ${
                    isSettingsActive
                      ? " hover:rotate-180"
                      : ""
                  }`}
                />
              </li>
            </button>
          </Link>
        </div>

       {/* Settings Submenu */}
        {isSettingsOpen && (
          <ul className="text-right">
            <Link to="/setting/updateProfile">
              <li
                className={`flex items-center gap-2 transition-all duration-300 ease-in-out mb-3 mt-3 ${isActive("/setting/updateProfile") ? "pl-3 pr-5 py-[14px] rounded-2xl bg-[#1B2D51] text-[#ffffff]" : "text-[#0F0B18]"}`}
              >
                <IoMdInformationCircleOutline className={`w-5 h-5 ${isActive("/setting/updateProfile") ? 'text-white' : 'text-[#0F0B18]'}`} />
                <p className="text-lg">Profile</p>
              </li>
            </Link>
            <Link to="/setting/about">
              <li
                className={`pb-2 flex items-center gap-2 transition-all duration-300 ease-in-out mb-1 ${isActive("/setting/about") ? "pl-3 pr-5 py-[12px] rounded-2xl bg-[#1B2D51] text-[#ffffff]" : "text-[#0F0B18]"}`}
              >
                <FaRegBookmark className={`w-5 h-5 ${isActive("/setting/about") ? 'text-white' : 'text-[#0F0B18]'}`}  />
                <p className="text-lg">About Us</p>
              </li>
            </Link>
            <Link to="/setting/terms">
              <li
                className={`pb-2 flex items-center gap-2 transition-all duration-300 ease-in-out mb-1 ${isActive("/setting/terms") ? "pl-3 pr-5 py-[12px] rounded-2xl bg-[#1B2D51] text-[#ffffff]" : "text-[#0F0B18]"}`}
              >
                <MdOutlinePolicy  className={`w-5 h-5 ${isActive("/setting/terms") ? 'text-white' : 'text-[#0F0B18]'}`}  />
                <p className="text-lg">Terms and Condition</p>
              </li>
            </Link>
            <Link to="/setting/privacy" className="">
              <li
                className={`py-2 flex items-center gap-2 transition-all duration-300 ease-in-out ${isActive("/setting/privacy") ? "pl-3 pr-5 py-[12px] rounded-2xl bg-[#1B2D51] text-[#ffffff]" : "text-[#0F0B18]"}`}
              >
                <MdOutlinePrivacyTip className={`w-5 h-5 ${isActive("/setting/privacy") ? 'text-white' : 'text-[#0F0B18]'}`}  />
                <p className="text-lg">Privacy Policy</p>
              </li>
            </Link>
            {/* <Link to="/setting/affiliate" className="">
              <li
                className={`py-2 flex items-center gap-2 transition-all duration-300 ease-in-out ${isActive("/setting/affiliate") ? "pl-3 pr-5 py-[12px] rounded-2xl bg-[#1B2D51] text-[#ffffff]" : "text-[#0F0B18]"}`}
              >
                <MdOutlinePrivacyTip className={`w-5 h-5 ${isActive("/setting/affiliate") ? 'text-white' : 'text-[#0F0B18]'}`}  />
                <p className="text-lg">Affiliate Condition</p>
              </li>
            </Link> */}
          </ul>
        )}

        {/* Logout */}
       

        <LogoutSection user={user} />
   
      </ul>
    </div>
  );
};

export default Sidebar;
