"use client"

import { useState, useMemo, forwardRef, useImperativeHandle } from "react"
import { Search, Plus, CheckSquare, Filter, Calendar, AlertCircle, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TasksList } from "./tasks-list"
import { TaskForm } from "./task-form"
import { TaskDetail } from "./task-detail"
import { EmptyTasksState } from "./empty-tasks-state"
import { EnhancedEmptyTasksState } from "@/components/onboarding/enhanced-empty-states"

// Expanded mock tasks data for better testing
const mockTasks = [
  {
    id: 1,
    title: "Review project proposal",
    description:
      "Go through the Q1 project proposal and provide feedback on budget allocation and timeline. Need to check technical feasibility and resource requirements.",
    completed: false,
    priority: "high",
    dueDate: "2024-01-20T17:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    category: "Work",
    tags: ["urgent", "review", "project"],
  },
  {
    id: 2,
    title: "Call dentist for appointment",
    description: "Schedule routine cleaning appointment for next month. Prefer morning slots if available.",
    completed: true,
    priority: "medium",
    dueDate: "2024-01-18T12:00:00Z",
    createdAt: "2024-01-10T11:00:00Z",
    updatedAt: "2024-01-17T10:15:00Z",
    category: "Personal",
    tags: ["health", "appointment"],
  },
  {
    id: 3,
    title: "Buy groceries",
    description:
      "Weekly grocery shopping: milk, bread, eggs, vegetables, fruits. Check if there are any sales on organic produce.",
    completed: false,
    priority: "low",
    dueDate: "2024-01-19T18:00:00Z",
    createdAt: "2024-01-14T16:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    category: "Personal",
    tags: ["shopping", "weekly"],
  },
  {
    id: 4,
    title: "Finish quarterly report",
    description:
      "Complete Q4 performance analysis including sales metrics, team productivity, and budget variance. Include recommendations for Q1.",
    completed: false,
    priority: "high",
    dueDate: "2024-01-22T23:59:00Z",
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-15T13:45:00Z",
    category: "Work",
    tags: ["report", "quarterly", "deadline"],
  },
  {
    id: 5,
    title: "Plan weekend trip",
    description:
      "Research and book accommodation for weekend getaway. Look into hiking trails and local restaurants. Check weather forecast.",
    completed: false,
    priority: "low",
    dueDate: "2024-01-25T20:00:00Z",
    createdAt: "2024-01-13T19:30:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
    category: "Personal",
    tags: ["travel", "weekend", "planning"],
  },
  {
    id: 6,
    title: "Update portfolio website",
    description:
      "Add recent projects to portfolio, update resume section, and optimize for mobile devices. Test contact form functionality.",
    completed: false,
    priority: "medium",
    dueDate: "2024-01-24T15:00:00Z",
    createdAt: "2024-01-11T14:00:00Z",
    updatedAt: "2024-01-14T09:30:00Z",
    category: "Work",
    tags: ["portfolio", "website", "development"],
  },
  {
    id: 7,
    title: "Exercise routine",
    description: "30-minute workout session focusing on cardio and strength training. Follow the weekly fitness plan.",
    completed: true,
    priority: "medium",
    dueDate: "2024-01-17T07:00:00Z",
    createdAt: "2024-01-16T20:00:00Z",
    updatedAt: "2024-01-17T07:30:00Z",
    category: "Health",
    tags: ["fitness", "routine", "health"],
  },
  {
    id: 8,
    title: "Read chapter 5",
    description:
      "Continue reading 'Atomic Habits' - Chapter 5: The Best Way to Start a New Habit. Take notes on key concepts.",
    completed: false,
    priority: "low",
    dueDate: "2024-01-21T21:00:00Z",
    createdAt: "2024-01-14T18:00:00Z",
    updatedAt: "2024-01-14T18:00:00Z",
    category: "Learning",
    tags: ["reading", "habits", "self-improvement"],
  },
  {
    id: 9,
    title: "Team meeting preparation",
    description:
      "Prepare agenda for Monday team meeting. Review sprint progress, identify blockers, and plan next iteration goals.",
    completed: false,
    priority: "high",
    dueDate: "2024-01-21T09:00:00Z",
    createdAt: "2024-01-16T15:00:00Z",
    updatedAt: "2024-01-16T15:00:00Z",
    category: "Work",
    tags: ["meeting", "team", "planning"],
  },
  {
    id: 10,
    title: "Water plants",
    description:
      "Water all indoor plants and check for any signs of pests or diseases. Rotate plants for even sunlight exposure.",
    completed: true,
    priority: "low",
    dueDate: "2024-01-16T10:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-16T10:15:00Z",
    category: "Home",
    tags: ["plants", "routine", "care"],
  },
]

