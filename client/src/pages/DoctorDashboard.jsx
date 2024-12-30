import { useEffect, useState } from "react";
import userIcon from "../assets/man-user-circle-icon.svg";
import { useAuth } from "../store/AuthContext";
const DoctorDashboard = () => {
  const [recentPatients, setRecentPatients] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const { userID } = useAuth();

  const apiUrl = `http://localhost:3000/api/reports/doctor/${userID()}`;

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Process and update state
        const patients = data.appointmentHistory.map(appointment => ({
          id: appointment.date,
          name: appointment.patientName,
          date: new Date(appointment.date).toLocaleDateString(),
          isFirstTime: appointment.isFirstVisit,
          amount: appointment.finalFee,
        }));
        setRecentPatients(patients);

        const totalEarnings = patients.reduce((sum, patient) => sum + patient.amount, 0);
        setTotalMoney(totalEarnings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Main Content */}
      <main className="px-4 py-6 mx-auto max-w-7xl">
        <div className="flex mb-8">
          {/* Total Money Box */}
          <div className="p-6 bg-white rounded-lg shadow w-3/4">
            <h2 className="text-lg font-semibold">Total Money</h2>
            <p className="mt-4 text-2xl font-bold text-gray-800">₹{totalMoney}</p>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Patients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-500">Patient Name</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map(patient => (
                  <tr key={patient.id} className="border-b border-gray-100">
                    <td className="py-4">
                      <div className="flex items-center">
                        <img
                          src={userIcon}
                          alt={patient.name}
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                        <span className="font-medium text-gray-700">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">{patient.date}</td>
                    <td className="py-4">
                      {patient.isFirstTime ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                          First Visit
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-medium text-gray-700">
                      ₹{patient.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
