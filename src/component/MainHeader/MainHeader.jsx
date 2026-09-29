import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import avatar from "../../assets/user.png";
import logo from "../../assets/logo.png";
import { useMyDataQuery } from "../../redux/feature/userManagement/userManagementApi";

const MainHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { data: myData } = useMyDataQuery();
  const me = myData?.data;

  return (
    // h-20 (80px) must match the sidebar's `top-20` / `5rem` offsets
    <header className="sticky top-0 z-30 bg-[#B9C2DB] font-title shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-10">
        {/* Left: menu button (mobile/tablet) + logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open menu"
            aria-expanded={!!isSidebarOpen}
            className="rounded-lg p-2 text-[#1B2D51] hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2D51] lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img src={logo} className="h-10 w-10 sm:h-12 sm:w-12" alt="Logo" />
        </div>

        {/* Right: profile */}
        <button
          type="button"
          onClick={() => navigate("/setting/updateProfile")}
          className="flex items-center gap-2 rounded-2xl px-2 py-2 hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2D51] sm:px-4"
        >
          <img
            src={me?.profilePicture || avatar}
            className="h-9 w-9 rounded-full object-cover md:h-12 md:w-12"
            alt="Your profile"
          />
          <h3 className="hidden max-w-[10rem] truncate text-lg font-semibold text-white md:block">
            {me?.userName}
          </h3>
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
