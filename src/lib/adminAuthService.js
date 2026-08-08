import { supabase } from "./supabase";

export const SUPERADMIN_EMAIL = "cleanplatelab.id@gmail.com";

const ADMIN_PROFILE_COLUMNS = "id,user_id,email,full_name,role,created_at,updated_at";

async function getFunctionErrorMessage(error, fallback) {
  try {
    const payload = await error?.context?.json();
    return payload?.error || payload?.message || error?.message || fallback;
  } catch {
    return error?.message || fallback;
  }
}

export async function getAdminProfile(userId) {
  if (!supabase || !userId) {
    return { data: null, error: new Error("Sesi admin tidak valid.") };
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select(ADMIN_PROFILE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

/** Fetch the complete admin list through the superadmin-only Edge Function. */
export async function fetchAdminUsers() {
  if (!supabase) {
    return { data: [], error: new Error("Supabase client not initialized.") };
  }

  const { data, error } = await supabase.functions.invoke("admin-users", {
    method: "GET",
  });

  if (error) {
    return {
      data: [],
      error: new Error(
        await getFunctionErrorMessage(error, "Gagal mengambil daftar admin."),
      ),
    };
  }

  return { data: data?.users || [], error: null };
}

/** Authenticate, then authorize the user against public.admin_users. */
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
      const isServerAccountError =
        error.status === 500 || error.code === "unexpected_failure";

      return {
        success: false,
        error: isServerAccountError
          ? "Data akun Auth bermasalah. Hubungi superadmin untuk memperbaiki akun ini."
          : error.message || "Email atau password tidak valid.",
      };
    }

    const user = data.user;
    const { data: profile, error: profileError } = await getAdminProfile(user.id);

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Akun ini tidak terdaftar sebagai Admin Clean Plate Lab.",
      };
    }

    return { success: true, user, role: profile.role, profile };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Email atau password tidak valid.",
    };
  }
}

/** Change the password for the currently authenticated admin. */
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
  } catch (error) {
    return { success: false, error: error.message || "Gagal mengubah password." };
  }
}

/** Create Auth and profile records atomically through a privileged Edge Function. */
export async function createAdminAccount({ email, password, fullName, role }) {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  const { data, error } = await supabase.functions.invoke("admin-users", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName?.trim() || "Admin User",
      role: role || "admin",
    },
  });

  if (error) {
    return {
      success: false,
      error: await getFunctionErrorMessage(error, "Gagal membuat akun admin."),
    };
  }

  return { success: true, user: data?.user };
}

/** Delete both the Auth user and profile through the superadmin-only Edge Function. */
export async function deleteAdminUser(id, email) {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  if (email?.trim().toLowerCase() === SUPERADMIN_EMAIL) {
    return { success: false, error: "Akun Superadmin Utama tidak dapat dihapus." };
  }

  const { error } = await supabase.functions.invoke("admin-users", {
    method: "DELETE",
    body: { id, email: email?.trim().toLowerCase() },
  });

  if (error) {
    return {
      success: false,
      error: await getFunctionErrorMessage(error, "Gagal menghapus akun admin."),
    };
  }

  return { success: true };
}
