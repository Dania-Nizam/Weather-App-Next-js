"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface weatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}
export default function WeatherApp() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<weatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    if (trimmedLocation == "") {
      setError("please enter a valid location.");
      setWeather(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("city not found.");
      }
      const data = await response.json();
      const WeatherData: weatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(WeatherData);
    } catch (error) {
      setError("city");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit == "c") {
      if (temperature < 0) {
        return `its freezing at ${temperature}°C! Bundle Up!`;
      } else if (temperature < 10) {
        return `its quit cold at ${temperature}°C! wear warm cloths.`;
      } else if (temperature < 20) {
        return `the temperature is ${temperature}°C! comfortable for a ligh jacket.`;
      } else if (temperature < 30) {
        return `Its a pleasent ${temperature}°C! enjoy the nice weather! `;
      } else {
        return `its hot at ${temperature}°C. stay hydrated`;
      }
    } else {
      //placeholder for other temperature units (e.g, Farenhiet)
      return `${temperature} ° ${unit}`;
    }
  }

  function getweatherMessage(description: string) {
    switch (description.toLocaleLowerCase()) {
      case "sunny":
        return "Its a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine";
      case "overcast":
        return "The sky is overcast";
      case "rain":
        return "Dont forget your umbrella.";
      case "Thunderstrom":
        return "thunderstrom is expected today";
      case "snow":
        return "Bundle up! its snowing.";
      case "mist":
        return "its misty outside.";
      case "fog":
        return "Be careful, there is fog outside";
      default:
        return description;
    }
  }
  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNigt = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNigt ? "at Night" : "During the Day"}`;
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w full max w md mx auto text center">
        <CardHeader>
          <CardTitle> WEATHER APP</CardTitle>
          <CardDescription>
            {" "}
            Search for the current weather conditon in your city
          </CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          {" "}
          <Input
            type="text"
            placeholder="Enter a city Name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "loading.... " : "search"}
          </Button>
        </form>

        {error && <div className="mt-4 text-red-500">{error}</div>}
        {weather && (
          <div className="mt-4 grid gap-2">
            <div className=" flex items center gap 2">
              <ThermometerIcon className="w-6 h-6" />
              {getTemperatureMessage(weather.temperature, weather.unit)}
            </div>

            <div className=" flex items center gap 2">
              <CloudIcon className="w-6 h-6" />
              {getweatherMessage(weather.description)}
            </div>

            <div className=" flex items center gap 2">
              <MapPinIcon className="w-6 h-6" />
              {getLocationMessage(weather.location)}
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
