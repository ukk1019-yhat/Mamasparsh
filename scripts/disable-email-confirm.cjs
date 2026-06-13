const { Client } = require("pg");
const client = new Client({
  connectionString: "postgresql://postgres:Ukk%407337580095@db.hltpicrbuojkegphtlnh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
client
  .connect()
  .then(() => client.query("UPDATE auth.config SET confirm_email = false;"))
  .then((r) => {
    console.log("Email confirmation disabled:", r.rowCount);
    return client.end();
  })
  .catch((e) => {
    console.error("Error:", e.message);
    client.end();
  });
