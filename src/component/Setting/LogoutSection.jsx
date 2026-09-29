import React from 'react';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/feature/auth/authSlice';

const LogoutSection = ({user}) => {
  const dispatch = useDispatch();
  const handleLogout=()=>{
dispatch(logout())
  }
    return (
    <div className="absolute bottom-1 w-[90%] px-5">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-0 py-3 border-2 text-[#0F0B18] rounded-xl duration-200 justify-center"
          >
            <RiLogoutCircleLine className="w-7 h-7 font-bold text-2xl text-[#0F0B18] rotate-90" />
            <span className="text-lg text-title font-bold">Logout</span>
          </button>
        ) : (
          <Link to="/sign-in">
            <button className="flex items-center gap-2 w-full px-0 py-3 border-2 text-[#0F0B18] rounded-xl duration-200 justify-center">
              <span className="text-lg text-title font-bold">Login</span>
            </button>
          </Link>
        )}
      </div>
    );
};

export default LogoutSection;