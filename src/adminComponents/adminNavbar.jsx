import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMiniUser } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";

function AdminNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Page conditions for action buttons
  const isProfilePage = pathname === "/admin/adminProfile" || pathname === "/admin/profile";
  const isBannerPage = pathname === "/admin/uploadbanner";
  const isEventsPage = pathname.startsWith("/admin/events") || pathname === "/admin/eventupload";
  const isStatusPage = pathname === "/admin/statuschange";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      const raw = localStorage.getItem("user_data");
      if (token && raw) {
        const parsed = JSON.parse(raw);
        const candidates = [
          parsed?.name,
          parsed?.username,
          parsed?.user?.name,
          parsed?.user?.username,
          parsed?.email,
          parsed?.user?.email,
        ];
        const first = candidates.find((v) => typeof v === "string" && v.trim());
        const display = first
          ? first.includes("@")
            ? first.split("@")[0]
            : first
          : "Admin";
        setUserName(display);
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  const handleSignout = () => {
    try {
      const raw = localStorage.getItem("user_data");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const uid = parsed?.id || parsed?.user?.id || parsed?.userId;
          if (uid != null) {
            const cacheKey = `userOrders_${uid}`;
            if (localStorage.getItem(cacheKey)) localStorage.removeItem(cacheKey);
          }
        } catch {}
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
    } catch {}
    setUserName(null);
    setIsLoggedIn(false);
    navigate("/admin");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 py-1">
        <div className="flex flex-wrap items-center w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <Link to="/admin">
            <div className="w-16 h-16 bg-gray-800 text-white flex items-center justify-center font-bold text-lg rounded">
              TA
            </div>
          </Link>

          {/* Center: Search (hidden on events page) */}
          {!isEventsPage ? (
            <div className="flex items-center flex-auto mx-1 sm:mx-2 md:mx-3 min-w-[200px] md:min-w-[300px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-8 sm:pl-10 pr-4 sm:pr-6 py-2 sm:py-3 bg-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
                />
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded ml-2 sm:ml-3 transition-colors-transform duration-200 hover:scale-105"
                style={{ backgroundColor: "#ee6786ff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ee678699")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ee6786ff")}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#ee678665")}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#ee6786ff")}
              >
                Search
              </button>
            </div>
          ) : (
            <div className="flex-auto mx-1 sm:mx-2 md:mx-3 min-w-[200px] md:min-w-[300px]" />
          )}

          {/* Action buttons based on current page */}
          <div className="flex items-center gap-2 ml-4">
            {isProfilePage && (
              <Link
                to="/admin"
                className="rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Admin Dashboard
              </Link>
            )}

            {isBannerPage && (
              <>
                <Link
                  to="/admin/uploadbanner"
                  className="rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Add Banner
                </Link>
                <Link
                  to="/admin/uploadbanner"
                  className="rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit Banner
                </Link>
              </>
            )}

            {isEventsPage && (
              <Link
                to="/admin/eventupload"
                className="rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Add Event
              </Link>
            )}

            {isStatusPage && (
              <Link
                to="/admin/statuschange"
                className="rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Change Status
              </Link>
            )}
          </div>

          {/* Right: auth/actions — mirror Navbar.jsx */}
          <div className="relative ml-2 sm:ml-4 md:ml-6 lg:ml-10 min-w-[180px] md:min-w-[220px] flex justify-left">
            {isLoggedIn ? (
              <div className="flex items-center gap-4 sm:gap-5 md:gap-7">
                {!isProfilePage && (
                  <Link
                    to="/admin/adminProfile"
                    className="flex items-center text-gray-600 p-2 cursor-pointer hover:text-red-600 transition-colors duration-200 hover:bg-gray-100"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-300 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                      <span className="text-xs sm:text-xs font-medium text-gray-600">
                        {(String(userName || "A").trim().charAt(0) || "A").toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{userName || "Admin"}</span>
                  </Link>
                )}
                <button
                  onClick={handleSignout}
                  className="flex items-center text-gray-600 border-none outline-none shadow-none p-2 cursor-pointer hover:text-red-600 transition-colors duration-200"
                >
                  <FiLogOut className="w-5 h-5 mr-1.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              !isProfilePage && (
                <div className="flex items-center text-gray-600">
                  <HiMiniUser className="w-5 h-5 mr-2" />
                  <span>Please log in</span>
                </div>
              )
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default AdminNavbar;