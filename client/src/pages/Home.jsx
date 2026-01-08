import { useState } from 'react'
import UserFormModal from '../components/UserFormModal'
import ControlPanel from '../components/ControlPanel'
import Header from '../components/Header'
import Pagination from '../components/Pagination'
import StatsCards from '../components/StatsCards'
import TableBody from '../components/TableBody'
import TableHead from '../components/TableHead'
import { useUser } from '../context/UserContext'
import UserDetailsModal from '../components/UserDetailsModel'

// Updated Home Component with Modal Integration
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

    const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

    const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const {loading,users} = useUser();


  return(
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header/>

          {/* Control Panel */}
          <ControlPanel setEditingUser={setEditingUser} setIsModalOpen={setIsModalOpen}/>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHead/>
               {loading ? <div className='h-[30vh] flex justify-center items-center'><span>Loading...</span></div>  : <tbody className="divide-y divide-gray-100">
                  {users?.map((user) => (
                    <TableBody key={user.id} handleViewDetails={handleViewDetails} user={user} setEditingUser={setEditingUser} setIsModalOpen={setIsModalOpen}/>
                  ))}
                </tbody>
                }
              </table>
            </div>
            
            {/* pagination  */}
            <Pagination users={users} />
          </div>

          {/* Stats Cards */}
           <StatsCards users={users}/>
        </div>
      </div>
        {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          user={selectedUser}
          handleEditUser={handleEditUser}
          // onEdit={handleEdit}
          // onDelete={handleDelete}
        />
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userData={editingUser}
      />
    </>
  )
}