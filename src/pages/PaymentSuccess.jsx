import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const location = useLocation();
  const { transactionId } = location.state || {}; // Get transaction ID

  // ✅ Save transactionId in localStorage
  useEffect(() => {
    if (transactionId) {
      localStorage.setItem("lastTransactionId", transactionId);
    }
  }, [transactionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-green-600 text-2xl font-bold">✅ Payment Successful!</h2>
        <p className="text-gray-600 mt-2">Transaction ID: <b>{transactionId || "N/A"}</b></p>
        <Link to="/payment-history" className="mt-4 text-blue-500">View Payment History</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
