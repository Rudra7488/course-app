import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Buy = () => {
  const { courseId } = useParams();
  
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
        setError("please login to purchase the courses");
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:5000/course/courses/${courseId}`,
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
          setError("you have already purchased the course");
        } else {
          toast.error(error?.response?.data?.errors);
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
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Verify payment with backend
          const verifyResponse = await axios.post(
            "http://localhost:5000/order/orderdetails",
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

          toast.success("Payment successful!");
          navigate("/purchases");
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: `${user?.user?.firstname} ${user?.user?.lastname}`,
        email: user?.user?.email
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
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">₹{course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Click the button below to pay securely with Razorpay
                </p>
                <button
                  onClick={handlePurchase}
                  disabled={loading || !orderData}
                  className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition duration-200"
                >
                  {loading ? "Loading..." : `Pay ₹${course.price}`}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buy;
