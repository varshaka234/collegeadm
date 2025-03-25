import { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastTransactionId, setLastTransactionId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/payments")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch payment history");
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // ✅ Debugging log

        setPayments(data);
        setLoading(false);

        // ✅ Ensure transactionId exists
        if (data.length > 0 && data[0].transactionId) {
          localStorage.setItem("lastTransactionId", data[0].transactionId);
          setLastTransactionId(data[0].transactionId);
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    // ✅ Retrieve last transaction ID correctly
    const storedTransactionId = localStorage.getItem("lastTransactionId");
    setLastTransactionId((prev) => storedTransactionId || prev);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">💰 Payment History</h2>

      {loading && <p className="text-blue-600">Loading payment history...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* ✅ Show Last Transaction ID */}
      {lastTransactionId && (
        <p className="text-green-600 font-semibold">
          Last Transaction ID: {lastTransactionId}
        </p>
      )}

      {!loading && !error && payments.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              // ✅ Ensure transactionId is available
              const transactionId = payment.transactionId || lastTransactionId || "N/A";

              return (
                <tr key={index} className="text-center">
                  <td className="border p-2">{transactionId}</td>
                  <td className="border p-3">
  {payment.amount.includes("₹") ? payment.amount : `₹${Number(payment.amount).toLocaleString("en-IN")}`}
</td>

                  <td className={`border p-2 ${payment.status === "Success" ? "text-green-600" : "text-red-600"}`}>
                    {payment.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-600">No payment records found.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
