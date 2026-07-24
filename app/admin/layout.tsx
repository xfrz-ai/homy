"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Search, 
  Bell, 
  Share2, 
  Settings, 
  HelpCircle,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;

    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (user && profile && profile.role !== 'admin' && pathname !== '/admin/login') {
      alert("Akses ditolak. Hanya admin yang dapat mengakses halaman ini.");
      signOut().then(() => router.push('/admin/login'));
    }
  }, [user, profile, loading, router, pathname, signOut]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">Loading...</div>;
  }

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#f4f2ee] font-sans">{children}</div>;
  }

  if (!user) {
    return null; 
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
  const avatarUrl = user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}&backgroundColor=b6e3f4`;

  return (
    <div className="flex min-h-screen bg-[#f4f2ee] text-slate-800 font-sans selection:bg-[#efe8fc]">
      {/* Sidebar */}
      <div className="w-64 flex flex-col py-6 px-4 hidden md:flex h-screen sticky top-0">
        <div className="flex items-center px-4 mb-8">
          <img src="/assets/logo.png" alt="Homy Logo" className="h-6 w-6 object-contain mr-2" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <h1 className="text-xl font-bold text-slate-900">Homy</h1>
        </div>
        
        <div className="px-4 mb-3">
          <p className="text-xs font-semibold text-slate-400 tracking-wider">GENERAL</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-colors",
                  isActive 
                    ? "bg-[#ede4fa] text-slate-900 font-semibold shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-slate-900" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#f4f2ee] p-4 flex justify-between items-center z-10">
          <div className="flex items-center">
            <img src="/assets/logo.png" alt="Homy Logo" className="h-5 w-5 object-contain mr-2" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <h1 className="text-lg font-bold text-slate-900">Homy</h1>
          </div>
          <button className="text-slate-900">Menu</button>
        </div>
        
        <main className="flex-1 p-4 md:p-8 pt-4 overflow-auto">
          {/* Top Header Row */}
          <header className="hidden md:flex justify-between items-center mb-8">
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className="block w-full pl-11 pr-3 py-2.5 bg-white border-0 rounded-full text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-purple-200 outline-none shadow-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4 relative">
              <div 
                className="flex items-center space-x-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img 
                  src={avatarUrl} 
                  alt="User avatar" 
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 leading-none">{displayName}</span>
                  <span className="text-[10px] text-slate-500">Administrator</span>
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-slate-100 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
