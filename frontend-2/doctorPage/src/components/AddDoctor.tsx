import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import { useAdminContext } from "../context/AdminContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImageUpload = ({
  image,
  setImage,
}: {
  image: File | null;
  setImage: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setError("Please upload an image file (JPEG, PNG, GIF)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          return;
        }

        setError(null);
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
  });

  const removeImage = () => {
    setImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"}
          ${error ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-sm -mt-2 -mr-2"
            >
              <FiXCircle className="h-6 w-6 text-red-500 hover:text-red-600" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <>
                  <p className="text-blue-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface FormDataType {
  name: string;
  email: string;
  password: string;
  speciality: string;
  degree: string;
  experience: string;
  description: string;
  fee: number;
  address: string;
}

export default function AddDoctor() {
  const { backendUrl, token } = useAdminContext();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    speciality: "",
    degree: "",
    experience: "",
    description: "",
    fee: 0,
    address: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === "fee" ? String(value) : value);
    });
    data.append("role", "doctor");
    if (image) {
      data.append("image", image);
    }
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/admin/add-doctor`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);

      if (response.data.status === "success") {
        toast.success("Doctor added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          speciality: "",
          degree: "",
          experience: "",
          description: "",
          fee: 0,
          address: "",
        });
        setImage(null);
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error("Error adding doctor. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter doctor's full name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter professional email address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Create a strong password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Speciality
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Cardiologist, Pediatrician"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.speciality}
              onChange={(e) =>
                setFormData({ ...formData, speciality: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degree
            </label>
            <input
              type="text"
              required
              placeholder="e.g., MBBS, MD, MS"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              required
              placeholder="Years of medical practice"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consultation Fee
          </label>
          <input
            type="number"
            required
            placeholder="Amount in INR"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData.fee}
            onChange={(e) =>
              setFormData({ ...formData, fee: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Clinic Address
          </label>
          <textarea
            required
            placeholder="Full clinic address with landmark"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            placeholder="Brief about doctor's expertise and qualifications"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <ImageUpload image={image} setImage={setImage} />
          <p className="mt-1 text-sm text-gray-500">
            Upload professional profile photo (Recommended: 300x300px)
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Add Doctor
      </button>
      <ToastContainer />
    </form>
  );
}
