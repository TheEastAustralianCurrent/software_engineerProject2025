type WeatherData = {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
};

export default async function Weather() {
  const apiKey = "79c9ff59ed220892603d6c6e662d6198";
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=51.509865&lon=-11.8092&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  
  const data: WeatherData = await response.json();
  console.log(data)
  return data;
}