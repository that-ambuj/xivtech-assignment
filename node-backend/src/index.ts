import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import fetch from "node-fetch";
import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

app.use(express.json());

if (process.env.NODE_ENV?.match(/dev/i)) {
  app.use(cors());
}

app.get("/", (_, res) => {
  res.json({ message: "Hello World" });
});

const WeatherRequestSchema = z.object({
  cities: z.array(z.string()).default([]),
});

const WeatherData = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  main: z.object({
    temp: z.number(),
  }),
  name: z.string(),
});

app.post("/api/getWeather", async (req, res, next) => {
  try {
    if (!OPEN_WEATHER_API_KEY) {
      res.status(500).json({ message: "Missing Open Weather API Key" });
    }

    const { cities } = WeatherRequestSchema.parse(req.body);
    const weatherData = await Promise.all(cities.map(getWeatherByCity));

    const weather = weatherData.reduce((acc: any, weather) => {
      const { name, main } = weather;

      if (!acc[name]) {
        acc[name] = main.temp;
      }

      return acc;
    }, {});

    return res.json({ weather });
  } catch (e) {
    next(e);
  }
});

async function getWeatherByCity(
  city: string
): Promise<z.infer<typeof WeatherData>> {
  try {
    const params = new URLSearchParams();
    params.set("appid", OPEN_WEATHER_API_KEY as string);
    params.set("q", city);
    params.set("units", "metric");

    const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

    const res = await fetch(url);

    if (res.status > 399) {
      console.error(res.json());
      throw new Error("Open API Error");
    }

    const data = await res.json();

    const parsedData = WeatherData.parse(data);
    return parsedData;
  } catch (e) {
    throw new Error(e as string);
  }
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);
  res.status(500).send({ message: err.message ?? "Something went wrong" });
};

app.use(errorHandler);

export default app;
