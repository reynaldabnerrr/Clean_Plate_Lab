import React, { useCallback, useEffect, useState } from "react";
import { CplContext } from "./cpl-context";
import { getDateInputValueInTimeZone } from "../lib/order";
import { migrateStoredLanguage, writeStoredState } from "../lib/storage";
import { supabase } from "../lib/supabase";
import {
  fetchWeeklyMenusFromSupabase,
  createWeeklyMenuItem,
  updateWeeklyMenuItem,
  deleteWeeklyMenuItem,
  toggleWeeklyMenuItemAvailability,
  seedDefaultWeeklyMenus,
} from "../lib/menuService";
import {
  loginAdminUser,
  changeUserPassword,
  createAdminAccount,
  fetchAdminUsers,
  deleteAdminUser,
  getAdminProfile,
} from "../lib/adminAuthService";
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS } from "../data/initialMenus";
import { translate } from "../data/translations";

export function CplProvider({ children }) {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [isFromDb, setIsFromDb] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingAdminSession, setLoadingAdminSession] = useState(
    Boolean(supabase),
  );
  const [announcementText, setAnnouncementText] = useState(
    "100% Lab Verified High Protein Meal Prep • Free Delivery Jabodetabek",
  );
  const [storedLanguage] = useState(migrateStoredLanguage);
  const [language, setLanguageState] = useState(storedLanguage || "EN");
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(
    Boolean(storedLanguage),
  );

  // Restore only real Supabase sessions that have an admin_users profile.
  useEffect(() => {
    if (!supabase) {
      setLoadingAdminSession(false);
      return undefined;
    }

    let isActive = true;
    localStorage.removeItem("cpl_admin_session");

    const clearAdminState = () => {
      setSupabaseUser(null);
      setIsAdminLoggedIn(false);
      setUserRole("admin");
    };

    const syncAdminSession = async (session) => {
      const user = session?.user ?? null;
      if (!user) {
        if (isActive) clearAdminState();
        return;
      }

      const { data: profile } = await getAdminProfile(user.id);
      if (!isActive) return;

      if (!profile) {
        clearAdminState();
        return;
      }

      setSupabaseUser(user);
      setIsAdminLoggedIn(true);
      setUserRole(profile.role);
    };

    const restoreAdminSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await syncAdminSession(session);
      } catch (error) {
        console.warn("Gagal memulihkan sesi admin:", error);
        if (isActive) clearAdminState();
      } finally {
        if (isActive) setLoadingAdminSession(false);
      }
    };

    void restoreAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Run outside the auth callback to avoid blocking other auth operations.
      setTimeout(() => void syncAdminSession(session), 0);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch menu items from Supabase (with fallback)
  const fetchLatestMenus = useCallback(async () => {
    setLoadingMenu(true);
    try {
      const res = await fetchWeeklyMenusFromSupabase();
      if (res.data && res.data.length > 0) {
        setMenuItems(res.data);
        setIsFromDb(res.isFromDb);
      }
      return res;
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestMenus();
  }, [fetchLatestMenus]);

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage !== "ID" && nextLanguage !== "EN") return;
    setLanguageState(nextLanguage);
    setHasSelectedLanguage(true);
    writeStoredState("language", nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ID" ? "id" : "en";
  }, [language]);

  const t = useCallback(
    (key) => translate(language, key),
    [language],
  );

  // Supabase Auth & Role Management Methods
  const loginSupabase = async (email, password) => {
    const res = await loginAdminUser(email, password);
    if (res.success) {
      setSupabaseUser(res.user);
      setIsAdminLoggedIn(true);
      setUserRole(res.role);
    }
    return res;
  };

  const logoutSupabase = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setSupabaseUser(null);
    setIsAdminLoggedIn(false);
    setUserRole("admin");
  };

  const changePassword = async (newPassword) => {
    return await changeUserPassword(newPassword);
  };

  const createAdminUserAccount = async (accountData) => {
    return await createAdminAccount(accountData);
  };

  const getAdminUsers = async () => {
    return await fetchAdminUsers();
  };

  const deleteAdminUserAccount = async (id, email) => {
    return await deleteAdminUser(id, email);
  };

  // Supabase Menu CRUD Methods
  const createMenuItem = async (itemData) => {
    const res = await createWeeklyMenuItem(itemData);
    if (res.success) {
      setMenuItems((prev) => [...prev, res.data]);
      setIsFromDb(true);
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error };
  };

  const updateMenuItem = async (id, updatedFields) => {
    const res = await updateWeeklyMenuItem(id, updatedFields);
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item)),
      );
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error };
  };

  const deleteMenuItem = async (id) => {
    const res = await deleteWeeklyMenuItem(id);
    if (res.success) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
    return res;
  };

  const toggleAvailability = async (id, currentStatus) => {
    const res = await toggleWeeklyMenuItemAvailability(id, currentStatus);
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item)),
      );
      return { success: true };
    } else {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, available: !currentStatus } : item,
        ),
      );
      return { success: true, error: res.error };
    }
  };

  const seedDefaultMenus = async () => {
    const res = await seedDefaultWeeklyMenus();
    if (res.success) {
      await fetchLatestMenus();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Add new order
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      refCode: `CPL-SUB-2026-${Math.floor(10 + Math.random() * 90)}`,
      date: getDateInputValueInTimeZone(),
      status: "Pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Update order status
  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord)),
    );
  };

  return (
    <CplContext.Provider
      value={{
        menuItems,
        supabaseUser,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        userRole,
        loginSupabase,
        logoutSupabase,
        changePassword,
        createAdminUserAccount,
        getAdminUsers,
        deleteAdminUserAccount,
        isFromDb,
        loadingMenu,
        loadingAdminSession,
        fetchLatestMenus,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        seedDefaultMenus,
        orders,
        addOrder,
        updateOrderStatus,
        announcementText,
        setAnnouncementText,
        language,
        setLanguage,
        hasSelectedLanguage,
        t,
      }}
    >
      {children}
    </CplContext.Provider>
  );
}
