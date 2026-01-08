
export default function TableHead() {
  return (
     <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <tr>
                        <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Name</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Email</th>
                        <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider">Age</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Role</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
  )
}
