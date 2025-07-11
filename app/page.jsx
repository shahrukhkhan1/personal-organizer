"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrganizerLayout from "@/components/organizer-layout"
import { ContactsView } from "@/components/views/contacts-view"
import { onboardingStorage } from "@/lib/storage"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        const isCompleted = onboardingStorage.isCompleted()
        console.log("Home page - checking onboarding status:", isCompleted)

        if (!isCompleted) {
          console.log("Onboarding not completed, redirecting to welcome")
          router.replace("/welcome")
          return
        }

        console.log("Onboarding completed, showing home page")
        setShowOnboarding(false)
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        // On error, assume onboarding is needed
        router.replace("/welcome")
      }
    }

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkOnboardingStatus, 50)

    return () => clearTimeout(timer)
  }, [router])

  // Show loading state while checking onboarding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">PO</span>
          </div>
          <p className="text-slate-600">Loading Personal Organizer...</p>
        </div>
      </div>
    )
  }

  // If we need to show onboarding, redirect (this shouldn't happen due to useEffect)
  if (showOnboarding) {
    return null
  }

  // Show the main app
  return (
    <OrganizerLayout>
      <ContactsView />
    </OrganizerLayout>
  )
}
