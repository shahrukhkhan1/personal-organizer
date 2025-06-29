"use client"

import { Star, Calendar, Tag, FileText } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function NotesGrid({ notes, onNoteSelect, onToggleFavorite, searchQuery }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const getContentPreview = (content) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove code
      .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
      .replace(/^\s*[-*+]\s+/gm, "") // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
      .trim()

    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText
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

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-100 text-blue-700 border-blue-200",
      Personal: "bg-green-100 text-green-700 border-green-200",
      Travel: "bg-purple-100 text-purple-700 border-purple-200",
      Health: "bg-red-100 text-red-700 border-red-200",
      Learning: "bg-orange-100 text-orange-700 border-orange-200",
      Hobbies: "bg-pink-100 text-pink-700 border-pink-200",
    }
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto pr-2">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="hover:shadow-md transition-all duration-200 cursor-pointer group border-slate-200 hover:border-blue-300"
        >
          <CardHeader className="pb-3" onClick={() => onNoteSelect(note)}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 text-sm">
                  {highlightText(note.title, searchQuery)}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(note.id)
                }}
                className={`h-8 w-8 flex-shrink-0 ${
                  note.favorite ? "text-yellow-600 hover:text-yellow-700" : "text-slate-400 hover:text-yellow-600"
                }`}
                title={note.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`h-4 w-4 ${note.favorite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0" onClick={() => onNoteSelect(note)}>
            <p className="text-sm text-slate-600 line-clamp-4 mb-3 leading-relaxed">
              {highlightText(getContentPreview(note.content), searchQuery)}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    {highlightText(tag, searchQuery)}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Word count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{note.content.split(" ").length} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{note.tags.length} tags</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
