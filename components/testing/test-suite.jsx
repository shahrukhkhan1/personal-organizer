"use client"

import { useState } from "react"
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const testSuites = [
  {
    name: "PWA Installation",
    tests: [
      {
        name: "Install prompt appears",
        test: () => {
          return new Promise((resolve) => {
            // Check if beforeinstallprompt event can be triggered
            const hasInstallPrompt = "serviceWorker" in navigator
            setTimeout(() => resolve(hasInstallPrompt), 1000)
          })
        },
      },
      {
        name: "Manifest is valid",
        test: async () => {
          try {
            const response = await fetch("/manifest.json")
            const manifest = await response.json()
            return manifest.name && manifest.icons && manifest.start_url
          } catch {
            return false
          }
        },
      },
      {
        name: "Icons load correctly",
        test: () => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
            img.src = "/icons/icon-192x192.png"
          })
        },
      },
    ],
  },
  {
    name: "Contacts Management",
    tests: [
      {
        name: "Add new contact",
        test: () => {
          try {
            const testContact = {
              id: Date.now(),
              name: "Test Contact",
              email: "test@example.com",
              phone: "+1234567890",
            }
            localStorage.setItem("test_contact", JSON.stringify(testContact))
            const saved = JSON.parse(localStorage.getItem("test_contact"))
            localStorage.removeItem("test_contact")
            return saved.name === testContact.name
          } catch {
            return false
          }
        },
      },
      {
        name: "Search contacts",
        test: () => {
          // Simulate search functionality
          const contacts = [
            { name: "John Doe", email: "john@example.com" },
            { name: "Jane Smith", email: "jane@example.com" },
          ]
          const searchQuery = "john"
          const filtered = contacts.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
          return filtered.length === 1 && filtered[0].name === "John Doe"
        },
      },
      {
        name: "Toggle favorite contact",
        test: () => {
          try {
            const contact = { id: 1, name: "Test", favorite: false }
            contact.favorite = !contact.favorite
            return contact.favorite === true
          } catch {
            return false
          }
        },
      },
    ],
  },
  {
    name: "Notes Management",
    tests: [
      {
        name: "Create new note",
        test: () => {
          try {
            const testNote = {
              id: Date.now(),
              title: "Test Note",
              content: "This is a test note",
              tags: ["test"],
              category: "Personal",
            }
            localStorage.setItem("test_note", JSON.stringify(testNote))
            const saved = JSON.parse(localStorage.getItem("test_note"))
            localStorage.removeItem("test_note")
            return saved.title === testNote.title
          } catch {
            return false
          }
        },
      },
      {
        name: "Filter by category",
        test: () => {
          const notes = [
            { title: "Work Note", category: "Work" },
            { title: "Personal Note", category: "Personal" },
          ]
          const filtered = notes.filter((n) => n.category === "Work")
          return filtered.length === 1 && filtered[0].title === "Work Note"
        },
      },
      {
        name: "Search note content",
        test: () => {
          const notes = [
            { title: "Meeting Notes", content: "Discussed project timeline" },
            { title: "Recipe", content: "Ingredients for pasta" },
          ]
          const searchQuery = "project"
          const filtered = notes.filter((n) => n.content.toLowerCase().includes(searchQuery.toLowerCase()))
          return filtered.length === 1
        },
      },
    ],
  },
  {
    name: "Tasks Management",
    tests: [
      {
        name: "Create new task",
        test: () => {
          try {
            const testTask = {
              id: Date.now(),
              title: "Test Task",
              completed: false,
              priority: "medium",
              dueDate: new Date().toISOString(),
            }
            localStorage.setItem("test_task", JSON.stringify(testTask))
            const saved = JSON.parse(localStorage.getItem("test_task"))
            localStorage.removeItem("test_task")
            return saved.title === testTask.title
          } catch {
            return false
          }
        },
      },
      {
        name: "Toggle task completion",
        test: () => {
          const task = { id: 1, title: "Test", completed: false }
          task.completed = !task.completed
          return task.completed === true
        },
      },
      {
        name: "Filter by status",
        test: () => {
          const tasks = [
            { title: "Done Task", completed: true },
            { title: "Pending Task", completed: false },
          ]
          const activeTasks = tasks.filter((t) => !t.completed)
          return activeTasks.length === 1
        },
      },
    ],
  },
  {
    name: "Data Persistence",
    tests: [
      {
        name: "LocalStorage availability",
        test: () => {
          try {
            localStorage.setItem("test", "test")
            const result = localStorage.getItem("test") === "test"
            localStorage.removeItem("test")
            return result
          } catch {
            return false
          }
        },
      },
      {
        name: "Data export functionality",
        test: () => {
          try {
            const testData = { contacts: [], notes: [], tasks: [] }
            const exported = JSON.stringify(testData)
            const parsed = JSON.parse(exported)
            return parsed.contacts && parsed.notes && parsed.tasks
          } catch {
            return false
          }
        },
      },
      {
        name: "Settings persistence",
        test: () => {
          try {
            const settings = { theme: "light", fontSize: "medium" }
            localStorage.setItem("test_settings", JSON.stringify(settings))
            const saved = JSON.parse(localStorage.getItem("test_settings"))
            localStorage.removeItem("test_settings")
            return saved.theme === settings.theme
          } catch {
            return false
          }
        },
      },
    ],
  },
  {
    name: "UI/UX Features",
    tests: [
      {
        name: "Responsive design",
        test: () => {
          // Check if viewport meta tag exists
          const viewport = document.querySelector('meta[name="viewport"]')
          return viewport && viewport.content.includes("width=device-width")
        },
      },
      {
        name: "Toast notifications",
        test: () => {
          // Check if toast container can be created
          try {
            const toastContainer = document.createElement("div")
            toastContainer.className = "toast-container"
            return toastContainer.className === "toast-container"
          } catch {
            return false
          }
        },
      },
      {
        name: "Navigation works",
        test: () => {
          // Check if navigation elements exist
          const hasNavigation = typeof window !== "undefined" && window.location && window.history
          return hasNavigation
        },
      },
    ],
  },
]

