import { ChangeEventHandler, useState } from "react";
import { Icon } from "@iconify/react";

function App() {
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);

  const handleCityInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.target.value;
    const last = input[input.length - 1];

    // When a seperator character is entered, the entered city name
    // is appended to the `cities` array and the text input is cleared
    if (last === "," || last === ";") {
      setCities(cities.concat(city.substring(0, city.length)));
      setCity("");
      event.target.value = "";
    }

    setCity(event.target.value);
    console.log(cities);
  };

  const removeCity = (index: number) => {
    setCities(cities.filter((_, idx) => index !== idx));
  };

  // TODO: fetch response from backend
  const getWeather = () => {};

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="my-auto flex flex-col items-center">
        <h1 className="md:text-4xl text-5xl font-semibold tracking-tight">
          Weather App
        </h1>
        <form>
          <input
            type="text"
            name="cities"
            placeholder="Enter names of cities"
            value={city}
            onChange={handleCityInput}
            className="rounded-lg my-5 bg-neutral-700 text-neutral-200 px-2 py-1"
          />
        </form>
        <div className="flex flex-col items-center">
          <div className="font-semibold text-white text-lg">
            Selected Cities:
          </div>
          <ul className="gap-2 max-w-xs">
            {cities.map((cityName, idx) => {
              return (
                <li
                  key={idx}
                  className="bg-slate-700 px-1.5 py-0.5 font-medium rounded-md items-center inline-flex my-1 mr-1 gap-1"
                >
                  {cityName}
                  <button onClick={() => removeCity(idx)}>
                    <Icon icon="ic:round-close" width={16} inline={true} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={() => getWeather()}
          className="bg-green-400 text-black font-medium tracking-tight text-lg mt-10 py-2 px-4 rounded-lg"
        >
          Fetch Weather
        </button>
      </div>
    </div>
  );
}

export default App;
