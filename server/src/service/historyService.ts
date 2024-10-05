import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  private async read(): Promise<string> {
    return await fs.readFile("db/searchHistory.json", {
      encoding: "utf8",
    });
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(
      "db/searchHistory.json",
      JSON.stringify(cities, null, "\t"),
    );
  }

  async getCities(): Promise<City[]> {
    try {
      const cities = await this.read();
      return JSON.parse(cities) as City[];
    } catch (err) {
      console.error("Error reading cities:", err);
      return [];
    }
  }

  async addCity(city: string): Promise<City> {
    if (!city) {
      throw new Error("City cannot be blank");
    }

    const newCity = new City(city, uuidv4());
    const cities = await this.getCities();

    if (cities.some((existingCity) => existingCity.name === city)) {
      return newCity; // Handle duplicates as needed
    }

    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();
