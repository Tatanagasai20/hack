'use client';

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  AlertCircle,
  Radio,
  Camera,
  BarChart3,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Map View', href: '/map', icon: Map },
  { name: 'Incidents', href: '/incidents', icon: AlertCircle },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Sensors', href: '/sensors', icon: Radio },
  { name: 'CCTV', href: '/cctv', icon: Camera },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("urbanopsUser");
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-foreground shadow-md">
      {/* --- Header --- */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI Urban Ops</h1>
            <p className="text-xs text-muted-foreground">Smart City Control</p>
          </div>
        </div>
      </div>

      {/* --- Navigation Links --- */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* --- Logout Button --- */}
      <div className="border-t border-border p-4 bg-card">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive-foreground hover:bg-destructive transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
