import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp'
import { Link } from 'react-router-dom'

import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";
import axios from 'axios'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'
import toast from "react-hot-toast";

const Home = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [courses,setcourses]=useState([])
  console.log(courses)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`${apiUrl}/course/view`,{withCredentials:true})
        
        setcourses(response.data.course)
        console.log(response.data.course)
      } catch (error) {
        console.log("error in fetch data", error)

      }
    }
    fetchdata();

  }, [])

  //logout

  const handlelogout=async ()=>{
    try {
      const response= await axios.get(`${apiUrl}/user/logout`,{withCredentials:true})
      console.log(response.data);

      toast.success(response.data.message);

      localStorage.removeItem("user");
      setIsLoggedIn(false);
      
    } catch (error) {
      console.log("error in logging out",error)
      
    }
  }

  var settings = { 
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-orange-500" />
              <h1 className="text-xl md:text-2xl font-bold text-orange-600">
                CourseHaven
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handlelogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="text-gray-700 hover:text-orange-600 font-medium transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/signup"}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Learn. Grow. Succeed.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Master in-demand skills with our expert-led courses and advance your career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={"/courses"}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg"
            >
              Browse Courses
            </Link>
            <Link
              to={"https://www.youtube.com/@FitHubRudra"}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Watch Videos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          {courses.length > 0 ? (
            <Slider className="" {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative pb-[60%]"> {/* Aspect ratio box */}
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={course.image?.url}
                        alt={course.title}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x225?text=Course+Image';
                        }}
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{course.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {course.description.length > 100
                          ? `${course.description.slice(0, 100)}...`
                          : course.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <span className="text-2xl font-bold text-orange-600">₹{course.price}</span>
                        <Link 
                          to={`/buy/${course._id}`} 
                          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-300 text-sm"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">No courses available yet</h3>
              <p className="text-gray-500 mt-2">Check back later for new courses</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose CourseHaven?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with industry-relevant content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-orange-600">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals with years of experience</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-orange-600">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Practical Learning</h3>
              <p className="text-gray-600">Hands-on projects and real-world applications</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-orange-600">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Career Support</h3>
              <p className="text-gray-600">Get career guidance and job placement assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                <h1 className="text-xl font-bold text-orange-500">CourseHaven</h1>
              </div>
              <p className="text-gray-400">
                Empowering learners with high-quality education and practical skills for the modern workforce.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition duration-300">Courses</Link></li>
                <li><Link to="/purchases" className="text-gray-400 hover:text-white transition duration-300">My Learning</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Career Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Learning Paths</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 CourseHaven. All rights reserved. Designed with ❤️ for learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home;