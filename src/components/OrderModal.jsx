import React, { useEffect, useId, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useCpl } from '../hooks/useCpl';
import { CplLogoImage } from './CplLogo';
import { DateRangePicker } from './DateRangePicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { addons, proteinTiers } from '../data/site';
import { analytics } from '../lib/analytics';
import { readStoredState, writeStoredState } from '../lib/storage';
import {
  addDaysToDateInputValue,
  getDateInputValueInTimeZone,
  WHATSAPP_NUMBER,
} from '../lib/order';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle,
  Clock3,
  Link2,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
  User,
  UtensilsCrossed,
} from 'lucide-react';

const TIER_OPTIONS = proteinTiers.map(({ protein, prices }) => ({ tier: protein, prices }));
const GOOGLE_MAPS_HOST_PATTERN = /(^|\.)google\.[a-z.]+$/i;
const GOOGLE_MAPS_SHORT_LINK_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl']);

function isValidGoogleMapsUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    const isGoogleMapsHost = GOOGLE_MAPS_HOST_PATTERN.test(hostname)
      && (hostname.startsWith('maps.') || url.pathname.startsWith('/maps'));
    const isGoogleMapsShortLink = GOOGLE_MAPS_SHORT_LINK_HOSTS.has(hostname)
      && (hostname !== 'goo.gl' || url.pathname.startsWith('/maps'));

    return (url.protocol === 'https:' || url.protocol === 'http:')
      && (isGoogleMapsHost || isGoogleMapsShortLink);
  } catch {
    return false;
  }
}

function formatReadyTime(value) {
  return value.replace(':', '.');
}

function calculateDeliveryDays(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) return 0;

  let deliveryDays = 0;
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    if (cursor.getUTCDay() !== 0) deliveryDays += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return deliveryDays;
}

function formatOrderDate(value, locale = 'id-ID') {
  if (!value) return '-';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function getCateringPeriod(totalDays) {
  if (totalDays >= 24) return 'monthly';
  if (totalDays >= 6) return 'weekly';
  return 'daily';
}

const isDateInput = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isOrderDraft = (value) => value
  && TIER_OPTIONS.some((option) => option.tier === value.proteinTier)
  && isDateInput(value.startDate) && isDateInput(value.endDate)
  && [1, 2].includes(value.mealsPerDay)
  && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.singleMealReadyTime)
  && Array.isArray(value.addonIds) && value.addonIds.every((id) => addons.some((addon) => addon.id === id))
  && ['Self-arranged', 'Online-delivery'].includes(value.fulfillment);

