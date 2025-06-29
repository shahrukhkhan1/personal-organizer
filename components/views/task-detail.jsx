"use client"

import {
  ArrowLeft,
  Edit,
  Calendar,
  Flag,
  Folder,
  Tag,
  FileText,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export function TaskDetail({ task, onEdit, onDelete, onBack, onToggleComplete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeUntilDue = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

    if (diffTime < 0) return { text: "Overdue", color: "text-red-600", urgent: true }
    if (diffHours < 24) return { text: `${diffHours} hours left`, color: "text-orange-600", urgent: true }
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-yellow-600", urgent: false }
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: "text-blue-600", urgent: false }
    return { text: `${diffDays} days left`, color: "text-slate-600", urgent: false }
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
        return <Flag className="h-4 w-4 text-red-600" />
      case "medium":
        return <Flag className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Flag className="h-4 w-4 text-green-600" />
      default:
        return <Flag className="h-4 w-4 text-slate-400" />
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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      onDelete()
    }
  }

  const timeInfo = getTimeUntilDue(task.dueDate)
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-800">Task Details</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage task information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Task Header Card */}
        <Card className={isOverdue ? "border-l-4 border-l-red-400" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <Checkbox checked={task.completed} onCheckedChange={onToggleComplete} className="h-6 w-6" />
              </div>

              {/* Task Info */}
              <div className="flex-1">
                <h2
                  className={`text-2xl font-bold mb-3 ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}
                >
                  {task.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Priority */}
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1 capitalize">{task.priority} Priority</span>
                  </Badge>

                  {/* Category */}
                  <Badge variant="outline" className={`${getCategoryColor(task.category)}`}>
                    <Folder className="h-3 w-3 mr-1" />
                    {task.category}
                  </Badge>

                  {/* Status */}
                  <Badge
                    variant={task.completed ? "default" : "secondary"}
                    className={task.completed ? "bg-green-600" : ""}
                  >
                    {task.completed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    )}
                  </Badge>
                </div>

                {/* Due Date Info */}
                <div className={`flex items-center gap-2 text-lg font-medium ${timeInfo.color}`}>
                  {isOverdue ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  <span>{timeInfo.text}</span>
                  {timeInfo.urgent && !task.completed && (
                    <Badge variant="destructive" className="ml-2">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            {task.description && (
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Description</h4>
                <p className="text-slate-600 leading-relaxed">{task.description}</p>
              </div>
            )}

            <Separator />

            {/* Due Date */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Due Date</p>
                <p className="text-slate-600">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            {/* Tags */}
            {task.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
              <div>
                <p className="font-medium">Created</p>
                <p>{formatDate(task.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p>{formatDate(task.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete a task, there is no going back. Please be certain.
            </p>
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
