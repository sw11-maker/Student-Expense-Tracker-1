import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Expenses", href: "/expenses", icon: "receipt_long" },
  { label: "Income", href: "/income", icon: "savings" },
  { label: "Budgets", href: "/budgets", icon: "account_balance" },
  { label: "Reports", href: "/reports", icon: "insert_chart" },
  { label: "Resources", href: "/resources", icon: "school" },
  { label: "Profile", href: "/profile", icon: "person" },
];

const semesterNavItems: NavItem[] = [
  { label: "Fall 2025", href: "/semesters/fall-2025", icon: "calendar_today" },
  { label: "Add Semester", href: "/semesters/add", icon: "add_circle_outline" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-full overflow-y-auto">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="material-icons text-white text-xl">account_balance_wallet</span>
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">SJSU Budget</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center p-3 text-sm font-medium rounded-lg",
                location === item.href
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
              )}
            >
              <span className={cn(
                "material-icons mr-3",
                location === item.href ? "text-sidebar-primary" : "text-sidebar-foreground/60"
              )}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-sidebar-border">
          <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Semester Planning
          </h3>
          <div className="mt-2 space-y-1">
            {semesterNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center p-3 text-sm font-medium rounded-lg",
                  location === item.href
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                )}
              >
                <span className={cn(
                  "material-icons mr-3",
                  location === item.href ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
                <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
            >
              <span className="material-icons text-sm">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
