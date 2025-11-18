'use client';

import Link from 'next/link';

export default function Footer({ 
  brand = "ST PIZZA", 
  showLinks = true, 
  showSocials = true 
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t mt-12 pt-8 pb-4 text-center text-gray-600">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo / Brand */}
        <div className="text-lg font-semibold text-primary">
          © {year} {brand}. All rights reserved.
        </div>

        {/* Navigation links (optional) */}
        {showLinks && (
          <div className="flex gap-6 text-sm justify-center">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        )}

        {/* Social icons (optional) */}
        {showSocials && (
          <div className="flex gap-4 justify-center">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <svg className="w-5 h-5 fill-gray-600 hover:fill-primary transition-colors" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.6 9.87v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.1c-1 0-1.3.6-1.3 1.2v1.8h2.5l-.4 3h-2v7A10 10 0 0 0 22 12z"/>
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <svg className="w-5 h-5 fill-gray-600 hover:fill-primary transition-colors" viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.8-.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
