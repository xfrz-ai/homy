"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users</h1>
      </div>

      <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[120px] font-semibold text-slate-700">User ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Full Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-slate-500">Loading users...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-slate-500">No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium font-mono text-xs text-slate-500">
                    {user.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
