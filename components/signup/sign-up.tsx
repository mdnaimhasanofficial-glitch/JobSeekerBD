"use client"

import React, { useState } from "react"
import {
  Users,
  UserRound,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import type { Role } from "@/lib/auth"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Role
}

type FormErrors = Partial<Record<keyof FormData, string>>

const ROLE_OPTIONS: {
  value: Role
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "seeker", label: "Job Seeker", icon: Users },
  { value: "recruiter", label: "Recruiter", icon: UserRound },
  { value: "admin", label: "Admin", icon: ShieldCheck },
]

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required."
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required."
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
      setApiError(null)
    }

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => ({ ...prev, role }))
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
      callbackURL: "http://localhost:3000/sign-in",
      role: formData.role,
    })

    if (error) {
      setApiError(error.message ?? "Something went wrong. Please try again.")
    }

    setLoading(false)
    console.log("Signup form data:", signUpResponse, error)
  }

  const inputClasses = (hasError?: string) =>
    `h-12 rounded-xl border bg-[#0c0c12] pl-11 text-zinc-100 text-sm transition-colors placeholder:text-zinc-500 focus-visible:ring-indigo-500/40 ${
      hasError
        ? "border-red-500/70 focus-visible:ring-red-500/40"
        : "border-zinc-800 focus-visible:border-indigo-500/60"
    }`

  return (
    <Card
      {...props}
      className={`relative w-full max-w-md rounded-3xl border-zinc-800/80 bg-[#101015] text-zinc-100 shadow-2xl shadow-indigo-950/50 ${className ?? ""}`}
    >
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400">
          Join JobSeekerBD and find your dream job today.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-8">
        {apiError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="role"
              className="text-sm font-medium text-zinc-300"
            >
              Joining JobSeekerBD as
            </FieldLabel>
            <div
              role="radiogroup"
              aria-label="Account type"
              className="grid grid-cols-3 gap-2.5 pt-1"
            >
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon
                const selected = formData.role === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleRoleChange(option.value)}
                    className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-4 transition-all duration-200 ${
                      selected
                        ? "border-indigo-500/70 bg-indigo-500/10 text-zinc-100"
                        : "border-zinc-800 bg-[#0c0c12] text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Full Name */}
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="name"
              className="text-sm font-medium text-zinc-300"
            >
              Full name
            </FieldLabel>
            <div className="relative">
              <UserRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange("name")}
                aria-invalid={!!errors.name}
                className={inputClasses(errors.name)}
              />
            </div>
            <FieldError className="text-xs text-red-400">
              {errors.name}
            </FieldError>
          </Field>

          {/* Email */}
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              Email address
            </FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange("email")}
                aria-invalid={!!errors.email}
                className={inputClasses(errors.email)}
              />
            </div>
            <FieldError className="text-xs text-red-400">
              {errors.email}
            </FieldError>
          </Field>

          {/* Password */}
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="password"
              className="text-sm font-medium text-zinc-300"
            >
              Password
            </FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange("password")}
                aria-invalid={!!errors.password}
                className={`${inputClasses(errors.password)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError className="text-xs text-red-400">
              {errors.password}
            </FieldError>
          </Field>

          {/* Confirm Password */}
          <Field className="space-y-2">
            <FieldLabel
              htmlFor="confirm-password"
              className="text-sm font-medium text-zinc-300"
            >
              Confirm password
            </FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className={`${inputClasses(errors.confirmPassword)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError className="text-xs text-red-400">
              {errors.confirmPassword}
            </FieldError>
          </Field>

          {/* Create Account Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-indigo-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          {/* Already have an account footer */}
          <p className="pt-1 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Sign in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
