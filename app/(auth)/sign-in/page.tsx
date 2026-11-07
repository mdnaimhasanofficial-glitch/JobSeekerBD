import { LoginForm } from "@/components/auth/SignIn"
export default function Page() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#09090d] p-6 md:p-10">
      {/* Background purple glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-104 w-120 -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
