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
  Check,
  Ban,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { CplPrimaryLogo } from "../components/CplLogo";

const INITIAL_FORM_STATE = {
  id: null,
  code: "CPL-MON",
  name: "",
  day: "Monday / Senin",
  protein: 80,
  carbs: 120,
  fat: 25,
  fiber: 0.14,
  sodium: 1300,
  potassium: 350,
  kcal: 1050,
  image: "/images/chicken_teriyaki.webp",
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
    fetchLatestMenus,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
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
    const res = await getAdminUsers();
    if (res.data) {
      setAdminUsers(res.data);
    }
    setLoadingUsers(false);
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
    setFormState(INITIAL_FORM_STATE);
    setEditModalOpen(true);
  };

  // Open Form to Edit Meal
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setFormState({
      id: item.id,
      code: item.code || "CPL-MENU",
      name: item.name || "",
      day: item.day || "Monday / Senin",
      protein: item.protein ?? 80,
      carbs: item.carbs ?? 120,
      fat: item.fat ?? 25,
      fiber: item.fiber ?? 0.14,
      sodium: item.sodium ?? 1300,
      potassium: item.potassium ?? 350,
      kcal: item.kcal ?? 1050,
      image: item.image || "/images/chicken_teriyaki.webp",
      tags_ID: Array.isArray(item.tags_ID) ? item.tags_ID : [item.day || "Today"],
      tags_EN: Array.isArray(item.tags_EN) ? item.tags_EN : [item.day || "Today"],
      desc_ID: item.desc_ID || "",
      desc_EN: item.desc_EN || "",
      batch: item.batch || "BATCH-01",
    });
    setEditModalOpen(true);
  };

  // Save Meal Form
  const handleFormSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage("");

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
        setActionLoading(false);
        return;
      }
    }

    let res;
    if (isEditing) {
      res = await updateMenuItem(formState.id, formState);
    } else {
      res = await createMenuItem(formState);
    }

    setActionLoading(false);
    if (res.success) {
      setEditModalOpen(false);
      setStatusMessage(
        isEditing ? "Menu berhasil diperbarui!" : "Menu baru berhasil ditambahkan!"
      );
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal menyimpan menu: ${res.error}`);
    }
  };

  // Delete Meal
  const handleDeleteMeal = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus menu "${name}"?`)) {
      return;
    }
    setActionLoading(true);
    const res = await deleteMenuItem(id);
    setActionLoading(false);

    if (res.success) {
      setStatusMessage(`Menu "${name}" berhasil dihapus.`);
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal menghapus menu: ${res.error}`);
    }
  };

  // Toggle Availability
  const handleToggleMeal = async (id, currentStatus, name) => {
    const res = await toggleAvailability(id, !currentStatus);
    if (res.success) {
      setStatusMessage(
        `Status "${name}" diubah menjadi ${!currentStatus ? "Tersedia" : "Stok Habis"}.`
      );
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  // Seed Preset Menus
  const handleSeedPresets = async () => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menambahkan 6 menu preset Clean Plate Lab ke database?"
      )
    )
      return;

    setActionLoading(true);
    const res = await seedDefaultMenus();
    setActionLoading(false);

    if (res.success) {
      setStatusMessage("6 Menu preset berhasil di-seed!");
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
      setPassSuccess("Password berhasil diubah!");
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
      (item.day && item.day.toLowerCase().includes(query))
    );
  });

  const loggedInEmail = supabaseUser?.email || "cleanplatelab.id@gmail.com";

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
          <span className="font-mono text-xs font-bold text-[#6B7860] uppercase tracking-wider">
            Clean Plate Lab CMS v2.0
          </span>
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
    <div className="h-screen w-screen overflow-hidden bg-[#F6F5EE] flex text-[#1E1E1E] font-sans">
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION (RESPONSIVE DRAWER) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1E1E1E] text-white flex flex-col justify-between shrink-0 h-full border-r-2 border-[#1E1E1E] overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 ${
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
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b-2 border-[#1E1E1E] p-4 sm:p-6 sticky top-0 z-20 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#6B7860] uppercase font-bold mb-1 truncate">
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
                <h2 className="font-display text-lg sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-[#1E1E1E] truncate">
                  {activeTab === "menu"
                    ? "KATALOG THIS WEEK MENU"
                    : activeTab === "users"
                    ? "MANAJEMEN AKUN ADMIN"
                    : "PENGATURAN KEAMANAN"}
                </h2>
              </div>
            </div>

            {/* Mobile / Tablet Database Status Badge */}
            <span className="inline-flex xl:hidden items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-emerald-900 border border-emerald-300 shrink-0">
              <CheckCircle size={12} className="text-emerald-600" /> Live DB
            </span>
          </div>

          {/* Quick Header Badges & Actions */}
          <div className="flex flex-wrap items-center justify-start xl:justify-end gap-2.5 w-full xl:w-auto shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-[#1E1E1E]/10">
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
              <CheckCircle size={13} className="text-emerald-600" /> Live Database Active
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
        <main className="p-4 sm:p-6 flex-1">
          {/* TAB 1: KATALOG MENU THIS WEEK */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Top Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-[#1E1E1E] bg-white p-4 shadow-[4px_4px_0_#1E1E1E]">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari hidangan menu, hari, atau kategori..."
                    className="w-full rounded-xl border border-[#1E1E1E] bg-[#FEFDF9] py-2 pl-10 pr-4 text-xs font-bold text-[#1E1E1E] placeholder-gray-400 focus:outline-none focus:border-[#8D9B7D]"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="font-mono text-xs font-bold text-gray-500 mr-2">
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
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                          </div>

                          {/* COMPLETE NUTRITION FACTS SPECS BOX */}
                          <div className="mt-auto pt-4 border-t border-[#1E1E1E]/15 space-y-3">
                            <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3 space-y-2 rounded-none">
                              <div className="border-b border-[#1E1E1E]/20 pb-1.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#6B7860]">
                                <span>LAB NUTRITION SPECS</span>
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
                                onClick={() => handleDeleteMeal(item.id, item.name)}
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
                <div className="overflow-x-auto border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E]">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] font-mono uppercase text-white text-[10px]">
                      <tr>
                        <th className="p-3">Hidangan</th>
                        <th className="p-3">Hari / Kode</th>
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
                              {item.menu_date && <div className="text-[10px] text-[#6B7860] font-bold">{item.menu_date}</div>}
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
                                  onClick={() => handleDeleteMeal(item.id, item.name)}
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
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-2 border-[#1E1E1E] bg-white p-5 shadow-[4px_4px_0_#1E1E1E]">
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
                  className="gap-2 border-2 border-[#1E1E1E] bg-[#8D9B7D] text-white text-xs font-bold uppercase shadow-[2px_2px_0_#1E1E1E] hover:bg-[#6B7860]"
                >
                  <UserPlus size={16} />
                  <span>Tambah Akun Baru</span>
                </Button>
              </div>

              {/* Admin Users Table */}
              <div className="border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] font-mono text-white text-[10px] uppercase">
                    <tr>
                      <th className="p-3.5">Nama & Email</th>
                      <th className="p-3.5">Role Akses</th>
                      <th className="p-3.5">Tanggal Dibuat</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-[#1E1E1E]/20 font-bold">
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
            </div>
          )}

          {/* TAB 3: GANTI PASSWORD */}
          {activeTab === "password" && (
            <div className="max-w-md mx-auto my-6 border-2 border-[#1E1E1E] bg-white p-6 sm:p-8 shadow-[6px_6px_0_#1E1E1E]">
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
                  {passLoading ? "Mengubah Password..." : "Simpan Password Baru"}
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MEAL MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl my-auto border-2 border-[#1E1E1E] bg-white p-5 sm:p-7 shadow-[8px_8px_0_#1E1E1E] max-h-[92vh] overflow-y-auto rounded-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Hari Katering (Slot 1 - 6)
                  </label>
                  <select
                    value={formState.day}
                    onChange={(e) => {
                      const selectedDay = e.target.value;
                      let code = "CPL-MON";
                      if (selectedDay.includes("Tuesday") || selectedDay.includes("Selasa")) code = "CPL-TUE";
                      if (selectedDay.includes("Wednesday") || selectedDay.includes("Rabu")) code = "CPL-WED";
                      if (selectedDay.includes("Thursday") || selectedDay.includes("Kamis")) code = "CPL-THU";
                      if (selectedDay.includes("Friday") || selectedDay.includes("Jumat")) code = "CPL-FRI";
                      if (selectedDay.includes("Saturday") || selectedDay.includes("Sabtu")) code = "CPL-SAT";

                      setFormState({ ...formState, day: selectedDay, code });
                    }}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  >
                    <option value="Monday / Senin">Senin / Monday (CPL-MON)</option>
                    <option value="Tuesday / Selasa">Selasa / Tuesday (CPL-TUE)</option>
                    <option value="Wednesday / Rabu">Rabu / Wednesday (CPL-WED)</option>
                    <option value="Thursday / Kamis">Kamis / Thursday (CPL-THU)</option>
                    <option value="Friday / Jumat">Jumat / Friday (CPL-FRI)</option>
                    <option value="Saturday / Sabtu">Sabtu / Saturday (CPL-SAT)</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Quick Presets & Preview */}
              <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3.5 rounded-xl space-y-3">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">URL Gambar Hidangan</label>
                  <input
                    type="text"
                    required
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    placeholder="/images/chicken_teriyaki.webp atau URL gambar"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>

                {/* Preset image selector & Live Preview */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className="h-20 w-28 shrink-0 rounded-xl border-2 border-[#1E1E1E] overflow-hidden bg-gray-100 relative">
                    <img
                      src={formState.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-[#1E1E1E] text-white text-[8px] font-mono px-1 py-0.5 rounded">
                      PREVIEW
                    </span>
                  </div>

                  <div className="flex-1 w-full">
                    <span className="font-mono text-[9px] text-gray-500 uppercase block mb-1.5">
                      Preset Gambar Contoh (Klik untuk pilih):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: "Chicken Teriyaki", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
                        { name: "Beef Steak", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
                        { name: "Salmon Bowl", url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80" },
                        { name: "Grilled Chicken", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setFormState({ ...formState, image: preset.url })}
                          className="px-2 py-1 text-[10px] font-mono font-bold bg-white border border-[#1E1E1E] rounded hover:bg-[#E1ECD3] transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Macros Grid */}
              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1.5 block">
                  Kandungan Nutrisi / Makro (Per Porsi)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border-2 border-[#1E1E1E] bg-white p-2.5 rounded-xl">
                    <label className="font-mono text-[9px] uppercase text-[#6B7860] block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formState.protein}
                      onChange={(e) => setFormState({ ...formState, protein: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold text-[#6B7860] focus:outline-none focus:border-[#8D9B7D]"
                    />
                  </div>

                  <div className="border-2 border-[#1E1E1E] bg-white p-2.5 rounded-xl">
                    <label className="font-mono text-[9px] uppercase text-[#6B7860] block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formState.carbs}
                      onChange={(e) => setFormState({ ...formState, carbs: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none focus:border-[#8D9B7D]"
                    />
                  </div>

                  <div className="border-2 border-[#1E1E1E] bg-white p-2.5 rounded-xl">
                    <label className="font-mono text-[9px] uppercase text-[#6B7860] block mb-1">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formState.fat}
                      onChange={(e) => setFormState({ ...formState, fat: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none focus:border-[#8D9B7D]"
                    />
                  </div>

                  <div className="border-2 border-[#1E1E1E] bg-white p-2.5 rounded-xl">
                    <label className="font-mono text-[9px] uppercase text-[#6B7860] block mb-1">Fiber / Serat (g)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formState.fiber}
                      onChange={(e) => setFormState({ ...formState, fiber: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold text-[#1E1E1E] focus:outline-none focus:border-[#8D9B7D]"
                    />
                  </div>

                  <div className="border-2 border-[#1E1E1E] bg-white p-2.5 rounded-xl">
                    <label className="font-mono text-[9px] uppercase text-[#6B7860] block mb-1">Kalori (Kcal)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formState.kcal}
                      onChange={(e) => setFormState({ ...formState, kcal: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none focus:border-[#8D9B7D]"
                    />
                  </div>
                </div>
              </div>

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
                  {actionLoading ? "Menyimpan..." : "Simpan Menu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN USER MODAL (SUPERADMIN ONLY) */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md border-2 border-[#1E1E1E] bg-white p-6 sm:p-8 shadow-[8px_8px_0_#1E1E1E]">
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
                  {createUserLoading ? "Membuat Akun..." : "Buat Akun Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
