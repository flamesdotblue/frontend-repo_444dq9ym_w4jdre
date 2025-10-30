import { useEffect, useMemo, useState } from 'react'
import { Sun, Sunrise, Sunset, Moon } from 'lucide-react'

// Approximate Malayalam month lengths (days) and order starting mid-Aug
const MAL_MONTHS = [
  'Chingam',
  'Kanni',
  'Thulam',
  'Vrischikam',
  'Dhanu',
  'Makaram',
  'Kumbham',
  'Meenam',
  'Medam',
  'Edavam',
  'Mithunam',
  'Karkidakam',
]
const MAL_MONTH_LENGTHS = [31, 30, 31, 30, 30, 29, 30, 31, 31, 31, 30, 30]

const NAKSHATRAS = [
  'Ashwati', 'Bharani', 'Karthika', 'Rohini', 'Makayiram', 'Thiruvathira', 'Punartham', 'Pooyam', 'Ayilyam',
  'Makam', 'Pooram', 'Uthram', 'Atham', 'Chithra', 'Chothi', 'Visakham', 'Anizham', 'Thrikketta', 'Moolam',
  'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittam', 'Chathayam', 'Pooruruttathi', 'Uthrattathi', 'Revathi'
]

function pad(n) { return String(n).padStart(2, '0') }

// NOAA-like simple sunrise/sunset calculation
function toJulian(date) {
  return date / 86400000 + 2440587.5
}
function solarMeanAnomaly(d) {
  return (357.5291 + 0.98560028 * d) * (Math.PI / 180)
}
function eclipticLongitude(M) {
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * (Math.PI / 180)
  const P = 102.9372 * (Math.PI / 180)
  return M + C + P + Math.PI
}
function declination(L) {
  const e = 23.4397 * (Math.PI / 180)
  return Math.asin(Math.sin(e) * Math.sin(L))
}
function hourAngle(lat, dec) {
  const h = Math.acos((Math.sin(-0.83 * Math.PI / 180) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec)))
  return h
}
function getSetJ(date, lat, lng, rising) {
  const lw = -lng * (Math.PI / 180)
  const phi = lat * (Math.PI / 180)
  const d = toJulian(date) - 2451545.0
  const M = solarMeanAnomaly(d)
  const L = eclipticLongitude(M)
  const dec = declination(L)
  const H = hourAngle(phi, dec) * (rising ? -1 : 1)
  const Jtransit = 2451545.0 + d + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L)
  const JriseSet = Jtransit + (H + lw) / (2 * Math.PI)
  return (JriseSet - 2440587.5) * 86400000
}
function formatTime(date) {
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ampm = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${pad(mm)} ${ampm}`
}

// Moon phase simple approximation
function moonPhase(date) {
  const synodic = 29.53058867
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14))
  const days = (date - knownNewMoon) / 86400000
  const age = ((days % synodic) + synodic) % synodic
  const phase = age / synodic

  const names = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ]
  const index = Math.floor((phase * 8) + 0.5) % 8
  return { age: age.toFixed(1), name: names[index] }
}

// Approx Malayalam date approximation
function malayalamDate(gd) {
  // Chingam roughly starts on Aug 17
  const year = gd.getMonth() >= 7 ? gd.getFullYear() : gd.getFullYear() - 1
  const start = new Date(year, 7, 17)
  const diffDays = Math.floor((new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()) - start) / 86400000)
  let d = diffDays
  let monthIndex = 0
  while (d >= MAL_MONTH_LENGTHS[monthIndex]) {
    d -= MAL_MONTH_LENGTHS[monthIndex]
    monthIndex = (monthIndex + 1) % 12
  }
  const day = d + 1
  const kollavarsham = year - 825 // Kollavarsham approx offset
  return { month: MAL_MONTHS[monthIndex], day, year: kollavarsham }
}

// Approx Nakshatra using sidereal month length
function nakshatra(date) {
  const sidereal = 27.321661
  const epoch = new Date(Date.UTC(2000, 0, 1, 0, 0))
  const days = (date - epoch) / 86400000
  const idx = Math.floor(((days % sidereal) + sidereal) % sidereal / (sidereal / 27))
  return NAKSHATRAS[idx]
}

function DayDetails({ date, location }) {
  const [sunTimes, setSunTimes] = useState({ sunrise: '-', sunset: '-' })

  const mal = useMemo(() => malayalamDate(date), [date])
  const phase = useMemo(() => moonPhase(date), [date])
  const star = useMemo(() => nakshatra(date), [date])

  useEffect(() => {
    if (!location) return
    // compute sunrise/sunset in local timezone of device
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const sunriseMs = getSetJ(d, location.lat, location.lon, true)
    const sunsetMs = getSetJ(d, location.lat, location.lon, false)
    const rise = new Date(sunriseMs)
    const set = new Date(sunsetMs)
    setSunTimes({ sunrise: formatTime(rise), sunset: formatTime(set) })
  }, [date, location])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="text-amber-500" size={18} />
        <h3 className="font-semibold text-gray-800">Day Details</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">English Date</span>
          <span className="font-medium">{date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Malayalam Date</span>
          <span className="font-medium">{mal.month} {mal.day}, {mal.year}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Star (Nakshatra)</span>
          <span className="font-medium">{star}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Sunrise size={16} />
              <span>Sunrise</span>
            </div>
            <span className="font-semibold text-gray-800">{sunTimes.sunrise}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Sunset size={16} />
              <span>Sunset</span>
            </div>
            <span className="font-semibold text-gray-800">{sunTimes.sunset}</span>
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <Moon size={16} />
            <span>Moon</span>
          </div>
          <span className="font-semibold text-indigo-900">{phase.name} · age {phase.age}d</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">Values are approximate for quick reference.</p>
    </div>
  )
}

export default DayDetails
