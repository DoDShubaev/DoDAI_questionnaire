import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ClipboardList, LayoutDashboard } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { title: "שאלון", url: "/", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl" style={{ direction: 'rtl' }}>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              {/* Nav items */}
              <div className="hidden sm:flex sm:gap-x-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-emerald-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      <item.icon className="w-4 h-4 ml-2" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* App Title */}
              <div className="flex items-center">
              <h1 className="text-lg font-semibold text-slate-700">AI Navigator</h1>
              </div>
          </div>
        </nav>
      </header>
      <main style={{ direction: 'rtl' }}>
        {children}
      </main>
    </div>
  );
}
