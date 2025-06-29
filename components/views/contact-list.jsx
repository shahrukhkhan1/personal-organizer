"use client"

import { Phone, Mail, Building2, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ContactList({ groupedContacts, onContactSelect, searchQuery, onToggleFavorite }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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

  return (
    <div className="space-y-6 overflow-y-auto pr-2">
      {Object.entries(groupedContacts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, contacts]) => (
          <div key={letter} className="space-y-3">
            {/* Alphabetical Header */}
            <div className="sticky top-0 bg-slate-50 py-2 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{letter}</span>
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-medium">{contacts.length} contacts</span>
              </div>
            </div>

            {/* Contacts in this group */}
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative" onClick={() => onContactSelect(contact)}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0" onClick={() => onContactSelect(contact)}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {highlightText(contact.name, searchQuery)}
                        </h3>
                        {contact.company && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Building2 className="h-3 w-3 mr-1" />
                            {highlightText(contact.company, searchQuery)}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{highlightText(contact.phone, searchQuery)}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{highlightText(contact.email, searchQuery)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(contact.id)
                        }}
                        className={`h-8 w-8 ${
                          contact.favorite
                            ? "text-yellow-600 hover:text-yellow-700"
                            : "text-slate-400 hover:text-yellow-600"
                        }`}
                        title={contact.favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star className={`h-4 w-4 ${contact.favorite ? "fill-current" : ""}`} />
                      </Button>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {contact.phone && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`tel:${contact.phone}`)
                            }}
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-100"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {contact.email && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`mailto:${contact.email}`)
                            }}
                            className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
