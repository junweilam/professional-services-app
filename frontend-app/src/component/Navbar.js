import React, { useState } from 'react';
import { useEmail } from '../context/EmailContext';

function Navbar() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userEmail } = useEmail();

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const token = localStorage.getItem('token');
  console.log(token);


  const handleSignout = () => {
      localStorage.removeItem("token");
      console.log("logged out")
      window.location.href = './signin';
    
  }
  
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="" className="flex items-center">
          <img
            // Logo Image Here
            src=""
            className="h-8 mr-3"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Logo
          </span>
        </a>
        <div className="flex items-center md:order-2">

          <button
            type="button"
            className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded={isUserDropdownOpen}
            onClick={toggleUserDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              // User profile pic
              src=""
              alt="Profile Pic"
            />
          </button>
          {/* Dropdown menu */}
          <div
            className={`${isUserDropdownOpen ? 'block' : 'hidden'
              } absolute right-27 top-12 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-400 z-50`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              {/* User Name */}
              <span className="block text-sm text-gray-900 dark:text-white">
                email
              </span>
              {/* User Email */}
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                {userEmail ? (
                  <p>Welcome, {userEmail}</p>
                ) : (
                  <p>Welcome, Guest</p>
                )}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-200 dark:hover-text-white"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-200 dark:hover-text-white"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-200 dark:hover-text-white"
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-200 dark:hover-text-white"
                  onClick={handleSignout}
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover-bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover-bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${isMobileMenuOpen ? 'block' : 'hidden'
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md-border-0 md-bg-white dark-bg-gray-800 md-dark-bg-gray-900 dark-border-gray-700"
          >
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md-bg-transparent md-text-blue-700 md-p-0 md-dark-text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0 dark-text-white md-dark-hover-text-blue-500 dark-hover-bg-gray-700 dark-hover-text-white md-dark-hover-bg-transparent dark-border-gray-700"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0 dark-text-white md-dark-hover-text-blue-500 dark-hover-bg-gray-700 dark-hover-text-white md-dark-hover-bg-transparent dark-border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

