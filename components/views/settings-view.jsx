"use client"

import { useState } from "react"
import {
  Settings,
  Palette,
  Type,
  Cloud,
  Database,
  Bell,
  Info,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  Shield,
  Heart,
  MessageSquare,
  ExternalLink,
  Check,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const fontSizeOptions = [
  { value: "small", label: "Small (14px)" },
  { value: "medium", label: "Medium (16px)" },
  { value: "large", label: "Large (18px)" },
  { value: "extra-large", label: "Extra Large (20px)" },
]

const cloudServices = [
  { value: "google", label: "Google Drive" },
  { value: "dropbox", label: "Dropbox" },
  { value: "onedrive", label: "OneDrive" },
  { value: "icloud", label: "iCloud" },
]

const reminderTimes = [
  { value: "5", label: "5 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
]

export function SettingsView() {
  const [settings, setSettings] = useState({
    // General
    theme: "system",
    fontSize: "medium",

    // Data & Sync
    cloudSyncEnabled: false,
    cloudService: "google",
    autoBackup: true,

    // Notifications
    taskReminders: true,
    defaultReminderTime: "15",
    browserNotifications: false,

    // About
    version: "1.0.0",
    buildDate: "2024-01-20",
  })

  // Separate state for each dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    console.log(`Setting ${key} changed to:`, value)
  }

  const handleExportData = () => {
    try {
      // Simulate data export
      const data = {
        contacts: [], // Would be actual data
        notes: [],
        tasks: [],
        settings: settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `personal-organizer-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportDialogOpen(false)
      alert("Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      alert("Error exporting data. Please try again.")
    }
  }

  const handleImportData = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          console.log("Imported data:", data)
          alert("Data imported successfully!")
          setImportDialogOpen(false)
        } catch (error) {
          console.error("Import error:", error)
          alert("Error importing data. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
    // Reset the input value
    event.target.value = ""
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      console.log("Clearing all data...")
      alert("All data has been cleared.")
      setClearDialogOpen(false)
    }
  }

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      alert("Please enter your feedback before sending.")
      return
    }

    try {
      console.log("Feedback:", feedbackText)
      alert("Thank you for your feedback! We appreciate your input.")
      setFeedbackText("")
      setFeedbackDialogOpen(false)
    } catch (error) {
      console.error("Error sending feedback:", error)
      alert("Sorry, there was an error sending your feedback. Please try again.")
    }
  }

  const handleNotificationToggle = async (checked) => {
    if (checked && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          handleSettingChange("browserNotifications", true)
          // Show a test notification
          new Notification("Personal Organizer", {
            body: "Browser notifications are now enabled!",
            icon: "/icon-192x192.png",
          })
        } else {
          alert("Notification permission denied. Please enable notifications in your browser settings.")
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
        alert("Unable to enable notifications. Please check your browser settings.")
      }
    } else {
      handleSettingChange("browserNotifications", checked)
    }
  }

  const handleCloudSyncToggle = async (checked) => {
    if (checked) {
      try {
        console.log("Connecting to cloud service...")
        handleSettingChange("cloudSyncEnabled", true)
        alert("Cloud sync enabled! Your data will now be synchronized.")
      } catch (error) {
        console.error("Error enabling cloud sync:", error)
        alert("Unable to connect to cloud service. Please check your internet connection and try again.")
      }
    } else {
      handleSettingChange("cloudSyncEnabled", false)
      alert("Cloud sync disabled. Your data will remain local only.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-slate-100">
          <Settings className="h-6 w-6 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Customize your Personal Organizer experience</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSettingChange("theme", option.value)
                    console.log("Theme changed to:", option.value)
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    settings.theme === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                  {settings.theme === option.value && <Check className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </Label>
            <Select
              value={settings.fontSize}
              onValueChange={(value) => {
                handleSettingChange("fontSize", value)
                console.log("Font size changed to:", value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data & Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-green-600" />
            Data & Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cloud Sync */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">Cloud Sync</Label>
              <p className="text-xs text-slate-500">Sync your data across devices</p>
            </div>
            <Switch checked={settings.cloudSyncEnabled} onCheckedChange={handleCloudSyncToggle} />
          </div>

          {/* Cloud Service Selection */}
          {settings.cloudSyncEnabled && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Cloud Service</Label>
              <Select
                value={settings.cloudService}
                onValueChange={(value) => handleSettingChange("cloudService", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cloudServices.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Auto Backup */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">Auto Backup</Label>
              <p className="text-xs text-slate-500">Automatically backup data weekly</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
            />
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Management
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Export Data Dialog */}
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Export all your contacts, notes, tasks, and settings to a JSON file for backup or transfer.
                    </p>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        The exported file will contain all your personal data. Keep it secure.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Import Data Dialog */}
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Import data from a previously exported JSON file. This will merge with your existing data.
                    </p>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Importing data will add to your existing data. Duplicate items may be created.
                      </AlertDescription>
                    </Alert>
                    <Input type="file" accept=".json" onChange={handleImportData} className="cursor-pointer" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Clear Data Dialog */}
              <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear All Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This will permanently delete all your contacts, notes, tasks, and reset settings. This action
                        cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <p className="text-sm text-slate-600">
                      Are you sure you want to clear all data? Consider exporting your data first as a backup.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleClearData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">Task Reminders</Label>
              <p className="text-xs text-slate-500">Get reminded about upcoming tasks</p>
            </div>
            <Switch
              checked={settings.taskReminders}
              onCheckedChange={(checked) => handleSettingChange("taskReminders", checked)}
            />
          </div>

          {/* Default Reminder Time */}
          {settings.taskReminders && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Default Reminder Time</Label>
              <Select
                value={settings.defaultReminderTime}
                onValueChange={(value) => handleSettingChange("defaultReminderTime", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reminderTimes.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Browser Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">Browser Notifications</Label>
              <p className="text-xs text-slate-500">Show notifications in your browser</p>
            </div>
            <Switch checked={settings.browserNotifications} onCheckedChange={handleNotificationToggle} />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-600" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* App Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Version</span>
              <Badge variant="secondary">{settings.version}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Build Date</span>
              <span className="text-sm text-slate-500">{settings.buildDate}</span>
            </div>
          </div>

          <Separator />

          {/* Legal Links */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Legal
            </Label>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  console.log("Privacy Policy clicked")
                  window.open("#", "_blank")
                }}
              >
                <span className="flex items-center gap-2">
                  Privacy Policy
                  <ExternalLink className="h-3 w-3" />
                </span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  console.log("Terms of Service clicked")
                  window.open("#", "_blank")
                }}
              >
                <span className="flex items-center gap-2">
                  Terms of Service
                  <ExternalLink className="h-3 w-3" />
                </span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  console.log("Open Source Licenses clicked")
                  window.open("#", "_blank")
                }}
              >
                <span className="flex items-center gap-2">
                  Open Source Licenses
                  <ExternalLink className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Feedback */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Feedback
            </Label>
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Send Feedback
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    We'd love to hear your thoughts! Share your feedback, suggestions, or report any issues.
                  </p>
                  <Textarea
                    placeholder="Tell us what you think..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendFeedback} disabled={!feedbackText.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Feedback
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Support */}
          <div className="text-center pt-4">
            <p className="text-xs text-slate-500">
              Made with <Heart className="h-3 w-3 inline text-red-500" /> for productivity enthusiasts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
