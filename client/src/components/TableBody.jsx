import { Edit2, Eye, Trash2 } from "lucide-react";
import {useUser} from "../context/UserContext"
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../configs/Api";

export default function TableBody({ user, setEditingUser, setIsModalOpen,handleViewDetails }) {
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const {users,setUsers} = useUser();
  const [loading,setLoading] = useState(false);

  const handleDelete = async (id) => {
    setLoading(true)
      try {
        const {data} = await api.delete(`/api/users/${id}`)
        if(data.success){
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
  return (
    <tr
      key={user.id}
      className="hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="py-4 px-6">
        <div className="flex items-center">
          {user.avatar ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-blue-400 to-blue-500">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")} // Simple hide on error
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 font-bold text-white">
              {user.name
                ? user.name[0].toUpperCase()
                : "?"}
            </div>
          )}

          <div className="ml-4" onClick={()=>handleViewDetails(user)}>
            <div className="font-medium flex text-gray-900 text-nowrap">{user.name} <Eye className="font-normal text-sm text-green-800 ms-2 cursor-pointer hover:text-indigo-800" width={20} strokeWidth={0.75}/></div>
            <div className="text-xs sm:text-sm text-gray-500">{user.company}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="text-gray-800">{user.email}</div>
        <div className="text-sm text-gray-500">{user.phone}</div>
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex text-nowrap text-center  px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {user.age} years
        </span>
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex text-nowrap items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
          {user.role}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditUser(user)}
            className="flex items-center gap-2 px-2.5 py-0.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button disabled={loading} onClick={()=> handleDelete(user.id)} className="flex items-center gap-2 px-2.5 py-0.5 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow">
            {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />: <><Trash2 size={16} />
            Delete </>}
          </button>
        </div>
      </td>
    </tr>
  );
}
