import Link from 'next/link';
import { Github, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';
import { Logo } from './logo';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185.2 199.31V296.2a87.63 87.63 0 1 0 89.44 89.44V128A210.1 210.1 0 0 1 448 209.9z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Crafting bespoke digital solutions that drive growth and inspire users.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-accent">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-accent">
                About
              </Link>
              <Link href="/projects" className="text-muted-foreground hover:text-accent">
                Projects
              </Link>
              <Link href="/resume" className="text-muted-foreground hover:text-accent">
                Resume
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-accent">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold text-lg mb-4">Follow Me</h3>
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <Link
                href="https://github.com/felix-odhiambo3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com/in/felix-odhiambo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61582697134450"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://vm.tiktok.com/ZMHcUhssGBQ1k-s0wN0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent"
              >
                <TikTokIcon className="h-5 w-5" />
                <span className="sr-only">TikTok</span>
              </Link>
              <Link
                href="https://www.youtube.com/@odhiambofelix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Felafrika Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
