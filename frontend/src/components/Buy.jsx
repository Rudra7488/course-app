import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLock, FaCreditCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Buy = () => {
  const { courseId } = useParams();
  const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchBuyCourse = async () => {
      if (!token) {
        setError("Please login to purchase the courses");
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiUrl}/course/courses/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        
        setCourse(response.data.course);
        setOrderData({
          orderId: response.data.orderId,
          amount: response.data.amount,
          currency: response.data.currency,
          keyId: response.data.keyId
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
        } else {
          toast.error(error?.response?.data?.errors || "Failed to initialize payment");
        }
      }
    };

    fetchBuyCourse();
  }, [courseId, token]);

  const handlePurchase = async () => {
    if (!orderData) {
      toast.error("Order data not available");
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "CourseHaven",
      description: `Purchase ${course.title}`,
      image: "https://placehold.co/100x40?text=CH", // Replace with actual logo
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Verify payment with backend
          const verifyResponse = await axios.post(
            `${apiUrl}/order/orderdetails`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.user._id,
              courseId: courseId,
              amount: orderData.amount
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: true
            }
          );

          toast.success("Payment successful! Course purchased successfully!");
          navigate("/purchases");
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: `${user?.user?.firstname} ${user?.user?.lastname}`,
        email: user?.user?.email,
        contact: user?.user?.phone || "" // Assuming phone exists in user object
      },
      theme: {
        color: "#f97316"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.");
      console.log(response.error);
    });
    rzp.open();
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Secure and fast checkout powered by Razorpay</p>
          </div>

          {error ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <FaTimesCircle className="text-red-500 text-5xl" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Purchase Error</h2>
              <p className="text-gray-700 mb-6">{error}</p>
              <Link
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                to={"/courses"}
              >
                Browse Other Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                        {course.image ? (
                          <img 
                            src={course.image?.url} 
                            alt={course.title} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs text-center px-1">No Image</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-gray-500 text-sm">Course</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>₹{course.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Discount:</span>
                      <span>₹0.00</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total:</span>
                      <span>₹{course.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <FaLock className="text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Secured Payment Gateway</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FaCreditCard className="text-orange-500 mr-3 text-xl" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Razorpay Secure Checkout</h3>
                      <p className="text-gray-600 text-sm">Safe and encrypted payment</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">{user?.user?.firstname} {user?.user?.lastname}</p>
                    <p className="text-gray-600 text-sm">{user?.user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handlePurchase}
                  disabled={loading || !orderData}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-white transition duration-300 flex items-center justify-center ${
                    loading || !orderData 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Pay Now ₹{course.price}
                    </>
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">PCI DSS Compliant</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                    By clicking "Pay Now", you agree to our <Link className="text-orange-500 hover:underline" to="/terms">Terms of Service</Link> and <Link className="text-orange-500 hover:underline" to="/privacy">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Badge */}
          {!error && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <FaCheckCircle className="mr-2" />
                <span className="text-sm font-medium">Secure Payment • 256-bit SSL Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buy;