import React from 'react'

export default function StatsCards({users}) {
  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="text-blue-100">Total Users</div>
              <div className="text-sm text-blue-200 mt-2">↗ 12% increase from last month</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">94%</div>
              <div className="text-emerald-100">Active Users</div>
              <div className="text-sm text-emerald-200 mt-2">↗ 8% increase from last month</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">
                {(users.reduce((sum, user) => sum + user.age, 0) / users.length).toFixed(1)}
              </div>
              <div className="text-purple-100">Average Age</div>
              <div className="text-sm text-purple-200 mt-2">→ Stable compared to last month</div>
            </div>
          </div>
  )
}
