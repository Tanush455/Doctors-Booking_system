import { useEffect, useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import axios from "axios";

export default function Dashboard() {
  const { token, backendUrl } = useAdminContext();
  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/admin/dashboard-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getDashboardData();
    }
  }, [token]);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Doctors Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Doctors</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {dashboardData.doctors}
          </p>
          <div className="mt-4 flex items-center text-green-600">
            <span className="text-sm">Medical Professionals</span>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Appointments</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {dashboardData.appointments}
          </p>
          <div className="mt-4 flex items-center text-blue-600">
            <span className="text-sm">Scheduled Sessions</span>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Registered Users</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {dashboardData.users}
          </p>
          <div className="mt-4 flex items-center text-purple-600">
            <span className="text-sm">Active Patients</span>
          </div>
        </div>
      </div>

      {/* Latest Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Latest Appointments</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.latestAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={appointment.doctor.image}
                        alt={appointment.doctor.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctor.speciality}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {appointment.user.gender}, {appointment.user.dob}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('en-GB')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.timeSlot}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${appointment.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.payment 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.payment ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}