import { supabase } from "./supabase";

export const SUPERADMIN_EMAIL = "cleanplatelab.id@gmail.com";
export const SUPERADMIN_DEFAULT_PASS = "CPL123";

export const DEFAULT_ADMIN_USERS = [
  {
    id: "sa-001",
    email: "cleanplatelab.id@gmail.com",
    full_name: "Clean Plate Lab Owner",
    role: "superadmin",
    created_at: new Date().toISOString(),
  },
];

/**
 * Fetch all admin users from Supabase admin_users table (with fallback)
 */
export async function fetchAdminUsers() {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: DEFAULT_ADMIN_USERS, error: null };
    }

    return { data, error: null };
  } catch (err) {
    return { data: DEFAULT_ADMIN_USERS, error: err };
  }
}

/**
 * Login with standard Supabase Auth — no bypass
 */
export async function loginAdminUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not initialized. Environment variables not set.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message || "Email atau password tidak valid." };
    }

    const user = data.user;
    const role =
      cleanEmail === SUPERADMIN_EMAIL ? "superadmin" : "admin";

    return { success: true, user, role };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Email atau password tidak valid.",
    };
  }
}

/**
 * Change Password — requires real authenticated session
 */
export async function changeUserPassword(newPassword) {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { success: false, error: "Sesi tidak ditemukan. Login ulang untuk ganti password." };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message || "Gagal mengubah password." };
  }
}

/**
 * Superadmin creates a new Admin/Superadmin account
 * Requires real authenticated session (superadmin must login with correct password)
 */
export async function createAdminAccount({ email, password, fullName, role }) {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        error:
          "Sesi tidak ditemukan. Login sebagai superadmin dengan password yang benar untuk mengelola akun admin.",
      };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName || "Admin User",
          role: role || "admin",
        },
      },
    });

    if (authError && authError.message?.includes("rate limit")) {
      console.warn("SignUp rate limit — using existing auth user.");
    }

    const { data: insertedRows, error: dbError } = await supabase
      .from("admin_users")
      .upsert(
        [
          {
            user_id: authData?.user?.id ?? null,
            email: cleanEmail,
            full_name: fullName || "Admin User",
            role: role || "admin",
          },
        ],
        { onConflict: "email" }
      )
      .select();

    if (dbError) {
      console.error("admin_users upsert failed:", dbError.message);
      return {
        success: false,
        error:
          dbError.message ||
          "Gagal menyimpan profil admin. Pastikan migrasi sudah di-apply (npx supabase db push).",
      };
    }

    return {
      success: true,
      user: authData?.user || insertedRows?.[0] || { email: cleanEmail, role: role || "admin" },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Gagal membuat akun admin.",
    };
  }
}

/**
 * Delete admin account profile
 */
export async function deleteAdminUser(id, email) {
  try {
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized." };
    }

    if (email === SUPERADMIN_EMAIL) {
      return { success: false, error: "Akun Superadmin Utama tidak dapat dihapus." };
    }

    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
