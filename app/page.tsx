'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-2 py-12">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Nurox</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1600px] mx-auto px-2">
        <main className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center py-12 md:py-20">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Seamless Healthcare Management Platform
            </h2>
            <p className="text-xl text-gray-600">
              Connect doctors, pharmacies, labs, and insurers in one integrated system for efficient healthcare service delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <LogIn className="h-5 w-5" />
                  Access Dashboard
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative h-[500px] w-full">
            <Image 
              src="/assets/images/health.png" 
              alt="Healthcare Management Platform"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </main>
        
        <section className="py-16 md:py-24">
          <h3 className="text-2xl font-semibold text-center mb-12">Trusted by Healthcare Providers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image 
                  src={`/assets/images/logo${i}.png`} 
                  alt={`Healthcare Logo ${i}`}
                  width={400}
                  height={80}
                  className="h-12 w-48 object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <footer className="bg-gray-50 py-8 mt-10">
        <div className="max-w-[1600px] mx-auto px-2 text-center text-gray-500">
          <p>© 2025 Nurox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}