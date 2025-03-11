import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import logo from "../Navbar/logo.png";
import logo from "../../public/assets/logo.png";

import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../components/Constant/constant";
import CibliJobId from "./CibliJobId";
import { useTranslation } from "react-i18next";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [user, setUser] = useState("");
  const [photo, setPhoto] = useState("");
  const router = useRouter();
  const axiosInstance = axios.create();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };
  useEffect(() => {
    const token = localStorage.getItem("token"); // Access localStorage here

    if (token) {
      setIsLoggedIn(true);

      // Check API success
      const checkApiSuccess = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/user/user-profile`,
            {
              headers: {
                Authorization: token,
              },
            }
          );

          if (response.data.status === "success") {
            setIsApiSuccess(true);
            setUser(response.data.data.first_name);
            setPhoto(response.data.data.photo);
          } else {
            setIsApiSuccess(false);
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            router.push("/login2");
          }
        } catch (error) {
          localStorage.removeItem("token");
          setIsApiSuccess(false);
          setIsLoggedIn(false);
          router.push("/login2");
        }
      };

      checkApiSuccess();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => setIsMenuOpen(false);

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => setIsHovering(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${BASE_URL}/api/user/logout`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.removeItem("token");
      router.push("/login2");
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response?.data || error.message
      );
      // Still remove token and redirect even if logout API fails
      localStorage.removeItem("token");
      router.push("/login2");
    }
  };

  // Setup axios interceptor
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image src={logo} alt="logo" className="h-12 w-full" />
            </Link>
          </div>
          <div className="hidden md:flex justify-center items-center space-x-4">
            {isLoggedIn ? (
              <div>
                <Link
                  href="/dashboard"
                  className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
                >
                  {t("dashboard")}
                </Link>
                {/* <Link
                  href="/dashboard/resumelist"
                  className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
                >
                  {t("my_resumes")}
                </Link>
                <Link
                  href="/dashboard/cvletterlist"
                  className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
                >
                  {t("cover_letter")}
                </Link> */}
              </div>
            ) : (
              <></>
            )}
            {/* <LanguageSelector /> */}
            <Link
              href="/navbarcontent"
              className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
            >
              {t("ai_resume_builder")}
            </Link>
            <Link
              href="/dashboard/jobs"
              className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
            >
              {t("jobs")}
            </Link>
            <Link
              href="https://blog.Create My Resume.fr/"
              className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
            >
              {t("resources")}
            </Link>
            {/* <Link
              href=""
              onClick={handleOpenPopup}
              className="text-black hover:text-teal-700 px-3 py-2 rounded-md text-lg font-semibold"
            >
              {t("cibli_job_id")}
              {/* CibliJob ID
            </Link> */}
            {/* <CibliJobId isOpen={isPopupOpen} onClose={handleClosePopup} /> */}
          </div>
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center bg-teal-700 text-white px-4 py-2 text-md font-semibold border-2 rounded-xl"
                >
                  <img
                    src={
                      photo
                        ? `https://api.ciblijob.fr${photo}`
                        : "https://img.freepik.com/premium-vector/businessman-avatar-illustration-cartoon-user-portrait-user-profile-icon_118339-4382.jpg"
                    }
                    alt="User"
                    className="w-full h-8 rounded-full"
                  />

                  <span className="ml-2">{user ? user : "profile"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-black z-50">
                    <Link
                      href="/"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("home")}
                    </Link>

                    <Link
                      href="/dashboard/page"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("profile")}
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      href="/dashboard/resumelist"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      {t("my_resumes")}
                    </Link>
                    <Link
                      href="/dashboard/cvletterlist"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      {t("cover_letter")}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login2"
                  className="bg-teal-700 text-white px-4 py-2 text-md font-semibold rounded-xl"
                >
                  {"login"}
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden ">
            <button
              onClick={handleMenuClick}
              className="text-black hover:text-teal-700 focus:outline-none px-3 py-2 rounded-md text-sm font-medium"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard/jobs"
                className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
              >
                {t("jobs")}
              </Link>
              <Link
                href="/navbarcontent"
                className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
              >
                {t("ai_resume_builder")}
              </Link>
              <Link
                href="https://blog.ciblijob.fr/"
                className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
              >
                {t("resources")}
              </Link>
              {/* <Link
                href=""
                onClick={handleOpenPopup}
                className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
              >
                {t("cibli_job_id")}
              </Link> */}
              {/* <CibliJobId isOpen={isPopupOpen} onClose={handleClosePopup} /> */}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    href="/dashboard/resumelist"
                    className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
                  >
                    {t("my_resumes")}
                  </Link>
                  <Link
                    href="/dashboard/cvletterlist"
                    className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
                  >
                    {t("cover_letter")}
                  </Link>
                  <Link
                    href="/dashboard/page"
                    className="text-black hover:text-teal-700 block px-3 py-2 rounded-md text-base font-semibold"
                  >
                    {t("profile")}
                  </Link>
                  <Link
                    href="/"
                    className="bg-teal-700 text-white block px-3 py-2 rounded-md text-base font-semibold"
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                  >
                    {t("logout")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login2"
                    className="bg-teal-500 text-white block px-3 py-2 rounded-md text-base font-semibold"
                    onClick={handleLinkClick}
                  >
                    {t("login")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
