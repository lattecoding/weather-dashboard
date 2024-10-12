import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  id: string;
  fullName: string;
  description: string;
  url: string;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;

  constructor(temperature: number, description: string) {
    this.temperature = temperature;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;

  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    const response = await fetch(
      `${this.baseURL}/search.json?key=${this.apiKey}&q=${query}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      id: locationData.id,
      fullName: locationData.name,
      description: locationData.country,
      url: locationData.url,
    };
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/current.json?key=${this.apiKey}&q=${coordinates.fullName}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return response.json();
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    const locations = await this.fetchLocationData(city);
    if (locations.length === 0) {
      throw new Error("No location found for the specified city");
    }
    const location = this.destructureLocationData(locations[0]); // Get the first match
    const weatherData = await this.fetchWeatherData(location);

    return new Weather(
      weatherData.current.temp_c,
      weatherData.current.condition.text,
    );
  }
}

export default new WeatherService();
