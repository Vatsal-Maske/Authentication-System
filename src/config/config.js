// dotenv package ko import kar rahe hain (env variables read karne ke liye)
import dotenv from "dotenv";

// dotenv ko initialize kar rahe hain → .env file ko read karega
dotenv.config();

// check kar rahe hain ki MONGOO_URI env me exist karta hai ya nahi
if (!process.env.MONGOO_URI) {
    // agar nahi mila to error throw hoga aur app crash ho jayega
    throw new Error("MONGOO_URI is not defined in environment variables");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in environment variables");
}

if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined in environment variables");
}
// ek config object bana rahe hain jisme env variable store karenge
const config = {
    // process.env se MONGOO_URI leke object me daal rahe hain
    MONGOO_URI: process.env.MONGOO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,
};

// config object ko export kar rahe hain taaki dusri files me use ho sake
export default config;

// Start
//   ↓
// Import dotenv package
//   ↓
// Call dotenv.config()
//   ↓
// .env file read hoti hai
//   ↓
// Environment variables load hote hain
//   ↓
// Check: MONGOO_URI exist karta hai?
//       ↓             ↓
//      YES            NO
//       ↓              ↓
// Store in config   Throw Error ❌ (App stop)
//       ↓
// Export config
//       ↓
// End