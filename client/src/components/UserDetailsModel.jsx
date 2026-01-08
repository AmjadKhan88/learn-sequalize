import {
  Building,
  Calendar,
  CheckCircle,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  X,
  Award,
  Shield,
  Bell,
  Briefcase,
  Home,
  Link,
  Smartphone,
  MailCheck,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import axios from "axios";



export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  handleEditUser
//   onDelete,
}) {
  const {users,setUsers} = useUser();
  const [loading,setLoading] = useState(false);

  const handleDelete = async (id) => {
    setLoading(true)
      try {
        const {data} = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
        if(data.success){
          onClose()
          setUsers(users.filter(user => user.id !== id))
          toast.success(data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false)
      }
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300">
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                  {user.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {user.role}
                    </span>
                    {user.isVerified && (
                      <span className="text-sm bg-emerald-500/20 text-emerald-100 px-3 py-1 rounded-full flex items-center">
                        <MailCheck size={12} className="mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={()=>handleEditUser(user)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200 group"
                  title="Edit User"
                >
                  <Edit size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 text-indigo-600" size={20} />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">{user.age} years</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{user.address || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Globe size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={user.website || undefined}
                            onClick={(e) => !user.website && e.preventDefault()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium cursor-not-allowed text-indigo-600 hover:text-indigo-800 ${user.website && 'hover:underline cursor-pointer'}`}
                          >
                            {user.website ? "Visit website" : "Not provided"}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="mr-2 text-blue-600" size={20} />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Building size={18} className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{user.company || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Award size={18} className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium">{user.role || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Actions */}
              <div className="space-y-6">
                {/* User Status Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="mr-2 text-gray-600" size={20} />
                    Account Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Verified</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                        }`}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notifications</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.receiveNotifications
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {user.receiveNotifications ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Bell className="mr-2 text-emerald-600" size={20} />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={()=>handleEditUser(user)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-200 group"
                    >
                      <Edit size={18} className="group-hover:scale-110 transition-transform" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${user.email}`, "_blank")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 group"
                    >
                      <Mail size={18} className="group-hover:scale-110 transition-transform" />
                      Send Email
                    </button>
                    <button
                      onClick={()=>handleDelete(user.id)}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                          Delete User
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                {(user.createdAt || user.updatedAt) && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                    <div className="space-y-2">
                      {user.createdAt && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-2" />
                          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {user.updatedAt && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Edit size={14} className="mr-2" />
                          <span>Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Badges */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Badges</h3>
              <div className="flex flex-wrap gap-3">
                {user.isActive && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200">
                    <CheckCircle size={16} />
                    <span className="font-medium">Active Member</span>
                  </div>
                )}
                {user.isVerified && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
                    <Shield size={16} />
                    <span className="font-medium">Verified Account</span>
                  </div>
                )}
                {user.receiveNotifications && (
                  <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200">
                    <Bell size={16} />
                    <span className="font-medium">Notifications On</span>
                  </div>
                )}
                {user.role && (
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full border border-amber-200">
                    <Award size={16} />
                    <span className="font-medium">{user.role}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-200">
                    <Building size={16} />
                    <span className="font-medium">{user.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <Smartphone size={16} className="mr-2" />
                <span>User ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.open(`tel:${user.phone}`, "_blank")}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={!user.phone}
                >
                  <Phone size={18} />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${user.phone.replace(/\D/g, '')}`, "_blank")}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-800 transition-colors"
                  disabled={!user.phone}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => window.open(user.website || "#", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                  disabled={!user.website}
                >
                  <Link size={18} />
                  <span>Website</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}