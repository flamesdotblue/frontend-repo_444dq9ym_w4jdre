import { useEffect, useState } from 'react'
import { MapPin, LocateFixed } from 'lucide-react'

function LocationPicker({ value, onChange }) {
  const [status, setStatus] = useState('')
  const [lat, setLat] = useState(value?.lat ?? 10.1632)
  const [lon, setLon] = useState(value?.lon ?? 76.6413)

  useEffect(() => {
    onChange({ lat, lon })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setStatus('Geolocation not supported by your browser')
      return
    }
    setStatus('Locating…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLat(Number(latitude.toFixed(6)))
        setLon(Number(longitude.toFixed(6)))
        onChange({ lat: latitude, lon: longitude })
        setStatus('')
      },
      (err) => {
        setStatus(err.message || 'Could not get your location')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const applyManual = () => {
    onChange({ lat: Number(lat), lon: Number(lon) })
    setStatus('')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-blue-600" size={18} />
        <h3 className="font-semibold text-gray-800">Location</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={applyManual}
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={useMyLocation}
          className="px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
        >
          <LocateFixed size={16} /> Use my location
        </button>
      </div>

      {status && (
        <p className="mt-2 text-xs text-gray-500">{status}</p>
      )}
    </div>
  )
}

export default LocationPicker
