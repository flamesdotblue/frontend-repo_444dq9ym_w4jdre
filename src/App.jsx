import { useMemo, useState } from 'react'
import Header from './components/Header'
import CalendarMonth from './components/CalendarMonth'
import DayDetails from './components/DayDetails'
import LocationPicker from './components/LocationPicker'

function App() {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selected, setSelected] = useState(() => new Date())
  const [location, setLocation] = useState(null)

  const title = useMemo(
    () => selected.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
    [selected]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto">
        <Header />

        <main className="px-4 pb-20 space-y-4">
          <div className="sticky top-0 z-10 -mx-4 px-4 pb-2 pt-1 bg-gradient-to-b from-blue-50 to-transparent">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          <CalendarMonth
            viewDate={viewDate}
            selectedDate={selected}
            onSelect={(d) => setSelected(d)}
            onNavigate={(d) => setViewDate(d)}
          />

          <DayDetails date={selected} location={location} />

          <LocationPicker value={location} onChange={setLocation} />
        </main>
      </div>
    </div>
  )
}

export default App
