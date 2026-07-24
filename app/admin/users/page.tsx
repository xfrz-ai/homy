"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at?: string; // Might not exist on all profiles, but let's try
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // The profiles table usually contains public user info
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (!error && data) {
      setUsers(data as Profile[]);
    } else {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-none mb-2">Users Management</h1>
          <p className="text-sm text-slate-500">Manage registered users and customers</p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">All Users List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-4 font-medium px-4">User ID</th>
                <th className="pb-4 font-medium px-4">Full Name</th>
                <th className="pb-4 font-medium px-4">Email</th>
                <th className="pb-4 font-medium px-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50/80 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-4 font-mono text-xs text-slate-500">{user.id.substring(0, 8)}...</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{user.full_name || 'N/A'}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{user.email || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
