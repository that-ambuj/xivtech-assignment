import express from "express";
import z from "zod";

const port = process.env.PORT || 8000;
const app = express();

app.get("/", (_, res) => {
  res.send("hello");
});

const WeatherRequestSchema = z.object({
  cities: z.array(z.string()).default([]),
});

// TODO: implement weather api
app.post("/getWeather", async (req, res) => {
  const { cities } = await WeatherRequestSchema.parseAsync(req);
});

app.listen(port, () => {
  console.log(`Express backend is running on http://localhost:${port}/`);
});
