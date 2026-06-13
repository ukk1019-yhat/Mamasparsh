/**
 * Admin setup script.
 * Run: node scripts/setup-admin.js
 *
 * Requires your Supabase service_role key (from Project Settings > API > service_role key).
 * This key has admin privileges — never expose it client-side.
 */
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://hltpicrbuojkegphtlnh.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY env var.");
  console.error("Get it from: Supabase Dashboard > Project Settings > API > service_role key");
  console.error("");
  console.error("Usage: $env:SUPABASE_SERVICE_ROLE_KEY='your-key' ; node scripts/setup-admin.js");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function setup() {
  // 1. Create the user in Supabase Auth
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: "mamasparsh2026@gmail.com",
    password: "MAMA@2026",
    email_confirm: true,
    user_metadata: { full_name: "Admin", role: "admin" },
  });

  if (createError) {
    // User might already exist
    if (createError.message.includes("already exists")) {
      console.log("Admin user already exists in Auth. Updating profile...");
    } else {
      console.error("Failed to create admin user:", createError.message);
      process.exit(1);
    }
  } else {
    console.log("Admin user created in Auth:", user.user.id);
  }

  // 2. Ensure profile is set to admin + approved
  const { error: updateError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user?.user?.id,
        email: "mamasparsh2026@gmail.com",
        full_name: "Admin",
        role: "admin",
        status: "approved",
      },
      { onConflict: "id" }
    );

  if (updateError) {
    // Try via raw ID lookup if upsert failed
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "mamasparsh2026@gmail.com")
      .single();

    if (existing) {
      const { error: update2 } = await supabase
        .from("profiles")
        .update({ role: "admin", status: "approved" })
        .eq("id", existing.id);

      if (update2) {
        console.error("Failed to update profile:", update2.message);
        process.exit(1);
      }
    }
  }

  console.log("Admin profile updated: role=admin, status=approved");
  console.log("You can now sign in at /auth/login with:");
  console.log("  Email:    mamasparsh2026@gmail.com");
  console.log("  Password: MAMA@2026");
}

setup().catch(console.error);
