import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1)
}

function getCalendarDays(viewDate) {
  const start = startOfMonth(viewDate)
  const end = endOfMonth(viewDate)

  const startWeekday = (start.getDay() + 6) % 7 // Monday=0
  const daysInMonth = end.getDate()

  const days = []
  // Previous month padding
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() - (startWeekday - i))
    days.push({ date: d, outside: true })
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i)
    days.push({ date: d, outside: false })
  }
  // Next month padding to complete weeks (6 rows)
  const total = Math.ceil(days.length / 7) * 7
  while (days.length < total) {
    const last = days[days.length - 1].date
    const d = new Date(last)
    d.setDate(d.getDate() + 1)
    days.push({ date: d, outside: true })
  }
  return days
}

function CalendarMonth({ viewDate, selectedDate, onSelect, onNavigate }) {
  const days = useMemo(() => getCalendarDays(viewDate), [viewDate])
  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const todayStr = new Date().toDateString()

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <button
          aria-label="Previous month"
          onClick={() => onNavigate(addMonths(viewDate, -1))}
          className="p-2 rounded-md hover:bg-gray-100 active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-sm font-semibold text-gray-800">{monthLabel}</div>
        <button
          aria-label="Next month"
          onClick={() => onNavigate(addMonths(viewDate, 1))}
          className="p-2 rounded-md hover:bg-gray-100 active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {weekDays.map((d) => (
          <div
            key={d}
            className="bg-gray-50 text-[11px] md:text-xs font-medium text-gray-500 tracking-wide py-2 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {days.map(({ date, outside }) => {
          const isToday = date.toDateString() === todayStr
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={[
                'aspect-square bg-white flex items-center justify-center text-sm md:text-base transition-colors',
                outside ? 'text-gray-300' : 'text-gray-700',
                isSelected ? 'bg-blue-600 text-white' : '',
                !isSelected && isToday ? 'ring-2 ring-blue-500 ring-offset-2' : '',
              ].join(' ')}
            >
              <span className="font-medium">{date.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarMonth
