import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function getMonthMatrix(activeDate) {
  const start = startOfMonth(activeDate)
  const end = endOfMonth(activeDate)
  const startWeekDay = (start.getDay() + 6) % 7 // make Monday=0

  const days = []
  // leading blanks
  for (let i = 0; i < startWeekDay; i++) days.push(null)
  // month days
  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(activeDate.getFullYear(), activeDate.getMonth(), d))
  }
  // chunk into weeks
  const rows = []
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))
  return rows
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function CalendarGrid({ monthDate, onMonthChange, selectedDate, onSelectDate }) {
  const rows = useMemo(() => getMonthMatrix(monthDate), [monthDate])
  const today = new Date()

  const isSameDay = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          aria-label="Previous month"
          onClick={() => onMonthChange(-1)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          <div className="text-xs text-gray-500">Gregorian calendar</div>
        </div>
        <button
          aria-label="Next month"
          onClick={() => onMonthChange(1)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {rows.map((week, i) => (
          <div key={i} className="contents">
            {week.map((day, j) => {
              if (!day) return <div key={`${i}-${j}`} className="h-12" />
              const isToday = isSameDay(day, today)
              const isSelected = isSameDay(day, selectedDate)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => onSelectDate(day)}
                  className={`h-12 rounded-md text-sm flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isToday
                      ? 'border-blue-200 text-blue-700 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
