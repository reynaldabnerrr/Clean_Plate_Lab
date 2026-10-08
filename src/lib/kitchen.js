export const KITCHEN_BREAK_START = "2026-10-08";
export const KITCHEN_BREAK_END = "2026-10-13";
export const KITCHEN_REOPENS = "2026-10-14";
export const KITCHEN_NOTICE_END = new Date("2026-10-14T00:00:00+08:00").getTime();

export function isKitchenNoticeActive(now = Date.now()) {
  return Number(now) < KITCHEN_NOTICE_END;
}

export function isKitchenClosed(date) {
  return date >= KITCHEN_BREAK_START && date <= KITCHEN_BREAK_END;
}

export function isServiceDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    && date.getUTCDay() !== 0 && !isKitchenClosed(value);
}

export function getServiceDates(start, end) {
  if (!start || !end || start > end) return [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  if (!Number.isFinite(cursor.getTime()) || !Number.isFinite(last.getTime())) return [];
  const dates = [];
  while (cursor <= last) {
    const value = cursor.toISOString().slice(0, 10);
    if (isServiceDate(value)) dates.push(value);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

// Shared with submit validation; callers supply today's date in operational WITA.
export function getOrderDateError(start, end, today) {
  if (isKitchenClosed(start) || isKitchenClosed(end)) return "kitchenClosed";
  if (!isServiceDate(start) || !isServiceDate(end) || end < start) return "invalidRange";
  if (start < today) return "pastDate";
  return null;
}

export const kitchenCopy = {
  ID: {
    title: "Kitchen Libur · 8–13 Oktober 2026",
    body: "Kitchen Clean Plate Lab libur sementara pada 8–13 Oktober 2026 dan kembali beroperasional pada 14 Oktober 2026.",
    orders: "Pemesanan tetap dibuka! Kamu bisa order sekarang untuk jadwal makan mulai 14 Oktober dan seterusnya.",
    homeAction: "Pesan untuk 14 Oktober & Seterusnya",
    formAction: "Lanjut Isi Form",
    validation: "Kitchen kami libur pada 8–13 Oktober 2026. Silakan pilih jadwal makan mulai 14 Oktober.",
    excluded: "Hari Minggu dan tanggal libur kitchen tidak dihitung sebagai hari makan.",
  },
  EN: {
    title: "Kitchen Break · 8–13 October 2026",
    body: "The Clean Plate Lab kitchen will be closed from 8–13 October 2026. We’ll be back on 14 October 2026.",
    orders: "We’re still taking orders! Place your order now for meals scheduled for 14 October onwards.",
    homeAction: "Order for 14 October Onwards",
    formAction: "Continue to Order Form",
    validation: "Our kitchen is closed from 8–13 October 2026. Please select a meal date from 14 October onwards.",
    excluded: "Sundays and kitchen closure dates are excluded from meal days.",
  },
};
