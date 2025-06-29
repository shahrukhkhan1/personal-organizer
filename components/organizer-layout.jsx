"use client"

import { useState } from "react"
import { Search, Settings, Plus, Users, FileText, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { InstallPrompt } from "@/components/pwa/install-prompt"

const navigationItems = [
  {
    title: "Contacts",
    icon: Users,
    id: "contacts",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    href: "/contacts",
  },
  {
    title: "Notes",
    icon: FileText,
    id: "notes",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/notes",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    id: "tasks",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/tasks",
  },
]

function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const getActiveSection = () => {
    if (pathname === "/" || pathname === "/contacts") return "contacts"
    if (pathname === "/notes") return "notes"
    if (pathname === "/tasks") return "tasks"
    return "contacts"
  }

  const activeSection = getActiveSection()

  const handleNavigation = (item) => {
    if (item.id === "contacts") {
      // For contacts, navigate to either home or contacts page
      if (pathname === "/") {
        // Already on home page, no need to navigate
        return
      } else {
        router.push("/contacts")
      }
    } else {
      router.push(item.href)
    }
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item)}
                    isActive={activeSection === item.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="font-medium text-slate-700">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function TopAppBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PO</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Personal Organizer</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const getActiveSection = () => {
    if (pathname === "/" || pathname === "/contacts") return "contacts"
    if (pathname === "/notes") return "notes"
    if (pathname === "/tasks") return "tasks"
    return "contacts"
  }

  const activeSection = getActiveSection()

  const handleNavigation = (item) => {
    if (item.id === "contacts") {
      // For contacts, navigate to either home or contacts page
      if (pathname === "/") {
        // Already on home page, no need to navigate
        return
      } else {
        router.push("/contacts")
      }
    } else {
      router.push(item.href)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              activeSection === item.id ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

function FloatingActionButton({ onCreateAction }) {
  const pathname = usePathname()

  const getActiveSection = () => {
    if (pathname === "/" || pathname === "/contacts") return "contacts"
    if (pathname === "/notes") return "notes"
    if (pathname === "/tasks") return "tasks"
    return "contacts"
  }

  const activeSection = getActiveSection()

  const getActionLabel = () => {
    switch (activeSection) {
      case "contacts":
        return "Add Contact"
      case "notes":
        return "New Note"
      case "tasks":
        return "Add Task"
      default:
        return "Add New"
    }
  }

  return (
    <Button
      onClick={() => onCreateAction && onCreateAction()}
      className="fixed bottom-20 right-4 md:bottom-6 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 z-40"
      size="icon"
      title={getActionLabel()}
    >
      <Plus className="h-6 w-6 text-white" />
    </Button>
  )
}

export default function OrganizerLayout({ children, onCreateAction }) {
  // If children are provided, render them instead of default content
  if (children) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-slate-50">
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <TopAppBar />
            <main className="flex-1 p-4 pb-20 md:pb-4">
              <div className="max-w-6xl mx-auto h-full">{children}</div>
            </main>
          </SidebarInset>
        </div>

        <BottomNavigation />
        <FloatingActionButton onCreateAction={onCreateAction} />
        <InstallPrompt />
      </SidebarProvider>
    )
  }

  // This fallback content is no longer needed since we're using proper routing
  return null
}
