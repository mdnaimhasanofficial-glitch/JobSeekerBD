"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react"

type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

// Figma: HL 2.0/Sidebar — one spec for every role (brand, identity card,
// nav, footer CTA + user card + logout). Nav items below are per role.
const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    {
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    {
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    {
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

const publicItems: MenuItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "Browse Jobs", url: "/jobs", icon: Search },
  { name: "Companies", url: "/companies", icon: Building2 },
  { name: "Pricing", url: "/pricing", icon: Tag },
]

const roleLabel: Record<Role, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

const roleSubtitle: Record<Role, string> = {
  seeker: "Seeker Portal",
  recruiter: "Recruiter Portal",
  admin: "Admin Console",
}

const ctaByRole: Partial<Record<Role, MenuItem>> = {
  seeker: {
    name: "Post Resume",
    url: "/dashboard/seeker/settings",
    icon: FileText,
  },
  recruiter: {
    name: "Post a Job",
    url: "/dashboard/recruiter/jobs/new",
    icon: Briefcase,
  },
}

export function AppSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const roles: Role[] = ["seeker", "recruiter", "admin"]

  // Role based on the route being browsed first:
  // /dashboard/seeker/* -> seeker menu, /dashboard/admin/* -> admin menu, etc.
  // Session role is only a fallback (e.g. plain /dashboard).
  const routeRole = pathname?.split("/")[2]
  const roleFromRoute = roles.includes(routeRole as Role)
    ? (routeRole as Role)
    : null

  const rawSessionRole = (session?.user?.role || "").toLowerCase()
  const roleFromSession = roles.includes(rawSessionRole as Role)
    ? (rawSessionRole as Role)
    : null

  const role = roleFromRoute ?? roleFromSession ?? "seeker"

  const user = session?.user
  const userName = user?.name || "User"
  const userEmail = user?.email || ""
  const firstLetter = userName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const isActive = (url: string) =>
    pathname === url ||
    (url !== `/dashboard/${role}` && pathname.startsWith(`${url}/`))

  const renderItems = (items: MenuItem[]) =>
    items.map((item) => (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton
          isActive={isActive(item.url)}
          render={<Link href={item.url} />}
          className={
            isActive(item.url)
              ? "bg-indigo-500/10 font-medium text-indigo-500 hover:bg-indigo-500/15 hover:text-indigo-500"
              : undefined
          }
        >
          <item.icon />
          <span>{item.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Brand (Figma: Brand + Subtitle) */}
        <Link
          href="/"
          className="flex items-center gap-1 px-2 pt-2 text-xl font-black tracking-tight"
        >
          <span className="text-sky-400">JobSeeker</span>
          <span className="text-orange-500">BD</span>
          <span className="ml-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        </Link>
        <p className="px-2 text-xs text-muted-foreground">
          {roleSubtitle[role]}
        </p>

        {/* Identity card (Figma: Identity — Avatar, Name, Role, Badge) */}
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
          {user?.image ? (
            <Image
              src={user.image}
              alt={userName}
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-base font-bold text-white">
              {firstLetter}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail || roleLabel[role]}
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-500">
            {roleLabel[role]}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Role-based nav (Figma: Nav) */}
        <SidebarGroup>
          <SidebarMenu>{renderItems(menuItemByRole[role])}</SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Public pages */}
        <SidebarGroup>
          <SidebarGroupLabel>Public</SidebarGroupLabel>
          <SidebarMenu>{renderItems(publicItems)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Footer CTA (Figma: CTA) */}
        {ctaByRole[role] && (
          <Link
            href={ctaByRole[role]!.url}
            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-purple-700"
          >
            {ctaByRole[role]!.name}
          </Link>
        )}

        {/* User card (Figma: User) */}
        <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
          {user?.image ? (
            <Image
              src={user.image}
              alt={userName}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              {firstLetter}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {roleLabel[role]}
            </p>
          </div>
        </div>

        <SidebarSeparator />

        {/* Logout (Figma: Logout) */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
