'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Users, Calendar, Pill, Activity, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', path: '/doctors', icon: User },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Prescriptions', path: '/prescriptions', icon: Pill },
  { name: 'Symptoms', path: '/symptoms', icon: Activity },
  { name: 'Logs', path: '/logs', icon: FileText },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/" className="block">
            <h1 className="text-2xl font-bold text-[#024059]">ClinicFlow <span className="text-[#04BF8A]">AI</span></h1>
          </Link>
          <div className="mt-4 -mx-6">
            <div className="h-px bg-gray-200" />
          </div>
        </div>
        <nav className="mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors relative ${
                  isActive ? 'bg-gray-50 text-[#04BF8A] font-medium' : ''
                }`}
              >
                {isActive && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#024059] rounded-full" />
                )}
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h1 className="text-xl font-light text-gray-800">ClinicFlow AI Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}