const filterOptions = [
  { value: "all", label: "All Tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
]

const sortOptions = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
]

export const TasksView = forwardRef((props, ref) => {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by status
    const now = new Date()
    switch (statusFilter) {
      case "active":
        filtered = filtered.filter((task) => !task.completed)
        break
      case "completed":
        filtered = filtered.filter((task) => task.completed)
        break
      case "overdue":
        filtered = filtered.filter((task) => !task.completed && new Date(task.dueDate) < now)
        break
      default:
        // "all" - no additional filtering
        break
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
          if (priorityDiff !== 0) return priorityDiff
          // If same priority, sort by due date
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "updated":
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        case "dueDate":
        default:
          return new Date(a.dueDate) - new Date(b.dueDate)
      }
    })

    return filtered
  }, [tasks, searchQuery, statusFilter, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const active = total - completed
    const overdue = tasks.filter((task) => !task.completed && new Date(task.dueDate) < now).length
    const dueToday = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return !task.completed && taskDate.toDateString() === now.toDateString()
    }).length

    return { total, completed, active, overdue, dueToday }
  }, [tasks])

  const handleCreateTask = () => {
    // Mark that user has visited tasks
    localStorage.setItem("organizer_tasks_visited", "true")
    setEditingTask(null)
    setIsFormOpen(true)
    setSelectedTask(null)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
    setSelectedTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
    setSelectedTask(null)
  }

  const handleSaveTask = (taskData) => {
    const now = new Date().toISOString()

    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...taskData,
                id: editingTask.id,
                createdAt: editingTask.createdAt,
                updatedAt: now,
              }
            : t,
        ),
      )
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: Math.max(...tasks.map((t) => t.id), 0) + 1,
        createdAt: now,
        updatedAt: now,
        completed: false,
      }
      setTasks([newTask, ...tasks])
    }
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleTaskSelect = (task) => {
    setSelectedTask(task)
    setIsFormOpen(false)
  }

  const handleBackToList = () => {
    setSelectedTask(null)
    setIsFormOpen(false)
  }

  const handleToggleComplete = (taskId) => {
    const now = new Date().toISOString()
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              updatedAt: now,
            }
          : t,
      ),
    )
  }

  useImperativeHandle(ref, () => ({
    handleCreateTask,
  }))

  // Show form view
  if (isFormOpen) {
    return (
      <TaskForm
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setIsFormOpen(false)
          setEditingTask(null)
        }}
      />
    )
  }

  // Show task detail view
  if (selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        onEdit={() => handleEditTask(selectedTask)}
        onDelete={() => handleDeleteTask(selectedTask.id)}
        onBack={handleBackToList}
        onToggleComplete={() => handleToggleComplete(selectedTask.id)}
      />
    )
  }

  // Show main tasks list view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredAndSortedTasks.length} of {tasks.length} tasks
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <Button
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tasks by title, description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-purple-300 focus:ring-purple-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                <Filter className="h-4 w-4 mr-2" />
                {filterOptions.find((opt) => opt.value === statusFilter)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setStatusFilter(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Sort by {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">Total</p>
                  <p className="text-lg font-bold text-purple-700">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900">Active</p>
                  <p className="text-lg font-bold text-blue-700">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-900">Done</p>
                  <p className="text-lg font-bold text-green-700">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs font-medium text-red-900">Overdue</p>
                  <p className="text-lg font-bold text-red-700">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-orange-900">Due Today</p>
                  <p className="text-lg font-bold text-orange-700">{stats.dueToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 min-h-0">
        {filteredAndSortedTasks.length === 0 ? (
          tasks.length === 0 ? (
            <EnhancedEmptyTasksState onCreateTask={handleCreateTask} />
          ) : (
            <EmptyTasksState
              hasTasks={tasks.length > 0}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onCreateTask={handleCreateTask}
              onClearSearch={() => setSearchQuery("")}
              onClearFilters={() => {
                setStatusFilter("all")
                setSearchQuery("")
              }}
            />
          )
        ) : (
          <TasksList
            tasks={filteredAndSortedTasks}
            onTaskSelect={handleTaskSelect}
            onToggleComplete={handleToggleComplete}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  )
})

TasksView.displayName = "TasksView"
