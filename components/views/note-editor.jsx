"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Save, X, Bold, Italic, List, ListOrdered, Type, Tag, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = ["Work", "Personal", "Travel", "Health", "Learning", "Hobbies"]

export function NoteEditor({ note, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    content: note?.content || "",
    category: note?.category || "Personal",
    tags: note?.tags || [],
  })

  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState({})
  const textareaRef = useRef(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const insertFormatting = (before, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    const newText = beforeText + before + selectedText + after + afterText
    setFormData((prev) => ({ ...prev, content: newText }))

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertList = (type) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(start)

    const listItem = type === "ordered" ? "1. " : "- "
    const newText = beforeText + (beforeText.endsWith("\n") || beforeText === "" ? "" : "\n") + listItem + afterText

    setFormData((prev) => ({ ...prev, content: newText }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + listItem.length + (beforeText.endsWith("\n") || beforeText === "" ? 0 : 1))
    }, 0)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  const isEditing = !!note

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-800">{isEditing ? "Edit Note" : "Create New Note"}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEditing ? "Update your note content" : "Write your thoughts and ideas"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Type className="h-5 w-5 text-blue-600" />
              Note Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Title and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter note title..."
                  className={`text-lg font-medium ${
                    errors.title
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                  }`}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ✕
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                />
                <Button type="button" onClick={addTag} variant="outline" disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Content *</Label>
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("**", "**")}
                  className="h-8 px-2"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("*", "*")}
                  className="h-8 px-2"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("# ", "")}
                  className="h-8 px-2"
                  title="Heading"
                >
                  H1
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertList("unordered")}
                  className="h-8 px-2"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertList("ordered")}
                  className="h-8 px-2"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("`", "`")}
                  className="h-8 px-2"
                  title="Code"
                >
                  {"</>"}
                </Button>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="flex-1 flex flex-col">
              <Textarea
                ref={textareaRef}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Start writing your note... You can use markdown formatting!"
                className={`flex-1 min-h-[300px] resize-none font-mono text-sm leading-relaxed ${
                  errors.content
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                }`}
              />
              {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>Supports Markdown formatting</span>
                <span>{formData.content.split(" ").filter((word) => word.length > 0).length} words</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
