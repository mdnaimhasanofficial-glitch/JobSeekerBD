"use client"

import React from "react"
import { cn } from "@/lib/utils"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-4 py-5",
        className
      )}
      {...props}
    >
      {/* Background Soft Glow Effects matching SignupForm */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-80 w-120 rounded-full bg-purple-500/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md rounded-3xl border-zinc-200 bg-white p-4 text-zinc-900 shadow-2xl">
        <CardHeader className="space-y-1.5 pb-6 text-center">
          {/* Logo / Brand Accent */}
          <div className="mb-2 flex items-center justify-center gap-1 text-2xl font-black tracking-tight select-none">
            <span className="text-sky-500">JobSeeker</span>
            <span className="font-extrabold text-orange-500">BD</span>
            <span className="ml-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            Login to your account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            Enter your email below to login to your JobSeekerBD account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <FieldGroup className="space-y-4">
              {/* Email Field */}
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
              </Field>

              {/* Password Field + Forgot Password Link */}
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-xs font-semibold tracking-wider text-zinc-700 uppercase"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-indigo-500"
                />
              </Field>

              {/* Buttons & Actions */}
              <FieldGroup className="space-y-3 pt-2">
                <Field className="space-y-3">
                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Login
                  </Button>

                  {/* Login with Google Button */}
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 w-full rounded-xl border-zinc-200 bg-white font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Login with Google
                  </Button>

                  {/* Sign Up Redirect Link */}
                  <FieldDescription className="px-6 pt-2 text-center text-sm text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/sign-up"
                      className="font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-500"
                    >
                      Sign up
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
