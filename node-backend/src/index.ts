import express from "express";
import z from "zod";

const app = express();

app.get("/api", (_, res) => {
  res.send("hello");
});

const WeatherRequestSchema = z.object({
  cities: z.array(z.string()).default([]),
});

// TODO: implement weather api
app.post("/getWeather", async (req, res) => {
  const { cities } = await WeatherRequestSchema.parseAsync(req);
});

export default app;
