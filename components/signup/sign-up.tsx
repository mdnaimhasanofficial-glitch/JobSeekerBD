"use client"

import React, { useState } from "react"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required."
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!formData.password) {
      newErrors.password = "Password is required."
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password."
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    return newErrors
  }

  const handleChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      callbackURL: "/",
    })

    if (error) {
      setApiError(error.message ?? "Something went wrong. Please try again.")
    }

    setLoading(false)
    console.log("Signup form data:", signUpResponse, error, formData)
  }

  return (
    <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden bg-white px-4 py-5">
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
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {apiError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
              >
                {apiError}
              </div>
            )}
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
                  value={formData.name}
                  onChange={handleChange("name")}
                  aria-invalid={!!errors.name}
                  className={cn(
                    "h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-indigo-500",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <FieldError className="text-xs">{errors.name}</FieldError>
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
                  value={formData.email}
                  onChange={handleChange("email")}
                  aria-invalid={!!errors.email}
                  className={cn(
                    "h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-indigo-500",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <FieldError className="text-xs">{errors.email}</FieldError>
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
                  value={formData.password}
                  onChange={handleChange("password")}
                  aria-invalid={!!errors.password}
                  className={cn(
                    "h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-indigo-500",
                    errors.password &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <FieldError className="text-xs">{errors.password}</FieldError>
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
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  className={cn(
                    "h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-indigo-500",
                    errors.confirmPassword &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <FieldError className="text-xs">
                  {errors.confirmPassword}
                </FieldError>
              </Field>

              {/* Buttons & Actions */}
              <FieldGroup className="space-y-3 pt-2">
                <Field className="space-y-3">
                  {/* Create Account Gradient Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-indigo-400/30 bg-linear-to-r from-indigo-500 to-purple-600 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Creating account..." : "Create Account"}
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