export function OrderModal({ isOpen, onClose, initialProteinTier = 40, initialMealsPerDay = 1, hasExplicitInitialValues = false }) {
  const { addOrder, t, language } = useCpl();
  const fieldId = useId();
  const [today, setToday] = useState(() => getDateInputValueInTimeZone());

  const [storedDraft] = useState(() => readStoredState('order-draft', isOrderDraft));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [proteinTier, setProteinTier] = useState(storedDraft?.proteinTier ?? initialProteinTier);
  const [startDate, setStartDate] = useState(storedDraft?.startDate >= today ? storedDraft.startDate : today);
  const [endDate, setEndDate] = useState(storedDraft?.endDate >= today ? storedDraft.endDate : addDaysToDateInputValue(today, 4));
  const [mealsPerDay, setMealsPerDay] = useState(storedDraft?.mealsPerDay ?? initialMealsPerDay);
  const [singleMealReadyTime, setSingleMealReadyTime] = useState(storedDraft?.singleMealReadyTime ?? '12:00');
  const readyTimeMeal1 = mealsPerDay === 1 ? singleMealReadyTime : '12:00';
  const readyTimeMeal2 = '18:00';
  const [addonIds, setAddonIds] = useState(storedDraft?.addonIds ?? []);
  const [fulfillment, setFulfillment] = useState(storedDraft?.fulfillment ?? 'Self-arranged');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const totalDays = calculateDeliveryDays(startDate, endDate);
  const cateringPeriod = getCateringPeriod(totalDays);
  const selectedTier = TIER_OPTIONS.find((option) => option.tier === proteinTier) || TIER_OPTIONS[0];
  const selectedPrice = selectedTier.prices[cateringPeriod];
  const selectedAddons = addons.filter((addon) => addonIds.includes(addon.id));
  const addonsPerBox = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const pricePerBox = selectedPrice + addonsPerBox;
  const totalBoxes = totalDays * mealsPerDay;
  const totalCost = totalBoxes * pricePerBox;
  const isIndonesian = language === 'ID';
  const locale = isIndonesian ? 'id-ID' : 'en-GB';
  const centralKitchenAddress = t('footerCentralKitchen');
  const periodLabels = isIndonesian
    ? { daily: 'Harian', weekly: 'Mingguan', monthly: 'Bulanan' }
    : { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  const periodLabel = periodLabels[cateringPeriod];
  const orderCopy = isIndonesian ? {
    servingsPerDay: 'Porsi per hari',
    oneServing: '1 porsi / hari',
    twoServings: '2 porsi / hari',
    sameMenu: 'Kedua porsi menggunakan menu harian yang sama.',
    singleSchedule: 'Jadwal makan pilihan',
    dualSchedule: 'Jadwal makan siang & malam',
    singleScheduleNote: 'Pilih jadwal makan siang atau makan malam.',
    scheduleNote: 'Makan siang siap pukul 12.00 dan makan malam siap pukul 18.00.',
    lunch: 'Makan siang',
    dinner: 'Makan malam',
    ready: 'siap',
    addons: 'Kustomisasi menu',
    addonsHelp: 'Paket standar menggunakan nasi putih. Opsi Baby Potato + Jagung menggantikan nasi putih, bukan menambah karbo baru. Semua biaya dihitung per box.',
    addonTotal: 'Total kustomisasi',
    fulfillment: 'Metode pengambilan / pengiriman',
    onlineDelivery: 'Online Delivery',
    selfArranged: 'Ambil Sendiri / Atur Kurir',
    centralKitchen: 'Alamat Clean Plate Lab',
    deliveryDestination: 'Alamat tujuan',
    selfArrangedNote: 'Pesanan dapat diambil sendiri atau melalui kurir yang Anda atur dari alamat Clean Plate Lab berikut:',
    weeklyRotation: 'Paket katering',
    menuPlan: 'Menu plan',
    none: 'Tanpa add-on',
    basePrice: 'Harga dasar',
    addonsPrice: 'Add-on per box',
    courierNote: 'Biaya kurir belum termasuk dan dikonfirmasi melalui WhatsApp.',
  } : {
    servingsPerDay: 'Servings per day',
    oneServing: '1 serving / day',
    twoServings: '2 servings / day',
    sameMenu: 'Both servings use the same daily menu.',
    singleSchedule: 'Selected meal schedule',
    dualSchedule: 'Lunch & dinner schedule',
    singleScheduleNote: 'Choose a lunch or dinner schedule.',
    scheduleNote: 'Lunch is ready at 12:00 and dinner is ready at 18:00.',
    lunch: 'Lunch',
    dinner: 'Dinner',
    ready: 'ready',
    addons: 'Meal customizations',
    addonsHelp: 'The standard meal includes white rice. Baby Potato + Corn replaces the white rice—it is not an additional carb. All charges are calculated per box.',
    addonTotal: 'Total customizations',
    fulfillment: 'Pickup or delivery method',
    onlineDelivery: 'Online Delivery',
    selfArranged: 'Self-pickup / Arrange courier',
    centralKitchen: 'Clean Plate Lab address',
    deliveryDestination: 'Delivery destination',
    selfArrangedNote: 'Collect the order yourself or arrange a courier to collect it from the following Clean Plate Lab address:',
    weeklyRotation: 'Catering plan',
    menuPlan: 'Menu plan',
    none: 'No add-ons',
    basePrice: 'Base price',
    addonsPrice: 'Add-ons per box',
    courierNote: 'Courier fees are excluded and confirmed through WhatsApp.',
  };
  const fulfillmentOptions = [
    { id: 'Self-arranged', label: orderCopy.selfArranged },
    { id: 'Online-delivery', label: orderCopy.onlineDelivery },
  ];
  const requiresDeliveryAddress = fulfillment === 'Online-delivery';
  const selectedFulfillmentLabel = fulfillmentOptions.find((option) => option.id === fulfillment)?.label || fulfillment;
  const selectedAddonNames = selectedAddons.map((addon) => isIndonesian ? addon.nameID : addon.name);
  const scheduleLabel = mealsPerDay === 1 ? orderCopy.singleSchedule : orderCopy.dualSchedule;
  const dayCountLabel = isIndonesian ? `${totalDays} hari` : `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
  const boxCountLabel = isIndonesian ? `${totalBoxes} box` : `${totalBoxes} ${totalBoxes === 1 ? 'box' : 'boxes'}`;
  const planString = `${selectedTier.tier}g Protein · ${periodLabel} · ${mealsPerDay}x ${isIndonesian ? 'per hari' : 'per day'} · Rp ${selectedPrice.toLocaleString('id-ID')} / ${isIndonesian ? 'porsi' : 'serving'}`;

  useEffect(() => {
    if (isOpen && hasExplicitInitialValues && TIER_OPTIONS.some((option) => option.tier === initialProteinTier)) {
      setProteinTier(initialProteinTier);
      setMealsPerDay(initialMealsPerDay === 2 ? 2 : 1);
    }
  }, [hasExplicitInitialValues, initialMealsPerDay, initialProteinTier, isOpen]);

  useEffect(() => {
    writeStoredState('order-draft', {
      proteinTier,
      startDate,
      endDate,
      mealsPerDay,
      singleMealReadyTime,
      addonIds,
      fulfillment,
    });
  }, [addonIds, endDate, fulfillment, mealsPerDay, proteinTier, singleMealReadyTime, startDate]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const syncWitaDate = () => {
      const currentWitaDate = getDateInputValueInTimeZone();
      setToday(currentWitaDate);
      setStartDate((current) => current < currentWitaDate ? currentWitaDate : current);
      setEndDate((current) => current < currentWitaDate ? currentWitaDate : current);
    };

    syncWitaDate();
    const intervalId = window.setInterval(syncWitaDate, 30_000);

    return () => window.clearInterval(intervalId);
  }, [isOpen]);

  const handleStartDateChange = (value) => {
    const nextStartDate = value < today ? today : value;
    setStartDate(nextStartDate);
    setEndDate((current) => {
      if (!current || current < nextStartDate) return nextStartDate;
      return current;
    });
  };

  const handleEndDateChange = (value) => {
    setEndDate(value < startDate ? startDate : value);
  };

  const toggleAddon = (addonId) => {
    setAddonIds((current) => current.includes(addonId)
      ? current.filter((id) => id !== addonId)
      : [...current, addonId]);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setSubmitted(false);
      setErrors({});
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = t('orderNameReqError') || 'Nama lengkap wajib diisi';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = t('orderPhoneReqError') || 'Nomor WhatsApp wajib diisi';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = t('orderPhoneMinError') || 'Nomor WhatsApp minimal 10 digit (contoh: 081234567890)';
    }

    if (!startDate) {
      newErrors.startDate = t('orderStartDateError') || 'Tanggal mulai wajib dipilih';
    } else if (startDate < today) {
      newErrors.startDate = t('orderPastDateError') || 'Tanggal mulai tidak boleh sebelum hari ini (WITA)';
    }

    if (!endDate) {
      newErrors.endDate = t('orderEndDateError') || 'Tanggal selesai wajib dipilih';
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = t('orderDateRangeError') || 'Tanggal selesai harus sama atau setelah tanggal mulai';
    } else if (totalDays === 0) {
      newErrors.endDate = t('orderDateRangeError') || 'Tanggal selesai harus sama atau setelah tanggal mulai';
    }

    if (requiresDeliveryAddress && !address.trim()) {
      newErrors.address = t('orderAddressReqError') || 'Alamat pengiriman lengkap wajib diisi';
    }

    if (requiresDeliveryAddress && mapsUrl.trim() && !isValidGoogleMapsUrl(mapsUrl)) {
      newErrors.mapsUrl = t('orderMapsInvalidError') || 'Masukkan tautan Google Maps yang valid';
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    addOrder({
      customerName: name,
      phone,
      plan: planString,
      startDate,
      endDate,
      totalDays,
      mealsPerDay,
      totalBoxes,
      readyTimeMeal1,
      readyTimeMeal2: mealsPerDay === 2 ? readyTimeMeal2 : null,
      addonIds,
      addons: selectedAddonNames,
      fulfillment,
      address,
      mapsUrl,
      amount: totalCost,
    });

    setSubmitted(true);
    analytics.whatsappClicked({ proteinTier, cateringPeriod, totalDays, mealsPerDay, totalBoxes, totalCost });

    const message = buildWhatsAppMessage();

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8A9C7A', '#1E1E1E', '#F5F2EA'],
      });
    } catch (error) {
      console.log('Confetti trigger error', error);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  const buildWhatsAppMessage = () => {
    const whatsappPeriodLabel = { daily: 'Harian', weekly: 'Mingguan', monthly: 'Bulanan' }[cateringPeriod];
    const addonSummary = selectedAddons.length
      ? selectedAddons.map((addon) => addon.nameID).join(', ')
      : 'Tanpa add-on';
    const addonCostBreakdown = selectedAddons.length
      ? `${selectedAddons.map((addon) => `• ${addon.nameID}: *Rp ${addon.price.toLocaleString('id-ID')} × ${totalBoxes} box = Rp ${(addon.price * totalBoxes).toLocaleString('id-ID')}*`).join('\n')}
• Total add-on: *Rp ${(addonsPerBox * totalBoxes).toLocaleString('id-ID')}*`
      : '• Add-on: *Tidak ada*';
    const fulfillmentSummary = requiresDeliveryAddress
      ? 'Online Delivery'
      : 'Ambil sendiri / kurir diatur pelanggan · pengambilan di Clean Plate Lab';
    const deliveryLocationDetails = requiresDeliveryAddress
      ? `
• Alamat lengkap: *${address || '-'}*${mapsUrl.trim() ? `
• Titik Google Maps: ${mapsUrl.trim()}` : ''}`
      : '';

    return `*CLEAN PLATE LAB MAKASSAR*
_GOOD FOOD. CLEAR DATA. BETTER YOU._

Halo Tim Clean Plate Lab, saya ingin memesan meal plan dengan rincian berikut:

*PEMESAN*
• Nama: *${name}*
• WhatsApp: *${phone}*

*DETAIL MEAL PLAN*
• Target protein: *${selectedTier.tier}g per porsi*
• Periode harga: *${whatsappPeriodLabel} · Rp ${selectedPrice.toLocaleString('id-ID')}/porsi*
• Tanggal katering: *${formatOrderDate(startDate, 'id-ID')} – ${formatOrderDate(endDate, 'id-ID')}*
• Jumlah: *${mealsPerDay} porsi/hari · ${totalBoxes} box (${totalDays} hari layanan)*
• Jadwal layanan: *Senin–Sabtu, Minggu tidak dihitung*
• Jadwal makan: *${mealsPerDay === 1 ? `${singleMealReadyTime === '12:00' ? 'Makan siang' : 'Makan malam'} pukul ${formatReadyTime(readyTimeMeal1)}` : `Makan siang pukul ${formatReadyTime(readyTimeMeal1)} · Makan malam pukul ${formatReadyTime(readyTimeMeal2)}`}*
• Add-on: ${addonSummary}
• Metode pengambilan/pengiriman: ${fulfillmentSummary}${deliveryLocationDetails}

*RINCIAN BIAYA*
• Harga paket: *Rp ${selectedPrice.toLocaleString('id-ID')} × ${totalBoxes} box = Rp ${(selectedPrice * totalBoxes).toLocaleString('id-ID')}*
${addonCostBreakdown}

*TOTAL BIAYA: Rp ${totalCost.toLocaleString('id-ID')}*

Mohon konfirmasi ketersediaan, total akhir, dan petunjuk pembayaran. Terima kasih.`;
  };

  const handleReopenWhatsApp = () => {
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const datePickerOpenRef = useRef(false);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        style={{ width: 'min(calc(100vw - 1rem), 52rem)', maxWidth: 'none' }}
        onPointerDownOutside={(event) => {
          if (datePickerOpenRef.current || event.target?.closest?.('[data-cpl-datepicker]')) {
            event.preventDefault();
          }
        }}
        onFocusOutside={(event) => {
          if (datePickerOpenRef.current || event.target?.closest?.('[data-cpl-datepicker]')) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (datePickerOpenRef.current || event.target?.closest?.('[data-cpl-datepicker]')) {
            event.preventDefault();
          }
        }}
        className="max-h-[calc(100dvh-1.5rem)] overflow-x-hidden overflow-y-auto rounded-[28px] border border-black/10 bg-[#F7F5EF] p-0 text-[#1E1E1E] shadow-2xl sm:rounded-[32px] [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border-2 [&>button]:border-white/70 [&>button]:bg-white [&>button]:p-0 [&>button]:text-[#1E1E1E] [&>button]:opacity-100 [&>button]:shadow-[0_8px_24px_rgba(0,0,0,0.28)] [&>button]:transition-[transform,background-color,box-shadow] [&>button:hover]:scale-105 [&>button:hover]:bg-[#EBF0E6] [&>button:active]:scale-95 [&>button:focus-visible]:ring-2 [&>button:focus-visible]:ring-[#B8C8AA] [&>button:focus-visible]:ring-offset-2 [&>button:focus-visible]:ring-offset-[#1E1E1E] sm:[&>button]:right-4 sm:[&>button]:top-4"
      >
        {!submitted ? (
          <form noValidate onSubmit={handleSubmit} className="min-w-0">
            <DialogHeader className="relative mx-3 mt-3 overflow-hidden rounded-[22px] border-0 bg-[#1E1E1E] py-5 pl-5 pr-16 text-left shadow-[0_14px_32px_rgba(30,30,30,0.18)] sm:mx-4 sm:mt-4 sm:rounded-[26px] sm:py-6 sm:pl-7 sm:pr-20">
              <div className="absolute inset-y-0 right-0 hidden w-40 border-l border-white/10 sm:block" aria-hidden="true">
                <div className="grid h-full grid-cols-5 opacity-20">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <span key={index} className="border-b border-r border-white/30" />
                  ))}
                </div>
              </div>

              <div className="relative flex items-center gap-2.5">
                <CplLogoImage size={42} className="border-white/40 shadow-none" />
                <div className="min-w-0">
                  <p className="truncate font-display text-[10px] font-bold uppercase text-[#B8C8AA]">
                    {t('orderInquiryBadge')}
                  </p>
                  <DialogTitle className="mt-1 text-xl font-black uppercase leading-tight text-white sm:text-2xl">
                    {t('orderModalTitle')}
                  </DialogTitle>
                </div>
              </div>
              <DialogDescription className="relative mt-2 max-w-lg pl-[52px] font-sans text-xs leading-relaxed text-white/60">
                {t('orderModalSub')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid min-w-0 gap-5 p-4 sm:p-7 md:grid-cols-2 md:gap-7">
              <div className="min-w-0 space-y-5">
                <section aria-labelledby={`${fieldId}-contact-title`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">01</span>
                    <h3 id={`${fieldId}-contact-title`} className="min-w-0 font-display text-xs font-extrabold uppercase">
                      {t('orderCustomerDetails')}
                    </h3>
                    <span className="h-px flex-1 min-w-[8px] bg-[#1E1E1E]/15" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="min-w-0 space-y-1.5">
                      <label htmlFor={`${fieldId}-name`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                        {t('orderName')}
                      </label>
                      <div className="relative">
                        <User size={15} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-[#C93B2B]' : 'text-[#647554]'}`} />
                        <Input
                          id={`${fieldId}-name`}
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(event) => {
                            const val = event.target.value;
                            setName(val);
                            if (errors.name && val.trim()) {
                              setErrors((prev) => ({ ...prev, name: undefined }));
                            }
                          }}
                          placeholder="Alex Pratama"
                          className={`h-11 w-full max-w-full min-w-0 rounded-lg pl-9 pr-3 font-sans text-xs font-semibold transition-all duration-200 ${
                            errors.name
                              ? 'border-2 border-[#C93B2B] bg-[#FDF5F5] text-[#1E1E1E] focus-visible:ring-2 focus-visible:ring-[#C93B2B]/20'
                              : 'border-[#1E1E1E]/25 bg-white'
                          }`}
                        />
                        {errors.name && (
                          <div
                            role="alert"
                            className="absolute left-0 top-full z-20 mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg border border-[#F4C4BF] bg-[#FFF5F4] px-3 py-1.5 font-sans text-[11px] font-bold text-[#8A1F17] shadow-[0_4px_16px_rgba(201,59,43,0.18)] animate-in fade-in slide-in-from-top-1"
                          >
                            <AlertCircle size={13} className="shrink-0 text-[#C93B2B]" />
                            <span className="leading-tight">{errors.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <label htmlFor={`${fieldId}-phone`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                        {t('orderPhone')}
                      </label>
                      <div className="relative">
                        <Phone size={15} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-[#C93B2B]' : 'text-[#647554]'}`} />
                        <Input
                          id={`${fieldId}-phone`}
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(event) => {
                            const val = event.target.value;
                            setPhone(val);
                            if (errors.phone && val.replace(/\D/g, '').length >= 10) {
                              setErrors((prev) => ({ ...prev, phone: undefined }));
                            }
                          }}
                          placeholder={t('orderPhonePlaceholder') || '0812 3456 7890'}
                          className={`h-11 w-full max-w-full min-w-0 rounded-lg pl-9 pr-3 font-sans text-xs font-semibold transition-all duration-200 ${
                            errors.phone
                              ? 'border-2 border-[#C93B2B] bg-[#FDF5F5] text-[#1E1E1E] focus-visible:ring-2 focus-visible:ring-[#C93B2B]/20'
                              : 'border-[#1E1E1E]/25 bg-white'
                          }`}
                        />
                        {errors.phone && (
                          <div
                            role="alert"
                            className="absolute left-0 top-full z-20 mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg border border-[#F4C4BF] bg-[#FFF5F4] px-3 py-1.5 font-sans text-[11px] font-bold text-[#8A1F17] shadow-[0_4px_16px_rgba(201,59,43,0.18)] animate-in fade-in slide-in-from-top-1"
                          >
                            <AlertCircle size={13} className="shrink-0 text-[#C93B2B]" />
                            <span className="leading-tight">{errors.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section aria-labelledby={`${fieldId}-protein-title`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">02</span>
                    <h3 id={`${fieldId}-protein-title`} className="min-w-0 font-display text-xs font-extrabold uppercase">
                      {t('orderProteinTier')}
                    </h3>
                    <span className="h-px flex-1 min-w-[8px] bg-[#1E1E1E]/15" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label={t('orderProteinTier')}>
                    {TIER_OPTIONS.map((option) => {
                      const isSelected = proteinTier === option.tier;

                      return (
                        <button
                          key={option.tier}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => {
                            setProteinTier(option.tier);
                            analytics.proteinTierSelected(option.tier);
                          }}
                          className={`min-h-24 min-w-0 rounded-lg border-2 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] ${
                            isSelected
                              ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                              : 'border-[#1E1E1E]/15 bg-white text-[#1E1E1E] hover:border-[#8A9C7A]'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-1">
                            <strong className="font-display text-xl font-black leading-none">{option.tier}g</strong>
                            {isSelected ? (
                              <span className="flex items-center gap-0.5 rounded-full bg-[#B8C8AA] px-1.5 py-0.5 font-display text-[7px] font-extrabold uppercase text-[#1E1E1E]">
                                <Check size={9} strokeWidth={3} />
                                {isIndonesian ? 'Dipilih' : 'Selected'}
                              </span>
                            ) : null}
                          </span>
                          <span className={`mt-2 block font-mono text-[10px] font-bold ${isSelected ? 'text-[#B8C8AA]' : 'text-[#647554]'}`}>
                            Rp {option.prices[cateringPeriod].toLocaleString('id-ID')}
                          </span>
                          <span className={`mt-1 block text-[8px] font-bold uppercase tracking-wide ${isSelected ? 'text-white/55' : 'text-black/40'}`}>{periodLabel}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 grid grid-cols-3 border border-[#1E1E1E]/20 bg-white text-center font-mono text-[9px] font-bold uppercase">
                    <div className={`p-2 ${cateringPeriod === 'daily' ? 'bg-[#1E1E1E] text-white' : ''}`}>{periodLabels.daily}<span className="mt-0.5 block font-sans text-[8px] font-normal normal-case opacity-65">1–5 {isIndonesian ? 'hari' : 'days'}</span></div>
                    <div className={`border-x border-[#1E1E1E]/20 p-2 ${cateringPeriod === 'weekly' ? 'bg-[#1E1E1E] text-white' : ''}`}>{periodLabels.weekly}<span className="mt-0.5 block font-sans text-[8px] font-normal normal-case opacity-65">6–23 {isIndonesian ? 'hari' : 'days'}</span></div>
                    <div className={`p-2 ${cateringPeriod === 'monthly' ? 'bg-[#1E1E1E] text-white' : ''}`}>{periodLabels.monthly}<span className="mt-0.5 block font-sans text-[8px] font-normal normal-case opacity-65">24+ {isIndonesian ? 'hari' : 'days'}</span></div>
                  </div>

                  <div className="mt-3 flex min-w-0 items-start gap-3 rounded-lg border border-[#8A9C7A]/50 bg-[#E7EEE1] p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#647554] text-white">
                      <Truck size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[11px] font-extrabold uppercase text-[#33402B]">
                        {mealsPerDay} {isIndonesian ? `box segar setiap hari` : `fresh ${mealsPerDay === 1 ? 'box' : 'boxes'} every day`}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-[#526049]">
                        {mealsPerDay === 2 ? orderCopy.sameMenu : t('orderDeliveryDetail')}
                      </p>
                    </div>
                    <div className="hidden shrink-0 flex-col gap-1 font-mono text-[8px] font-bold uppercase text-[#647554] sm:flex">
                      <span className="inline-flex items-center gap-1"><Clock3 size={10} /> {mealsPerDay}x / day</span>
                      <span className="inline-flex items-center gap-1"><UtensilsCrossed size={10} /> {mealsPerDay} {mealsPerDay === 1 ? 'box' : 'boxes'} / day</span>
                    </div>
                  </div>
                </section>

                <section aria-labelledby={`${fieldId}-addons-title`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">03</span>
                    <h3 id={`${fieldId}-addons-title`} className="min-w-0 font-display text-xs font-extrabold uppercase">{orderCopy.addons}</h3>
                    <span className="h-px min-w-[8px] flex-1 bg-[#1E1E1E]/15" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {addons.map((addon) => {
                      const selected = addonIds.includes(addon.id);
                      return (
                        <button key={addon.id} type="button" aria-pressed={selected} onClick={() => toggleAddon(addon.id)} className={`flex min-h-16 items-center justify-between gap-3 rounded-lg border-2 p-3 text-left transition-colors ${selected ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white' : 'border-[#1E1E1E]/15 bg-white hover:border-[#8A9C7A]'}`}>
                          <span className="min-w-0"><strong className="block font-display text-[10px] font-extrabold uppercase leading-tight">{isIndonesian ? addon.nameID : addon.name}</strong><span className={`mt-1 block font-mono text-[9px] font-bold ${selected ? 'text-[#B8C8AA]' : 'text-[#647554]'}`}>+ Rp {addon.price.toLocaleString('id-ID')} / box</span></span>
                          {selected ? <Check size={16} className="shrink-0 text-[#B8C8AA]" /> : null}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[9px] leading-4 text-[#647554]">{orderCopy.addonsHelp}</p>
                </section>
              </div>

              <section aria-labelledby={`${fieldId}-delivery-title`} className="min-w-0">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">04</span>
                  <h3 id={`${fieldId}-delivery-title`} className="min-w-0 font-display text-xs font-extrabold uppercase">
                    {t('orderDeliverySchedule')}
                  </h3>
                  <span className="h-px flex-1 min-w-[8px] bg-[#1E1E1E]/15" />
                </div>

                <div className="min-w-0">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    today={today}
                    onStartDateChange={(value) => {
                      handleStartDateChange(value);
                      if (errors.startDate || errors.endDate) {
                        setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
                      }
                    }}
                    onEndDateChange={(value) => {
                      handleEndDateChange(value);
                      if (errors.endDate) {
                        setErrors((prev) => ({ ...prev, endDate: undefined }));
                      }
                    }}
                    onOpenChange={(isOpen) => {
                      datePickerOpenRef.current = isOpen;
                    }}
                    isIndonesian={isIndonesian}
                    hasError={!!(errors.startDate || errors.endDate)}
                    errorMsg={errors.startDate || errors.endDate}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">05</span>
                    <p className="font-display text-[10px] font-extrabold uppercase">{orderCopy.servingsPerDay}</p>
                    <span className="h-px min-w-[8px] flex-1 bg-[#1E1E1E]/15" />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label={orderCopy.servingsPerDay}>
                    <button type="button" role="radio" aria-checked={mealsPerDay === 1} onClick={() => setMealsPerDay(1)} className={`min-h-11 rounded-lg border-2 px-3 font-display text-[10px] font-extrabold uppercase ${mealsPerDay === 1 ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white' : 'border-[#1E1E1E]/20 bg-white'}`}>{orderCopy.oneServing}</button>
                    <button type="button" role="radio" aria-checked={mealsPerDay === 2} onClick={() => setMealsPerDay(2)} className={`min-h-11 rounded-lg border-2 px-3 font-display text-[10px] font-extrabold uppercase ${mealsPerDay === 2 ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white' : 'border-[#1E1E1E]/20 bg-white'}`}>{orderCopy.twoServings}</button>
                  </div>
                  {mealsPerDay === 2 ? <p className="mt-2 rounded-lg border border-[#8A9C7A]/40 bg-[#E7EEE1] px-3 py-2 text-[10px] font-semibold leading-4 text-[#526049]">{orderCopy.sameMenu}</p> : null}
                </div>

                <div className="mt-4 rounded-lg border border-[#1E1E1E]/20 bg-white p-3">
                  <p className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase text-[#4D4D4D]"><Clock3 size={13} className="text-[#647554]" />{scheduleLabel}</p>
                  {mealsPerDay === 1 ? (
                    <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label={orderCopy.singleScheduleNote}>
                      {[
                        { time: '12:00', label: orderCopy.lunch },
                        { time: '18:00', label: orderCopy.dinner },
                      ].map(({ time, label }) => {
                        const isSelected = singleMealReadyTime === time;

                        return (
                          <button
                            key={time}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setSingleMealReadyTime(time)}
                            className={`flex min-h-11 items-center justify-between rounded-lg border-2 px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] ${isSelected ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white' : 'border-[#1E1E1E]/15 bg-[var(--cpl-cream)] text-[#1E1E1E]'}`}
                          >
                            <span className={`font-display text-[9px] font-bold uppercase ${isSelected ? 'text-[#B8C8AA]' : 'text-[#647554]'}`}>{label}</span>
                            <strong className="font-mono text-xs">{time.replace(':', '.')}</strong>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between rounded-md bg-[var(--cpl-cream)] px-3 py-2"><span className="font-display text-[9px] font-bold uppercase text-[#647554]">{orderCopy.lunch}</span><strong className="font-mono text-xs">12.00</strong></div>
                      <div className="flex items-center justify-between rounded-md bg-[var(--cpl-cream)] px-3 py-2"><span className="font-display text-[9px] font-bold uppercase text-[#647554]">{orderCopy.dinner}</span><strong className="font-mono text-xs">18.00</strong></div>
                    </div>
                  )}
                  <p className="mt-2 text-[9px] leading-4 text-[#647554]">{mealsPerDay === 1 ? orderCopy.singleScheduleNote : orderCopy.scheduleNote}</p>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">06</span>
                    <p className="font-display text-[10px] font-extrabold uppercase">{orderCopy.fulfillment}</p>
                    <span className="h-px min-w-[8px] flex-1 bg-[#1E1E1E]/15" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {fulfillmentOptions.map((option) => <button key={option.id} type="button" aria-pressed={fulfillment === option.id} onClick={() => { setFulfillment(option.id); setErrors((current) => ({ ...current, address: undefined, mapsUrl: undefined })); }} className={`min-h-11 rounded-lg border-2 px-2 font-display text-[9px] font-extrabold uppercase leading-tight ${fulfillment === option.id ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white' : 'border-[#1E1E1E]/20 bg-white'}`}>{option.label}</button>)}
                  </div>
                </div>

                {requiresDeliveryAddress ? <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor={`${fieldId}-address`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderAddress')}
                    </label>
                    <div className="relative">
                      <MapPin size={15} className={`pointer-events-none absolute left-3 top-3 transition-colors ${errors.address ? 'text-[#C93B2B]' : 'text-[#647554]'}`} />
                      <textarea
                        id={`${fieldId}-address`}
                        rows={2}
                        autoComplete="street-address"
                        value={address}
                        onChange={(event) => {
                          const val = event.target.value;
                          setAddress(val);
                          if (errors.address && val.trim()) {
                            setErrors((prev) => ({ ...prev, address: undefined }));
                          }
                        }}
                        placeholder={t('orderAddressPlaceholder')}
                        className={`block h-20 w-full resize-none rounded-lg py-3 pl-9 pr-3 font-sans text-xs font-semibold outline-none transition-all duration-200 placeholder:font-normal placeholder:text-gray-400 ${
                          errors.address
                            ? 'border-2 border-[#C93B2B] bg-[#FDF5F5] text-[#1E1E1E] focus:ring-2 focus:ring-[#C93B2B]/20'
                            : 'border border-[#1E1E1E]/25 bg-white text-[#1E1E1E] focus:ring-2 focus:ring-[#8A9C7A]'
                        }`}
                      />
                      {errors.address && (
                        <div
                          role="alert"
                          className="absolute left-0 top-full z-20 mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg border border-[#F4C4BF] bg-[#FFF5F4] px-3 py-1.5 font-sans text-[11px] font-bold text-[#8A1F17] shadow-[0_4px_16px_rgba(201,59,43,0.18)] animate-in fade-in slide-in-from-top-1"
                        >
                          <AlertCircle size={13} className="shrink-0 text-[#C93B2B]" />
                          <span className="leading-tight">{errors.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor={`${fieldId}-maps-url`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderMapsLink')}
                    </label>
                    <div className="relative">
                      <Link2 size={15} className="pointer-events-none absolute left-3 top-3 text-[#647554]" />
                      <Input
                        id={`${fieldId}-maps-url`}
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        value={mapsUrl}
                        aria-invalid={Boolean(errors.mapsUrl)}
                        aria-describedby={`${fieldId}-maps-help`}
                        onChange={(event) => {
                          const value = event.target.value;
                          setMapsUrl(value);
                          if (errors.mapsUrl && (!value.trim() || isValidGoogleMapsUrl(value))) {
                            setErrors((current) => ({ ...current, mapsUrl: undefined }));
                          }
                        }}
                        placeholder={t('orderMapsPlaceholder')}
                        className={`rounded-lg bg-white pl-9 font-sans font-semibold normal-case ${errors.mapsUrl ? 'border-2 border-[#C93B2B] focus-visible:ring-[#C93B2B]/20' : 'border-[#1E1E1E]/25'}`}
                      />
                    </div>
                    {errors.mapsUrl ? (
                      <p id={`${fieldId}-maps-help`} role="alert" className="flex items-center gap-1.5 text-[10px] font-bold leading-4 text-[#8A1F17]"><AlertCircle size={12} className="shrink-0 text-[#C93B2B]" />{errors.mapsUrl}</p>
                    ) : (
                      <p id={`${fieldId}-maps-help`} className="text-[9px] leading-4 text-[#647554]">{t('orderMapsHelp')}</p>
                    )}
                  </div>
                </div> : <div className="mt-3 rounded-lg border border-[#8A9C7A]/40 bg-[#E7EEE1] px-3 py-2 text-[9px] font-semibold leading-4 text-[#526049]">
                  <p>{orderCopy.selfArrangedNote}</p>
                  <p className="mt-1.5 flex items-start gap-1.5 font-bold text-[#33402B]"><MapPin size={12} className="mt-0.5 shrink-0" /><span>{centralKitchenAddress}</span></p>
                </div>}

                <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#8A9C7A] bg-[#E7EEE1]" aria-live="polite">
                  <div className="flex items-center gap-3 border-b border-[#8A9C7A]/35 px-3.5 py-3 sm:px-4">
                    <p className="flex min-w-0 items-center gap-2 font-display text-[10px] font-extrabold uppercase text-[#33402B]">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1E1E1E] font-mono text-[9px] text-white">07</span>
                      <PackageCheck size={15} className="shrink-0" />
                      <span>{t('orderSummary')}</span>
                    </p>
                  </div>

                  <div className="space-y-2.5 p-3 sm:p-3.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-[#8A9C7A]/25 bg-white p-3">
                        <p className="font-display text-[8px] font-bold uppercase tracking-wide text-[#647554]">{orderCopy.weeklyRotation}</p>
                        <p className="mt-1 font-display text-xs font-black leading-tight text-[#1E1E1E] sm:text-sm">{selectedTier.tier}g Protein · {periodLabel}</p>
                        <p className="mt-0.5 text-[9px] leading-4 text-[#647554]">{dayCountLabel} · {boxCountLabel}</p>
                        <p className="mt-1 text-[9px] font-semibold leading-4 text-[#33402B]">{formatOrderDate(startDate, locale)} – {formatOrderDate(endDate, locale)}</p>
                      </div>
                      <div className="rounded-xl border border-[#8A9C7A]/25 bg-white p-3">
                        <p className="font-display text-[8px] font-bold uppercase tracking-wide text-[#647554]">{orderCopy.servingsPerDay}</p>
                        <p className="mt-1 font-display text-sm font-black text-[#1E1E1E]">{mealsPerDay}x / {isIndonesian ? 'hari' : 'day'}</p>
                        <p className="mt-0.5 text-[9px] leading-4 text-[#647554]">{t('orderSundayExcluded')}</p>
                      </div>
                    </div>

                    <div className="divide-y divide-[#1E1E1E]/10 rounded-xl border border-[#8A9C7A]/25 bg-white px-3">
                      <div className="flex items-start gap-2.5 py-2.5">
                        <Truck size={14} className="mt-0.5 shrink-0 text-[#647554]" />
                        <div className="min-w-0">
                          <p className="font-display text-[8px] font-bold uppercase tracking-wide text-[#647554]">{orderCopy.fulfillment}</p>
                          <p className="mt-0.5 text-[10px] font-bold text-[#1E1E1E]">{selectedFulfillmentLabel}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 py-2.5">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#647554]" />
                        <div className="min-w-0">
                          <p className="font-display text-[8px] font-bold uppercase tracking-wide text-[#647554]">{requiresDeliveryAddress ? orderCopy.deliveryDestination : orderCopy.centralKitchen}</p>
                          <p className="mt-0.5 break-words text-[9px] leading-4 text-[#1E1E1E]">{requiresDeliveryAddress ? (address || '-') : centralKitchenAddress}</p>
                          {requiresDeliveryAddress && mapsUrl.trim() ? <p className="mt-1 flex min-w-0 items-start gap-1 text-[9px] text-[#647554]"><Link2 size={10} className="mt-0.5 shrink-0" /><span className="break-all">{mapsUrl.trim()}</span></p> : null}
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 py-2.5">
                        <Clock3 size={14} className="mt-0.5 shrink-0 text-[#647554]" />
                        <div className="min-w-0">
                          <p className="font-display text-[8px] font-bold uppercase tracking-wide text-[#647554]">{scheduleLabel}</p>
                          <p className="mt-0.5 text-[9px] font-semibold leading-4 text-[#1E1E1E]">{mealsPerDay === 1 ? `${singleMealReadyTime === '12:00' ? orderCopy.lunch : orderCopy.dinner} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal1)}` : `${orderCopy.lunch} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal1)} · ${orderCopy.dinner} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal2)}`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#8A9C7A]/25 bg-white font-mono text-[9px]">
                      <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                        <span className="text-[#647554]">{orderCopy.basePrice}<br /><span>Rp {selectedPrice.toLocaleString('id-ID')} × {totalBoxes} box</span></span>
                        <strong className="whitespace-nowrap text-[#33402B]">Rp {(selectedPrice * totalBoxes).toLocaleString('id-ID')}</strong>
                      </div>
                      <div className="border-t border-[#1E1E1E]/10 px-3 py-2.5">
                        <p className="font-sans text-[8px] font-bold uppercase tracking-wide text-[#647554]">{orderCopy.addons}</p>
                        {selectedAddons.length ? selectedAddons.map((addon) => (
                          <div key={addon.id} className="mt-1.5 flex items-start justify-between gap-3">
                            <span>{isIndonesian ? addon.nameID : addon.name}<br /><span className="text-[#647554]">Rp {addon.price.toLocaleString('id-ID')} / box × {totalBoxes}</span></span>
                            <strong className="whitespace-nowrap text-[#33402B]">Rp {(addon.price * totalBoxes).toLocaleString('id-ID')}</strong>
                          </div>
                        )) : <p className="mt-1 font-sans text-[10px] font-semibold text-[#1E1E1E]">{orderCopy.none}</p>}
                        {selectedAddons.length ? <div className="mt-2 flex justify-between gap-3 border-t border-[#1E1E1E]/10 pt-2 font-bold text-[#33402B]"><span>{orderCopy.addonTotal}</span><span className="whitespace-nowrap">Rp {(addonsPerBox * totalBoxes).toLocaleString('id-ID')}</span></div> : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#1E1E1E] px-3.5 py-3 text-white">
                      <p className="font-display text-[9px] font-bold uppercase tracking-wide text-white/65">{t('orderEstimatedTotal')}</p>
                      <p className="whitespace-nowrap font-display text-xl font-black">Rp {totalCost.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center text-[9px] leading-4 text-[#647554]">{orderCopy.courierNote}</p>

                <Button
                  type="submit"
                  variant="dark"
                  disabled={totalDays === 0}
                  className="mt-4 h-auto min-h-12 w-full min-w-0 whitespace-normal rounded-lg bg-[#1E1E1E] px-4 py-3 text-center text-xs leading-tight text-white hover:bg-[#647554]"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 font-mono text-[9px] font-bold text-white">08</span>
                  <span className="min-w-0 break-words">{t('orderSubmit')}</span>
                  <ArrowRight size={17} className="hidden min-[430px]:block" />
                </Button>

                <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-[9px] leading-tight text-[#526049]">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span>{t('orderGuaranteeNote')}</span>
                </div>
              </section>
            </div>
          </form>
        ) : (
          <div className="min-w-0 bg-[#F7F5EF] p-5 text-[#1E1E1E] sm:p-8">
            <div className="relative mx-auto max-w-xl text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8A9C7A]/40 bg-[#E7EEE1] text-[#647554] shadow-md animate-in zoom-in-50 duration-300 sm:h-20 sm:w-20">
                <CheckCircle size={38} strokeWidth={2.5} className="text-[#647554] sm:size-11" />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E1E1E] text-[#B8C8AA] shadow-sm">
                  <MessageCircle size={13} />
                </span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#647554] animate-pulse" />
                <p className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#647554]">
                  {t('orderSuccessBadge')}
                </p>
              </div>

              <h3 className="mt-1 font-display text-xl font-black uppercase tracking-tight text-[#1E1E1E] sm:text-2xl">
                {t('orderSuccessMsg')}
              </h3>

              <p className="mx-auto mt-2 max-w-md font-sans text-xs leading-relaxed text-[#526049]">
                {t('orderSuccessDetail').replace('{name}', name).replace('{plan}', planString)}
              </p>

              <div className="mt-5 rounded-2xl border border-[#8A9C7A]/40 bg-[#E7EEE1] p-4 text-left shadow-xs sm:p-5">
                <div className="border-b border-[#8A9C7A]/25 pb-3">
                  <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#33402B]">
                    {t('orderTicketTitle')}
                  </span>
                </div>

                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{t('orderName')}</p>
                    <p className="mt-0.5 font-sans text-xs font-bold text-[#1E1E1E]">{name}</p>
                  </div>

                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{t('orderPhone')}</p>
                    <p className="mt-0.5 font-sans text-xs font-bold text-[#1E1E1E]">{phone}</p>
                  </div>

                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{t('orderDeliveryPeriodLabel')}</p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-[#33402B]">
                      {formatOrderDate(startDate, locale)} – {formatOrderDate(endDate, locale)}
                    </p>
                  </div>

                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{orderCopy.weeklyRotation}</p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-[#1E1E1E]">{selectedTier.tier}g Protein · {periodLabel}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{t('orderSummary')}</p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-[#1E1E1E]">
                      {dayCountLabel} · {mealsPerDay}x/{isIndonesian ? 'hari' : 'day'} · {boxCountLabel}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{scheduleLabel}</p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-[#1E1E1E]">{mealsPerDay === 1 ? `${singleMealReadyTime === '12:00' ? orderCopy.lunch : orderCopy.dinner} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal1)}` : `${orderCopy.lunch} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal1)} · ${orderCopy.dinner} ${orderCopy.ready} ${formatReadyTime(readyTimeMeal2)} · ${orderCopy.sameMenu}`}</p>
                  </div>
                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{orderCopy.addons}</p>
                    <p className="mt-0.5 text-[10px] font-bold text-[#1E1E1E]">{selectedAddonNames.length ? selectedAddonNames.join(', ') : orderCopy.none}</p>
                  </div>
                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{orderCopy.fulfillment}</p>
                    <p className="mt-0.5 text-[10px] font-bold text-[#1E1E1E]">{selectedFulfillmentLabel}</p>
                  </div>
                  {requiresDeliveryAddress ? (
                    <div className="sm:col-span-2">
                      <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{orderCopy.deliveryDestination}</p>
                      <p className="mt-0.5 text-[10px] font-bold leading-4 text-[#1E1E1E]">{address}</p>
                      {mapsUrl.trim() ? <a href={mapsUrl.trim()} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-start gap-1 break-all text-[9px] font-semibold text-[#526049] underline underline-offset-2"><Link2 size={10} className="mt-0.5 shrink-0" />{mapsUrl.trim()}</a> : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#1E1E1E]/15 bg-white px-4 py-3 shadow-xs">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-[#526049]">{t('orderEstimatedTotal')}</span>
                  <span className="font-display text-xl font-black text-[#1E1E1E] sm:text-2xl">Rp {totalCost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  variant="dark"
                  onClick={handleReopenWhatsApp}
                  className="h-11 w-full rounded-xl bg-[#1E1E1E] px-6 text-xs font-bold text-white shadow-md transition-all hover:bg-[#647554] sm:w-auto"
                >
                  <MessageCircle size={17} />
                  <span>{t('orderOpenWaCta')}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-11 w-full rounded-xl border-[#1E1E1E]/25 bg-white px-6 text-xs font-bold text-[#1E1E1E] hover:bg-[#E7EEE1] sm:w-auto"
                >
                  {t('orderBackBtn')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
