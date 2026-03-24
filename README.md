# Weather Analytics Dashboard

A React-based weather dashboard for live conditions, multi-city favorites, forecasts, and interactive charts. State is handled with **Redux Toolkit** (including RTK Query for the weather API). There is **no backend**; favorites, units, and session are kept in the browser.

---

## Prerequisites

- **Node.js** 18 or newer  
- **npm** (comes with Node)

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the weather API

Create a `.env` file in the project root (you can copy `.env.example`):

```bash
cp .env.example .env
```

Set your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_key_here
```

Create a free key at [OpenWeatherMap](https://openweathermap.org/api). After creating a key, activation can take a short time.

**Important:** Do not commit real API keys. Keep them only in `.env` (this file is gitignored).

### 3. Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Signing in

The app opens on a **login** screen. For this demo build, use:

| Field    | Value                 |
|----------|-----------------------|
| Email    | `taptalent@gmail.com` |
| Password | `Weather@1234`        |

After sign-in you can search cities, pin favorites, open a city for detailed charts, and switch **°C / °F** in the header. Use **Sign out** to return to the login page.

---

## Production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Notes

- **Rate limits** apply on the free OpenWeather tier; the app uses caching and polling to stay within typical usage.
- **Google sign-in** on the login page is disabled in this demo.
- **UV index** may show as unavailable on the free current-weather endpoint; other stats and charts use the data returned by the API.

---

## License

Private assessment / portfolio use unless otherwise stated.


<img width="1919" height="932" alt="Screenshot from 2026-03-24 15-16-57" src="https://github.com/user-attachments/assets/0b13e80d-4772-4e21-9aa3-f5e93ea7b61c" />
<img width="1919" height="932" alt="Screenshot from 2026-03-24 15-16-40" src="https://github.com/user-attachments/assets/8fc1423b-8acb-48fc-960c-048f1e68dd7d" />
<img width="1919" height="932" alt="Screenshot from 2026-03-24 15-16-26" src="https://github.com/user-attachments/assets/97ad3c45-a1f0-437a-b302-6da186c65218" />
<img width="1919" height="932" alt="Screenshot from 2026-03-24 15-16-13" src="https://github.com/user-attachments/assets/828f12bd-5484-434f-92bd-81aa671d3d4f" />
<img width="1919" height="932" alt="Screenshot from 2026-03-24 15-15-48" src="https://github.com/user-attachments/assets/6450bb36-32d7-4eb3-a8f6-47a474cfbd6c" />

