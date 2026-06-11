import http from "http";
import { getAuthUrl, exchangeCode } from "./drive";

const REDIRECT_URI = "http://localhost:5173/oauth-callback";

if (!process.env.GOOGLE_DRIVE_CLIENT_ID || !process.env.GOOGLE_DRIVE_CLIENT_SECRET) {
  console.error("\nMissing Google OAuth credentials. Set these env vars:\n");
  console.error("  $env:GOOGLE_DRIVE_CLIENT_ID=\"<your-client-id>\"");
  console.error("  $env:GOOGLE_DRIVE_CLIENT_SECRET=\"<your-client-secret>\"\n");
  process.exit(1);
}

const url = getAuthUrl(REDIRECT_URI);
console.log("\n1. Visit this URL in your browser to authorize:\n");
console.log(`   ${url}\n");
console.log("2. Copy the redirect URL from your browser after authorizing (it contains ?code=...)\n");

let code = "";
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url!, `http://${req.headers.host}`);
  const c = urlObj.searchParams.get("code");
  if (c) {
    code = c;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Authorization successful! Check your terminal for the refresh token.");

    try {
      const tokens = await exchangeCode(REDIRECT_URI, code);
      console.log("\n3. Add this as an environment variable on Vercel:\n");
      console.log(`   GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}\n");
    } catch (err) {
      console.error("Token exchange failed:", err);
    }

    server.close();
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("No authorization code found.");
  }
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/oauth-callback`);
  console.log("Press Ctrl+C to cancel.\n");
});
