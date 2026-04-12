import React, { useContext, useRef, useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import apiEndpoints from "../Util/apiEndpoints";
import { AlertCircle, CreditCard, Check } from "lucide-react";

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { credits, setCredits, fetchUserCredits } =
    useContext(UserCreditsContext);

  const plans = [
    {
      id: "premium",
      name: "Premium",
      credits: 500,
      price: 500,
      recommended: false,
      features: [
        "Upload up to 500 files",
        "Access to all basic features",
        "Priority support",
      ],
    },
    {
      id: "ultimate",
      name: "Ultimate",
      credits: 5000,
      price: 2500,
      recommended: true,
      features: [
        "Upload up to 5000 files",
        "Access to all premium features",
        "Priority support",
        "Advanced analytics",
      ],
    },
  ];

  // Razorpay Load (FIXED)
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        setMessage("Payment gateway failed to load.");
        setMessageType("error");
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchUserCredits();
  }, []);

  const handlePurchase = async (plan) => {
    if (!razorpayLoaded) return;

    setProcessingPayment(true);
    setActivePlan(plan.id);
    setMessage("");

    try {
      const token = await getToken();
      console.log("TOKEN:", token);

      const response = await axios.post(
        apiEndpoints.CREATE_ORDER,
        {
          planId: plan.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDER RESPONSE:", response.data);

      if (!response.data.success || !response.data.orderId) {
        setMessage("Order creation failed");
        setMessageType("error");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: response.data.amount,   // 🔥 backend से
        currency: "INR",
        name: "CloudShare",
        description: `Purchase ${plan.credits} credits`,
        order_id: response.data.orderId,

        handler: async function (response) {
          try {
            const token = await getToken();

            const verifyResponse = await axios.post(
              apiEndpoints.VERIFY_PAYMENT,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              await fetchUserCredits();
              setMessage("Payment successful! Plan activated");
              setMessageType("success");
            } else {
              setMessage("Verification failed");
              setMessageType("error");
            }
          } catch (err) {
            console.error(err);
            setMessage("Verification error");
            setMessageType("error");
          }
        },

        modal: {
          ondismiss: function () {
            setMessage("Payment cancelled");
            setMessageType("error");
          },
        },

        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },

        theme: {
          color: "#7C3AED",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("FULL ERROR:", error.response?.data);
      setMessage(error.response?.data?.message || "Payment failed");
      setMessageType("error");
    } finally {
      setProcessingPayment(false);
      setActivePlan(null);
    }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-500 mb-6">
          Choose a plan that works for you
        </p>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${messageType === "error"
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
              }`}
          >
            <AlertCircle size={18} />
            {message}
          </div>
        )}

        {/* Credits */}
        <div className="mb-6 bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-2">
            <CreditCard className="text-purple-500" />
            <h2 className="font-semibold">
              Current Credits:{" "}
              <span className="text-purple-600 font-bold">
                {credits}
              </span>
            </h2>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-xl border ${plan.recommended
                ? "bg-purple-50 border-purple-300 shadow-md"
                : "bg-white"
                }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>

              <p className="text-3xl font-bold mt-2">
                ₹{plan.price}
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check size={16} className="text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={processingPayment && activePlan === plan.id}
                className="mt-6 w-full py-2 rounded-lg bg-purple-600 text-white"
              >
                {processingPayment && activePlan === plan.id
                  ? "Processing..."
                  : "Purchase Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;