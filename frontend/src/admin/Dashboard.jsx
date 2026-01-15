import React from 'react'
import logo from '../../public/logo.webp'
import {Link} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleLogout=async ()=>{
    try {
        const response= await axios.get(`${apiUrl}/admin/logout`,{withCredentials:true})
        console.log(response.data);

        toast.success(response.data.message);

        localStorage.removeItem("admin");
  
        
    } catch (error) {
        console.log("error in logging out",error)
        
    }
}
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5">
        <div className="flex items-center flex-col mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>
      <div className="flex h-screen items-center justify-center ml-[40%]">
        Welcome!!!
      </div>
    </div>
  );
}

export default Dashboard
