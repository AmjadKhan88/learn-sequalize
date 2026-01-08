import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {LogOut, Mail, User} from 'lucide-react'
import toast from "react-hot-toast";
import api from "../configs/Api";
import { Navigate } from "react-router-dom";


export default function Header() {
  const [show,setShow] = useState(false);
  const {auth,setAuth} = useAuth();

  const logout = async ()=> {
    if(window.confirm('Are you sure you want to logout?')){
    try {
      const {data} = await api.post('/api/auth/logout');
      if(data.success){
        setAuth(null)
        toast.success(data.message)
        return <Navigate to={'/login'} />
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error)
    }
  }
  }
  

  return (
    <div className="mb-8 flex justify-between">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage your users efficiently and effectively
        </p>
      </div>

      <div class="relative inline-block text-left">
        <button
          type="button"
          class="flex items-center focus:outline-none"
          // onClick={()=>setShow(!show)}
          onMouseEnter={()=>setShow(!show)}
        >
          <span className="w-10 h-10 p-1 rounded-full flex items-center justify-center bg-cyan-600 text-white border border-gray-300 shadow">{auth?.name[0].toUpperCase() || 'P'}</span>
        </button>

        {show && <div
          onMouseLeave={()=>setShow(!show)}
          class="absolute right-0 z-10 mt-2 w-48 md:w-52 origin-top-right rounded-md bg-cyan-600  py-1 shadow-lg ring-black "
        >
          <div class="px-4 py-2 text-xs text-white/90">Manage Account</div>

          <a
            
            class="block px-4 pt-2 text-sm text-white "
          >
             {auth?.name}
          </a>
          <a
            
            class="block px-4 mb-3 text-xs text-white"
          >
             {auth?.email}
          </a>

          <hr class=" border-gray-200 mt-8" />

            <button
              type="submit"
              class="flex gap-1 items-center text-white w-full text-left px-4 cursor-pointer m-0 py-2 text-sm hover:text-red-600 hover:bg-gray-100"
              onClick={logout}
            >
             <LogOut size={16} strokeWidth={0.75}/> Sign out
            </button>
        </div>
      }
      </div>
    </div>
  );
}
