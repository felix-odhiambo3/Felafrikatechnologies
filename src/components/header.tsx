'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin/suggest-projects', label: 'AI Suggester' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    className,
  }: {
    href: string;
    label: string;
    className?: string;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'text-sm font-medium transition-colors hover:text-accent',
          isActive ? 'text-accent' : 'text-foreground/80',
          className,
        )}
        onClick={() => setIsOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 p-4">
                <Link
                  href="/"
                  className="mr-6 flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Logo />
                </Link>
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      className="text-lg"
                    />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
