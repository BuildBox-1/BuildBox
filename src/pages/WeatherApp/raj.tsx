import { useState } from 'react'
import { Link } from 'react-router'

interface WeatherData {
    city: string
    temp: number
    feelsLike: number
    humidity: number
    windSpeed: number
    weatherCode: number
    isDay: number
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
    0: { label: 'Clear sky', icon: '☀' },
    1: { label: 'Mainly clear', icon: '🌤' },
    2: { label: 'Partly cloudy', icon: '⛅' },
    3: { label: 'Overcast', icon: '☁' },
    45: { label: 'Fog', icon: '🌫' },
    48: { label: 'Icy fog', icon: '🌫' },
    51: { label: 'Light drizzle', icon: '🌦' },
    53: { label: 'Drizzle', icon: '🌦' },
    55: { label: 'Heavy drizzle', icon: '🌧' },
    61: { label: 'Light rain', icon: '🌧' },
    63: { label: 'Rain', icon: '🌧' },
    65: { label: 'Heavy rain', icon: '🌧' },
    71: { label: 'Light snow', icon: '🌨' },
    73: { label: 'Snow', icon: '❄' },
    75: { label: 'Heavy snow', icon: '❄' },
    80: { label: 'Rain showers', icon: '🌦' },
    95: { label: 'Thunderstorm', icon: '⛈' },
}

function getWeather(code: number) {
    return WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡' }
}

async function fetchCoords(city: string) {
    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    const data = await res.json()
    if (!data.results?.length) throw new Error('City not found')
    return data.results[0] as { latitude: number; longitude: number; name: string; country: string }
}

async function fetchWeather(lat: number, lon: number): Promise<Omit<WeatherData, 'city'>> {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day` +
        `&temperature_unit=celsius`
    )
    const data = await res.json()
    const c = data.current
    return {
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        windSpeed: Math.round(c.wind_speed_10m),
        weatherCode: c.weather_code,
        isDay: c.is_day,
    }
}

export default function WeatherApp() {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const search = async () => {
        if (!city.trim()) return
        setLoading(true)
        setError('')
        setWeather(null)
        try {
            const location = await fetchCoords(city.trim())
            const data = await fetchWeather(location.latitude, location.longitude)
            setWeather({ ...data, city: `${location.name}, ${location.country}` })
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const condition = weather ? getWeather(weather.weatherCode) : null

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            <Link
                to="/projects/weather-app"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
            >
                ← Back
            </Link>

            <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-1">☁ Weather App</h1>
            <p className="font-mono text-xs text-(--text) mb-8">
                Powered by{' '}
                <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-(--accent) hover:underline">
                    Open-Meteo
                </a>{' '}
                — no API key needed
            </p>

            {/* Search */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                    placeholder="Enter a city…"
                    className="flex-1 font-mono text-sm bg-(--code-bg) border border-(--border) rounded-lg px-4 py-2.5 text-(--text-h) placeholder:text-(--text) outline-none focus:border-(--accent) transition-colors"
                />
                <button
                    onClick={search}
                    disabled={loading}
                    className="font-mono text-sm bg-(--accent) text-white px-4 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50"
                >
                    {loading ? '…' : 'Search'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <p className="font-mono text-sm text-red-400 border border-red-400/30 bg-red-400/10 rounded-lg px-4 py-3 mb-4">
                    {error}
                </p>
            )}

            {/* Result */}
            {weather && condition && (
                <div className="flex flex-col gap-3">

                    {/* Main card */}
                    <div className="bg-(--code-bg) border border-(--accent-border) rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="font-mono text-xs text-(--accent) uppercase tracking-widest mb-1">
                                    {condition.label}
                                </p>
                                <h2 className="text-lg font-bold text-(--text-h) tracking-tight">{weather.city}</h2>
                            </div>
                            <span className="text-5xl leading-none">{condition.icon}</span>
                        </div>

                        <div className="flex items-end gap-3">
                            <span className="text-6xl font-bold text-(--text-h) tracking-tighter leading-none">
                                {weather.temp}°
                            </span>
                            <span className="font-mono text-sm text-(--text) mb-2">Celsius</span>
                        </div>
                    </div>

                    {/* Stat row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Feels like', value: `${weather.feelsLike}°C` },
                            { label: 'Humidity', value: `${weather.humidity}%` },
                            { label: 'Wind', value: `${weather.windSpeed} km/h` },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-(--code-bg) border border-(--border) rounded-xl px-3 py-3 text-center"
                            >
                                <div className="text-sm font-semibold text-(--text-h)">{stat.value}</div>
                                <div className="font-mono text-[10px] text-(--text) mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}