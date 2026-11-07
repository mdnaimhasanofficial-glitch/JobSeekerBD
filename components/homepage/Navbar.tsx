"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="relative z-50 mx-auto w-full max-w-7xl px-4 py-6">
      <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141416]/90 px-6 py-3.5 shadow-2xl backdrop-blur-md">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-black tracking-tight select-none"
        >
          <span className="text-sky-400">JobSeeker</span>
          <span className="font-extrabold text-orange-500">BD</span>
          <span className="ml-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        </Link>

        {/* Right Content Section (Desktop) */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Nav Links */}
          <ul className="flex items-center gap-7 text-sm font-medium text-zinc-300">
            <li>
              <Link
                href="/jobs"
                className="transition-colors duration-200 hover:text-white"
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/company"
                className="transition-colors duration-200 hover:text-white"
              >
                Company
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="transition-colors duration-200 hover:text-white"
              >
                Pricing
              </Link>
            </li>
          </ul>

          {/* Separator Line */}
          <div className="h-5 w-px bg-zinc-700/80" />

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-indigo-400 transition-colors duration-200 hover:text-indigo-300"
            >
              Sign In
            </Link>

            <Button className="rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-2 font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="p-1 text-zinc-300 hover:text-white focus:outline-none md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Side Menu Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all md:hidden">
          <div className="flex h-full w-3/4 max-w-xs animate-in flex-col justify-between border-l border-white/10 bg-[#141416] p-6 shadow-2xl duration-300 slide-in-from-right">
            {/* Top Close / Header */}
            <div>
              <div className="mb-8 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={toggleMenu}
                  className="flex items-center gap-1 text-xl font-black tracking-tight"
                >
                  <span className="text-sky-400">JobSeeker</span>
                  <span className="font-extrabold text-orange-500">BD</span>
                </Link>
                <button
                  onClick={toggleMenu}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <ul className="flex flex-col gap-5 text-base font-medium text-zinc-300">
                <li>
                  <Link
                    href="/jobs"
                    onClick={toggleMenu}
                    className="block transition-colors hover:text-white"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/company"
                    onClick={toggleMenu}
                    className="block transition-colors hover:text-white"
                  >
                    Company
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    onClick={toggleMenu}
                    className="block transition-colors hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Bottom Auth Actions */}
            <div className="flex flex-col gap-4 border-t border-zinc-800 pt-6">
              <Link
                href="/sign-in"
                onClick={toggleMenu}
                className="py-2 text-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </Link>
              <Button className="w-full rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 py-2.5 font-medium text-white shadow-lg">
                <Link href="/sign-up" onClick={toggleMenu}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
