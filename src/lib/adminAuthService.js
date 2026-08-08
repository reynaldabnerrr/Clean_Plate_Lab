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
 * Login function with direct authentication & "Email not confirmed" bypass
 */
export async function loginAdminUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not initialized. Environment variables not set on Vercel.",
    };
  }

  try {
    // 1. Try standard Supabase Auth Login
    let { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    // 2. Auto-provision Superadmin if first time (user may not exist yet)
    if (error && cleanEmail === SUPERADMIN_EMAIL) {
      console.log("Auto-provisioning Superadmin account in Supabase Auth...");
      try {
        const signUpRes = await supabase.auth.signUp({
          email: cleanEmail,
          password: password || SUPERADMIN_DEFAULT_PASS,
          options: {
            data: {
              full_name: "Superadmin CPL",
              role: "superadmin",
            },
          },
        });

        if (!signUpRes.error && signUpRes.data.user) {
          data = signUpRes.data;
          error = null;
        }
      } catch {
        // Continue
      }
    }

    // 3. Only bypass for EMAIL NOT CONFIRMED — never for wrong password
    if (error) {
      const isEmailNotConfirmed =
        error.message?.toLowerCase().includes("not confirmed") ||
        error.message?.toLowerCase().includes("email_confirm") ||
        error.code === "email_not_confirmed";

      // Superadmin bypass — ONLY for unconfirmed email
      if (cleanEmail === SUPERADMIN_EMAIL && isEmailNotConfirmed) {
        return {
          success: true,
          user: {
            id: "sa-001",
            email: SUPERADMIN_EMAIL,
            user_metadata: { full_name: "Superadmin CPL", role: "superadmin" },
          },
          role: "superadmin",
        };
      }

      // Registered admin bypass — ONLY for unconfirmed email
      if (isEmailNotConfirmed) {
        try {
          const { data: adminRecord } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", cleanEmail)
            .single();

          if (adminRecord) {
            return {
              success: true,
              user: {
                id: adminRecord.user_id || adminRecord.id,
                email: adminRecord.email,
                user_metadata: {
                  full_name: adminRecord.full_name,
                  role: adminRecord.role,
                },
              },
              role: adminRecord.role || "admin",
            };
          }
        } catch {
          // Continue to error
        }
      }

      // Wrong password, user not found, etc. — reject
      throw error;
    }

    const user = data.user;
    let role = cleanEmail === SUPERADMIN_EMAIL ? "superadmin" : "admin";

    // Fetch profile from admin_users table
    try {
      const { data: profile, error: profileError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", cleanEmail)
        .single();

      if (profileError) {
        if (
          profileError.message?.includes("not found") ||
          profileError.message?.includes("querying schema")
        ) {
          console.warn("admin_users table not available — skipping profile fetch.");
        } else {
          console.warn("admin_users profile query error:", profileError.message);
        }
      } else if (profile?.role) {
        role = profile.role;
      } else {
        // Upsert admin user profile
        await supabase.from("admin_users").upsert([
          {
            user_id: user.id,
            email: cleanEmail,
            full_name: user.user_metadata?.full_name || (cleanEmail === SUPERADMIN_EMAIL ? "Superadmin CPL" : "Admin User"),
            role: role,
          },
        ]);
      }
    } catch {
      // Ignore if table error — login still succeeds
    }

    return {
      success: true,
      user,
      role,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Email atau password tidak valid.",
    };
  }
}

/**
 * Change Password for logged in user
 */
export async function changeUserPassword(newPassword, userEmail = null) {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { success: true, user: data.user };
    }

    if (userEmail) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        {
          redirectTo: `${window.location.origin}/?reset=true`,
        },
      );
      if (error && error.message !== "User not found") throw error;
      return {
        success: true,
        requiresEmailConfirmation: true,
        message:
          "Kami mengirimkan tautan reset password ke email Anda. Buka email untuk mengkonfirmasi perubahan password.",
      };
    }

    throw new Error("No active session. Please log in again to change password.");
  } catch (err) {
    return { success: false, error: err.message || "Gagal mengubah password." };
  }
}

/**
 * Superadmin creates a new Admin/Superadmin account
 */
export async function createAdminAccount({ email, password, fullName, role }) {
  const cleanEmail = email.trim().toLowerCase();

  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  try {
    let newUserId = null;
    let authUser = null;

    // Attempt Supabase Auth SignUp silently
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName || "Admin User",
            role: role || "admin",
          },
        },
      });

      if (!error && data?.user) {
        authUser = data.user;
        newUserId = data.user.id;
      }
    } catch (authErr) {
      console.warn("Bypassing Auth email confirmation rate limit:", authErr.message);
    }

    // Direct registration into admin_users table (No Email Confirmation Needed)
    const { data: insertedRows, error: dbError } = await supabase
      .from("admin_users")
      .upsert(
        [
          {
            user_id: newUserId,
            email: cleanEmail,
            full_name: fullName || "Admin User",
            role: role || "admin",
          },
        ],
        { onConflict: "email" }
      )
      .select();

    if (dbError && !authUser && !insertedRows) {
      throw new Error(dbError.message || "Gagal membuat akun admin.");
    }

    return {
      success: true,
      user: authUser || insertedRows?.[0] || { email: cleanEmail, role: role || "admin" },
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
