import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata = {
  title: {
    default: "Personal Organizer - Contacts, Notes & Tasks",
    template: "%s | Personal Organizer",
  },
  description:
    "A modern, offline-first personal organizer app for managing contacts, notes, and tasks. Simple, secure, and always available.",
  keywords: ["personal organizer", "contacts", "notes", "tasks", "productivity", "offline", "PWA"],
  authors: [{ name: "Personal Organizer Team" }],
  creator: "Personal Organizer",
  publisher: "Personal Organizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Personal Organizer - Contacts, Notes & Tasks",
    description:
      "A modern, offline-first personal organizer app for managing contacts, notes, and tasks. Simple, secure, and always available.",
    siteName: "Personal Organizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Personal Organizer App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Organizer - Contacts, Notes & Tasks",
    description: "A modern, offline-first personal organizer app for managing contacts, notes, and tasks.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#6366f1" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Personal Organizer",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Personal Organizer",
    "application-name": "Personal Organizer",
    "msapplication-TileColor": "#6366f1",
    "msapplication-config": "/browserconfig.xml",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" type="image/png" />
        <link rel="preload" href="/icons/icon-512x512.png" as="image" type="image/png" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#6366f1" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50">{children}</div>
        </ToastProvider>
      </body>
    </html>
  )
}
