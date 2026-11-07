"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <div className="relative flex w-130 items-center justify-center overflow-hidden bg-white px-4 py-5">
      {/* Background Soft Glow Effects for White Theme */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-80 w-100 rounded-full bg-purple-500/10 blur-3xl" />

      <Card
        {...props}
        className="relative z-10 w-full max-w-md rounded-3xl border-zinc-200 bg-white p-4 text-zinc-900 shadow-2xl"
      >
        <CardHeader className="space-y-1.5 pb-6 text-center">
          {/* Logo / Brand Accent */}
          <div className="mb-2 flex items-center justify-center gap-1 text-2xl font-black tracking-tight select-none">
            <span className="text-sky-500">JobSeeker</span>
            <span className="font-extrabold text-orange-500">BD</span>
            <span className="ml-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            Join JobSeekerBD and find your dream job today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <FieldGroup className="space-y-4">
              {/* Full Name */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="name"
                  className="text-xs font-semibold tracking-wider text-zinc-700 uppercase"
                >
                  Full Name
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-indigo-500"
                />
              </Field>

              {/* Email */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-semibold tracking-wider text-zinc-700 uppercase"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-indigo-500"
                />
                <FieldDescription className="text-xs text-zinc-400">
                  We&apos;ll use this to contact you. Never shared with anyone.
                </FieldDescription>
              </Field>

              {/* Password */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wider text-zinc-700 uppercase"
                >
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-indigo-500"
                />
                <FieldDescription className="text-xs text-zinc-400">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              {/* Confirm Password */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="confirm-password"
                  className="text-xs font-semibold tracking-wider text-zinc-700 uppercase"
                >
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-indigo-500"
                />
              </Field>

              {/* Buttons & Actions */}
              <FieldGroup className="space-y-3 pt-2">
                <Field className="space-y-3">
                  {/* Create Account Gradient Button */}
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Create Account
                  </Button>

                  {/* Sign up with Google Button */}
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 w-full rounded-xl border-zinc-200 bg-white font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Sign up with Google
                  </Button>

                  {/* Already have an account footer */}
                  <FieldDescription className="px-6 pt-2 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <a
                      href="/sign-in"
                      className="font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-500"
                    >
                      Sign in
                    </a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
