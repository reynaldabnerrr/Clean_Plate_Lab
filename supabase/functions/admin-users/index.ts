import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const jsonHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

const primarySuperadminEmail = "cleanplatelab.id@gmail.com";
const validRoles = new Set(["admin", "superadmin"]);

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: jsonHeaders });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Konfigurasi server Supabase tidak lengkap." }, 500);
  }

  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Sesi autentikasi tidak ditemukan." }, 401);
  }

  const accessToken = authorization.slice("Bearer ".length);
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user: caller },
    error: callerError,
  } = await adminClient.auth.getUser(accessToken);

  if (callerError || !caller) {
    return jsonResponse({ error: "Sesi tidak valid atau sudah kedaluwarsa." }, 401);
  }

  const { data: callerProfile, error: callerProfileError } = await adminClient
    .from("admin_users")
    .select("role")
    .eq("user_id", caller.id)
    .maybeSingle();

  if (callerProfileError) {
    return jsonResponse({ error: "Gagal memverifikasi hak akses superadmin." }, 500);
  }

  if (callerProfile?.role !== "superadmin") {
    return jsonResponse({ error: "Hanya superadmin yang dapat mengelola akun admin." }, 403);
  }

  if (request.method === "GET") {
    const { data: users, error } = await adminClient
      .from("admin_users")
      .select("id,user_id,email,full_name,role,created_at,updated_at")
      .order("created_at", { ascending: true });

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ users });
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const fullName = body?.fullName?.trim() || "Admin User";
    const role = body?.role || "admin";

    if (!email || typeof password !== "string") {
      return jsonResponse({ error: "Email dan password wajib diisi." }, 400);
    }

    if (password.length < 6) {
      return jsonResponse({ error: "Password minimal 6 karakter." }, 400);
    }

    if (!validRoles.has(role)) {
      return jsonResponse({ error: "Role admin tidak valid." }, 400);
    }

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
      app_metadata: { admin_role: role },
    });

    if (authError || !authData.user) {
      const message = authError?.message?.toLowerCase().includes("already")
        ? "Email tersebut sudah terdaftar di Supabase Auth."
        : authError?.message || "Gagal membuat akun Auth.";
      return jsonResponse({ error: message }, authError?.status || 400);
    }

    const { data: profile, error: profileError } = await adminClient
      .from("admin_users")
      .insert({
        user_id: authData.user.id,
        email,
        full_name: fullName,
        role,
      })
      .select("id,user_id,email,full_name,role,created_at,updated_at")
      .single();

    if (profileError) {
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return jsonResponse({ error: `Gagal menyimpan profil admin: ${profileError.message}` }, 500);
    }

    return jsonResponse({ user: profile }, 201);
  }

  if (request.method === "DELETE") {
    const body = await request.json().catch(() => null);
    const profileId = body?.id;

    if (!profileId) {
      return jsonResponse({ error: "ID profil admin wajib diisi." }, 400);
    }

    const { data: target, error: targetError } = await adminClient
      .from("admin_users")
      .select("id,user_id,email,role")
      .eq("id", profileId)
      .maybeSingle();

    if (targetError) return jsonResponse({ error: targetError.message }, 500);
    if (!target) return jsonResponse({ error: "Akun admin tidak ditemukan." }, 404);

    if (target.email.toLowerCase() === primarySuperadminEmail) {
      return jsonResponse({ error: "Akun Superadmin Utama tidak dapat dihapus." }, 400);
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(target.user_id);
    if (deleteError) return jsonResponse({ error: deleteError.message }, 500);

    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Method tidak didukung." }, 405);
});
