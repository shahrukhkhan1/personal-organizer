"use client"

import { useState, useMemo, forwardRef, useImperativeHandle } from "react"
import { Search, Plus, FileText, Grid, List, Filter, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotesList } from "./notes-list"
import { NotesGrid } from "./notes-grid"
import { NoteEditor } from "./note-editor"
import { NoteDetail } from "./note-detail"
import { EmptyNotesState } from "./empty-notes-state"
import { EnhancedEmptyNotesState } from "@/components/onboarding/enhanced-empty-states"

// Expanded mock notes data for better testing
const mockNotes = [
  {
    id: 1,
    title: "Project Planning Meeting Notes",
    content: `# Q1 Planning Session

## Key Discussion Points
- **Budget allocation** for new initiatives
- Timeline for product launch
- Resource requirements and team assignments

## Action Items
1. Finalize budget by end of week
2. Schedule follow-up with design team
3. Review technical specifications

The meeting was productive and we covered all major points. Next steps are clearly defined.`,
    tags: ["work", "meeting", "planning", "q1"],
    category: "Work",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    favorite: true,
  },
  {
    id: 2,
    title: "Recipe Collection",
    content: `# Favorite Recipes

## Pasta Carbonara
- 400g spaghetti
- 200g pancetta
- 4 large eggs
- 100g Pecorino Romano
- Black pepper

**Instructions:**
1. Cook pasta in salted water
2. Fry pancetta until crispy
3. Mix eggs with cheese
4. Combine everything off heat

## Chocolate Chip Cookies
Simple and delicious recipe that never fails. Perfect for weekend baking.`,
    tags: ["personal", "cooking", "recipes", "food"],
    category: "Personal",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    favorite: false,
  },
  {
    id: 3,
    title: "Book Reading List",
    content: `# 2024 Reading Goals

## Currently Reading
- **"Atomic Habits"** by James Clear
- **"The Design of Everyday Things"** by Don Norman

## Want to Read
1. "Thinking, Fast and Slow" - Daniel Kahneman
2. "The Lean Startup" - Eric Ries
3. "Sapiens" - Yuval Noah Harari

## Completed
✓ "The Psychology of Money" - Morgan Housel
✓ "Digital Minimalism" - Cal Newport

Taking notes while reading helps retention significantly.`,
    tags: ["personal", "books", "learning", "goals"],
    category: "Personal",
    createdAt: "2024-01-10T20:00:00Z",
    updatedAt: "2024-01-16T18:30:00Z",
    favorite: true,
  },
  {
    id: 4,
    title: "Travel Itinerary - Japan",
    content: `# Japan Trip Planning

## Tokyo (5 days)
- **Shibuya Crossing** - iconic intersection
- **Senso-ji Temple** - historic temple in Asakusa
- **Tsukiji Outer Market** - fresh sushi breakfast
- **Harajuku** - youth culture and fashion

## Kyoto (3 days)
- **Fushimi Inari Shrine** - thousands of torii gates
- **Bamboo Grove** - Arashiyama district
- **Kiyomizu-dera** - wooden temple with city views

## Transportation
- JR Pass for unlimited train travel
- IC card for local transportation

Budget: $3000 for 10 days including flights.`,
    tags: ["personal", "travel", "japan", "planning"],
    category: "Travel",
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-13T11:45:00Z",
    favorite: false,
  },
  {
    id: 5,
    title: "Workout Routine",
    content: `# Weekly Fitness Plan

## Monday - Upper Body
- Push-ups: 3 sets of 15
- Pull-ups: 3 sets of 8
- Dumbbell rows: 3 sets of 12
- Shoulder press: 3 sets of 10

## Wednesday - Lower Body
- Squats: 3 sets of 20
- Lunges: 3 sets of 12 each leg
- Deadlifts: 3 sets of 10
- Calf raises: 3 sets of 15

## Friday - Cardio
- 30 minutes running
- 15 minutes cycling
- 10 minutes stretching

Consistency is key. Track progress weekly.`,
    tags: ["personal", "fitness", "health", "routine"],
    category: "Health",
    createdAt: "2024-01-05T07:30:00Z",
    updatedAt: "2024-01-11T19:20:00Z",
    favorite: false,
  },
  {
    id: 6,
    title: "Client Meeting - ABC Corp",
    content: `# ABC Corp Partnership Discussion

## Attendees
- John Smith (CEO, ABC Corp)
- Sarah Johnson (CTO, ABC Corp)
- Our team: Mike, Lisa, David

## Key Points
- **Integration timeline**: 6-8 weeks
- **Budget approved**: $50,000
- **Technical requirements** reviewed
- **Security compliance** discussed

## Next Steps
1. Send technical proposal by Friday
2. Schedule architecture review meeting
3. Prepare contract draft

Very positive meeting. They're excited about the partnership.`,
    tags: ["work", "client", "meeting", "partnership"],
    category: "Work",
    createdAt: "2024-01-14T15:00:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    favorite: true,
  },
  {
    id: 7,
    title: "Learning JavaScript ES6",
    content: `# Modern JavaScript Features

## Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

## Destructuring
\`\`\`javascript
const { name, age } = person;
const [first, second] = array;
\`\`\`

## Template Literals
\`\`\`javascript
const message = \`Hello \${name}!\`;
\`\`\`

## Async/Await
\`\`\`javascript
const fetchData = async () => {
  const response = await fetch(url);
  return response.json();
};
\`\`\`

These features make JavaScript much more readable and powerful.`,
    tags: ["learning", "javascript", "programming", "es6"],
    category: "Learning",
    createdAt: "2024-01-09T13:15:00Z",
    updatedAt: "2024-01-12T10:45:00Z",
    favorite: false,
  },
  {
    id: 8,
    title: "Garden Planning",
    content: `# Spring Garden Layout

## Vegetable Section
- **Tomatoes** - 6 plants (cherry and beefsteak)
- **Peppers** - 4 plants (bell and jalapeño)
- **Herbs** - basil, oregano, thyme, rosemary
- **Lettuce** - succession planting every 2 weeks

## Flower Section
- **Sunflowers** along the back fence
- **Marigolds** for pest control
- **Zinnias** for color variety

## Timeline
- Start seeds indoors: March 1st
- Transplant outdoors: May 15th
- First harvest: July

Companion planting will help with natural pest control.`,
    tags: ["personal", "gardening", "spring", "planning"],
    category: "Hobbies",
    createdAt: "2024-01-07T11:30:00Z",
    updatedAt: "2024-01-10T16:20:00Z",
    favorite: false,
  },
]

