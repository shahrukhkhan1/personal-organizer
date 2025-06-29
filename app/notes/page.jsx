"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import OrganizerLayout from "@/components/organizer-layout"
import { NotesView } from "@/components/views/notes-view"
import { useRef } from "react"

export default function NotesPage() {
  const notesViewRef = useRef(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we should trigger create action from onboarding
    const action = searchParams.get("action")
    if (action === "create" && notesViewRef.current) {
      setTimeout(() => {
        if (notesViewRef.current.handleCreateNote) {
          notesViewRef.current.handleCreateNote()
        }
      }, 100)
    }
  }, [searchParams])

  const handleCreateAction = () => {
    if (notesViewRef.current && notesViewRef.current.handleCreateNote) {
      notesViewRef.current.handleCreateNote()
    }
  }

  return (
    <OrganizerLayout onCreateAction={handleCreateAction}>
      <NotesView ref={notesViewRef} />
    </OrganizerLayout>
  )
}
