"use client"

import { useState, useMemo, forwardRef, useImperativeHandle, useEffect } from "react"
import { Search, Plus, Users, Phone, Mail, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ContactList } from "./contact-list"
import { ContactForm } from "./contact-form"
import { ContactDetail } from "./contact-detail"
import { EmptyContactsState } from "./empty-contacts-state"
import { EnhancedEmptyContactsState } from "@/components/onboarding/enhanced-empty-states"
import { contactsStorage } from "@/lib/storage"
import { useToast } from "@/components/ui/toast"

// Mock data for initial setup - only for demo purposes
const initialMockContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+1 (555) 123-4567",
    email: "alice.johnson@techsolutions.com",
    address: "123 Main St, San Francisco, CA 94102",
    company: "Tech Solutions Inc.",
    notes:
      "Met at the tech conference in 2023. Interested in our new AI product line. Very knowledgeable about machine learning.",
    avatar: "/placeholder.svg?height=40&width=40",
    favorite: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "+1 (555) 987-6543",
    email: "bob.smith@designstudio.com",
    address: "456 Oak Ave, New York, NY 10001",
    company: "Creative Design Studio",
    notes: "Freelance designer specializing in UI/UX projects. Available for contract work. Portfolio is impressive.",
    avatar: "/placeholder.svg?height=40&width=40",
    favorite: false,
  },
  {
    id: 3,
    name: "Carol Davis",
    phone: "+1 (555) 456-7890",
    email: "carol.davis@gmail.com",
    address: "789 Pine St, Los Angeles, CA 90210",
    company: "",
    notes:
      "College friend from UCLA. Now working as a photographer in LA. Great for event photography recommendations.",
    avatar: "/placeholder.svg?height=40&width=40",
    favorite: false,
  },
]

