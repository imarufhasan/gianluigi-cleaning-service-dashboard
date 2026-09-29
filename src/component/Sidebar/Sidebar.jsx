import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaRegBookmark, FaRegUser } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import {
  MdOutlinePayment,
  MdOutlinePolicy,
  MdOutlinePrivacyTip,
  MdOutlineViewCarousel,
} from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";
import { SlArrowDown } from "react-icons/sl";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GiProgression } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { SiAdblock } from "react-icons/si";
import { PiUsersThreeLight } from "react-icons/pi";
import { GoBook } from "react-icons/go";

import SidebarItem from "../Setting/SidebarItem";
import LogoutSection from "../Setting/LogoutSection";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/feature/auth/authSlice";

const MENU_ITEMS = [
  { to: "/", label: "Dashboard", icon: FaHome },
  { to: "/userManagement", label: "User Management", icon: FaRegUser },
  { to: "/allOwner", label: "All Owner Details", icon: MdOutlinePayment },
  { to: "/allProviders", label: "All Provider Details", icon: CgMail },
  { to: "/requestOverview", label: "Request Overview", icon: GiProgression },
  {
    to: "/transactionHistory",
    label: "Transaction History",
    icon: GrTransaction,
  },
  { to: "/allCategory", label: "All Category", icon: HiOutlineSquares2X2 },
  { to: "/paymentTracking", label: "Payment Tracking", icon: MdOutlinePayment },
  { to: "/accountSuspension", label: "Account Suspension", icon: SiAdblock },
  { to: "/profileStatus", label: "Profile Status", icon: PiUsersThreeLight },
  { to: "/knowledge", label: "Knowledge Hub", icon: GoBook },
  { to: "/banner", label: "Banners", icon: MdOutlineViewCarousel },
];

const SETTINGS_ITEMS = [
  {
    to: "/setting/updateProfile",
    label: "Profile",
    icon: IoMdInformationCircleOutline,
  },
  { to: "/setting/about", label: "About Us", icon: FaRegBookmark },
  { to: "/setting/terms", label: "Terms and Condition", icon: MdOutlinePolicy },
  {
    to: "/setting/privacy",
    label: "Privacy Policy",
    icon: MdOutlinePrivacyTip,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const user = useAppSelector(selectCurrentUser);

  const isActive = (path) => pathname === path;
  const isSettingsActive = pathname.startsWith("/setting");

  // Settings dropdown starts open if we're already on a settings page
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  // Close the mobile drawer after navigating
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Esc closes the drawer, and the page behind it stops scrolling while it's open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop (mobile/tablet only) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Main navigation"
        className={`font-title fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto bg-white px-3 pb-6 pt-4 shadow-xl transition-transform duration-300 ease-in-out
          lg:sticky lg:top-20 lg:z-10 lg:h-[calc(100vh-5rem)] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-gray-200 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header (mobile/tablet only) */}
        <div className="mb-2 flex items-center justify-between pl-5 lg:hidden">
          <span className="text-lg font-semibold text-[#1B2D51]">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full bg-[#0D0D0D] p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2D51]"
          >
            <IoCloseSharp />
          </button>
        </div>

        <ul className="pl-5 text-[10px]">
          {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
            <SidebarItem
              key={to}
              to={to}
              icon={<Icon className="h-5 w-5" />}
              label={label}
              isActive={isActive(to)}
            />
          ))}

          {/* Settings */}
          <li className="relative mt-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen((open) => !open)}
              aria-expanded={isSettingsOpen}
              className={`relative flex w-full items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-3 text-left transition-colors duration-300 ${
                isSettingsActive
                  ? "bg-[#1B2D51] text-white"
                  : "text-[#0F0B18] hover:bg-gray-100"
              }`}
            >
              {/* Active bar, same idea as the other menu items */}
              {isSettingsActive && (
                <span className="absolute -left-6 top-0 h-full w-1.5 -translate-x-full rounded-r bg-[#1B2D51]" />
              )}
              <IoMdSettings className="h-5 w-5" />
              <span className="flex-1 text-lg">Settings</span>
              <SlArrowDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSettingsOpen && (
              <ul className="mt-1 space-y-1 pl-3">
                {SETTINGS_ITEMS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 transition-colors duration-300 ${
                        isActive(to)
                          ? "bg-[#1B2D51] text-white"
                          : "text-[#0F0B18] hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-lg">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Logout */}
          <LogoutSection user={user} />
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
