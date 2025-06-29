"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { onboardingStorage } from "@/lib/storage"

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // If user has already completed onboarding, redirect to home
    if (onboardingStorage.isCompleted()) {
      console.log("Onboarding already completed, redirecting to home")
      router.replace("/")
      return
    }
  }, [router])

  const handleOnboardingComplete = () => {
    try {
      console.log("Starting onboarding completion process...")

      // Mark onboarding as completed
      const success = onboardingStorage.setCompleted()
      console.log("Onboarding completion result:", success)

      // Mark all sections as visited to prevent welcome screens
      localStorage.setItem("organizer_contacts_visited", "true")
      localStorage.setItem("organizer_notes_visited", "true")
      localStorage.setItem("organizer_tasks_visited", "true")

      console.log("All sections marked as visited")
      console.log("Welcome flow completed, redirecting to home")

      // Force a small delay to ensure localStorage is written
      setTimeout(() => {
        router.replace("/")
      }, 100)
    } catch (error) {
      console.error("Error completing welcome flow:", error)
      // Fallback: still redirect to home
      setTimeout(() => {
        router.replace("/")
      }, 100)
    }
  }

  const handleNavigateToSection = (section) => {
    try {
      console.log("Navigating to section:", section)

      // Complete onboarding first
      onboardingStorage.setCompleted()
      localStorage.setItem("organizer_contacts_visited", "true")
      localStorage.setItem("organizer_notes_visited", "true")
      localStorage.setItem("organizer_tasks_visited", "true")

      // Navigate to specific section with action
      setTimeout(() => {
        switch (section) {
          case "contacts":
            router.replace("/contacts?action=create")
            break
          case "notes":
            router.replace("/notes?action=create")
            break
          case "tasks":
            router.replace("/tasks?action=create")
            break
          default:
            router.replace("/")
            break
        }
      }, 100)
    } catch (error) {
      console.error("Error navigating from welcome:", error)
      setTimeout(() => {
        router.replace("/")
      }, 100)
    }
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} onNavigateToSection={handleNavigateToSection} />
}
