"use client"

import { CheckSquare, Search, Plus, Target, Calendar, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyTasksState({ hasTasks, searchQuery, statusFilter, onCreateTask, onClearSearch, onClearFilters }) {
  if (hasTasks && (searchQuery || statusFilter !== "all")) {
    // No search/filter results
    return (
      <Card className="border-dashed border-2 border-slate-300">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            {searchQuery ? `No tasks match "${searchQuery}"` : `No ${statusFilter} tasks found`}. Try adjusting your
            search or filters.
          </p>
          <div className="flex gap-3">
            {searchQuery && (
              <Button onClick={onClearSearch} variant="outline">
                Clear Search
              </Button>
            )}
            {onClearFilters && (
              <Button onClick={onClearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
            <Button
              onClick={onCreateTask}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No tasks at all
  return (
    <Card className="border-dashed border-2 border-slate-300">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-6">
          <CheckSquare className="h-10 w-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">No tasks yet</h3>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
          Stay organized and productive by creating your first task. Set priorities, due dates, and track your progress.
        </p>
        <Button
          onClick={onCreateTask}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-sm"
        >
          <Target className="h-5 w-5 mr-2" />
          Create Your First Task
        </Button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Track Progress</h4>
            <p className="text-sm text-slate-500">Check off completed tasks and see your productivity</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Set Due Dates</h4>
            <p className="text-sm text-slate-500">Never miss a deadline with date and time reminders</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Set Priorities</h4>
            <p className="text-sm text-slate-500">Focus on what matters most with priority levels</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
