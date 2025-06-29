"use client"

import { Users, FileText, CheckSquare, Plus, Sparkles, Target, BookOpen, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EnhancedEmptyContactsState({ onAddContact }) {
  return (
    <Card className="border-dashed border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Users className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">Welcome to Contacts!</h3>
        <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
          Start building your personal network. Add friends, family, colleagues, and business contacts all in one
          organized place.
        </p>

        <Button
          onClick={onAddContact}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Your First Contact
        </Button>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-emerald-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Target className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Quick Access</h4>
              <p className="text-xs text-slate-600">Tap any contact to call, email, or message instantly</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-emerald-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Rich Profiles</h4>
              <p className="text-xs text-slate-600">Add notes, company info, and custom details</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedEmptyNotesState({ onCreateNote }) {
  return (
    <Card className="border-dashed border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">Your Digital Notebook</h3>
        <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
          Capture ideas, meeting notes, recipes, or anything that matters. With markdown support and smart organization.
        </p>

        <Button
          onClick={onCreateNote}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
        >
          <Plus className="h-5 w-5 mr-2" />
          Write Your First Note
        </Button>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-blue-200">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Rich Formatting</h4>
              <p className="text-xs text-slate-600">Use markdown for headers, lists, and emphasis</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-blue-200">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Smart Search</h4>
              <p className="text-xs text-slate-600">Find any note instantly with full-text search</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedEmptyTasksState({ onCreateTask }) {
  return (
    <Card className="border-dashed border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <CheckSquare className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">Stay On Track</h3>
        <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
          Organize your to-dos with priorities, due dates, and categories. Never miss an important deadline again.
        </p>

        <Button
          onClick={onCreateTask}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Task
        </Button>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-purple-200">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <Target className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Smart Priorities</h4>
              <p className="text-xs text-slate-600">Set high, medium, or low priority levels</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-purple-200">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 text-sm">Track Progress</h4>
              <p className="text-xs text-slate-600">See completion stats and overdue items</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
