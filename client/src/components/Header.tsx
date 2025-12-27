import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Microscope, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tests", label: "Tests" },
    { href: "/packages", label: "Packages" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Microscope className="h-8 w-8 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl leading-none text-primary">Archana</span>
            <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Pathology Lab</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="font-bold shadow-md hover:shadow-lg transition-all">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium px-4 py-2 rounded-lg ${
                location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-4 flex items-center justify-between px-4">
             <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({itemCount})</span>
             </Link>
             {!user && (
               <div className="flex gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm">Register</Button>
                  </Link>
               </div>
             )}
          </div>
        </div>
      )}
    </header>
  );
}
