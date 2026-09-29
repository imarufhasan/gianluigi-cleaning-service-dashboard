import React from 'react';
import { Link } from 'react-router-dom';

const SettingsSubItem = ({to,icon,label,isActive}) => {
    return (
        <div>
              <Link to={to}>
    <li
      className={`pb-2 flex items-center gap-2 transition-all duration-300 ease-in-out mb-1 ${isActive(to) ? "pl-3 pr-5 py-[14px] rounded-2xl bg-[#F3F3F3] text-[#0F0B18]" : ""}`}
    >
      {icon}
      <p className="text-lg">{label}</p>
    </li>
  </Link>
        </div>
    );
};

export default SettingsSubItem;