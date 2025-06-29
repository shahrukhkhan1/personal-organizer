"use client"

import { useState, useEffect } from "react"
import { Download, X, Smartphone, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running as PWA
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)

    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show prompt after 30 seconds if not dismissed
      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed")
        const installed = localStorage.getItem("pwa-installed")

        if (!dismissed && !installed && !isStandalone) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      localStorage.setItem("pwa-installed", "true")
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        localStorage.setItem("pwa-installed", "true")
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")

    // Show again after 7 days
    setTimeout(
      () => {
        localStorage.removeItem("pwa-install-dismissed")
      },
      7 * 24 * 60 * 60 * 1000,
    )
  }

  // Don't show if already installed or dismissed
  if (isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              {isIOS ? <Smartphone className="h-5 w-5 text-white" /> : <Monitor className="h-5 w-5 text-white" />}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Install Personal Organizer</h3>
              <p className="text-xs text-slate-600 mb-3">
                {isIOS
                  ? "Add to your home screen for the best experience. Tap the share button and select 'Add to Home Screen'."
                  : "Install our app for faster access, offline support, and a native experience."}
              </p>

              <div className="flex gap-2">
                {!isIOS && deferredPrompt && (
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Install
                  </Button>
                )}
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700 text-xs px-2 py-1.5 h-auto"
                >
                  Maybe Later
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
