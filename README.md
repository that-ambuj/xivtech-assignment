# xivtech-assignment

## Prequisites

- Vercel account
- Vercel CLI
- Node js

## Instructions

- Install dependencies by using `yarn install` in the root directory and `node-backend` directory
- Run `yarn build` in root directory to build the frontend
- Run `vercel dev` in the backend directory to run the project as a full stack application

## Endpoints

### `POST /api/getWeather`

#### Request
```json
{ "cities": ["mumbai", "london"] }
```

#### Response
```json
{ "weather": { "mumbai": 32.05, "london": 28.32 } }
```
