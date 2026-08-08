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
  ShieldAlert,
  Crown,
  UserCheck,
} from "lucide-react";
import { Button } from "./ui/button";

const INITIAL_FORM_STATE = {
  id: "",
  code: "CPL-MON",
  name: "",
  day: "Monday / Senin",
  category: "High Protein",
  protein: 80,
  carbs: 120,
  fat: 25,
  sodium: 1300,
  potassium: 350,
  kcal: 1050,
  image: "/images/chicken_teriyaki.webp",
  tags_ID: ["Monday / Senin", "80g Protein"],
  tags_EN: ["Monday", "80g Protein"],
  desc_ID: "",
  desc_EN: "",
  available: true,
  batch: "MON-01",
};

export function AdminDashboardModal({ isOpen, onClose }) {
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
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState("admin");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [userActionLoading, setUserActionLoading] = useState(false);

  // Fetch Admin Users list when entering Users tab
  const loadAdminUsersList = useCallback(async () => {
    setLoadingUsers(true);
    const res = await getAdminUsers();
    if (res.data) setAdminUsers(res.data);
    setLoadingUsers(false);
  }, [getAdminUsers]);

  useEffect(() => {
    if (isAdminLoggedIn && activeTab === "users" && userRole === "superadmin") {
      loadAdminUsersList();
    }
  }, [isAdminLoggedIn, activeTab, userRole, loadAdminUsersList]);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const res = await loginSupabase(email, password);
    setAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || "Login gagal. Periksa email dan password Supabase Anda.");
    }
  };

  // Handle Change Password Submit
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
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassSuccess("Password berhasil diperbarui!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } else {
      setPassError(res.error || "Gagal memperbarui password.");
    }
  };

  // Handle Create Admin User (Superadmin)
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setUserError("");
    setUserSuccess("");

    if (!newUserEmail || !newUserPassword) {
      setUserError("Email dan password wajib diisi.");
      return;
    }
    if (newUserPassword.length < 6) {
      setUserError("Password minimal 6 karakter.");
      return;
    }

    setUserActionLoading(true);
    const res = await createAdminUserAccount({
      email: newUserEmail,
      password: newUserPassword,
      fullName: newUserFullName,
      role: newUserRole,
    });
    setUserActionLoading(false);

    if (res.success) {
      setUserSuccess(`Akun ${newUserRole.toUpperCase()} baru berhasil dibuat!`);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setCreateUserModalOpen(false);
      loadAdminUsersList();
    } else {
      setUserError(res.error || "Gagal membuat akun admin.");
    }
  };

  // Handle Delete Admin User
  const handleDeleteUser = async (id, userEmail) => {
    if (!window.confirm(`Hapus akun admin ${userEmail}?`)) return;

    setUserActionLoading(true);
    const res = await deleteAdminUserAccount(id, userEmail);
    setUserActionLoading(false);

    if (res.success) {
      setUserSuccess("Akun berhasil dihapus.");
      loadAdminUsersList();
    } else {
      alert(`Gagal menghapus: ${res.error}`);
    }
  };

  // Open Form to Create Meal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormState({
      ...INITIAL_FORM_STATE,
      code: `CPL-${Date.now().toString().slice(-4)}`,
      tags_ID: ["Monday / Senin", "80g Protein"],
      tags_EN: ["Monday", "80g Protein"],
    });
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
      category: item.category || "High Protein",
      protein: item.protein ?? 80,
      carbs: item.carbs ?? 120,
      fat: item.fat ?? 25,
      sodium: item.sodium ?? 1300,
      potassium: item.potassium ?? 350,
      kcal: item.kcal ?? 1050,
      image: item.image || "/images/chicken_teriyaki.webp",
      tags_ID: Array.isArray(item.tags_ID) ? item.tags_ID : [item.day || "Today"],
      tags_EN: Array.isArray(item.tags_EN) ? item.tags_EN : [item.day || "Today"],
      desc_ID: item.desc_ID || "",
      desc_EN: item.desc_EN || "",
      available: item.available ?? true,
      batch: item.batch || "BATCH-01",
    });
    setEditModalOpen(true);
  };

  // Save Meal Form
  const handleFormSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage("");

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
    if (!window.confirm(`Yakin ingin menghapus menu "${name}"?`)) return;

    setActionLoading(true);
    const res = await deleteMenuItem(id);
    setActionLoading(false);

    if (res.success) {
      setStatusMessage(`Menu "${name}" telah dihapus.`);
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal menghapus: ${res.error}`);
    }
  };

  // Seed default menus
  const handleSeed = async () => {
    if (!window.confirm("Masukkan 6 menu bawaan CPL ke dalam tabel Supabase (this_week_menu)?")) return;

    setActionLoading(true);
    const res = await seedDefaultMenus();
    setActionLoading(false);

    if (res.success) {
      setStatusMessage("6 Menu preset berhasil di-seed ke Supabase!");
      setTimeout(() => setStatusMessage(""), 4000);
    } else {
      alert(`Gagal seed preset: ${res.error}`);
    }
  };

  const loggedInEmail = supabaseUser?.email || "cleanplatelab.id@gmail.com";
  const isSuperAdmin = userRole === "superadmin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border-2 border-[#1E1E1E] bg-[#FEFDF9] p-4 sm:p-8 shadow-[8px_8px_0_#1E1E1E] my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E1E]/15 pb-4 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E1E1E] bg-[#1E1E1E] text-[#8D9B7D] shadow-2xs">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-black uppercase tracking-tight text-[#1E1E1E] sm:text-2xl">
                  Admin CMS Portal
                </h2>
                {isAdminLoggedIn && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider ${
                      isSuperAdmin
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-blue-100 text-blue-900 border border-blue-300"
                    }`}
                  >
                    {isSuperAdmin ? <Crown size={12} className="text-amber-600" /> : <UserCheck size={12} />}
                    {isSuperAdmin ? "SUPERADMIN" : "ADMIN"}
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] text-[#1E1E1E]/60">
                {isAdminLoggedIn ? loggedInEmail : "Kelola Katalog This Week Menu & Akses CMS"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={logoutSupabase}
                className="h-9 gap-1.5 rounded-lg border-[#1E1E1E] text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1E1E1E] bg-white text-[#1E1E1E] transition-colors hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NOT LOGGED IN LOGIN FORM */}
        {!isAdminLoggedIn ? (
          <div className="mx-auto my-6 w-full max-w-md space-y-6">

            {authError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-800">
                <AlertTriangle size={16} className="shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]/80">
                  Email Admin / Superadmin
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white py-2.5 pl-9 pr-3 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                    placeholder="nama@cleanplatelab.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]/80">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white py-2.5 pl-9 pr-10 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="mt-2 min-h-11 w-full rounded-xl bg-[#1E1E1E] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8D9B7D]"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" /> Verifikasi Auth...
                  </span>
                ) : (
                  "Login Ke Admin Portal"
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD CONTROLS */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 border-b border-[#1E1E1E]/15 pb-3 mb-4 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === "menu"
                    ? "bg-[#1E1E1E] text-white shadow-sm"
                    : "bg-gray-100 text-[#1E1E1E]/70 hover:bg-gray-200"
                }`}
              >
                <Database size={15} />
                <span>This Week Menu CMS</span>
              </button>

              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === "users"
                      ? "bg-[#1E1E1E] text-white shadow-sm"
                      : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <Users size={15} />
                  <span>User Management</span>
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] font-black text-white">
                    SUPER
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === "password"
                    ? "bg-[#1E1E1E] text-white shadow-sm"
                    : "bg-gray-100 text-[#1E1E1E]/70 hover:bg-gray-200"
                }`}
              >
                <Key size={15} />
                <span>Ganti Password</span>
              </button>
            </div>

            {statusMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 text-xs font-bold text-green-900 shrink-0">
                <CheckCircle size={16} className="text-green-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* TAB 1: MENU CMS */}
            {activeTab === "menu" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-[#1E1E1E]">DataSource:</span>
                    {isFromDb ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-800 border border-green-300">
                        <Sparkles size={11} className="text-green-600" /> Supabase Live DB
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                        Local Fallback Preset
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchLatestMenus}
                      disabled={loadingMenu}
                      className="h-9 gap-1.5 rounded-lg border-[#1E1E1E] text-xs font-bold"
                    >
                      <RefreshCw size={13} className={loadingMenu ? "animate-spin" : ""} />
                      <span>Refresh</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSeed}
                      disabled={actionLoading}
                      className="h-9 gap-1.5 rounded-lg border-amber-400 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100"
                    >
                      <Sparkles size={13} />
                      <span>Seed Preset SQL</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleOpenCreate}
                      className="h-9 gap-1.5 rounded-lg bg-[#8D9B7D] text-xs font-bold text-white hover:bg-[#6B7860]"
                    >
                      <Plus size={15} />
                      <span>Tambah Menu</span>
                    </Button>
                  </div>
                </div>

                {/* Menu Table */}
                <div className="flex-1 overflow-y-auto border-2 border-[#1E1E1E] rounded-xl bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-[#1E1E1E] text-white font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Hari & Kode</th>
                        <th className="p-3">Nama Menu</th>
                        <th className="p-3 text-center">Protein / Kcal</th>
                        <th className="p-3 text-center">Status Stok</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-sans">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 font-mono">
                            <span className="font-bold text-[#1E1E1E]">{item.day}</span>
                            <span className="block text-[10px] text-gray-500">{item.code}</span>
                          </td>
                          <td className="p-3 font-bold text-[#1E1E1E]">{item.name}</td>
                          <td className="p-3 text-center font-mono">
                            <span className="font-extrabold text-[#8D9B7D]">{item.protein}g</span>
                            <span className="block text-[10px] text-gray-500">{item.kcal} kcal</span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAvailability(item.id, item.available)}
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider transition-all ${
                                item.available
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {item.available ? "AVAILABLE" : "SOLD OUT"}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
                                title="Edit Menu"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMeal(item.id, item.name)}
                                className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                                title="Hapus Menu"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT (SUPERADMIN ONLY) */}
            {activeTab === "users" && isSuperAdmin && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-4">
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#1E1E1E]">
                      Manajemen Akun Admin & Superadmin
                    </h3>
                    <p className="font-mono text-xs text-gray-500">
                      Hanya Superadmin yang memiliki hak membuat dan mengelola akun admin.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setCreateUserModalOpen(true)}
                    className="h-9 gap-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    <UserPlus size={15} />
                    <span>Tambah Akun Baru</span>
                  </Button>
                </div>

                {userSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 text-xs font-bold text-green-900 shrink-0">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>{userSuccess}</span>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto border-2 border-[#1E1E1E] rounded-xl bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-[#1E1E1E] text-white font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Email Akun</th>
                        <th className="p-3">Nama Lengkap</th>
                        <th className="p-3 text-center">Role Hak Akses</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-sans">
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-amber-50/30">
                          <td className="p-3 font-mono font-bold text-[#1E1E1E]">{user.email}</td>
                          <td className="p-3 font-medium text-gray-700">{user.full_name || "-"}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase ${
                                user.role === "superadmin"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {user.role === "superadmin" && <Crown size={11} className="text-amber-600" />}
                              {user.role?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {user.email !== "cleanplatelab.id@gmail.com" ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-mono text-[11px]"
                              >
                                <Trash2 size={14} />
                              </button>
                            ) : (
                              <span className="font-mono text-[10px] text-gray-400 italic">Protected</span>
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
              <div className="mx-auto my-auto w-full max-w-md space-y-4">
                <div className="rounded-xl border border-[#1E1E1E]/20 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <Key size={18} className="text-[#8D9B7D]" />
                    <h3 className="font-display font-extrabold text-base uppercase text-[#1E1E1E]">
                      Ubah Password Akun ({userRole.toUpperCase()})
                    </h3>
                  </div>

                  {passSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 text-xs font-bold text-green-900">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>{passSuccess}</span>
                    </div>
                  )}

                  {passError && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span>{passError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]/80">
                        Password Baru
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white py-2.5 pl-9 pr-10 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                          placeholder="Password baru (min. 6 karakter)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E1E1E]/80">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white py-2.5 pl-9 pr-3 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                          placeholder="Ulangi password baru"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={passLoading}
                      className="mt-2 min-h-11 w-full rounded-xl bg-[#1E1E1E] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8D9B7D]"
                    >
                      {passLoading ? "Memperbarui Password..." : "Simpan Password Baru"}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE NEW ADMIN USER MODAL (SUPERADMIN ONLY) */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-[#1E1E1E] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-amber-600" />
                <h3 className="font-display font-extrabold text-base uppercase text-[#1E1E1E]">
                  Buat Akun Admin Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateUserModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {userError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800">
                <AlertTriangle size={16} className="text-red-600" />
                <span>{userError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 font-sans text-xs">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-gray-700">
                  Email Akun Baru
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                  placeholder="admin@cleanplatelab.com"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                  placeholder="Nama Admin"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-gray-700">
                  Role Akses
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-sm font-bold focus:border-[#8D9B7D] focus:outline-none"
                >
                  <option value="admin">ADMIN (Kelola Katalog Menu)</option>
                  <option value="superadmin">SUPERADMIN (Akses Penuh + User Management)</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-gray-700">
                  Password Awal
                </label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-sm font-medium focus:border-[#8D9B7D] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateUserModalOpen(false)}
                  className="h-10 rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={userActionLoading}
                  className="h-10 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  {userActionLoading ? "Membuat Akun..." : "Buat Akun"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/CREATE MEAL FORM MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border-2 border-[#1E1E1E] bg-white p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-3 mb-4 sticky top-0 bg-white z-10">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#8D9B7D] uppercase tracking-wider">
                  {isEditing ? "EDIT DATA MENU" : "TAMBAH MENU BARU"}
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl uppercase text-[#1E1E1E]">
                  {isEditing ? `Edit Menu: ${formState.name}` : "Tambah Menu Hidangan Baru"}
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

            <form onSubmit={handleFormSave} className="space-y-4 font-sans text-xs font-bold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                    placeholder="misal: Chicken Teriyaki & Rice"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Hari Sajian (Slot Katering)
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

                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Kategori Menu
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  >
                    <option value="High Protein">High Protein</option>
                    <option value="Lean Muscle">Lean Muscle</option>
                    <option value="Keto Lab">Keto Lab</option>
                    <option value="Balanced Diet">Balanced Diet</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                    Status Ketersediaan
                  </label>
                  <select
                    value={formState.available ? "true" : "false"}
                    onChange={(e) => setFormState({ ...formState, available: e.target.value === "true" })}
                    className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  >
                    <option value="true">Tersedia (Available)</option>
                    <option value="false">Habis / Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Live Preview & Presets */}
              <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3.5 rounded-xl space-y-3">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">URL Gambar</label>
                  <input
                    type="text"
                    required
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    placeholder="/images/chicken_teriyaki.webp"
                    className="w-full rounded-xl border-2 border-[#1E1E1E] bg-white p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  />
                </div>

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
                      Preset Gambar Contoh:
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

              {/* Nutrition Specs */}
              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1.5 block">
                  Kandungan Nutrisi (Per Porsi)
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
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold text-[#6B7860] focus:outline-none"
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
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none"
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
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none"
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
                      className="w-full rounded-lg border border-[#1E1E1E] p-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-[#6B7860] mb-1 block">
                  Deskripsi Menu (Bahasa Indonesia)
                </label>
                <textarea
                  rows={2}
                  value={formState.desc_ID}
                  onChange={(e) => setFormState({ ...formState, desc_ID: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#1E1E1E] p-2.5 text-xs font-bold focus:border-[#8D9B7D] focus:outline-none"
                  placeholder="Deskripsi nutrisi dan bahan hidangan..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t-2 border-[#1E1E1E]">
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
    </div>
  );
}
