"use client"

import { ArrowLeft, Edit, Phone, Mail, MapPin, Building2, FileText, Trash2, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ContactDetail({ contact, onEdit, onDelete, onBack, onToggleFavorite }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleCall = () => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`)
    }
  }

  const handleEmail = () => {
    if (contact.email) {
      window.open(`mailto:${contact.email}`)
    }
  }

  const handleMessage = () => {
    if (contact.phone) {
      window.open(`sms:${contact.phone}`)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}? This action cannot be undone.`)) {
      onDelete()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-800">Contact Details</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage contact information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFavorite}
            className={`${
              contact.favorite
                ? "text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                : "text-slate-400 hover:text-yellow-600 hover:border-yellow-300"
            }`}
            title={contact.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-4 w-4 ${contact.favorite ? "fill-current" : ""}`} />
          </Button>
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-xl">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                {contact.favorite && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-700 fill-current" />
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-800">{contact.name}</h2>
                  {contact.company && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Building2 className="h-3 w-3 mr-1" />
                      {contact.company}
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  {contact.phone && (
                    <Button onClick={handleCall} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                  {contact.phone && (
                    <Button
                      onClick={handleMessage}
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  )}
                  {contact.email && (
                    <Button
                      onClick={handleEmail}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Phone</p>
                    <p className="text-slate-600">{contact.phone}</p>
                  </div>
                </div>
              )}

              {contact.email && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email</p>
                      <p className="text-slate-600">{contact.email}</p>
                    </div>
                  </div>
                </>
              )}

              {contact.address && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Address</p>
                      <p className="text-slate-600">{contact.address}</p>
                    </div>
                  </div>
                </>
              )}

              {contact.company && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Company</p>
                      <p className="text-slate-600">{contact.company}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        {contact.notes && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Notes
              </h3>
              <p className="text-slate-600 leading-relaxed">{contact.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete a contact, there is no going back. Please be certain.
            </p>
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Contact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
