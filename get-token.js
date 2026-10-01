import "dotenv/config";

const [email, password] = process.argv.slice(2);

const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: {
    apikey: process.env.SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

const data = await res.json();
console.log(data.access_token || data);