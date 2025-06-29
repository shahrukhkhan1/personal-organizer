"use client"

import { Users, Search, Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyContactsState({ hasContacts, searchQuery, onAddContact, onClearSearch }) {
  if (hasContacts && searchQuery) {
    // No search results
    return (
      <Card className="border-dashed border-2 border-slate-300">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No contacts found</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            We couldn't find any contacts matching "{searchQuery}". Try adjusting your search terms.
          </p>
          <div className="flex gap-3">
            <Button onClick={onClearSearch} variant="outline">
              Clear Search
            </Button>
            <Button
              onClick={onAddContact}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No contacts at all
  return (
    <Card className="border-dashed border-2 border-slate-300">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
          <Users className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">No contacts yet</h3>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
          Start building your contact list by adding your first contact. You can store names, phone numbers, emails, and
          more.
        </p>
        <Button
          onClick={onAddContact}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Your First Contact
        </Button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Organize Contacts</h4>
            <p className="text-sm text-slate-500">Keep all your contacts in one place with alphabetical grouping</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Quick Search</h4>
            <p className="text-sm text-slate-500">Find any contact instantly with real-time search</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-slate-800 mb-1">Rich Profiles</h4>
            <p className="text-sm text-slate-500">Store detailed information including notes and company details</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
