import { useEffect, useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Appointment {
  _id: string;
  Slotdate: string;
  timeSlot: string;
  doctor: {
    image: string;
    name: string;
    speciality: string;
  };
  user: {
    name: string;
    phoneno: string;
  };
  amount: number;
}

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { backendUrl } = useAdminContext();
  const [open, setIsOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const handleDownload = (date: string) => {
    const doc = new jsPDF();
    const appointmentsForDate = appointments.filter(appointment => {
      const [day, monthYear] = appointment.Slotdate.split(" ");
      const [month, year] = monthYear.split("_");
      const appointmentDate = new Date(Number(year), Number(month) - 1, Number(day));
      return appointmentDate.toISOString().split('T')[0] === date;
    });

    const tableData = appointmentsForDate.map(app => ({
      doctor: `${app.doctor.name}\n${app.doctor.speciality}`,
      patient: app.user.name,
      phone: app.user.phoneno || 'N/A',
      time: app.timeSlot,
      amount: `₹${app.amount}`
    }));

    const headers = [['Doctor', 'Patient', 'Phone', 'Time', 'Amount']];
    const data = tableData.map(item => [
      item.doctor,
      item.patient,
      item.phone,
      item.time,
      item.amount
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 1.5,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    const dateString = new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    doc.save(`Appointments-${dateString}.pdf`);
  };

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grouped = appointments.reduce((acc, appointment) => {
      const [day, monthYear] = appointment.Slotdate.split(" ");
      const [month, year] = monthYear.split("_");
      const date = new Date(Number(year), Number(month) - 1, Number(day));

      if (date < today) return acc;

      const dateKey = date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(appointment);
      return acc;
    }, {} as { [key: string]: Appointment[] });

    // Sort dates and filter for next 7 days
    const sortedDates = Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .filter(d => {
        const diff = (new Date(d).getTime() - today.getTime()) / (1000 * 3600 * 24);
        return diff <= 7;
      });

    // Sort appointments within each date
    sortedDates.forEach(date => {
      grouped[date].sort((a, b) => {
        const getTime = (slot: string) => {
          const [time, period] = slot.split(' ')[0].split(/(?=[AP]M)/);
          const [hours, minutes] = time.split(':').map(Number);
          return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + minutes;
        };
        return getTime(a.timeSlot) - getTime(b.timeSlot);
      });
    });

    return { groupedAppointments: grouped, sortedDates };
  };

  const { groupedAppointments, sortedDates } = groupAppointmentsByDate(appointments);

  const formatGroupHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.toDateString() === today.toDateString()) return "Today's Appointments";
    if (date.getTime() - today.getTime() === 86400000) return "Tomorrow's Appointments";

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Delete appointment handlers
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/admin/deleteAppointmentAdmin/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      setAppointments(prev => prev.filter(a => a._id !== id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      toast.error("Error deleting appointment");
    }
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/admin/getAllAppointments`, {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching appointments");
      }
    };
    fetchAppointments();
  }, [backendUrl]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {sortedDates.map(date => (
              <div key={date} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {formatGroupHeader(date)}
                </h3>
                <div className="flex justify-end mb-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleDownload(date)}>
                    Download Pdf
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-300 mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Doctor
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Patient
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Time
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {groupedAppointments[date].map(appointment => (
                      <tr key={appointment._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={appointment.doctor.image}
                              alt={appointment.doctor.name}
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {appointment.doctor.name}
                              </div>
                              <div className="text-gray-500">
                                {appointment.doctor.speciality}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{appointment.user.name}</div>
                          <div className="text-gray-500">{appointment.user.phoneno}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">
                            {new Date(appointment.Slotdate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">{appointment.timeSlot}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ₹{appointment.amount}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => {
                              setAppointmentId(appointment._id);
                              setIsOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 py-2 mr-7"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Delete Appointment
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this appointment? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (appointmentId) handleDelete(appointmentId);
                      setIsOpen(false);
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-3 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 