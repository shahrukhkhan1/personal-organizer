// Data persistence utilities
const STORAGE_KEYS = {
  CONTACTS: "organizer_contacts",
  NOTES: "organizer_notes",
  TASKS: "organizer_tasks",
  SETTINGS: "organizer_settings",
  ONBOARDING: "organizer_onboarding_completed",
}

export const storage = {
  // Get data from localStorage with fallback
  get: (key) => {
    try {
      if (typeof window === "undefined") return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  },

  // Set data to localStorage with error handling
  set: (key, value) => {
    try {
      if (typeof window === "undefined") return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      if (typeof window === "undefined") return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },

  // Clear all app data
  clear: () => {
    try {
      if (typeof window === "undefined") return false
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },
}

// Specific storage functions for each data type
export const contactsStorage = {
  get: () => storage.get(STORAGE_KEYS.CONTACTS) || [],
  set: (contacts) => storage.set(STORAGE_KEYS.CONTACTS, contacts),
}

export const notesStorage = {
  get: () => storage.get(STORAGE_KEYS.NOTES) || [],
  set: (notes) => storage.set(STORAGE_KEYS.NOTES, notes),
}

export const tasksStorage = {
  get: () => storage.get(STORAGE_KEYS.TASKS) || [],
  set: (tasks) => storage.set(STORAGE_KEYS.TASKS, tasks),
}

export const settingsStorage = {
  get: () => storage.get(STORAGE_KEYS.SETTINGS) || {},
  set: (settings) => storage.set(STORAGE_KEYS.SETTINGS, settings),
}

// Enhanced onboarding storage with better error handling and debugging
export const onboardingStorage = {
  isCompleted: () => {
    try {
      const completed = storage.get(STORAGE_KEYS.ONBOARDING)
      console.log("onboardingStorage.isCompleted() - Raw value:", completed)
      console.log("onboardingStorage.isCompleted() - Type:", typeof completed)
      console.log("onboardingStorage.isCompleted() - Result:", completed === true)
      return completed === true
    } catch (error) {
      console.error("Error checking onboarding completion:", error)
      return false
    }
  },
  setCompleted: () => {
    try {
      console.log("onboardingStorage.setCompleted() - Setting onboarding as completed")
      const result = storage.set(STORAGE_KEYS.ONBOARDING, true)
      console.log("onboardingStorage.setCompleted() - Set result:", result)

      // Verify it was set correctly
      const verification = storage.get(STORAGE_KEYS.ONBOARDING)
      console.log("onboardingStorage.setCompleted() - Verification:", verification)

      return result
    } catch (error) {
      console.error("Error setting onboarding completion:", error)
      return false
    }
  },
  reset: () => {
    try {
      console.log("onboardingStorage.reset() - Resetting onboarding")
      const result = storage.remove(STORAGE_KEYS.ONBOARDING)
      console.log("onboardingStorage.reset() - Reset result:", result)
      return result
    } catch (error) {
      console.error("Error resetting onboarding:", error)
      return false
    }
  },
}

export { STORAGE_KEYS }
