import { ChangeEventHandler, RefCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function WeatherComponent({
  data,
  ref,
}: {
  data?: Record<string, number>;
  ref: RefCallback<Element>;
}) {
  return data ? (
    <div className="my-4 self-start" ref={ref}>
      <h2 className="text-lg font-semibold tracking-tight">Weather Data: </h2>
      {Object.entries(data).map(([k, v], idx) => (
        <div key={idx}>
          <span className="font-medium">{k}</span>: {v}°C
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}

function App() {
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);

  const [weatherResponse, setWeatherResponse] = useState<
    Record<string, number> | undefined
  >();

  const [parent] = useAutoAnimate();

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
  };

  const removeCity = (index: number) => {
    setCities(cities.filter((_, idx) => index !== idx));
  };

  async function getWeather() {
    const res = await fetch(`/api/getWeather`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cities: cities.length > 0 ? cities : [city] }),
    });

    const data = await res.json();

    setWeatherResponse(data.weather);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="my-auto flex flex-col items-center">
        <h1 className="md:text-4xl text-5xl font-semibold tracking-tight">
          Weather App
        </h1>
        <form
          className="flex flex-col my-5 max-w-xs md:max-w-md"
          onSubmit={(ev) => {
            ev.preventDefault();
            getWeather();
          }}
        >
          <div className="inline mb-1">
            Tip: Seperate city names by a comma(<b>,</b>) or a semicolon(
            <b>;</b>)
          </div>
          <input
            type="text"
            name="cities"
            placeholder="Enter names of cities"
            value={city}
            onChange={handleCityInput}
            className="rounded-lg bg-neutral-700 text-neutral-200 px-2 py-1"
          />
        </form>
        {cities.length > 0 ? (
          <div className="flex flex-col items-start self-start">
            <div className="font-semibold text-white text-lg">
              Selected Cities:
            </div>
            <ul className="gap-2 max-w-sm" ref={parent}>
              {cities.map((cityName, idx) => {
                return (
                  <li
                    key={idx}
                    className="bg-slate-700 px-1.5 py-0.5  font-medium rounded-md items-center inline-flex my-1 ml-0 mr-1 gap-1"
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
        ) : (
          <></>
        )}
        <button
          onClick={() => getWeather()}
          className="bg-green-400 text-black font-medium tracking-tight text-lg mt-10 py-2 px-4 rounded-lg"
        >
          Fetch Weather
        </button>
        <WeatherComponent data={weatherResponse} ref={parent} />
      </div>
    </div>
  );
}

export default App;
