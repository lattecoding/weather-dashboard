import dotenv from "dotenv";

dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor( city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;

  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    const response = await fetch(
      `${this.baseURL}/data/2.5/weather?q=${query}&APPID=${this.apiKey}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const { lat, lon } = coordinates;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`,
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
    const coordinates = this.destructureLocationData(locations); // Get the first match
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log(weatherData.list[0]);

    //TODO: make a for loop to filter out only the next 5 days.
    return weatherData.list; 

    // return new Weather(
    //   weatherData.city.name,
    //   weatherData.list[0].dt_txt,
    //   weatherData.list[0].weather.icon,
    //   weatherData.list[0].weather[0].description,
    //   weatherData.list[0].main.temp,
    //   weatherData.list[0].wind.speed,
    //   weatherData.list[0].main.humidity
    // );
  }
}

export default new WeatherService();
