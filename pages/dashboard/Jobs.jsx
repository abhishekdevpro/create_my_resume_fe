// import React, { useState } from 'react'
// import SavedJobsPage from './SavedJobs';
// import JobsPage from './MyJobs';
// import Navbar from '../Navbar/Navbar';

// const JobsToggle = () => {
//     const [activeTab, setActiveTab] = useState("myJobs");

//     return (
//       <>
//        <Navbar/>
//        <div className=" mx-auto mt-10 p-6 rounded-lg shadow-lg">
//         <div className="flex border-b mb-6">
//           <button
//             className={`flex-1 py-2 text-center text-lg font-medium transition-all duration-300 ${
//               activeTab === "myJobs"
//                 ? "border-b-4 border-blue-500 text-blue-500"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab("myJobs")}
//           >
//             My Jobs
//           </button>
//           <button
//             className={`flex-1 py-2 text-center text-lg font-medium transition-all duration-300 ${
//               activeTab === "savedJobs"
//                 ? "border-b-4 border-blue-500 text-blue-500"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab("savedJobs")}
//           >
//             Saved Jobs
//           </button>
//         </div>

//         {activeTab === "myJobs" ? <JobsPage /> : <SavedJobsPage />}
//       </div>
//       </>
//     );
//   };

//   export default JobsToggle;
import Navbar from "../Navbar/Navbar";

import Sidebar from "./Sidebar";

import React, { useState } from "react";

import { FaBars } from "react-icons/fa"; //

import MyCvLetter from "./MyCvLetter";
import JobSearch from "../JobSearch";

export default function MyJobs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="w-full shadow-md">{/* <ProfilePage /> */}</div>

        <div className="flex flex-1 w-full  mt-4 bg-white shadow-md rounded-lg overflow-hidden">
          {/* Hamburger icon for mobile view */}
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="p-4 focus:outline-none">
              <FaBars className="text-2xl" />
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={`md:w-64 flex-shrink-0 md:block  ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            <Sidebar onClose={closeSidebar} />
          </div>

          {/* Content area */}
          <div className="flex-1 w-full max-w-8xl p-4 overflow-auto">
            <JobSearch />
          </div>
          {/* Content area */}
        </div>
      </div>
    </div>
  );
}
