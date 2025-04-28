import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Expenses", href: "/expenses", icon: "receipt_long" },
  { label: "Income", href: "/income", icon: "savings" },
  { label: "Budgets", href: "/budgets", icon: "account_balance" },
  { label: "Profile", href: "/profile", icon: "person" },
];

export default function MobileNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-neutral-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="material-icons text-white text-xl">account_balance_wallet</span>
            </div>
            <h1 className="text-lg font-bold text-neutral-800">SJSU Budget</h1>
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100">
                <span className="material-icons">menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                      <span className="material-icons text-white text-xl">account_balance_wallet</span>
                    </div>
                    <h1 className="text-lg font-bold">SJSU Budget</h1>
                  </div>
                </SheetTitle>
              </SheetHeader>
              
              {user && (
                <div className="border-b border-neutral-200 py-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>
              )}
              
              <div className="py-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center py-2 px-3 text-base font-medium rounded-lg",
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      <span className={cn(
                        "material-icons mr-3",
                        location === item.href ? "text-primary" : "text-neutral-500"
                      )}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Semester Planning
                  </h3>
                  <Link
                    href="/semesters/fall-2025"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 px-3 text-base font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
                  >
                    <span className="material-icons mr-3 text-neutral-500">calendar_today</span>
                    Fall 2025
                  </Link>
                  <Link
                    href="/semesters/add"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 px-3 text-base font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
                  >
                    <span className="material-icons mr-3 text-neutral-500">add_circle_outline</span>
                    Add Semester
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Other
                  </h3>
                  <Link
                    href="/reports"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 px-3 text-base font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
                  >
                    <span className="material-icons mr-3 text-neutral-500">insert_chart</span>
                    Reports
                  </Link>
                  <Link
                    href="/resources"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 px-3 text-base font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
                  >
                    <span className="material-icons mr-3 text-neutral-500">school</span>
                    Resources
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center py-2 px-3 text-base font-medium rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <span className="material-icons mr-3 text-red-600">logout</span>
                    Log out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-neutral-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex flex-col items-center justify-center",
                location === item.href ? "text-primary" : "text-neutral-500"
              )}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
