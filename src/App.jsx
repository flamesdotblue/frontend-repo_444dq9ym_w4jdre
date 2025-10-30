import { useMemo, useState } from 'react'
import Header from './components/Header'
import CalendarGrid from './components/CalendarGrid'
import DayDetails from './components/DayDetails'
import LocationPicker from './components/LocationPicker'

function App() {
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [location, setLocation] = useState({ lat: 10.1632, lon: 76.6413 }) // Kochi default

  const handleMonthChange = (delta) => {
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))
  }

  // Keep selected date in sync when months change if it falls outside
  useMemo(() => {
    if (
      selectedDate.getFullYear() !== monthDate.getFullYear() ||
      selectedDate.getMonth() !== monthDate.getMonth()
    ) {
      // keep it; user can reselect. No automatic change.
    }
  }, [monthDate, selectedDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <Header />

      <main className="mx-auto max-w-6xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            monthDate={monthDate}
            onMonthChange={handleMonthChange}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div className="space-y-4">
          <LocationPicker value={location} onChange={setLocation} />
          <DayDetails date={selectedDate} location={location} />
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-gray-500">
        Built for a smooth mobile experience. Add to Home Screen for an app-like feel.
      </footer>
    </div>
  )
}

export default App
