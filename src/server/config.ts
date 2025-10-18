import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

console.log("Loading environment variables...");

if (!process.env.ADMIN_EMAILS) {
  console.warn(`
    ADMIN_EMAILS environment variable is not set. 
    No one wiil be able to log in as admin. 
    Set it to a comma-separated list of admin emails.
  `);
}

const config = {
  baseUrl: process.env.VITE_BASE_URL || '/',
  admins: (process.env.ADMIN_EMAILS ?? '').split(',').map(email => email.trim()).filter(email => email.length > 0),
  newsBaseUrl: process.env.NEWS_BASE_URL || 'https://vsau.org/novini',
  secureCookie: process.env.NODE_ENV === 'production',
  sessionExpiration: 60 * 60 * 1 * 1000, // 1 hour
};

console.log("Configuration loaded:", config);

export default config;