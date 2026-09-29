import { useNavigate } from "react-router-dom";
import anita from "../../assets/user.png";
import logo from "../../assets/logo.png";
import { useMyDataQuery } from "../../redux/feature/userManagement/userManagementApi";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { data: myData, refetch } = useMyDataQuery();
  return (
    <div className="relative font-title">
      <header className="bg-[#B9C2DB] shadow-sm">
        <div className="flex justify-between px-5 md:px-10 h-[80px] items-center">
          {/* Logo on the left */}
          <div className="flex items-center ml-20">
            <img src={logo} className="w-12 h-12 mb-3 mt-3" alt="Logo" />
          </div>

          {/* User Avatar on the right */}
          <div
            onClick={() => navigate("/setting/updateProfile")}
            className="flex items-center gap-2 cursor-pointer px-5 py-2 rounded-2xl"
          >
            <img
              src={myData?.data?.profilePicture}
              className="w-8 md:w-12 h-8 md:h-12 object-cover rounded-full"
              alt="User Avatar"
            />
            <div className="hidden md:block">
              <h3 className="text-white text-lg font-semibold">{myData?.data?.userName}</h3>
            </div>
          </div>

          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