export const ContactsView = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [showEnhancedWelcome, setShowEnhancedWelcome] = useState(false)
  const { addToast } = useToast()

  // Load contacts from localStorage on mount
  useEffect(() => {
    try {
      const savedContacts = contactsStorage.get()
      const hasVisited = localStorage.getItem("organizer_contacts_visited")
      const onboardingCompleted = localStorage.getItem("organizer_onboarding_completed")

      console.log("Contacts loading:", {
        savedContactsLength: savedContacts.length,
        hasVisited,
        onboardingCompleted,
      })

      if (savedContacts.length > 0) {
        // User has contacts, show them
        setContacts(savedContacts)
        setShowEnhancedWelcome(false)
        // Mark as visited since they have contacts
        if (!hasVisited) {
          localStorage.setItem("organizer_contacts_visited", "true")
        }
      } else {
        // No contacts found
        setContacts([])

        // Only show enhanced welcome if:
        // 1. User hasn't visited contacts before AND
        // 2. User hasn't completed onboarding (meaning they're truly new)
        if (!hasVisited && !onboardingCompleted) {
          setShowEnhancedWelcome(true)
        } else {
          setShowEnhancedWelcome(false)
          // Mark as visited for returning users
          localStorage.setItem("organizer_contacts_visited", "true")
        }
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
      setContacts([])
      setShowEnhancedWelcome(false)
    }
  }, [])

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      contactsStorage.set(contacts)
      // Mark as visited when user has contacts
      localStorage.setItem("organizer_contacts_visited", "true")
      setShowEnhancedWelcome(false)
    }
  }, [contacts])

  // Improved search functionality - searches across all fields
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts

    const query = searchQuery.toLowerCase().trim()

    return contacts.filter((contact) => {
      // Search in all text fields
      const searchableFields = [
        contact.name,
        contact.phone,
        contact.email,
        contact.address,
        contact.company,
        contact.notes,
      ]

      return searchableFields.some((field) => field && field.toLowerCase().includes(query))
    })
  }, [contacts, searchQuery])

  // Group contacts alphabetically
  const groupedContacts = useMemo(() => {
    const groups = {}
    filteredContacts
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((contact) => {
        const firstLetter = contact.name[0].toUpperCase()
        if (!groups[firstLetter]) {
          groups[firstLetter] = []
        }
        groups[firstLetter].push(contact)
      })
    return groups
  }, [filteredContacts])

  const handleAddContact = () => {
    // Mark that user has visited contacts and hide enhanced welcome
    localStorage.setItem("organizer_contacts_visited", "true")
    setShowEnhancedWelcome(false)
    setEditingContact(null)
    setIsFormOpen(true)
    setSelectedContact(null)
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setIsFormOpen(true)
    setSelectedContact(null)
  }

  const handleDeleteContact = (contactId) => {
    const contactToDelete = contacts.find((c) => c.id === contactId)
    const updatedContacts = contacts.filter((c) => c.id !== contactId)
    setContacts(updatedContacts)
    setSelectedContact(null)

    addToast({
      title: "Contact Deleted",
      description: `${contactToDelete?.name} has been removed from your contacts.`,
      variant: "success",
    })
  }

  const handleSaveContact = (contactData) => {
    if (editingContact) {
      // Update existing contact
      setContacts(contacts.map((c) => (c.id === editingContact.id ? { ...contactData, id: editingContact.id } : c)))
      addToast({
        title: "Contact Updated",
        description: `${contactData.name} has been updated successfully.`,
        variant: "success",
      })
    } else {
      // Add new contact
      const newContact = {
        ...contactData,
        id: Math.max(...contacts.map((c) => c.id), 0) + 1,
        avatar: "/placeholder.svg?height=40&width=40",
        favorite: false,
      }
      setContacts([...contacts, newContact])
      addToast({
        title: "Contact Added",
        description: `${contactData.name} has been added to your contacts.`,
        variant: "success",
      })
    }
    setIsFormOpen(false)
    setEditingContact(null)
  }

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
    setIsFormOpen(false)
  }

  const handleBackToList = () => {
    setSelectedContact(null)
    setIsFormOpen(false)
  }

  const handleToggleFavorite = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId)
    setContacts(contacts.map((c) => (c.id === contactId ? { ...c, favorite: !c.favorite } : c)))

    addToast({
      title: contact?.favorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${contact?.name} has been ${contact?.favorite ? "removed from" : "added to"} your favorites.`,
      variant: "info",
    })
  }

  useImperativeHandle(ref, () => ({
    handleAddContact,
  }))

  // Show form view
  if (isFormOpen) {
    return (
      <ContactForm
        contact={editingContact}
        onSave={handleSaveContact}
        onCancel={() => {
          setIsFormOpen(false)
          setEditingContact(null)
        }}
      />
    )
  }

  // Show contact detail view
  if (selectedContact) {
    return (
      <ContactDetail
        contact={selectedContact}
        onEdit={() => handleEditContact(selectedContact)}
        onDelete={() => handleDeleteContact(selectedContact.id)}
        onBack={handleBackToList}
        onToggleFavorite={() => handleToggleFavorite(selectedContact.id)}
      />
    )
  }

  // Show main contacts list view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Contacts</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredContacts.length} of {contacts.length} contacts
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <Button
            onClick={handleAddContact}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search contacts by name, email, company, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-medium text-emerald-900">Total</p>
                  <p className="text-lg font-bold text-emerald-700">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900">Work</p>
                  <p className="text-lg font-bold text-blue-700">{contacts.filter((c) => c.company).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">Phone</p>
                  <p className="text-lg font-bold text-purple-700">{contacts.filter((c) => c.phone).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-orange-900">Favorites</p>
                  <p className="text-lg font-bold text-orange-700">{contacts.filter((c) => c.favorite).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 min-h-0">
        {filteredContacts.length === 0 ? (
          // Show enhanced welcome only for true first-time users who haven't visited contacts
          showEnhancedWelcome ? (
            <EnhancedEmptyContactsState onAddContact={handleAddContact} />
          ) : (
            // Show regular empty state for returning users or after search
            <EmptyContactsState
              hasContacts={contacts.length > 0}
              searchQuery={searchQuery}
              onAddContact={handleAddContact}
              onClearSearch={() => setSearchQuery("")}
            />
          )
        ) : (
          <ContactList
            groupedContacts={groupedContacts}
            onContactSelect={handleContactSelect}
            searchQuery={searchQuery}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </div>
  )
})

ContactsView.displayName = "ContactsView"
