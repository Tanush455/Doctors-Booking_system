import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAdminContext } from "../context/AdminContext";

export interface IDoctor {
  _id: string;
  name: string;
  password: string;
  email: string;
  role: "doctor" | "admin";
  address: string;
  description: string;
  image: string;
  degree: string;
  speciality: string;
  experience: string;
  timeSlot?: object;
  isAvailable: boolean;
  fee: number;
  createdTime?: Date;
  comparePassword?(enteredPassword: string): Promise<boolean>;
}

export const DoctorList: React.FC = () => {
  const token = localStorage.getItem("authToken")?.split(" ")[1];
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { backendUrl } = useAdminContext();

  const getAllDoctors = async () => {
    try {
      const response = await axios.get<{ data: IDoctor[] }>(
        `${backendUrl}/api/v1/admin/doctors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setDoctors([]);
      }
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  // Toggle the availability of a doctor
  const changeAvailable = async (_id: string) => {
    try {
      await axios.post(
        `${backendUrl}/api/v1/admin/doctors/changeAvailability`,
        { docId: _id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh the doctor list after a successful update
      getAllDoctors();
    } catch (error: any) {
      console.error("Error changing availability:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  // Filter out any doctors with role 'admin'
  const filteredDoctors = doctors.filter((doctor) => doctor.role !== "admin");

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Our Specialist Doctors
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredDoctors.length === 0 && !error && (
        <p className="text-center text-gray-500 text-lg">No doctors found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-96 object-cover hover:bg-amber-300 transition-all duration-300"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {doctor.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                    doctor.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  onClick={() => changeAvailable(doctor._id)}
                >
                  {doctor.isAvailable ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Speciality:</span>{" "}
                  {doctor.speciality}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Degree:</span> {doctor.degree}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {doctor.experience}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Fee:</span> $
                  {doctor.fee.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
