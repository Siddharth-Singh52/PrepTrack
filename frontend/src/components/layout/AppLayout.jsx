import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';

export const AppLayout = ({ children, title = 'PrepTrack' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
