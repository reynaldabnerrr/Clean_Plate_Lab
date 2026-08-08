import React, { useState, useEffect, useCallback } from "react";
import { useCpl } from "../hooks/useCpl";
import {
  X,
  Lock,
  Mail,
  LogOut,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Database,
  ShieldCheck,
  UserPlus,
  Users,
  Key,
  Crown,
  UserCheck,
  ArrowLeft,
  Utensils,
  Menu,
  LayoutGrid,
  List,
  Search,
  ExternalLink,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { MenuImageUpload } from "../components/MenuImageUpload";
import { NutritionTierEditor } from "../components/NutritionTierEditor";
import {
  FullScreenLoader,
  LoadingSpinner,
  MenuGridSkeleton,
  Skeleton,
} from "../components/ui/loading";
import {
  buildNutritionByTier,
  formatMenuDate,
  getManagedMenuImagePath,
  getMenuSlot,
  getMenuSlotFromDate,
  getWeeklyMenuDate,
  isMenuDateForSlot,
  normalizeNutritionByTier,
  removeMenuImage,
  uploadMenuImage,
} from "../lib/menuService";

const INITIAL_NUTRITION_BY_TIER = buildNutritionByTier({
  protein: 80,
  carbs: 120,
  fat: 25,
  fiber: 0.14,
  sodium: 1300,
  potassium: 350,
  kcal: 1050,
});

const MENU_DAY_BY_SLOT = {
  1: { day: "Monday / Senin", code: "CPL-MON", label: "Senin / Monday" },
  2: { day: "Tuesday / Selasa", code: "CPL-TUE", label: "Selasa / Tuesday" },
  3: { day: "Wednesday / Rabu", code: "CPL-WED", label: "Rabu / Wednesday" },
  4: { day: "Thursday / Kamis", code: "CPL-THU", label: "Kamis / Thursday" },
  5: { day: "Friday / Jumat", code: "CPL-FRI", label: "Jumat / Friday" },
  6: { day: "Saturday / Sabtu", code: "CPL-SAT", label: "Sabtu / Saturday" },
};

const INITIAL_FORM_STATE = {
  id: null,
  code: "CPL-MON",
  name: "",
  day: "Monday / Senin",
  menuDate: getWeeklyMenuDate(1),
  protein: 80,
  carbs: 120,
  fat: 25,
  fiber: 0.14,
  sodium: 1300,
  potassium: 350,
  kcal: 1050,
  nutritionByTier: INITIAL_NUTRITION_BY_TIER,
  image: "",
  tags_ID: ["Monday / Senin", "80g Protein"],
  tags_EN: ["Monday", "80g Protein"],
  desc_ID: "",
  desc_EN: "",
  batch: "MON-01",
};

export default function AdminPage() {
  const {
    supabaseUser,
    isAdminLoggedIn,
    userRole,
    loginSupabase,
    logoutSupabase,
    changePassword,
    createAdminUserAccount,
    getAdminUsers,
    deleteAdminUserAccount,
    menuItems,
    isFromDb,
    loadingMenu,
    loadingAdminSession,
    fetchLatestMenus,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    seedDefaultMenus,
  } = useCpl();

  // Active Tab: "menu" | "users" | "password"
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [translating, setTranslating] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auto-translate ID description to English
  const handleAutoTranslate = async () => {
    if (!formState.desc_ID.trim()) {
      alert("Isi deskripsi Bahasa Indonesia terlebih dahulu.");
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          formState.desc_ID
        )}&langpair=id|en`
      );
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        setFormState((prev) => ({
          ...prev,
          desc_EN: data.responseData.translatedText,
        }));
      } else {
        setFormState((prev) => ({ ...prev, desc_EN: prev.desc_ID }));
      }
    } catch {
      setFormState((prev) => ({ ...prev, desc_EN: prev.desc_ID }));
    } finally {
      setTranslating(false);
    }
  };

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Menu CRUD modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Change Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // User Management State (Superadmin)
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState("admin");
  const [userMgmtError, setUserMgmtError] = useState("");
  const [userMgmtSuccess, setUserMgmtSuccess] = useState("");
  const [createUserLoading, setCreateUserLoading] = useState(false);

  const isSuperAdmin = userRole === "superadmin";

  // Load Admin Users List
  const loadAdminUsersList = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoadingUsers(true);
    setUserMgmtError("");
    try {
      const res = await getAdminUsers();
      if (res.data) {
        setAdminUsers(res.data);
      }
      if (res.error) {
        setUserMgmtError(res.error.message || "Gagal memuat daftar akun admin.");
      }
    } finally {
      setLoadingUsers(false);
    }
  }, [isSuperAdmin, getAdminUsers]);

  useEffect(() => {
    if (isAdminLoggedIn && activeTab === "users" && isSuperAdmin) {
      loadAdminUsersList();
    }
  }, [isAdminLoggedIn, activeTab, isSuperAdmin, loadAdminUsersList]);

  // Handle Admin Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const res = await loginSupabase(email, password);
    setAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || "Login gagal. Periksa email dan password Anda.");
    }
  };

  // Open Form to Create Meal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormState({ ...INITIAL_FORM_STATE, menuDate: getWeeklyMenuDate(1) });
    setImageFile(null);
    setEditModalOpen(true);
  };

  // Open Form to Edit Meal
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setImageFile(null);
    setFormState({
      id: item.id,
      code: item.code || "CPL-MENU",
      name: item.name || "",
      day: item.day || "Monday / Senin",
      menuDate:
        item.menuDate
        || item.menu_date
        || getWeeklyMenuDate(getMenuSlot(item)),
      protein: item.protein ?? 80,
      carbs: item.carbs ?? 120,
      fat: item.fat ?? 25,
      fiber: item.fiber ?? 0.14,
      sodium: item.sodium ?? 1300,
      potassium: item.potassium ?? 350,
      kcal: item.kcal ?? 1050,
      nutritionByTier: normalizeNutritionByTier(item.nutritionByTier, item),
      image: item.image || "/images/chicken_teriyaki.webp",
      tags_ID: Array.isArray(item.tags_ID) ? item.tags_ID : [item.day || "Today"],
      tags_EN: Array.isArray(item.tags_EN) ? item.tags_EN : [item.day || "Today"],
      desc_ID: item.desc_ID || "",
      desc_EN: item.desc_EN || "",
      batch: item.batch || "BATCH-01",
    });
    setEditModalOpen(true);
  };

  const handleMenuDateChange = (event) => {
    const menuDate = event.currentTarget.value;
    const menuSlot = getMenuSlotFromDate(menuDate);

    if (!menuDate) {
      event.currentTarget.setCustomValidity("");
      setFormState((current) => ({ ...current, menuDate: "" }));
      return;
    }

    if (menuSlot === 7) {
      event.currentTarget.setCustomValidity(
        "Hari Minggu tidak tersedia. Pilih tanggal Senin sampai Sabtu.",
      );
      setFormState((current) => ({ ...current, menuDate }));
      event.currentTarget.reportValidity();
      return;
    }

    const selectedDay = MENU_DAY_BY_SLOT[menuSlot];
    if (!selectedDay) return;

    event.currentTarget.setCustomValidity("");
    setFormState((current) => ({
      ...current,
      menuDate,
      day: selectedDay.day,
      code: selectedDay.code,
    }));
  };

  // Save Meal Form
  const handleFormSave = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const menuSlot = getMenuSlot(formState);
    if (!isMenuDateForSlot(formState.menuDate, menuSlot)) {
      alert(`Tanggal menu harus sesuai dengan hari ${formState.day}.`);
      return;
    }

    // Validation: prevent duplicate days when creating new meal
    if (!isEditing) {
      const dayKeyword = (formState.day || "").slice(0, 3).toLowerCase();
      const existingMeal = menuItems.find((item) =>
        (item.day || "").toLowerCase().includes(dayKeyword)
      );
      if (existingMeal) {
        alert(
          `Hari "${formState.day}" sudah memiliki menu (${existingMeal.name}). Katalog katering ini khusus 6 hari (Senin - Sabtu). Silakan gunakan tombol Edit pada menu "${existingMeal.name}" untuk memperbaruinya.`
        );
        return;
      }
    }

    if (!isEditing && menuItems.length >= 6) {
      alert("Katalog sudah memiliki 6 menu. Edit salah satu slot atau hapus slot terlebih dahulu.");
      return;
    }

    setActionLoading(true);
    let uploadedPath = null;
    try {
      const payload = { ...formState };
      if (imageFile) {
        const uploadResult = await uploadMenuImage(imageFile, formState.code);
        if (!uploadResult.success) {
          alert(`Gagal upload gambar: ${uploadResult.error}`);
          return;
        }
        payload.image = uploadResult.publicUrl;
        uploadedPath = uploadResult.path;
      }

      if (!payload.image) {
        alert("Pilih gambar menu sebelum menyimpan.");
        return;
      }

      const res = isEditing
        ? await updateMenuItem(formState.id, payload)
        : await createMenuItem(payload);

      if (!res.success) {
        if (uploadedPath) await removeMenuImage(uploadedPath);
        alert(`Gagal menyimpan menu: ${res.error}`);
        return;
      }

      const oldManagedPath = getManagedMenuImagePath(formState.image);
      if (isEditing && oldManagedPath && formState.image !== payload.image) {
        await removeMenuImage(oldManagedPath);
      }

      setImageFile(null);
      setEditModalOpen(false);
      setStatusMessage(
        isEditing ? "Menu dan gambarnya berhasil diperbarui!" : "Menu baru berhasil ditambahkan!"
      );
      setTimeout(() => setStatusMessage(""), 4000);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Meal
  const handleDeleteMeal = async (id, name, imageUrl) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus menu "${name}"?`)) {
      return;
    }
    setActionLoading(true);
    const res = await deleteMenuItem(id);
    setActionLoading(false);

    if (res.success) {
      await removeMenuImage(imageUrl);
      setStatusMessage(`Menu "${name}" berhasil dihapus.`);
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal menghapus menu: ${res.error}`);
    }
  };

  // Seed Preset Menus
  const handleSeedPresets = async () => {
    if (
      !window.confirm(
        "Perbarui 6 slot menu dengan preset Clean Plate Lab? Data pada slot Senin-Sabtu akan diganti, tanpa menambah baris baru."
      )
    )
      return;

    setActionLoading(true);
    const res = await seedDefaultMenus();
    setActionLoading(false);

    if (res.success) {
      setStatusMessage("6 slot menu berhasil diperbarui dari preset!");
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal seed preset: ${res.error}`);
    }
  };

  // Change Password Form
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (newPassword.length < 6) {
      setPassError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Konfirmasi password tidak cocok.");
      return;
    }

    setPassLoading(true);
    const res = await changePassword(newPassword);
    setPassLoading(false);

    if (res.success) {
      if (res.requiresEmailConfirmation) {
        setPassSuccess(res.message || "Tautan reset password telah dikirim ke email Anda.");
      } else {
        setPassSuccess("Password berhasil diubah!");
      }
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPassError(res.error || "Gagal mengubah password.");
    }
  };

  // Create New Admin Account Form
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setUserMgmtError("");
    setUserMgmtSuccess("");

    if (!newUserEmail || !newUserPassword) {
      setUserMgmtError("Email dan password wajib diisi.");
      return;
    }

    setCreateUserLoading(true);
    const res = await createAdminUserAccount({
      email: newUserEmail,
      password: newUserPassword,
      fullName: newUserFullName,
      role: newUserRole,
    });
    setCreateUserLoading(false);

    if (res.success) {
      setUserMgmtSuccess(`Akun ${newUserRole.toUpperCase()} berhasil dibuat!`);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setCreateUserModalOpen(false);
      loadAdminUsersList();
    } else {
      setUserMgmtError(res.error || "Gagal membuat akun.");
    }
  };

  // Delete Admin User Account
  const handleDeleteUser = async (id, emailToDelete) => {
    if (!window.confirm(`Hapus akun admin "${emailToDelete}"?`)) return;
    const res = await deleteAdminUserAccount(id, emailToDelete);
    if (res.success) {
      setUserMgmtSuccess(`Akun "${emailToDelete}" berhasil dihapus.`);
      loadAdminUsersList();
    } else {
      alert(`Gagal menghapus: ${res.error}`);
    }
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.code && item.code.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.day && item.day.toLowerCase().includes(query)) ||
      (item.menuDate && item.menuDate.includes(query))
    );
  });

  const loggedInEmail = supabaseUser?.email || "cleanplatelab.id@gmail.com";

  if (loadingAdminSession) {
    return (
      <FullScreenLoader
        title="Menyiapkan portal admin"
        description="Memeriksa sesi admin dan hak akses Supabase..."
      />
    );
  }

  // LOGIN PAGE LAYOUT (UNAUTHENTICATED)
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FEFDF9] flex flex-col justify-between font-sans">
        {/* Top Minimal Bar */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-[#1E1E1E]/10">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1E1E1E] bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#1E1E1E] shadow-[3px_3px_0_#1E1E1E] hover:bg-[#1E1E1E] hover:text-white transition-all"
          >
            <ArrowLeft size={15} />
            <span>Ke Website Utama</span>
          </a>
        </div>

        {/* Center Login Box */}
        <div className="mx-auto my-auto w-full max-w-md p-4 sm:p-6">
          <div className="rounded-2xl border-2 border-[#1E1E1E] bg-white p-6 sm:p-8 shadow-[8px_8px_0_#1E1E1E]">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#1E1E1E] bg-[#1E1E1E] text-[#8D9B7D] shadow-[4px_4px_0_#8D9B7D]">
                <ShieldCheck size={36} />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1E1E1E]">
                Portal Admin Login
              </h1>
              <p className="font-sans text-xs text-[#1E1E1E]/70 mt-1.5">
                Masuk untuk mengelola katalog menu mingguan & akses manajemen.
              </p>
            </div>

            {authError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-800 font-bold">
                <AlertTriangle size={16} className="shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@cleanplatelab.id"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-[#FEFDF9] py-2.5 pl-10 pr-4 text-sm font-bold text-[#1E1E1E] placeholder-gray-400 focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-[#FEFDF9] py-2.5 pl-10 pr-10 text-sm font-bold text-[#1E1E1E] placeholder-gray-400 focus:border-[#8D9B7D] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="mt-6 min-h-12 w-full justify-center rounded-xl border-2 border-[#1E1E1E] bg-[#1E1E1E] text-xs font-display font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#8D9B7D] hover:bg-[#333] transition-all"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={15} className="animate-spin text-[#8D9B7D]" />
                    Memverifikasi...
                  </span>
                ) : (
                  <span>Masuk Dashboard Admin</span>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="p-4 text-center text-xs font-mono text-gray-400 border-t border-[#1E1E1E]/10">
          Clean Plate Lab Admin Panel • Realtime Supabase Data Sync
        </div>
      </div>
    );
  }

  // DASHBOARD LAYOUT WITH LEFT SIDEBAR (AUTHENTICATED)
  return (
    <div className="flex min-h-[100dvh] w-full overflow-x-hidden bg-[#F6F5EE] font-sans text-[#1E1E1E] lg:h-screen lg:overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION (RESPONSIVE DRAWER) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[min(18rem,calc(100vw-2rem))] shrink-0 flex-col justify-between overflow-y-auto border-r-2 border-[#1E1E1E] bg-[#1E1E1E] text-white transition-transform duration-300 lg:static lg:w-72 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8D9B7D] text-white border border-white/20 shadow-sm shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-sm font-black uppercase tracking-wider text-white truncate">
                  Clean Plate Lab
                </h1>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8D9B7D]">
                  CMS ADMIN DASHBOARD
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("menu");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-display text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "menu"
                  ? "bg-[#8D9B7D] text-white shadow-[3px_3px_0_#000]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Utensils size={18} />
                <span>Katalog Menu</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-white font-bold">
                {menuItems.length}
              </span>
            </button>

            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("users");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-display text-xs font-extrabold uppercase tracking-wider transition-all ${
                  activeTab === "users"
                    ? "bg-[#8D9B7D] text-white shadow-[3px_3px_0_#000]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>User Management</span>
                </div>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded font-black bg-amber-400 text-black uppercase">
                  SUPER
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab("password");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-display text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "password"
                  ? "bg-[#8D9B7D] text-white shadow-[3px_3px_0_#000]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Key size={18} />
                <span>Ganti Password</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#8D9B7D]">
                LOGGED IN USER
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-black uppercase ${
                  isSuperAdmin
                    ? "bg-amber-400 text-black"
                    : "bg-blue-400 text-black"
                }`}
              >
                {isSuperAdmin ? <Crown size={10} /> : <UserCheck size={10} />}
                {userRole.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-white truncate" title={loggedInEmail}>
              {loggedInEmail}
            </p>
          </div>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-bold text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={14} />
              <span>Ke Website Utama</span>
            </span>
            <ExternalLink size={13} className="text-gray-400" />
          </a>

          <Button
            variant="outline"
            onClick={logoutSupabase}
            className="w-full h-10 gap-2 rounded-xl border-red-500/40 bg-red-950/30 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={15} />
            <span>Keluar (Logout)</span>
          </Button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col lg:h-full lg:min-h-0 lg:overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex flex-col justify-between gap-3 border-b-2 border-[#1E1E1E] bg-white p-3 shadow-2xs sm:p-5 xl:flex-row xl:items-center xl:gap-4">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1E1E1E] bg-white text-[#1E1E1E] shadow-[2px_2px_0_#1E1E1E] shrink-0 hover:bg-gray-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="min-w-0">
                <div className="mb-1 hidden items-center gap-2 truncate font-mono text-[11px] font-bold uppercase text-[#6B7860] sm:flex">
                  <span>Admin Dashboard</span>
                  <ChevronRight size={13} className="shrink-0" />
                  <span className="text-[#1E1E1E] truncate">
                    {activeTab === "menu"
                      ? "Katalog Menu Minggu Ini"
                      : activeTab === "users"
                      ? "User Management"
                      : "Pengaturan Keamanan Password"}
                  </span>
                </div>
                <h2 className="line-clamp-2 font-display text-base font-black uppercase leading-tight tracking-tight text-[#1E1E1E] sm:text-2xl lg:text-3xl">
                  {activeTab === "menu"
                    ? "KATALOG THIS WEEK MENU"
                    : activeTab === "users"
                    ? "MANAJEMEN AKUN ADMIN"
                    : "PENGATURAN KEAMANAN"}
                </h2>
              </div>
            </div>

            {/* Mobile / Tablet Database Status Badge */}
            <span
              className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:inline-flex sm:text-xs xl:hidden ${
                loadingMenu
                  ? "border-amber-300 bg-amber-100 text-amber-900"
                  : isFromDb
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-slate-100 text-slate-700"
              }`}
            >
              {loadingMenu ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : isFromDb ? (
                <CheckCircle size={12} className="text-emerald-600" />
              ) : (
                <Database size={12} />
              )}
              {loadingMenu ? "Syncing" : isFromDb ? "Live DB" : "Fallback"}
            </span>
          </div>

          {/* Quick Header Badges & Actions */}
          <div className="flex w-full shrink-0 flex-wrap items-center justify-start gap-2.5 border-t border-[#1E1E1E]/10 pt-2 xl:w-auto xl:justify-end xl:border-t-0 xl:pt-0">
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold xl:inline-flex ${
                loadingMenu
                  ? "border-amber-300 bg-amber-100 text-amber-900"
                  : isFromDb
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-slate-100 text-slate-700"
              }`}
            >
              {loadingMenu ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : isFromDb ? (
                <CheckCircle size={13} className="text-emerald-600" />
              ) : (
                <Database size={13} />
              )}
              {loadingMenu
                ? "Syncing Database..."
                : isFromDb
                  ? "Live Database Active"
                  : "Menggunakan Data Fallback"}
            </span>

            {activeTab === "menu" && (
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto">
                <button
                  type="button"
                  onClick={fetchLatestMenus}
                  disabled={loadingMenu}
                  className="col-span-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-[#1E1E1E] bg-white text-xs font-mono font-bold uppercase shadow-[2px_2px_0_#1E1E1E] hover:bg-[#E1ECD3] transition-all disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5"
                  title="Refresh Menu from Database"
                >
                  <RefreshCw size={14} className={loadingMenu ? "animate-spin text-[#6B7860]" : "text-[#6B7860]"} />
                  <span>{loadingMenu ? "Syncing..." : "Refresh"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedPresets}
                  disabled={actionLoading}
                  className="col-span-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-[#1E1E1E] bg-[#FEFDF9] text-xs font-mono font-bold uppercase shadow-[2px_2px_0_#1E1E1E] hover:bg-amber-100 transition-all disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5"
                  title="Seed Preset Menus if Empty"
                >
                  <Database size={14} className="text-amber-700" />
                  <span>Seed Presets</span>
                </button>

                <Button
                  onClick={handleOpenCreate}
                  disabled={actionLoading || menuItems.length >= 6}
                  title={menuItems.length >= 6 ? "Enam slot sudah terisi. Gunakan Edit untuk memperbarui menu." : "Tambah menu ke slot yang kosong"}
                  className="col-span-2 sm:flex-none w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-[#1E1E1E] bg-[#8D9B7D] text-white text-xs font-display font-black uppercase shadow-[3px_3px_0_#1E1E1E] hover:bg-[#6B7860] transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Plus size={16} />
                  <span>Tambah Menu Baru</span>
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Global Status Banner Notice */}
        {statusMessage && (
          <div className="m-4 sm:m-6 mb-0 flex items-center justify-between rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button type="button" onClick={() => setStatusMessage("")} className="text-emerald-700 hover:text-emerald-900">
              <X size={16} />
            </button>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="min-w-0 flex-1 p-3 pb-8 sm:p-5 lg:p-6">
          {/* TAB 1: KATALOG MENU THIS WEEK */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Top Search & Filter Bar */}
              <div className="flex flex-col justify-between gap-3 border-2 border-[#1E1E1E] bg-white p-3 shadow-[4px_4px_0_#1E1E1E] sm:flex-row sm:items-center sm:p-4">
                <div className="relative w-full flex-1 sm:max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari hidangan menu, hari, atau kategori..."
                    className="w-full rounded-xl border border-[#1E1E1E] bg-[#FEFDF9] py-2 pl-10 pr-4 text-xs font-bold text-[#1E1E1E] placeholder-gray-400 focus:outline-none focus:border-[#8D9B7D]"
                  />
                </div>

                <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
                  <span className="mr-auto font-mono text-[10px] font-bold text-gray-500 sm:mr-2 sm:text-xs">
                    Menampilkan {filteredMenuItems.length} dari {menuItems.length} menu
                  </span>

                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 border border-[#1E1E1E] rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-[#1E1E1E] text-white"
                        : "bg-white text-[#1E1E1E] hover:bg-gray-100"
                    }`}
                    title="Tampilan Grid Card"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`p-2 border border-[#1E1E1E] rounded-lg transition-all ${
                      viewMode === "table"
                        ? "bg-[#1E1E1E] text-white"
                        : "bg-white text-[#1E1E1E] hover:bg-gray-100"
                    }`}
                    title="Tampilan Tabel Detail"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* VIEW MODE 1: GRID VIEW */}
              {loadingMenu ? (
                <MenuGridSkeleton />
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {filteredMenuItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-none border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E] transition-all duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#8D9B7D]"
                      >
                        {/* Image Header */}
                        <div className="relative h-52 sm:h-60 bg-[#1E1E1E] border-b-2 border-[#1E1E1E] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          {/* Day / Code Badge */}
                          <div className="absolute left-3 top-3 bg-[#1E1E1E] text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_#8D9B7D] border border-white/20">
                            {item.day ? item.day.toUpperCase() : item.code}
                          </div>
                          {item.menuDate && (
                            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-[#1E1E1E] bg-[#FEFDF9] px-2.5 py-1 font-mono text-[9px] font-black uppercase text-[#1E1E1E] shadow-[2px_2px_0_#8D9B7D]">
                              <CalendarDays size={11} aria-hidden="true" />
                              {formatMenuDate(item.menuDate)}
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6 justify-between space-y-4">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#6B7860] block mb-1">
                                  {item.code || "CPL-MENU"} • {item.batch || "BATCH 01"}
                                </span>
                                <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1E1E1E] min-h-[3.25rem] flex items-center">
                                  {item.name}
                                </h3>
                              </div>
                              <span className="shrink-0 bg-[#E1ECD3] border border-[#1E1E1E] px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#1E1E1E] mt-4">
                                {item.kcal} KCAL
                              </span>
                            </div>

                            <p className="mt-3 text-xs leading-relaxed text-[#1E1E1E]/80">
                              {item.desc_ID || item.desc_EN || "Spesifikasi nutrisi lengkap tinggi protein."}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Varian protein tersedia">
                              {(item.availableProteinTiers || [25, 40, 60, 80, 100]).map((tier) => (
                                <span
                                  key={tier}
                                  className="border border-[#1E1E1E] bg-[#E1ECD3] px-2 py-1 font-mono text-[9px] font-black text-[#1E1E1E]"
                                >
                                  {tier}g
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* COMPLETE NUTRITION FACTS SPECS BOX */}
                          <div className="mt-auto pt-4 border-t border-[#1E1E1E]/15 space-y-3">
                            <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3 space-y-2 rounded-none">
                              <div className="border-b border-[#1E1E1E]/20 pb-1.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#6B7860]">
                                <span>LAB NUTRITION SPECS · DEFAULT 40G TIER</span>
                              </div>

                              {/* 4-Column Macros Grid */}
                              <div className="grid grid-cols-4 gap-1 text-center font-display">
                                <div className="border border-[#1E1E1E] bg-white p-1">
                                  <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">PROTEIN</div>
                                  <div className="text-xs font-black text-[#6B7860] mt-0.5">{item.protein}g</div>
                                </div>
                                <div className="border border-[#1E1E1E] bg-white p-1">
                                  <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">CARBS</div>
                                  <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{item.carbs}g</div>
                                </div>
                                <div className="border border-[#1E1E1E] bg-white p-1">
                                  <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FAT</div>
                                  <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{item.fat}g</div>
                                </div>
                                <div className="border border-[#1E1E1E] bg-white p-1">
                                  <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FIBER</div>
                                  <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{item.fiber ?? 0.14}g</div>
                                </div>
                              </div>

                              {/* 2-Column Micros Grid */}
                              <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                                <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                                  <span className="text-gray-500 font-bold">SODIUM</span>
                                  <span className="font-extrabold text-[#1E1E1E]">{item.sodium}mg</span>
                                </div>
                                <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                                  <span className="text-gray-500 font-bold">POTASSIUM</span>
                                  <span className="font-extrabold text-[#1E1E1E]">{item.potassium}mg</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between gap-2.5 pt-1">
                              <Button
                                onClick={() => handleOpenEdit(item)}
                                className="flex-1 h-10 gap-2 border-2 border-[#1E1E1E] bg-[#FEFDF9] text-xs font-bold text-[#1E1E1E] shadow-[3px_3px_0_#1E1E1E] hover:bg-[#8D9B7D] hover:text-white transition-all"
                              >
                                <Edit size={14} />
                                <span>EDIT MENU</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDeleteMeal(item.id, item.name, item.image)}
                                className="h-10 px-3.5 border-2 border-[#1E1E1E] bg-red-50 text-red-700 shadow-[3px_3px_0_#1E1E1E] hover:bg-red-600 hover:text-white transition-all"
                                title="Hapus Menu Ini"
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VIEW MODE 2: TABLE VIEW */
                <div className="max-w-full overflow-x-auto border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E]">
                  <table className="min-w-[860px] w-full text-left text-xs font-sans">
                    <thead className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] font-mono uppercase text-white text-[10px]">
                      <tr>
                        <th className="p-3">Hidangan</th>
                        <th className="p-3">Hari / Kode</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-center">Protein</th>
                        <th className="p-3 text-center">Carbs</th>
                        <th className="p-3 text-center">Fat</th>
                        <th className="p-3 text-center">Kcal</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-[#1E1E1E]/20">
                      {filteredMenuItems.map((item) => {
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 font-bold">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded object-cover border border-[#1E1E1E]"
                              />
                              <div>
                                <div className="font-display font-black text-sm uppercase text-[#1E1E1E]">
                                  {item.name}
                                </div>
                                <div className="text-[10px] font-mono text-gray-500 truncate max-w-xs">
                                  {item.desc_ID || item.desc_EN}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-xs">
                              <div>{item.day || item.code}</div>
                              {item.menuDate && (
                                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#6B7860]">
                                  <CalendarDays size={11} aria-hidden="true" />
                                  {formatMenuDate(item.menuDate)}
                                </div>
                              )}
                            </td>
                            <td className="p-3">{item.category}</td>
                            <td className="p-3 text-center text-[#6B7860] font-black">{item.protein}g</td>
                            <td className="p-3 text-center">{item.carbs}g</td>
                            <td className="p-3 text-center">{item.fat}g</td>
                            <td className="p-3 text-center font-mono">{item.kcal}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMeal(item.id, item.name, item.image)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT (SUPERADMIN ONLY) */}
          {activeTab === "users" && isSuperAdmin && (
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-col gap-4 border-2 border-[#1E1E1E] bg-white p-4 shadow-[4px_4px_0_#1E1E1E] sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown size={18} className="text-amber-500" />
                    <h3 className="font-display text-xl font-black uppercase">User Management</h3>
                  </div>
                  <p className="text-xs text-[#1E1E1E]/70 mt-1">
                    Kelola daftar akun Admin & Superadmin yang memiliki hak akses ke portal CMS.
                  </p>
                </div>
                <Button
                  onClick={() => setCreateUserModalOpen(true)}
                  className="w-full gap-2 border-2 border-[#1E1E1E] bg-[#8D9B7D] text-xs font-bold uppercase text-white shadow-[2px_2px_0_#1E1E1E] hover:bg-[#6B7860] sm:w-auto"
                >
                  <UserPlus size={16} />
                  <span>Tambah Akun Baru</span>
                </Button>
              </div>

              {/* Admin Users Table */}
              {userMgmtError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800" role="alert">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>{userMgmtError}</span>
                </div>
              )}
              {userMgmtSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-900" role="status">
                  <CheckCircle size={15} className="shrink-0 text-emerald-600" />
                  <span>{userMgmtSuccess}</span>
                </div>
              )}

              {loadingUsers ? (
                <div className="space-y-3 border-2 border-[#1E1E1E] bg-white p-4 shadow-[6px_6px_0_#1E1E1E]" role="status" aria-label="Memuat daftar akun admin">
                  <LoadingSpinner
                    label="Memuat daftar akun admin..."
                    className="w-full py-2 font-mono text-xs font-bold uppercase text-[#6B7860]"
                  />
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="grid gap-2 border-t border-[#1E1E1E]/15 pt-3 sm:grid-cols-[1fr_7rem_8rem]">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56 max-w-full" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:hidden">
                    {adminUsers.length === 0 ? (
                      <div className="border-2 border-dashed border-[#1E1E1E]/30 bg-white p-6 text-center font-mono text-xs uppercase text-gray-500">
                        Belum ada akun admin yang dapat ditampilkan.
                      </div>
                    ) : (
                      adminUsers.map((user) => (
                        <article
                          key={user.id}
                          className="border-2 border-[#1E1E1E] bg-white p-4 shadow-[4px_4px_0_#1E1E1E]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate font-display text-base font-black text-[#1E1E1E]">
                                {user.full_name || "Admin CPL"}
                              </h4>
                              <p className="mt-0.5 break-all font-mono text-[10px] text-gray-500">
                                {user.email}
                              </p>
                            </div>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-black uppercase ${
                                user.role === "superadmin"
                                  ? "border border-amber-300 bg-amber-100 text-amber-900"
                                  : "border border-blue-300 bg-blue-100 text-blue-900"
                              }`}
                            >
                              {user.role === "superadmin" ? (
                                <Crown size={10} />
                              ) : (
                                <UserCheck size={10} />
                              )}
                              {user.role?.toUpperCase()}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#1E1E1E]/15 pt-3">
                            <span className="font-mono text-[10px] text-gray-500">
                              Dibuat {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                            </span>
                            {user.email !== "cleanplatelab.id@gmail.com" ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="min-h-10 rounded-lg px-2 font-mono text-[10px] font-bold text-red-600 hover:bg-red-50 hover:text-red-800"
                              >
                                Hapus Akun
                              </button>
                            ) : (
                              <span className="font-mono text-[9px] italic text-gray-400">
                                Primary Owner
                              </span>
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </div>

              <div className="hidden max-w-full overflow-x-auto border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E] md:block">
                <table className="min-w-[680px] w-full text-left text-xs">
                  <thead className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] font-mono text-white text-[10px] uppercase">
                    <tr>
                      <th className="p-3.5">Nama & Email</th>
                      <th className="p-3.5">Role Akses</th>
                      <th className="p-3.5">Tanggal Dibuat</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-[#1E1E1E]/20 font-bold">
                    {adminUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center font-mono text-xs uppercase text-gray-500">
                          Belum ada akun admin yang dapat ditampilkan.
                        </td>
                      </tr>
                    )}
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-3.5">
                          <div className="font-display font-black text-sm text-[#1E1E1E]">
                            {u.full_name || "Admin CPL"}
                          </div>
                          <div className="font-mono text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-black uppercase ${
                              u.role === "superadmin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            }`}
                          >
                            {u.role === "superadmin" ? <Crown size={11} /> : <UserCheck size={11} />}
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-500 text-[11px]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "-"}
                        </td>
                        <td className="p-3.5 text-right">
                          {u.email !== "cleanplatelab.id@gmail.com" ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="text-red-600 hover:text-red-800 p-1 font-mono text-xs font-bold"
                            >
                              Hapus Akun
                            </button>
                          ) : (
                            <span className="font-mono text-[10px] text-gray-400 italic">Primary Owner</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: GANTI PASSWORD */}
          {activeTab === "password" && (
            <div className="mx-auto my-3 max-w-md border-2 border-[#1E1E1E] bg-white p-4 shadow-[6px_6px_0_#1E1E1E] sm:my-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#1E1E1E]/15 pb-4">
                <div className="p-2.5 bg-[#1E1E1E] text-[#8D9B7D] rounded-xl">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black uppercase">Keamanan Password</h3>
                  <p className="text-xs text-[#1E1E1E]/70 font-mono">Ubah password akun admin Anda saat ini.</p>
                </div>
              </div>

              {passError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800">
                  <AlertTriangle size={15} />
                  <span>{passError}</span>
                </div>
              )}
              {passSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 text-xs font-bold text-green-800">
                  <CheckCircle size={15} />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold uppercase text-[#1E1E1E]">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 pr-10 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold uppercase text-[#1E1E1E]">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={passLoading}
                  className="w-full min-h-11 mt-4 border-2 border-[#1E1E1E] bg-[#1E1E1E] text-white font-display font-black uppercase text-xs shadow-[3px_3px_0_#8D9B7D]"
                >
                  {passLoading ? (
                    <LoadingSpinner label="Mengubah Password..." />
                  ) : (
                    "Simpan Password Baru"
                  )}
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MEAL MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-[#1E1E1E] bg-white p-4 shadow-[6px_6px_0_#1E1E1E] sm:max-h-[92vh] sm:p-7 sm:shadow-[8px_8px_0_#1E1E1E]">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-3.5 mb-5 sticky top-0 bg-white z-10">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#8D9B7D] uppercase tracking-wider">
                  {isEditing ? "EDIT DATA MENU" : "FORMULARIO TAMBAH MENU"}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#1E1E1E]">
                  {isEditing ? `Edit Menu: ${formState.name}` : "Tambah Menu Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E1E1E] bg-white text-[#1E1E1E] hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSave} className="space-y-4 text-xs font-sans font-bold">
              {/* Basic info grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Nama Hidangan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="misal: Chicken Teriyaki & Brown Rice"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="menu-date" className="mb-1 block font-mono text-[10px] uppercase text-[#6B7860]">
                    Tanggal Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="menu-date"
                    type="date"
                    required
                    value={formState.menuDate}
                    onChange={handleMenuDateChange}
                    aria-describedby="menu-date-help"
                    className="w-full min-h-10 rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                  <p id="menu-date-help" className="mt-1.5 text-[10px] font-medium leading-relaxed text-[#1E1E1E]/60">
                    Pilih tanggal Senin–Sabtu. Hari, kode, dan slot akan terisi otomatis.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-[#6B7860]">
                    Hari Katering (Otomatis)
                  </label>
                  <select
                    value={formState.day}
                    disabled
                    aria-describedby="menu-day-help"
                    className="w-full cursor-not-allowed rounded-xl border-2 border-[#1E1E1E] bg-[#E1ECD3]/50 p-2.5 text-xs font-bold text-[#1E1E1E] opacity-100"
                  >
                    {Object.entries(MENU_DAY_BY_SLOT).map(([slot, option]) => (
                      <option key={slot} value={option.day}>
                        {option.label} ({option.code})
                      </option>
                    ))}
                  </select>
                  <p id="menu-day-help" className="mt-1.5 text-[10px] font-medium leading-relaxed text-[#1E1E1E]/60">
                    Slot {getMenuSlot(formState)} mengikuti tanggal yang dipilih.
                  </p>
                </div>
              </div>

              <MenuImageUpload
                currentImage={formState.image}
                file={imageFile}
                onFileChange={setImageFile}
                disabled={actionLoading}
                required={!isEditing}
              />

              <NutritionTierEditor
                value={formState.nutritionByTier}
                onChange={(nutritionByTier) =>
                  setFormState((current) => ({ ...current, nutritionByTier }))
                }
                disabled={actionLoading}
              />

              {/* Descriptions Dual-Language */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">Deskripsi (Bahasa Indonesia)</label>
                  <textarea
                    rows={2}
                    value={formState.desc_ID}
                    onChange={(e) => setFormState({ ...formState, desc_ID: e.target.value })}
                    placeholder="Penjelasan hidangan dalam Bahasa Indonesia..."
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[10px] uppercase text-[#6B7860]">Description (English)</label>
                    <button
                      type="button"
                      onClick={handleAutoTranslate}
                      disabled={translating}
                      className="font-mono text-[10px] font-extrabold text-[#8D9B7D] hover:underline flex items-center gap-1 disabled:opacity-50"
                      title="Terjemahkan otomatis dari deskripsi Bahasa Indonesia"
                    >
                      <Sparkles size={11} />
                      <span>{translating ? "Menerjemahkan..." : "⚡ Auto-Translate EN"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={formState.desc_EN}
                    onChange={(e) => setFormState({ ...formState, desc_EN: e.target.value })}
                    placeholder="Meal description in English (klik Auto-Translate jika ingin penerjemahan otomatis)..."
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t-2 border-[#1E1E1E]">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-white font-bold hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto min-h-11 px-6 rounded-xl border-2 border-[#1E1E1E] bg-[#8D9B7D] text-white font-display font-black uppercase shadow-[3px_3px_0_#1E1E1E] hover:bg-[#6B7860] transition-all"
                >
                  {actionLoading ? (
                    <LoadingSpinner label="Menyimpan..." />
                  ) : (
                    "Simpan Menu"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN USER MODAL (SUPERADMIN ONLY) */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1E1E1E]/80 p-3 backdrop-blur-xs sm:p-4">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto border-2 border-[#1E1E1E] bg-white p-4 shadow-[6px_6px_0_#1E1E1E] sm:p-8 sm:shadow-[8px_8px_0_#1E1E1E]">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-3 mb-5">
              <h3 className="font-display text-lg font-black uppercase">Tambah Akun Admin Baru</h3>
              <button type="button" onClick={() => setCreateUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {userMgmtError && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800 flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{userMgmtError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs font-sans font-bold">
              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860]">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="misal: Reynald Abner"
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 focus:border-[#8D9B7D] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860]">Email Admin</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="admin@cleanplatelab.id"
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 focus:border-[#8D9B7D] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860]">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 focus:border-[#8D9B7D] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860]">Role Hak Akses</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                >
                  <option value="admin">ADMIN (Kelola Katalog Menu)</option>
                  <option value="superadmin">SUPERADMIN (Akses Penuh + User Management)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#1E1E1E]">
                <button
                  type="button"
                  onClick={() => setCreateUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border-2 border-[#1E1E1E] bg-white font-bold"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  disabled={createUserLoading}
                  className="min-h-10 px-5 rounded-xl border-2 border-[#1E1E1E] bg-[#8D9B7D] text-white font-display font-black uppercase shadow-[3px_3px_0_#1E1E1E]"
                >
                  {createUserLoading ? (
                    <LoadingSpinner label="Membuat Akun..." />
                  ) : (
                    "Buat Akun Admin"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
