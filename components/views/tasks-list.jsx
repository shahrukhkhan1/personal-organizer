"use client"

import { Calendar, AlertCircle, Flag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export function TasksList({ tasks, onTaskSelect, onToggleComplete, searchQuery }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays <= 7) return `${diffDays} days`
    return date.toLocaleDateString()
  }

  const getDateColor = (dateString, completed) => {
    if (completed) return "text-green-600"

    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "text-red-600" // Overdue
    if (diffDays === 0) return "text-orange-600" // Today
    if (diffDays <= 3) return "text-yellow-600" // Soon
    return "text-slate-500" // Future
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Flag className="h-3 w-3 text-red-600" />
      case "medium":
        return <Flag className="h-3 w-3 text-yellow-600" />
      case "low":
        return <Flag className="h-3 w-3 text-green-600" />
      default:
        return <Flag className="h-3 w-3 text-slate-400" />
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-100 text-blue-700 border-blue-200",
      Personal: "bg-green-100 text-green-700 border-green-200",
      Health: "bg-red-100 text-red-700 border-red-200",
      Learning: "bg-purple-100 text-purple-700 border-purple-200",
      Home: "bg-orange-100 text-orange-700 border-orange-200",
    }
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200"
  }

  const highlightText = (text, query) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const isOverdue = (dateString, completed) => {
    if (completed) return false
    return new Date(dateString) < new Date()
  }

  return (
    <div className="space-y-3 overflow-y-auto pr-2">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`hover:shadow-md transition-all duration-200 cursor-pointer group border-slate-200 hover:border-purple-300 ${
            task.completed ? "bg-slate-50" : "bg-white"
          } ${isOverdue(task.dueDate, task.completed) ? "border-l-4 border-l-red-400" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className="h-5 w-5"
                />
              </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0" onClick={() => onTaskSelect(task)}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className={`font-semibold group-hover:text-purple-700 transition-colors text-lg ${
                      task.completed ? "line-through text-slate-500" : "text-slate-800"
                    }`}
                  >
                    {highlightText(task.title, searchQuery)}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p
                    className={`text-sm line-clamp-2 mb-3 leading-relaxed ${
                      task.completed ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {highlightText(task.description, searchQuery)}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Due Date */}
                    <div className={`flex items-center gap-1 text-sm ${getDateColor(task.dueDate, task.completed)}`}>
                      {isOverdue(task.dueDate, task.completed) ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                      <span className="font-medium">{formatDate(task.dueDate)}</span>
                    </div>

                    {/* Category */}
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        {highlightText(tag, searchQuery)}
                      </Badge>
                    ))}
                    {task.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                        +{task.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
