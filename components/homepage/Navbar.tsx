"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { data: session } = useSession()

  const user = session?.user

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleSignOut = async () => {
    await signOut()
    setProfileOpen(false)
    setIsOpen(false)
  }

  const userName = user?.name || "User"
  const firstLetter = userName.charAt(0).toUpperCase()

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Company", href: "/company" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <header className="relative z-50 mx-auto w-full max-w-7xl px-4 py-5">
      <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141416]/95 px-5 py-3.5 shadow-xl shadow-black/20 backdrop-blur-xl md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-black tracking-tight"
        >
          <span className="text-sky-400">JobSeeker</span>
          <span className="text-orange-500">BD</span>
          <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm font-medium text-zinc-400">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-white"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-px bg-zinc-700" />

          {/* Authentication */}
          {user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-all hover:border-indigo-400/40 hover:bg-white/10"
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                    {firstLetter}
                  </div>

                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#141416] bg-green-500" />
                </div>

                <div className="text-left">
                  <p className="max-w-32 truncate text-sm font-semibold text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-zinc-500">{session?.user.role}</p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute top-16 right-0 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#19191d] shadow-2xl shadow-black/50">
                    {/* Profile Header */}
                    <div className="border-b border-white/10 bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                          {firstLetter}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {userName}
                          </p>
                          <p className="truncate text-xs text-zinc-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Active Account
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                        My Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <User className="h-4 w-4 text-sky-400" />
                        My Profile
                      </Link>

                      <Link
                        href="/saved-jobs"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Bookmark className="h-4 w-4 text-orange-400" />
                        Saved Jobs
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Settings className="h-4 w-4 text-purple-400" />
                        Account Settings
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Sign In
              </Link>

              <Button className="rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:from-indigo-600 hover:to-purple-700">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="rounded-lg p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full right-4 left-4 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#17171b] p-5 shadow-2xl md:hidden">
          {/* Mobile User Profile */}
          {user && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                {firstLetter}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{userName}</p>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          )}

          {/* Mobile Links */}
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={toggleMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth */}
          <div className="mt-4 border-t border-white/10 pt-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                  My Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4 text-sky-400" />
                  My Profile
                </Link>

                <Link
                  href="/saved-jobs"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <Bookmark className="h-4 w-4 text-orange-400" />
                  Saved Jobs
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/sign-in"
                  onClick={toggleMenu}
                  className="rounded-xl py-2 text-center text-sm font-medium text-indigo-400 hover:bg-white/5"
                >
                  Sign In
                </Link>

                <Button className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 font-semibold text-white">
                  <Link href="/sign-up" onClick={toggleMenu}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
