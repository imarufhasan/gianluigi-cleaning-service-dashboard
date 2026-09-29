import { useState } from "react";

import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar/Sidebar";
import MainHeader from "../component/MainHeader/MainHeader";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className=" h-[100%] text-white">
     <div>
  
            <MainHeader toggleSidebar={toggleSidebar} />
     </div>
      {/* Main Content */}
      <div className="flex gap-5 overflow-hidden min-h-screen w-[100%]">
       {/* Sidebar  */}
    <div className="w-[20%]">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>

          <div className="w-[100%] overflow-x-hidden overflow-y-auto  px-8 pt-3 bg-[#F4F5F9]">
          <Outlet></Outlet>
        </div>
  
      </div>
    </div>
  );
};

export default Main;
