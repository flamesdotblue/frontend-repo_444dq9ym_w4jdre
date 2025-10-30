import SunCalc from 'suncalc'
import { useMemo } from 'react'
import { Sunrise, Sunset, Moon, Calendar as Cal, MapPin } from 'lucide-react'

function formatTime(date) {
  if (!date) return '—'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function moonPhaseName(phase) {
  // phase: 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter
  const p = phase
  if (p < 0.03 || p > 0.97) return 'New Moon'
  if (p < 0.22) return 'Waxing Crescent'
  if (p < 0.28) return 'First Quarter'
  if (p < 0.47) return 'Waxing Gibbous'
  if (p < 0.53) return 'Full Moon'
  if (p < 0.72) return 'Waning Gibbous'
  if (p < 0.78) return 'Last Quarter'
  return 'Waning Crescent'
}

function DayDetails({ date, location }) {
  const { lat, lon } = location || { lat: 10.1632, lon: 76.6413 }

  const data = useMemo(() => {
    try {
      const times = SunCalc.getTimes(date, lat, lon)
      const moonIllum = SunCalc.getMoonIllumination(date)
      const moonTimes = SunCalc.getMoonTimes(date, lat, lon)

      return {
        sunrise: times.sunrise,
        sunset: times.sunset,
        moonrise: moonTimes.rise || null,
        moonset: moonTimes.set || null,
        moonPhase: moonPhaseName(moonIllum.phase),
        illumination: Math.round(moonIllum.fraction * 100),
      }
    } catch (e) {
      return null
    }
  }, [date, lat, lon])

  // Malayalam calendar placeholders are marked clearly to avoid misinformation.
  const malayalamInfo = useMemo(() => {
    return {
      available: false,
      note:
        'Malayalam calendar date and nakshatra require precise Panchang data. Backend will provide this in a later update.',
    }
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Selected date</div>
          <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Cal size={18} /> {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Location</div>
          <div className="text-sm font-medium text-gray-900 flex items-center gap-1 justify-end">
            <MapPin size={16} /> {lat.toFixed(3)}, {lon.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 font-medium">
            <Sunrise size={18} /> Sunrise
          </div>
          <div className="text-xl font-semibold text-blue-900 mt-1">{formatTime(data?.sunrise)}</div>
        </div>
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2 text-orange-700 font-medium">
            <Sunset size={18} /> Sunset
          </div>
          <div className="text-xl font-semibold text-orange-900 mt-1">{formatTime(data?.sunset)}</div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
        <div className="flex items-center gap-2 text-purple-700 font-medium">
          <Moon size={18} /> Moon phase
        </div>
        <div className="mt-1 text-purple-900">
          <div className="text-lg font-semibold">{data?.moonPhase || '—'}</div>
          {typeof data?.illumination === 'number' && (
            <div className="text-sm">Illumination: {data.illumination}%</div>
          )}
          <div className="text-xs text-purple-700 mt-1">
            {data?.moonrise ? `Moonrise ${formatTime(data.moonrise)}` : 'Moonrise —'} · {data?.moonset ? `Moonset ${formatTime(data.moonset)}` : 'Moonset —'}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className="text-gray-700 font-medium">Malayalam calendar</div>
        <div className="mt-1 text-sm text-gray-700">
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">Not available offline</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Star sign (Nakshatra)</span>
            <span className="font-medium">Not available offline</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{malayalamInfo.note}</p>
        </div>
      </div>
    </div>
  )
}

export default DayDetails
