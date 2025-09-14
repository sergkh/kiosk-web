# Kiosk web

University kiosk web app.

# Configuration

Env variables:

* `VITE_MKR_API_URL` - MKR Api base URL
* `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID` – Firebase configuration
* `ADMIN_EMAILS` – List of Administrator user emails.
* `VITE_SCHEDULE_DAYS_TO_SHOW` – Number of days to show in the schedule (default: 3)

# Development

Requirements:
* .env file with environment variables
* `serviceAccount.json` in the `src/server/` with Firebase service account settings.

Starting a dev server:

```bash
npm run dev
```
