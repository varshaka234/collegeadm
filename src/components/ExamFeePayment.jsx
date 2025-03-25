import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamFeePayment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ Loader state
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]); // ✅ Default to empty array


  // Handle payment method selection
  const handlePaymentChange = (event) => {
    const selectedMethod = event.target.value;
    setPaymentMethod(selectedMethod);
    setShowCardNumber(selectedMethod === "credit-card");
  };

  // ✅ Validate card number format (16 digits)
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  // ✅ Simulated Payment Function with Loader
  const handlePayment = () => {
    if (paymentMethod === "credit-card" && cardNumber.length !== 16) {
      alert("❌ Invalid card number! Must be 16 digits.");
      return;
    }

    setIsLoading(true); // Show loader

    setTimeout(() => {
      setIsLoading(false); // Hide loader
      const isSuccess = Math.random() > 0.3; // 70% Success Rate
      const fakeTransactionId = "TXN" + Math.floor(Math.random() * 1000000000);

      if (isSuccess) {
        setTransactionId(fakeTransactionId);
        setPaymentStatus("success");
        setTimeout(() => {
          navigate("/payment-success", { state: { transactionId: fakeTransactionId } }); 
        }, 2000);
        
      } else {
        setPaymentStatus("failure");
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">💳 Exam Fee Payment</h2>

        <div className="bg-gray-200 p-3 rounded-lg text-lg font-medium mb-4 text-center">
  💰 Exam Fee: <span className="text-green-600">₹1,200.00</span>
</div>


        {/* ✅ Payment Method Dropdown */}
        <label className="block font-medium mb-2">Select Payment Method:</label>
        <select
          className="border rounded-lg p-2 w-full mb-4"
          value={paymentMethod}
          onChange={handlePaymentChange}
        >
          <option value="">Select Payment Method</option>
          <option value="credit-card">💳 Credit / Debit Card</option>
          <option value="net-banking">🏦 Net Banking</option>
          <option value="upi">📱 UPI</option>
        </select>

        {/* ✅ Card Details Input (Only if Credit/Debit Card is selected) */}
        {showCardNumber && (
          <>
            <label className="block font-medium mb-1">Card Number:</label>
            <input
              type="text"
              className="border rounded-lg p-2 w-full mb-3"
              placeholder="**** **** **** 1234"
              value={cardNumber}
              onChange={handleCardNumberChange}
              autoComplete="off"
            />

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium mb-1">Expiry Date:</label>
                <input type="text" className="border rounded-lg p-2 w-full" placeholder="MM/YY" />
              </div>
              <div className="w-1/2">
                <label className="block font-medium mb-1">CVV:</label>
                <input type="password" className="border rounded-lg p-2 w-full" placeholder="***" />
              </div>
            </div>
          </>
        )}

        {/* ✅ Payment Button with Loader */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Pay & Proceed"}
        </button>

        {/* ✅ Success & Error Messages */}
        {paymentStatus === "success" && (
          <div className="text-center text-green-600 font-bold text-lg mt-4">
            ✅ Payment Successful! <br />
            <span className="text-sm text-gray-600">Transaction ID: {transactionId}</span>
          </div>
        )}

        {paymentStatus === "failure" && (
          <div className="text-center text-red-600 font-bold text-lg mt-4">
            ❌ Payment Failed. Try Again!
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamFeePayment;
