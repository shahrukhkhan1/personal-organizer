export default function ContactsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-lg">📞</span>
        </div>
        <p className="text-slate-600">Loading Contacts...</p>
        <div className="w-32 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
