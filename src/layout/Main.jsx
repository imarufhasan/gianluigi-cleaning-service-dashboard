import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar/Sidebar";
import MainHeader from "../component/MainHeader/MainHeader";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((open) => !open),
    [],
  );
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-white">
      <MainHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Do NOT add overflow-hidden here: it breaks the sticky sidebar on desktop */}
      <div className="flex min-h-[calc(100vh-5rem)] items-start">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* min-w-0 lets wide tables/charts shrink instead of stretching the page */}
        <main className="min-w-0 flex-1 px-3 pb-8 pt-4 sm:px-5 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
