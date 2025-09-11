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
  admins: (process.env.ADMIN_EMAILS ?? '').split(',').map(email => email.trim()).filter(email => email.length > 0),
};

console.log("Loaded environment variables:", config);

export default config;