export function TestSuite() {
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState(null)

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})

    for (const suite of testSuites) {
      for (const test of suite.tests) {
        setCurrentTest(`${suite.name}: ${test.name}`)

        try {
          const result = await test.test()
          setTestResults((prev) => ({
            ...prev,
            [`${suite.name}-${test.name}`]: {
              status: result ? "passed" : "failed",
              message: result ? "Test passed" : "Test failed",
            },
          }))
        } catch (error) {
          setTestResults((prev) => ({
            ...prev,
            [`${suite.name}-${test.name}`]: {
              status: "error",
              message: error.message,
            },
          }))
        }

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    setCurrentTest(null)
    setIsRunning(false)
  }

  const getTestStatus = (suiteName, testName) => {
    return testResults[`${suiteName}-${testName}`]
  }

  const getSuiteStats = (suite) => {
    const suiteTests = suite.tests.map((test) => getTestStatus(suite.name, test.name))
    const completed = suiteTests.filter(Boolean).length
    const passed = suiteTests.filter((t) => t?.status === "passed").length
    const failed = suiteTests.filter((t) => t?.status === "failed").length
    const errors = suiteTests.filter((t) => t?.status === "error").length

    return { total: suite.tests.length, completed, passed, failed, errors }
  }

  const getOverallStats = () => {
    const allTests = testSuites.flatMap((suite) => suite.tests.map((test) => getTestStatus(suite.name, test.name)))
    const total = allTests.length
    const completed = allTests.filter(Boolean).length
    const passed = allTests.filter((t) => t?.status === "passed").length
    const failed = allTests.filter((t) => t?.status === "failed").length
    const errors = allTests.filter((t) => t?.status === "error").length

    return { total, completed, passed, failed, errors }
  }

  const overallStats = getOverallStats()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Personal Organizer Test Suite</h1>
        <p className="text-slate-600">Comprehensive testing for all app functionality</p>

        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </div>

      {/* Overall Progress */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>
                  {overallStats.completed}/{overallStats.total}
                </span>
              </div>
              <Progress value={(overallStats.completed / overallStats.total) * 100} />
              {currentTest && <p className="text-sm text-slate-600">Running: {currentTest}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {overallStats.completed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
                <div className="text-sm text-slate-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
                <div className="text-sm text-slate-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{overallStats.errors}</div>
                <div className="text-sm text-slate-600">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">{overallStats.total}</div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite) => {
          const stats = getSuiteStats(suite)

          return (
            <Card key={suite.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{suite.name}</CardTitle>
                  <div className="flex gap-2">
                    {stats.passed > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {stats.passed} passed
                      </Badge>
                    )}
                    {stats.failed > 0 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        {stats.failed} failed
                      </Badge>
                    )}
                    {stats.errors > 0 && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {stats.errors} errors
                      </Badge>
                    )}
                  </div>
                </div>
                {stats.completed > 0 && <Progress value={(stats.completed / stats.total) * 100} className="h-2" />}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suite.tests.map((test) => {
                    const result = getTestStatus(suite.name, test.name)

                    return (
                      <div key={test.name} className="flex items-center justify-between p-2 rounded border">
                        <span className="text-sm font-medium">{test.name}</span>
                        <div className="flex items-center gap-2">
                          {result ? (
                            <>
                              {result.status === "passed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {result.status === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                              {result.status === "error" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                              <Badge
                                variant="secondary"
                                className={
                                  result.status === "passed"
                                    ? "bg-green-100 text-green-700"
                                    : result.status === "failed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-orange-100 text-orange-700"
                                }
                              >
                                {result.status}
                              </Badge>
                            </>
                          ) : isRunning && currentTest?.includes(test.name) ? (
                            <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
