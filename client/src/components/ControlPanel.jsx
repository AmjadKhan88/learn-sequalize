import { Plus, RefreshCw, Search } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"


export default function ControlPanel({setEditingUser, setIsModalOpen}) {

    const handleAddUser = () => {
     setEditingUser(null)
     setIsModalOpen(true)
   }

   const [search,setSearch] = useState('');
   const [searchParams, setSearchParams] = useSearchParams();

const handleSearch = () => {
  // This updates the URL to ?query=your_input
  if(!search || search.trim() === ''){
    // 1. Create a copy or use the existing params object
    const newParams = new URLSearchParams(searchParams);
    
    // 2. Delete the specific key
    newParams.delete("search");
    
    // 3. Push the change to the URL
    setSearchParams(newParams);
  }else {
   setSearchParams({ "search": search });
  }
};

  const firstRemoveTheQuiryThenGitAllUsers = ()=> {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.delete("page");
    newParams.delete("limit");
    newParams.delete("sort");
    newParams.delete("role");
    setSearchParams(newParams);
    getAllUsers();
  }

  const {getAllUsers} = useUser();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button onClick={firstRemoveTheQuiryThenGitAllUsers} className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                <RefreshCw size={20} />
                Refresh Data
              </button>

              <div className="relative flex-1 md:flex-none md:w-96">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e=> setSearch(e.target.value)}
                  placeholder="Search users by name, email, or age..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Search
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddUser}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 w-full md:w-auto"
            >
              <Plus size={20} />
              Add New User
            </button>
          </div>
  )
}
