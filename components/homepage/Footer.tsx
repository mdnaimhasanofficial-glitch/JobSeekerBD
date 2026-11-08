import Link from "next/link"

type SocialIcon = React.ComponentType<{ className?: string }>

const FacebookIcon: SocialIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5H16.7V3.6c-.28-.04-1.26-.12-2.4-.12-2.38 0-4 1.45-4 4.12v2.3H7.6V13h2.7v8h3.2Z" />
  </svg>
)

const PayPalIcon: SocialIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M7.28 9.2h4.3c2.1 0 3.2 1 3.2 2.53 0 1.98-1.5 3.02-3.6 3.02H9.9l-.55 3.45H7.07L7.28 9.2Zm6.85 1.5c.3.55.34 1.24.1 2.1-.45 1.9-1.96 2.98-3.87 2.98h-.4l-.54 3.4H7.14l-.2 1.32h2.1l.55-3.4h1.68c2.36 0 4.28-1.32 4.85-3.88.2-.93.1-1.77-.3-2.42l-.69.4v-.5Zm-4.9-4.13h4.3c2.66 0 4.2 1.2 3.82 3.9-.3 2.06-2.05 3.9-4.85 3.9h-1.22l-.6 3.72H6.02l-.72-.9L7.6 5.1l1.63 1.47Z" />
  </svg>
)

const LinkedInIcon: SocialIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.25h3.4V21H3.3V8.25Zm5.65 0h3.26v1.74h.05c.45-.86 1.56-1.77 3.21-1.77 3.44 0 4.08 2.26 4.08 5.2V21h-3.4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.27V21h-3.4V8.25Z" />
  </svg>
)

const socials = [
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "PayPal", href: "#", icon: PayPalIcon },
  { name: "LinkedIn", href: "#", icon: LinkedInIcon },
]

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Job discovery", href: "/jobs" },
      { name: "Saved jobs", href: "/saved-jobs" },
      { name: "Companies", href: "/company" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { name: "Help center", href: "/contact" },
      { name: "Career library", href: "/company" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Brand guideline", href: "/company" },
      { name: "Newsroom", href: "/company" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-border bg-background text-foreground">
      {/* Soft glow bleeding up from the globe background */}
      <div className="pointer-events-none absolute -top-52 left-1/2 z-0 h-80 w-2xl -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 pb-8 md:px-6 md:pt-24">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center text-2xl font-black tracking-tight"
            >
              <span className="text-sky-400">JobSeeker</span>
              <span className="text-orange-500">BD</span>
              <span className="ml-1 h-2 w-2 rounded-full bg-orange-500" />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Bangladesh&apos;s modern job platform. Built for people who take
              their careers seriously.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-5 text-sm font-medium text-indigo-400">
                {group.title}
              </h3>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 pt-6 md:flex-row md:items-end">
          {/* Socials */}
          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Copyright + Legal Links */}
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
            <p>
              Copyright {new Date().getFullYear()} —{" "}
              <span className="text-foreground">JobSeekerBD</span>
            </p>
            <span className="hidden text-border sm:inline">-</span>
            <div className="flex items-center gap-3">
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms &amp; Policy
              </Link>
              <span className="text-border">-</span>
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy Guideline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
