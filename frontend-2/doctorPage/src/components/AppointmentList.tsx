// interface AppointmentListProps {
//     appointment: any;
//     onDelete: (id: string) => void;
//     onClick: (id: string) => void;
//   }
  
//   export default function AppointmentList({ appointment,onClick}: AppointmentListProps) {
//     const formatSlotDate = (slotDate: string) => {
//       const [day, rest] = slotDate.split(" ");
//       const [month, year] = rest.split("_");
//       const date = new Date(Number(year), Number(month) - 1, Number(day));
//       return date.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//       });
//     };
  
//     return (
//       <tr className="hover:bg-gray-50 transition-colors">
//         <td className="px-6 py-4 whitespace-nowrap">
//           <div className="flex items-center">
//             <img
//               className="h-10 w-10 rounded-full object-cover"
//               src={appointment.doctor.image}
//               alt={appointment.doctor.name}
//             />
//             <div className="ml-4">
//               <div className="text-sm font-medium text-gray-900">{appointment.doctor.name}</div>
//               <div className="text-sm text-gray-500">{appointment.doctor.speciality}</div>
//             </div>
//           </div>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap">
//           <div className="text-sm text-gray-900">{appointment.user.name}</div>
//           <div className="text-sm text-gray-500">Phone: {appointment.user.phoneno}</div>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap">
//           <div className="text-sm text-gray-900">{formatSlotDate(appointment.Slotdate)}</div>
//           <div className="text-sm text-gray-500">{appointment.timeSlot}</div>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
//           ₹{appointment.amount}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//           <button
//             className="text-red-600 hover:text-red-900"
//             onClick={() => onClick(appointment._id)}
//           >
//             Delete
//           </button>
//         </td>
//       </tr>
//     );
//   }
  