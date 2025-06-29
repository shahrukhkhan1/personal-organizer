"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import OrganizerLayout from "@/components/organizer-layout"
import { TasksView } from "@/components/views/tasks-view"
import { useRef } from "react"

export default function TasksPage() {
  const tasksViewRef = useRef(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we should trigger create action from onboarding
    const action = searchParams.get("action")
    if (action === "create" && tasksViewRef.current) {
      setTimeout(() => {
        if (tasksViewRef.current.handleCreateTask) {
          tasksViewRef.current.handleCreateTask()
        }
      }, 100)
    }
  }, [searchParams])

  const handleCreateAction = () => {
    if (tasksViewRef.current && tasksViewRef.current.handleCreateTask) {
      tasksViewRef.current.handleCreateTask()
    }
  }

  return (
    <OrganizerLayout onCreateAction={handleCreateAction}>
      <TasksView ref={tasksViewRef} />
    </OrganizerLayout>
  )
}