const categories = ["All", "Work", "Personal", "Travel", "Health", "Learning", "Hobbies"]

export const NotesView = forwardRef((props, ref) => {
  const [notes, setNotes] = useState(mockNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState([])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set()
    notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [notes])

  // Filter notes based on search, category, and tags
  const filteredNotes = useMemo(() => {
    let filtered = notes

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          note.category.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((note) => note.category === selectedCategory)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) => selectedTags.every((tag) => note.tags.includes(tag)))
    }

    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [notes, searchQuery, selectedCategory, selectedTags])

  const handleCreateNote = () => {
    // Mark that user has visited notes
    localStorage.setItem("organizer_notes_visited", "true")
    setEditingNote(null)
    setIsEditorOpen(true)
    setSelectedNote(null)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
    setSelectedNote(null)
  }

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((n) => n.id !== noteId))
    setSelectedNote(null)
  }

  const handleSaveNote = (noteData) => {
    const now = new Date().toISOString()

    if (editingNote) {
      // Update existing note
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id
            ? {
                ...noteData,
                id: editingNote.id,
                createdAt: editingNote.createdAt,
                updatedAt: now,
              }
            : n,
        ),
      )
    } else {
      // Create new note
      const newNote = {
        ...noteData,
        id: Math.max(...notes.map((n) => n.id), 0) + 1,
        createdAt: now,
        updatedAt: now,
        favorite: false,
      }
      setNotes([newNote, ...notes])
    }
    setIsEditorOpen(false)
    setEditingNote(null)
  }

  const handleNoteSelect = (note) => {
    setSelectedNote(note)
    setIsEditorOpen(false)
  }

  const handleBackToList = () => {
    setSelectedNote(null)
    setIsEditorOpen(false)
  }

  const handleToggleFavorite = (noteId) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, favorite: !n.favorite } : n)))
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  useImperativeHandle(ref, () => ({
    handleCreateNote,
  }))

  // Show editor view
  if (isEditorOpen) {
    return (
      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setIsEditorOpen(false)
          setEditingNote(null)
        }}
      />
    )
  }

  // Show note detail view
  if (selectedNote) {
    return (
      <NoteDetail
        note={selectedNote}
        onEdit={() => handleEditNote(selectedNote)}
        onDelete={() => handleDeleteNote(selectedNote.id)}
        onBack={handleBackToList}
        onToggleFavorite={() => handleToggleFavorite(selectedNote.id)}
      />
    )
  }

  // Show main notes list/grid view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Notes</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredNotes.length} of {notes.length} notes
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <Button
            onClick={handleCreateNote}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search notes by title, content, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900">Total</p>
                  <p className="text-lg font-bold text-blue-700">{notes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">Categories</p>
                  <p className="text-lg font-bold text-purple-700">{categories.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-900">This Week</p>
                  <p className="text-lg font-bold text-green-700">
                    {
                      notes.filter((note) => {
                        const noteDate = new Date(note.updatedAt)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return noteDate > weekAgo
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-orange-900">Favorites</p>
                  <p className="text-lg font-bold text-orange-700">{notes.filter((n) => n.favorite).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Filter by tags:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes Content */}
      <div className="flex-1 min-h-0">
        {filteredNotes.length === 0 ? (
          notes.length === 0 ? (
            <EnhancedEmptyNotesState onCreateNote={handleCreateNote} />
          ) : (
            <EmptyNotesState
              hasNotes={notes.length > 0}
              searchQuery={searchQuery}
              onCreateNote={handleCreateNote}
              onClearSearch={() => setSearchQuery("")}
              onClearFilters={() => {
                setSelectedCategory("All")
                setSelectedTags([])
              }}
            />
          )
        ) : viewMode === "grid" ? (
          <NotesGrid
            notes={filteredNotes}
            onNoteSelect={handleNoteSelect}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
          />
        ) : (
          <NotesList
            notes={filteredNotes}
            onNoteSelect={handleNoteSelect}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  )
})

NotesView.displayName = "NotesView"
