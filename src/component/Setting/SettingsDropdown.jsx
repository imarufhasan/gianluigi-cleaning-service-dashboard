
import SettingsSubItem from './SettingsSubItem';
import { IoMdInformationCircleOutline, IoMdSettings } from 'react-icons/io';
import { FaRegBookmark } from 'react-icons/fa';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { SlArrowDown } from 'react-icons/sl';

const SettingsDropdown = ({toggleSettingsDropdown,isActive,isSettingsOpen}) => {
    return (
         <div className="relative mt-3">
    <button
      onClick={()=>toggleSettingsDropdown()}
      className={`flex w-full justify-between items-center gap-2 mt-1 cursor-pointer transition-all duration-300 ease-in-out ${
        isActive ? "bg-[#1B2D51] text-[#ffffff] px-3 pb-2 rounded-2xl" : ""
      } relative`}
    >
      {isActive && <div className="bg-[#1B2D51] w-[3%] -left-6 top-0 absolute h-14" style={{ transform: "translateX(-100%)" }}></div>}
      <li className="flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out w-[98%]">
        <IoMdSettings className="w-5 h-5" />
        <p className="text-lg text-[#1B2D51]">Settings</p>
        <SlArrowDown className={`w-5 h-5 text-right ml-5 hover:-rotate-90 ${isActive ? "bg-[#1B2D51]" : "text-[#1B2D51]"}`} />
      </li>
    </button>
    {isSettingsOpen && (
      <ul className="text-right">
        <SettingsSubItem to="/setting/updateProfile" icon={<IoMdInformationCircleOutline className="w-5 h-5 text-lg" />} label="Profile" isActive={isActive} />
        <SettingsSubItem to="/setting/terms" icon={<FaRegBookmark className="w-5 h-5 text-lg" />} label="Terms and Condition" />
        <SettingsSubItem to="/setting/privacy" icon={<MdOutlinePrivacyTip className="w-5 h-5 text-lg" />} label="Privacy Policy" />
      </ul>
    )}
  </div>
    );
};

export default SettingsDropdown;