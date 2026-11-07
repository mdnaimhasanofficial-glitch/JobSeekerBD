"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormData = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

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

    return newErrors
  }

  const handleChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setApiError(null)
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

    const { data: signInResponse, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: "/",
    })

    if (error) {
      setApiError(error.message ?? "Invalid email or password.")
    }
    if (!error) {
      router.push("/")
      router.refresh()
    }

    setLoading(false)
    console.log("Login form data:", signInResponse, error, formData)
  }

  const inputClasses = (hasError?: string) =>
    `h-12 rounded-xl border bg-[#0c0c12] pl-11 text-zinc-100 text-sm transition-colors placeholder:text-zinc-500 focus-visible:ring-indigo-500/40 ${
      hasError ? "border-red-500/70 focus-visible:ring-red-500/40" : "border-zinc-800 focus-visible:border-indigo-500/60"
    }`

  return (
    <Card
      {...props}
      className={`relative w-full max-w-md rounded-3xl border-zinc-800/80 bg-[#101015] text-zinc-100 shadow-2xl shadow-indigo-950/50 ${className ?? ""}`}
    >
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400">
          Sign in to your JobSeekerBD account to continue.
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
            <FieldError className="text-xs text-red-400">{errors.email}</FieldError>
          </Field>

          {/* Password */}
          <Field className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor="password"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </FieldLabel>
              <a
                href="#"
                className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="current-password"
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

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-indigo-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Don't have an account footer */}
          <p className="pt-1 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
