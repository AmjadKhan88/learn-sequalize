/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  Building,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import api from "../configs/Api";
function UserFormModal({ isOpen, onClose, userData = null }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: null,
      name: "",
      email: "",
      age: "",
      phone: "",
      address: "",
      company: "",
      role: "",
      website: "",
      avatar: null,
      isActive: false,
      isVerified: false,
      receiveNotifications: false,
    },
  });

  
  const [previewAvatar, setPreviewAvatar] = useState("");
  const {users,setUsers} = useUser();
  
  // Reset form when userData changes or modal opens/closes

  useEffect(() => {
    if (userData) {
      reset({
        id: userData.id || null,
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age || "",
        phone: userData.phone || "",
        address: userData.address || "",
        company: userData.company || "",
        role: userData.role || "",
        website: userData.website || "",
        avatar: null,
        isActive: userData.isActive || false,
        isVerified: userData.isVerified || false,
        receiveNotifications: userData.receiveNotifications || false,
      });
      if (userData.avatar) {
        setPreviewAvatar(userData.avatar);
      } else {
        setPreviewAvatar("");
      }
    } else {
      reset();
      setPreviewAvatar("");
    }
  }, [userData, reset, isOpen]);

  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Update form value
      onChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (onChange) => {
    onChange(null);
    setPreviewAvatar("");
  };

  const onSubmit = async (data) => {
    try {

      // Create FormData for file upload
      const formData = new FormData();

      // Append all form fields except avatar
      Object.keys(data).forEach((key) => {
        if (key === "avatar") {
          if (data[key] instanceof File) {
            // Append the file
            formData.append("avatar", data[key]);
          }
          // Don't append if it's null (no file selected)
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key].toString());
        } else {
          formData.append(key, data[key] || "");
        }
      });

      // If editing, include the user ID and existing avatar URL
      if (userData?.id) {
        formData.append("id", userData.id);
        if (userData.avatar && !data.avatar) {
          formData.append("existingAvatar", userData.avatar);
        }
      }

     

          const response = userData?.id
      ? await api.put(
          `/api/users/${userData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      : await api.post(`/api/users`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      if (response.data.success) {
        toast.success(response.data.message);
        if(response.data.state === 'create'){
          setUsers([...users,response.data.user])
        }
        if(response.data.state === 'update'){
          setUsers(users.map(user => user.id === response?.data?.user?.id ? response.data.user : user))
        }
        // Close modal on success
        reset();
        setPreviewAvatar("");
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (!isOpen) return null;

const handleCancel = () => {
  // Reset form with default values
  reset({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    company: "",
    role: "",
    website: "",
    avatar: null,
    isActive: false,
    isVerified: false,
    receiveNotifications: false,
  });
  
  // Clear preview avatar
  setPreviewAvatar("");
  
  // Close modal
  onClose();
};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {userData ? "Edit User Profile" : "Add New User"}
                </h2>
                <p className="text-gray-300 mt-1">
                  {userData
                    ? "Update user information below"
                    : "Fill in the details to add a new user"}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6 md:p-8">
            {/* Server Error Display */}
           

            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              {/* Avatar & Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Avatar Upload */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Picture
                    </label>
                    <div className="relative">
                      <Controller
                        name="avatar"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <div className="relative group">
                              <div className="w-48 h-48 mx-auto rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors duration-200 overflow-hidden">
                                {previewAvatar ? (
                                  <div className="relative w-full h-full">
                                    <img
                                      src={previewAvatar}
                                      alt="Avatar preview"
                                      className="w-full h-full rounded-2xl object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                                      <Upload
                                        className="text-white"
                                        size={32}
                                      />
                                      <span className="text-white ml-2">
                                        Change
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <User
                                      size={64}
                                      className="text-blue-400 mb-4"
                                    />
                                    <span className="text-blue-600 font-medium">
                                      Click to upload
                                    </span>
                                    <span className="text-sm text-gray-500 mt-2">
                                      PNG, JPG up to 2MB
                                    </span>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, onChange)}
                                disabled={isSubmitting}
                              />
                            </div>

                            {previewAvatar && (
                              <button
                                type="button"
                                onClick={() => removeAvatar(onChange)}
                                className="mt-3 w-48 mx-auto flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                disabled={isSubmitting}
                              >
                                <X size={16} />
                                Remove photo
                              </button>
                            )}

                            <div className="mt-3 text-center">
                              <p className="text-xs text-gray-500">
                                Recommended: 500×500px, max 2MB
                              </p>
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User size={16} className="mr-2 text-blue-500" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Mail size={16} className="mr-2 text-blue-500" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        Age *
                      </label>
                      <input
                        type="number"
                        {...register("age", {
                          required: "Age is required",
                          min: {
                            value: 1,
                            message: "Age must be at least 1",
                          },
                          max: {
                            value: 120,
                            message: "Age must be at most 120",
                          },
                          valueAsNumber: true,
                        })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="25"
                        disabled={isSubmitting}
                      />
                      {errors.age && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.age.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Phone size={16} className="mr-2 text-blue-500" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: "Invalid phone number format",
                          },
                        })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      Address
                    </label>
                    <textarea
                      {...register("address")}
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="123 Main Street, New York, NY 10001"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building size={16} className="mr-2 text-blue-500" />
                    Company
                  </label>
                  <input
                    type="text"
                    {...register("company")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tech Corporation Inc."
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2 text-blue-500" />
                    Role / Position
                  </label>
                  <select
                    {...register("role")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a role</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Marketing Specialist">
                      Marketing Specialist
                    </option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="System Administrator">
                      System Administrator
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Website */}
              <div className="mb-8">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="mr-2 text-blue-500" />
                  Website
                </label>
                <input
                  type="url"
                  {...register("website", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.website.message}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                    <span className="ml-3 text-gray-700">Active User</span>
                  </label>

                  <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <input
                      type="checkbox"
                      {...register("isVerified")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                    <span className="ml-3 text-gray-700">Email Verified</span>
                  </label>

                  <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <input
                      type="checkbox"
                      {...register("receiveNotifications")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                    <span className="ml-3 text-gray-700">
                      Receive Notifications
                    </span>
                  </label>
                </div>
              </div>

              {/* Hidden submit button for form validation */}
              <button type="submit" className="hidden" />
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-emerald-600"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {userData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {userData ? "Update User" : "Create User"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFormModal;
