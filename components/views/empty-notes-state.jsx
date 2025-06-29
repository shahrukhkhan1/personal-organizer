"use client"

import { FileText, Search, Plus, PenTool, Tag, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyNotesState({ hasNotes, searchQuery, onCreateNote, onClearSearch, onClearFilters }) {
  if (hasNotes && searchQuery) {
    // No search results
    return (
      <Card className="border-dashed border-2 border-slate-300">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No notes found</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            We couldn't find any notes matching "{searchQuery}". Try adjusting your search terms or filters.
          </p>
          <div className="flex gap-3">
            <Button onClick={onClearSearch} variant="outline">
              Clear Search
            </Button>
            {onClearFilters && (
              <Button onClick={onClearFilters} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
            <Button
              onClick={onCreateNote}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No notes at all
  return (
    <Card className="border-dashed border-2 border-slate-300">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">No notes yet</h3>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
          Start capturing your thoughts, ideas, and important information. Create your first note to get organized.
        </p>
        <Button
          onClick={onCreateNote}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
        >
          <PenTool className="h-5 w-5 mr-2" />
          Create Your First Note
        </Button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
              <PenTool className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Rich Text Editor</h4>
            <p className="text-sm text-slate-500">Format your notes with markdown support and rich text features</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Smart Organization</h4>
            <p className="text-sm text-slate-500">Organize with categories and tags for easy retrieval</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Powerful Search</h4>
            <p className="text-sm text-slate-500">Find any note instantly with full-text search across all content</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
