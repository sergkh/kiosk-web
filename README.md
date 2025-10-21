# Kiosk web

University kiosk web app.

# Configuration

Env variables:

* `VITE_MKR_API_URL` - MKR Api base URL
* `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` – Firebase configuration
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
