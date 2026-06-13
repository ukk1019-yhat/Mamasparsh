const { Client } = require("pg");
const client = new Client({
  user: "postgres.hltpicrbuojkegphtlnh",
  password: "Ukk@7337580095",
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
client
  .connect()
  .then(() => client.query("UPDATE auth.config SET confirm_email = false;"))
  .then((r) => {
    console.log("Done:", r.rowCount);
    return client.end();
  })
  .catch((e) => {
    console.error("Error:", e.message);
    client.end();
  });
