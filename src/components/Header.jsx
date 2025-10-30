import { CalendarDays } from 'lucide-react'

function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
          <CalendarDays size={22} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
            Malayalam Day Finder
          </h1>
          <p className="text-xs md:text-sm text-gray-500">Tap a date on the English calendar to see day details</p>
        </div>
      </div>
      <a
        href="/test"
        className="text-xs md:text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4"
      >
        Backend status
      </a>
    </header>
  )
}

export default Header
