import { google } from "googleapis";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

export type DriveFile = {
  id: string;
  name: string;
};

function getClient(redirectUri?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirectUri,
  );
}

export function getAuthUrl(redirectUri: string) {
  const oauth2 = getClient(redirectUri);
  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
    prompt: "consent",
  });
}

export async function exchangeCode(redirectUri: string, code: string) {
  const oauth2 = getClient(redirectUri);
  const { tokens } = await oauth2.getToken(code);
  return tokens;
}

export async function listFolderFiles(refreshToken: string): Promise<DriveFile[]> {
  const oauth2 = getClient();
  oauth2.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: "v3", auth: oauth2 });

  const res = await drive.files.list({
    q: `'${FOLDER_ID}' in parents`,
    fields: "files(id, name)",
    orderBy: "createdTime",
  });

  return (res.data.files || []).map((f) => ({
    id: f.id!,
    name: f.name!,
  }));
}
