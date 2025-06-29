"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Smartphone,
  Shield,
  Zap,
  Wifi,
  WifiOff,
  Users,
  FileText,
  CheckSquare,
  Download,
  Cloud,
  Sparkles,
  Target,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const ONBOARDING_STEPS = ["welcome", "benefits", "install", "setup", "complete"]

export function OnboardingFlow({ onComplete, onNavigateToSection }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(false)
  const [setupData, setSetupData] = useState({
    enableSync: false,
    cloudService: "google",
    importData: false,
  })

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInstallPWA = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt()
      console.log("Install result:", result)
      setInstallPrompt(null)
      setCanInstall(false)
    }
    handleNext()
  }

  const handleSkipInstall = () => {
    handleNext()
  }

  // Enhanced completion with proper state management
  const handleCompleteOnboarding = () => {
    console.log("OnboardingFlow: handleCompleteOnboarding called")

    try {
      // Save setup data safely
      if (setupData && typeof setupData === "object") {
        localStorage.setItem("organizer_setup_data", JSON.stringify(setupData))
      }

      console.log("OnboardingFlow: Setup data saved, calling onComplete")

      // Call completion callback - this should handle the redirect
      if (typeof onComplete === "function") {
        onComplete()
      } else {
        console.error("OnboardingFlow: onComplete is not a function")
      }
    } catch (error) {
      console.error("OnboardingFlow: Error in handleCompleteOnboarding:", error)
      // Fallback: still try to call onComplete
      if (typeof onComplete === "function") {
        onComplete()
      }
    }
  }

  // Handle completion screen actions with better error handling
  const handleQuickAction = (action) => {
    console.log("OnboardingFlow: handleQuickAction called with:", action)

    try {
      // Save setup data
      if (setupData && typeof setupData === "object") {
        localStorage.setItem("organizer_setup_data", JSON.stringify(setupData))
      }

      console.log("OnboardingFlow: Setup data saved, calling onNavigateToSection")

      // Navigate to specific section after completion
      if (typeof onNavigateToSection === "function") {
        onNavigateToSection(action)
      } else {
        console.error("OnboardingFlow: onNavigateToSection is not a function, falling back to onComplete")
        // Fallback: just complete onboarding
        if (typeof onComplete === "function") {
          onComplete()
        }
      }
    } catch (error) {
      console.error("OnboardingFlow: Error in handleQuickAction:", error)
      // Fallback: just complete onboarding
      if (typeof onComplete === "function") {
        onComplete()
      }
    }
  }

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <div className="text-white text-3xl font-bold">PO</div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-800">Welcome to Personal Organizer</h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Your all-in-one productivity companion for contacts, notes, and tasks. Simple, secure, and always available.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-700">Contacts</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-blue-100 flex items-center justify-center mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-700">Notes</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-purple-100 flex items-center justify-center mb-2">
            <CheckSquare className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-slate-700">Tasks</p>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <Button
          onClick={handleNext}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          Get Started
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <p className="text-xs text-slate-500">Takes less than 2 minutes to set up</p>
      </div>
    </div>
  )

  const renderBenefitsStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-slate-800">Why You'll Love It</h2>
        <p className="text-slate-600">Built with your productivity and privacy in mind</p>
      </div>

      <div className="grid gap-6">
        {/* Offline Access */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <WifiOff className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Works Offline</h3>
                <p className="text-sm text-slate-600">
                  Access all your data even without internet. Perfect for travel or unreliable connections.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                    <Wifi className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                  <span className="text-slate-400">+</span>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Your Data Stays Private</h3>
                <p className="text-sm text-slate-600">
                  Everything is stored locally on your device. No tracking, no ads, no data mining.
                </p>
                <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  100% Private
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speed */}
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Lightning Fast</h3>
                <p className="text-sm text-slate-600">
                  Instant search, quick navigation, and smooth interactions. No loading spinners.
                </p>
                <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Instant Response
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simplicity */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Beautifully Simple</h3>
                <p className="text-sm text-slate-600">
                  Clean interface focused on what matters. No clutter, no complexity, just productivity.
                </p>
                <Badge variant="secondary" className="bg-purple-200 text-purple-800 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Intuitive Design
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderInstallStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Smartphone className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Install as an App</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Get the full app experience with offline access, faster loading, and easy access from your home screen.
        </p>
      </div>

      {/* Installation Benefits */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Faster startup</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <WifiOff className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Works offline</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Home screen icon</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Secure & private</span>
          </div>
        </div>
      </div>

      {/* Install Actions */}
      <div className="space-y-4">
        {canInstall ? (
          <Button
            onClick={handleInstallPWA}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
          >
            <Download className="h-5 w-5 mr-2" />
            Install App
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Manual Installation:</strong> Look for "Add to Home Screen" or "Install" in your browser menu.
              </p>
            </div>
            <Button
              onClick={handleSkipInstall}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8"
            >
              Continue in Browser
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        <Button onClick={handleSkipInstall} variant="ghost" className="text-slate-500 hover:text-slate-700">
          Skip for now
        </Button>
      </div>
    </div>
  )

  const renderSetupStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Cloud className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Optional Setup</h2>
        <p className="text-slate-600">Configure sync and import options (you can change these later)</p>
      </div>

      <div className="space-y-6">
        {/* Cloud Sync */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <Label className="text-base font-medium text-slate-700">Enable Cloud Sync</Label>
                <p className="text-sm text-slate-500">Sync your data across devices</p>
              </div>
              <Switch
                checked={setupData.enableSync}
                onCheckedChange={(checked) => setSetupData((prev) => ({ ...prev, enableSync: checked }))}
              />
            </div>

            {setupData.enableSync && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <Label className="text-sm font-medium text-slate-700">Cloud Service</Label>
                <Select
                  value={setupData.cloudService}
                  onValueChange={(value) => setSetupData((prev) => ({ ...prev, cloudService: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Drive</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="onedrive">OneDrive</SelectItem>
                    <SelectItem value="icloud">iCloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Import */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <Label className="text-base font-medium text-slate-700">Import Existing Data</Label>
                <p className="text-sm text-slate-500">Import from a backup file</p>
              </div>
              <Switch
                checked={setupData.importData}
                onCheckedChange={(checked) => setSetupData((prev) => ({ ...prev, importData: checked }))}
              />
            </div>

            {setupData.importData && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <Label className="text-sm font-medium text-slate-700">Select backup file</Label>
                <Input type="file" accept=".json" className="cursor-pointer" />
                <p className="text-xs text-slate-500">
                  Choose a JSON backup file from Personal Organizer or compatible apps
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-sm text-slate-600">
            Don't worry! You can configure these settings anytime in the Settings page.
          </p>
        </div>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Check className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-800">You're All Set!</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Welcome to Personal Organizer. Start by adding your first contact, note, or task.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-2 border-emerald-200 bg-emerald-50"
          onClick={() => handleQuickAction("contacts")}
        >
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-800">Add Contact</h3>
            <p className="text-xs text-slate-600">Start building your network</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-200 bg-blue-50"
          onClick={() => handleQuickAction("notes")}
        >
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-800">Write Note</h3>
            <p className="text-xs text-slate-600">Capture your thoughts</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-2 border-purple-200 bg-purple-50"
          onClick={() => handleQuickAction("tasks")}
        >
          <CardContent className="p-4 text-center">
            <CheckSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-800">Create Task</h3>
            <p className="text-xs text-slate-600">Stay organized</p>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleCompleteOnboarding}
        size="lg"
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
      >
        Start Using Personal Organizer
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  )

  const renderCurrentStep = () => {
    switch (ONBOARDING_STEPS[currentStep]) {
      case "welcome":
        return renderWelcomeStep()
      case "benefits":
        return renderBenefitsStep()
      case "install":
        return renderInstallStep()
      case "setup":
        return renderSetupStep()
      case "complete":
        return renderCompleteStep()
      default:
        return renderWelcomeStep()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">{renderCurrentStep()}</CardContent>
        </Card>

        {/* Navigation */}
        {currentStep !== ONBOARDING_STEPS.length - 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={handlePrevious}
              variant="ghost"
              disabled={currentStep === 0}
              className="text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep !== 0 && currentStep !== 2 && (
              <Button onClick={handleNext} variant="outline" className="bg-white/50">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
