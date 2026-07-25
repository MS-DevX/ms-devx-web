"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface WorldCity {
  city: string;
  country: string;
  timezone: string;
  flag: string;
}

const WORLD_CITIES: WorldCity[] = [
  { city: "New York", country: "USA", timezone: "America/New_York", flag: "🇺🇸" },
  { city: "Los Angeles", country: "USA", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Chicago", country: "USA", timezone: "America/Chicago", flag: "🇺🇸" },
  { city: "Miami", country: "USA", timezone: "America/New_York", flag: "🇺🇸" },
  { city: "Denver", country: "USA", timezone: "America/Denver", flag: "🇺🇸" },
  { city: "Phoenix", country: "USA", timezone: "America/Phoenix", flag: "🇺🇸" },
  { city: "Seattle", country: "USA", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Toronto", country: "Canada", timezone: "America/Toronto", flag: "🇨🇦" },
  { city: "Vancouver", country: "Canada", timezone: "America/Vancouver", flag: "🇨🇦" },
  { city: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", flag: "🇲🇽" },
  { city: "São Paulo", country: "Brazil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
  { city: "Rio de Janeiro", country: "Brazil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
  { city: "Buenos Aires", country: "Argentina", timezone: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
  { city: "Lima", country: "Peru", timezone: "America/Lima", flag: "🇵🇪" },
  { city: "Santiago", country: "Chile", timezone: "America/Santiago", flag: "🇨🇱" },
  { city: "Bogotá", country: "Colombia", timezone: "America/Bogota", flag: "🇨🇴" },
  { city: "London", country: "United Kingdom", timezone: "Europe/London", flag: "🇬🇧" },
  { city: "Paris", country: "France", timezone: "Europe/Paris", flag: "🇫🇷" },
  { city: "Berlin", country: "Germany", timezone: "Europe/Berlin", flag: "🇩🇪" },
  { city: "Rome", country: "Italy", timezone: "Europe/Rome", flag: "🇮🇹" },
  { city: "Madrid", country: "Spain", timezone: "Europe/Madrid", flag: "🇪🇸" },
  { city: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam", flag: "🇳🇱" },
  { city: "Brussels", country: "Belgium", timezone: "Europe/Brussels", flag: "🇧🇪" },
  { city: "Zurich", country: "Switzerland", timezone: "Europe/Zurich", flag: "🇨🇭" },
  { city: "Vienna", country: "Austria", timezone: "Europe/Vienna", flag: "🇦🇹" },
  { city: "Stockholm", country: "Sweden", timezone: "Europe/Stockholm", flag: "🇸🇪" },
  { city: "Oslo", country: "Norway", timezone: "Europe/Oslo", flag: "🇳🇴" },
  { city: "Copenhagen", country: "Denmark", timezone: "Europe/Copenhagen", flag: "🇩🇰" },
  { city: "Warsaw", country: "Poland", timezone: "Europe/Warsaw", flag: "🇵🇱" },
  { city: "Prague", country: "Czechia", timezone: "Europe/Prague", flag: "🇨🇿" },
  { city: "Budapest", country: "Hungary", timezone: "Europe/Budapest", flag: "🇭🇺" },
  { city: "Moscow", country: "Russia", timezone: "Europe/Moscow", flag: "🇷🇺" },
  { city: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", flag: "🇹🇷" },
  { city: "Athens", country: "Greece", timezone: "Europe/Athens", flag: "🇬🇷" },
  { city: "Lisbon", country: "Portugal", timezone: "Europe/Lisbon", flag: "🇵🇹" },
  { city: "Dublin", country: "Ireland", timezone: "Europe/Dublin", flag: "🇮🇪" },
  { city: "Dubai", country: "UAE", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Abu Dhabi", country: "UAE", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Riyadh", country: "Saudi Arabia", timezone: "Asia/Riyadh", flag: "🇸🇦" },
  { city: "Doha", country: "Qatar", timezone: "Asia/Qatar", flag: "🇶🇦" },
  { city: "Kuwait City", country: "Kuwait", timezone: "Asia/Kuwait", flag: "🇰🇼" },
  { city: "Tel Aviv", country: "Israel", timezone: "Asia/Jerusalem", flag: "🇮🇱" },
  { city: "Cairo", country: "Egypt", timezone: "Africa/Cairo", flag: "🇪🇬" },
  { city: "Johannesburg", country: "South Africa", timezone: "Africa/Johannesburg", flag: "🇿🇦" },
  { city: "Cape Town", country: "South Africa", timezone: "Africa/Johannesburg", flag: "🇿🇦" },
  { city: "Lagos", country: "Nigeria", timezone: "Africa/Lagos", flag: "🇳🇬" },
  { city: "Nairobi", country: "Kenya", timezone: "Africa/Nairobi", flag: "🇰🇪" },
  { city: "Casablanca", country: "Morocco", timezone: "Africa/Casablanca", flag: "🇲🇦" },
  { city: "Mumbai", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Delhi", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Bangalore", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Hyderabad", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Chennai", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Kolkata", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", flag: "🇵🇰" },
  { city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", flag: "🇵🇰" },
  { city: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka", flag: "🇧🇩" },
  { city: "Colombo", country: "Sri Lanka", timezone: "Asia/Colombo", flag: "🇱🇰" },
  { city: "Kathmandu", country: "Nepal", timezone: "Asia/Kathmandu", flag: "🇳🇵" },
  { city: "Singapore", country: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
  { city: "Kuala Lumpur", country: "Malaysia", timezone: "Asia/Kuala_Lumpur", flag: "🇲🇾" },
  { city: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta", flag: "🇮🇩" },
  { city: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", flag: "🇹🇭" },
  { city: "Hanoi", country: "Vietnam", timezone: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
  { city: "Ho Chi Minh City", country: "Vietnam", timezone: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
  { city: "Manila", country: "Philippines", timezone: "Asia/Manila", flag: "🇵🇭" },
  { city: "Yangon", country: "Myanmar", timezone: "Asia/Yangon", flag: "🇲🇲" },
  { city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "Osaka", country: "Japan", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "Seoul", country: "South Korea", timezone: "Asia/Seoul", flag: "🇰🇷" },
  { city: "Busan", country: "South Korea", timezone: "Asia/Seoul", flag: "🇰🇷" },
  { city: "Shanghai", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Beijing", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Hong Kong", country: "China", timezone: "Asia/Hong_Kong", flag: "🇭🇰" },
  { city: "Taipei", country: "Taiwan", timezone: "Asia/Taipei", flag: "🇹🇼" },
  { city: "Guangzhou", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Chengdu", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Shenzhen", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Sydney", country: "Australia", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { city: "Melbourne", country: "Australia", timezone: "Australia/Melbourne", flag: "🇦🇺" },
  { city: "Brisbane", country: "Australia", timezone: "Australia/Brisbane", flag: "🇦🇺" },
  { city: "Perth", country: "Australia", timezone: "Australia/Perth", flag: "🇦🇺" },
  { city: "Adelaide", country: "Australia", timezone: "Australia/Adelaide", flag: "🇦🇺" },
  { city: "Auckland", country: "New Zealand", timezone: "Pacific/Auckland", flag: "🇳🇿" },
  { city: "Wellington", country: "New Zealand", timezone: "Pacific/Auckland", flag: "🇳🇿" },
  { city: "Honolulu", country: "USA", timezone: "Pacific/Honolulu", flag: "🇺🇸" },
  { city: "Anchorage", country: "USA", timezone: "America/Anchorage", flag: "🇺🇸" },
  { city: "Reykjavik", country: "Iceland", timezone: "Atlantic/Reykjavik", flag: "🇮🇸" },
];

function getCurrentTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

function getCityForTimezone(timezone: string): WorldCity {
  const found = WORLD_CITIES.find((c) => c.timezone === timezone);
  if (found) return found;

  const tzParts = timezone.split("/");
  const cityName = tzParts[tzParts.length - 1].replace(/_/g, " ");
  return {
    city: cityName,
    country: "",
    timezone,
    flag: "🌍",
  };
}

function formatTimeInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

function formatDateInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function getTimezoneOffset(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === "timeZoneName");
    return offsetPart ? offsetPart.value : "";
  } catch {
    return "";
  }
}

function getHourInTimezone(date: Date, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === "hour");
    return hourPart ? parseInt(hourPart.value) : 12;
  } catch {
    return 12;
  }
}

function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 18;
}

function getDayNightEmoji(hour: number): string {
  return isDaytime(hour) ? "☀️" : "🌙";
}

export default function TimeZoneConverter() {
  const userTz = getCurrentTimezone();
  const userCity = getCityForTimezone(userTz);

  const [selectedCities, setSelectedCities] = useState<WorldCity[]>(() => {
    const defaultCities: WorldCity[] = [userCity];

    const nyc = WORLD_CITIES.find((c) => c.city === "New York");
    if (nyc && nyc.timezone !== userTz) {
      defaultCities.push(nyc);
    }

    const london = WORLD_CITIES.find((c) => c.city === "London");
    if (london && !defaultCities.some((c) => c.timezone === london.timezone)) {
      defaultCities.push(london);
    }

    const tokyo = WORLD_CITIES.find((c) => c.city === "Tokyo");
    if (tokyo && !defaultCities.some((c) => c.timezone === tokyo.timezone)) {
      defaultCities.push(tokyo);
    }

    return defaultCities.slice(0, 4);
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return WORLD_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.timezone.toLowerCase().includes(query)
    ).slice(0, 15);
  }, [searchQuery]);

  const addCity = useCallback(
    (city: WorldCity) => {
      if (selectedCities.some((c) => c.city === city.city)) return;
      setSelectedCities((prev) => [...prev, city]);
      setSearchQuery("");
      setShowDropdown(false);
    },
    [selectedCities]
  );

  const removeCity = useCallback((index: number) => {
    setSelectedCities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueTimezones = useMemo(() => {
    return new Set(selectedCities.map((c) => c.timezone));
  }, [selectedCities]);

  return (
    <div>
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-background rounded-xl border border-border p-4 text-center">
          <div className="text-3xl mb-1">🌍</div>
          <div className="text-xl font-bold text-foreground">{uniqueTimezones.size}</div>
          <div className="text-xs text-muted-foreground">Time Zones</div>
        </div>
        <div className="bg-background rounded-xl border border-border p-4 text-center">
          <div className="text-3xl mb-1">🏙️</div>
          <div className="text-xl font-bold text-foreground">{selectedCities.length}</div>
          <div className="text-xs text-muted-foreground">Cities</div>
        </div>
        <div className="bg-background rounded-xl border border-border p-4 text-center">
          <div className="text-3xl mb-1">📍</div>
          <div className="text-sm font-bold text-foreground truncate">{userCity.city}</div>
          <div className="text-xs text-muted-foreground">Your Location</div>
        </div>
        <div className="bg-background rounded-xl border border-border p-4 text-center">
          <div className="text-3xl mb-1">⏱️</div>
          <div className="text-lg font-bold text-foreground font-mono">
            {formatTimeInTimezone(currentTime, userTz).replace(" ", "")}
          </div>
          <div className="text-xs text-muted-foreground">Local Time</div>
        </div>
      </div>

      {/* Search & Add City */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-2">
          🔍 Add Cities to Compare
        </label>
        <div className="relative" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => searchQuery && setShowDropdown(true)}
            placeholder="Search for a city (e.g., Tokyo, London, Mumbai)..."
            className="w-full px-5 py-4 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background text-base"
          />

          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-lg max-h-72 overflow-y-auto">
              {filteredCities.map((city, idx) => (
                <button
                  key={`${city.city}-${idx}`}
                  onClick={() => addCity(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border last:border-b-0"
                >
                  <span className="text-2xl">{city.flag}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{city.city}</div>
                    <div className="text-xs text-muted-foreground">
                      {city.country} · {city.timezone}
                    </div>
                  </div>
                  {selectedCities.some((c) => c.city === city.city) && (
                    <span className="text-green-600 text-sm font-semibold">✓ Added</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchQuery && filteredCities.length === 0 && (
            <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-lg p-4 text-center text-muted-foreground">
              No cities found. Try another search term.
            </div>
          )}
        </div>
      </div>

      {/* World Clock Cards */}
      {selectedCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {selectedCities.map((cityData, idx) => {
            const timezone = cityData.timezone;
            const timeStr = formatTimeInTimezone(currentTime, timezone);
            const dateStr = formatDateInTimezone(currentTime, timezone);
            const offset = getTimezoneOffset(currentTime, timezone);
            const hour = getHourInTimezone(currentTime, timezone);
            const dayNightEmoji = getDayNightEmoji(hour);
            const isUser = timezone === userTz;
            const isDay = isDaytime(hour);

            return (
              <div
                key={`${cityData.city}-${idx}`}
                className={`rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                  isUser
                    ? "bg-primary/10 border-primary"
                    : isDay
                    ? "bg-background border-border"
                    : "bg-gray-50 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{cityData.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg">{cityData.city}</h3>
                        {isUser && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{cityData.country || ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{dayNightEmoji}</span>
                    <button
                      onClick={() => removeCity(idx)}
                      disabled={selectedCities.length <= 1}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove city"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl md:text-5xl font-mono font-black text-foreground tracking-tight">
                      {timeStr.split(" ")[0]}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground mt-1">
                      {timeStr.split(" ")[1] || ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold text-primary">
                      {offset}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {dateStr}
                    </div>
                  </div>
                </div>

                {/* Timezone info bar */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{timezone}</span>
                    <span>
                      {isDay ? "☀️ Daytime" : "🌙 Night"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted rounded-xl border border-border mb-8">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="font-semibold text-foreground text-lg mb-2">No Cities Added</h3>
          <p className="text-muted-foreground text-sm">
            Search for cities above to start comparing time zones.
          </p>
        </div>
      )}

      {/* Quick Add Presets */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">⚡ Quick Add Presets</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "🇺🇸 New York", city: "New York" },
            { label: "🇬🇧 London", city: "London" },
            { label: "🇯🇵 Tokyo", city: "Tokyo" },
            { label: "🇮🇳 Mumbai", city: "Mumbai" },
            { label: "🇦🇺 Sydney", city: "Sydney" },
            { label: "🇦🇪 Dubai", city: "Dubai" },
            { label: "🇩🇪 Berlin", city: "Berlin" },
            { label: "🇨🇳 Shanghai", city: "Shanghai" },
            { label: "🇸🇬 Singapore", city: "Singapore" },
            { label: "🇧🇷 São Paulo", city: "São Paulo" },
          ].map((preset) => {
            const found = WORLD_CITIES.find((c) => c.city === preset.city);
            const isAdded = found && selectedCities.some((c) => c.city === found.city);

            return (
              <button
                key={preset.city}
                onClick={() => found && addCity(found)}
                disabled={isAdded || !found}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isAdded
                    ? "bg-green-50 text-green-700 border-2 border-green-200 cursor-default"
                    : "bg-background border-2 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {isAdded && "✓ "}
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-2">💡 About This Tool</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>✓ <strong>Live clocks</strong> update every second</li>
          <li>✓ <strong>Day/Night indicator</strong> shows if it&apos;s daytime in each city</li>
          <li>✓ <strong>Timezone offsets</strong> with DST (Daylight Saving Time) awareness</li>
          <li>✓ <strong>Your location</strong> is auto-detected using your browser</li>
          <li>✓ <strong>Works offline</strong> — all calculations happen in your browser</li>
        </ul>
      </div>
    </div>
  );
}
