import { useEffect, useState } from "react";
import { FaWallet, FaPlus } from "react-icons/fa";
import { useAuth } from "../store/AuthContext";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userID } = useAuth();

  const fetchTransactionHistory = async () => {
    try {
      const id = userID();
      const response = await fetch(`http://localhost:3000/api/reports/patient/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setWalletBalance(data.summary.currentWalletBalance);
      setTransactions(
        data.transactionHistory.map((txn) => ({
          date: new Date(txn.date).toLocaleString(),
          type: txn.type,
          amount: txn.amount,
          description: txn.description,
          balance: txn.balance,
        }))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactionHistory().finally(() => setLoading(false));
  }, []);

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const id = userID();
      const response = await fetch("http://localhost:3000/api/patients/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          amount: Number(amount),
          description: "Recharge wallet",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add money.");
      }

      alert(`₹${amount} added successfully!`);
      setAmount("");
      setIsDialogOpen(false);

      // Refresh the wallet balance and transaction history
      fetchTransactionHistory();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaWallet className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold">Wallet Balance</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-600">
                  {loading ? "Loading..." : `₹${walletBalance}`}
                </span>
                <button
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <FaPlus size={16} />
                  Add Money
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{txn.date}</td>
                        <td className="px-4 py-2 capitalize">{txn.type}</td>
                        <td className="px-4 py-2">₹{txn.amount}</td>
                        <td className="px-4 py-2">{txn.description}</td>
                        <td className="px-4 py-2">₹{txn.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Money to Wallet</h3>
            <div className="flex flex-col items-center gap-4">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddMoney}
                disabled={!amount}
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
              >
                Add Money
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="mt-2 text-blue-600 hover:text-blue-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
