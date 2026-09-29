
import { Link } from 'react-router-dom';

const SidebarItem = ({to,isActive,icon,label}) => {
    return (
        <div>
              <Link to={to} className="flex justify-between">
    {isActive && <div className="bg-[#1B2D51] w-[3%] h-14 ml-0 -left-8 mt-5 relative"></div>}
    <li
      className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out w-[98%] ${
        isActive ? "bg-[#1B2D51] text-[#ffffff] px-3 py-3 rounded-xl" : "text-[#0F0B18]"
      }`}
    >
      {icon}
      <p className="text-lg">{label}</p>
    </li>
  </Link>
        </div>
    );
};

export default SidebarItem;