import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndPoints from '../Util/apiEndpoints';
import { AlertCircle, Loader2, ReceiptIcon } from 'lucide-react';

const Transation = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const response = await axios.get(apiEndPoints.TRANSACTIONS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // ✅ FIXED
        setTransactions(response.data);
        setError(null);

      } catch (error) {
        console.error("Error fetching transaction", error);
        setError("Failed to load your transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [getToken]);

  // ✅ Date format FIX
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // ✅ Amount format
  const formatAmount = (amountInPaise) => {
    return `₹${(amountInPaise / 100).toFixed(2)}`
  };


  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="p-6">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <ReceiptIcon className="text-blue-600" />
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (

          // EMPTY STATE
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <ReceiptIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-500">
              You haven't made any credit purchases yet.
            </p>
          </div>

        ) : (

          // ✅ TABLE UI
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">

              {/* TABLE HEAD */}
              <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment ID</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y">

                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">

                    {/* DATE */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(txn.transactionDate)}
                    </td>

                    {/* PLAN */}
                    <td className="px-6 py-4 text-sm">
                      {txn.planId === "premium"
                        ? "Premium Plan"
                        : txn.planId === "ultimate"
                          ? "Ultimate Plan"
                          : "Basic Plan"}
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatAmount(txn.amount)}
                    </td>

                    {/* CREDITS */}
                    <td className="px-6 py-4 text-sm">
                      +{txn.creditsAdded}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    {/* PAYMENT ID */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {txn.paymentId
                        ? txn.paymentId.substring(0, 10) + "..."
                        : "N/A"}
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Transation;