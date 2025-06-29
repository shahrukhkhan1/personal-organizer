"use client"

import { ArrowLeft, Edit, Star, Share, Trash2, Calendar, Tag, Folder, FileText, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NoteDetail({ note, onEdit, onDelete, onBack, onToggleFavorite }) {
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

  const renderMarkdown = (content) => {
    // Simple markdown rendering for display
    return content
      .replace(/#{3}\s+(.*)/g, '<h3 class="text-lg font-semibold text-slate-800 mt-4 mb-2">$1</h3>')
      .replace(/#{2}\s+(.*)/g, '<h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">$1</h2>')
      .replace(/#{1}\s+(.*)/g, '<h1 class="text-2xl font-bold text-slate-800 mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\s*[-*+]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, "</p><p class='mb-3 leading-relaxed text-slate-700'>")
      .replace(/\n/g, "<br>")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}`)
      alert("Note copied to clipboard!")
    }
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note.content)
    alert("Content copied to clipboard!")
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"? This action cannot be undone.`)) {
      onDelete()
    }
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
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-slate-800 truncate">{note.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Created {formatDate(note.createdAt)}
            {note.updatedAt !== note.createdAt && ` • Updated ${formatDate(note.updatedAt)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFavorite}
            className={`${
              note.favorite
                ? "text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                : "text-slate-400 hover:text-yellow-600 hover:border-yellow-300"
            }`}
            title={note.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-4 w-4 ${note.favorite ? "fill-current" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyContent}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
        {/* Note Metadata */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-slate-500" />
                <Badge variant="outline" className={`${getCategoryColor(note.category)}`}>
                  {note.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{note.content.split(" ").length} words</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {Math.ceil((new Date() - new Date(note.createdAt)) / (1000 * 60 * 60 * 24))} days old
                </span>
              </div>

              {note.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Note Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-3 leading-relaxed text-slate-700">${renderMarkdown(note.content)}</p>`,
              }}
            />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete a note, there is no going back. Please be certain.
            </p>
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Note
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
