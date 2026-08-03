import React, { useId, useState } from 'react';
import confetti from 'canvas-confetti';
import { useCpl } from '../hooks/useCpl';
import { CplLogoImage } from './CplLogo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle,
  Clock3,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
  User,
  UtensilsCrossed,
} from 'lucide-react';

const TIER_OPTIONS = [
  { tier: 25, price: 25000 },
  { tier: 60, price: 40000 },
  { tier: 80, price: 50000 },
  { tier: 100, price: 60000 },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toDateInputValue(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];
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

function formatOrderDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  }).format(new Date(`${value}T00:00:00+08:00`));
}

export function OrderModal({ isOpen, onClose }) {
  const { addOrder, t } = useCpl();
  const fieldId = useId();
  const today = toDateInputValue(new Date());

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [proteinTier, setProteinTier] = useState(60);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(toDateInputValue(new Date(Date.now() + 4 * DAY_IN_MS)));
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedTier = TIER_OPTIONS.find((option) => option.tier === proteinTier) || TIER_OPTIONS[0];
  const planString = `${selectedTier.tier}g Protein Plan - Rp ${selectedTier.price.toLocaleString('id-ID')} / porsi`;
  const totalDays = calculateDeliveryDays(startDate, endDate);
  const totalCost = totalDays * selectedTier.price;

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (endDate < value) setEndDate(value);
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
    }

    if (!endDate) {
      newErrors.endDate = t('orderEndDateError') || 'Tanggal selesai wajib dipilih';
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = t('orderDateRangeError') || 'Tanggal selesai harus sama atau setelah tanggal mulai';
    } else if (totalDays === 0) {
      newErrors.endDate = t('orderDateRangeError') || 'Tanggal selesai harus sama atau setelah tanggal mulai';
    }

    if (!address.trim()) {
      newErrors.address = t('orderAddressReqError') || 'Alamat pengiriman lengkap wajib diisi';
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
      address,
      amount: totalCost,
    });

    setSubmitted(true);

    const message = `*CLEAN PLATE LAB MAKASSAR*
_GOOD FOOD. CLEAR DATA. BETTER YOU._
----------------------------------

Halo Tim Clean Plate Lab,
Saya ingin mengajukan pemesanan meal plan dengan rincian berikut:

*DATA PEMESAN*
• Nama: *${name}*
• Nomor WhatsApp: *${phone}*

*PILIHAN MEAL PLAN*
• Target protein: *${selectedTier.tier}g per porsi*
• Harga per porsi: *Rp ${selectedTier.price.toLocaleString('id-ID')}*
• Periode pengiriman: *${formatOrderDate(startDate)} - ${formatOrderDate(endDate)}*
• Total pesanan: *${totalDays} box (${totalDays} ${t('orderDaysUnit')})*
• Hari layanan: *Senin-Sabtu (Minggu tidak dihitung)*

*RINGKASAN BIAYA*
• Estimasi total: *Rp ${totalCost.toLocaleString('id-ID')}*

*ALAMAT PENGIRIMAN*
${address}

----------------------------------
Mohon konfirmasi ketersediaan jadwal, total akhir, dan petunjuk pembayaran. Terima kasih.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=628996727181&text=${encodeURIComponent(message)}`;
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
    return `*CLEAN PLATE LAB MAKASSAR*
_GOOD FOOD. CLEAR DATA. BETTER YOU._
----------------------------------

Halo Tim Clean Plate Lab,
Saya ingin mengajukan pemesanan meal plan dengan rincian berikut:

*DATA PEMESAN*
• Nama: *${name}*
• Nomor WhatsApp: *${phone}*

*PILIHAN MEAL PLAN*
• Target protein: *${selectedTier.tier}g per porsi*
• Harga per porsi: *Rp ${selectedTier.price.toLocaleString('id-ID')}*
• Periode pengiriman: *${formatOrderDate(startDate)} - ${formatOrderDate(endDate)}*
• Total pesanan: *${totalDays} box (${totalDays} ${t('orderDaysUnit')})*
• Hari layanan: *Senin-Sabtu (Minggu tidak dihitung)*

*RINGKASAN BIAYA*
• Estimasi total: *Rp ${totalCost.toLocaleString('id-ID')}*

*ALAMAT PENGIRIMAN*
${address}

----------------------------------
Mohon konfirmasi ketersediaan jadwal, total akhir, dan petunjuk pembayaran. Terima kasih.`;
  };

  const handleReopenWhatsApp = () => {
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=628996727181&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        style={{ width: 'min(calc(100vw - 1rem), 52rem)', maxWidth: 'none' }}
        className="max-h-[calc(100dvh-1.5rem)] overflow-x-hidden overflow-y-auto rounded-[28px] border border-black/10 bg-[#F7F5EF] p-0 text-[#1E1E1E] shadow-2xl sm:rounded-[32px] [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border-2 [&>button]:border-white/70 [&>button]:bg-white [&>button]:p-0 [&>button]:text-[#1E1E1E] [&>button]:opacity-100 [&>button]:shadow-[0_8px_24px_rgba(0,0,0,0.28)] [&>button]:transition-[transform,background-color,box-shadow] [&>button:hover]:scale-105 [&>button:hover]:bg-[#EBF0E6] [&>button:active]:scale-95 [&>button:focus-visible]:ring-2 [&>button:focus-visible]:ring-[#B8C8AA] [&>button:focus-visible]:ring-offset-2 [&>button:focus-visible]:ring-offset-[#1E1E1E] sm:[&>button]:right-4 sm:[&>button]:top-4"
      >
        {!submitted ? (
          <form noValidate onSubmit={handleSubmit} className="min-w-0">
            <DialogHeader className="relative overflow-hidden border-0 bg-[#1E1E1E] py-5 pl-5 pr-16 text-left sm:py-6 sm:pl-7 sm:pr-20">
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

                  <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label={t('orderProteinTier')}>
                    {TIER_OPTIONS.map((option) => {
                      const isSelected = proteinTier === option.tier;

                      return (
                        <button
                          key={option.tier}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setProteinTier(option.tier)}
                          className={`min-h-20 min-w-0 rounded-lg border-2 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] ${
                            isSelected
                              ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                              : 'border-[#1E1E1E]/15 bg-white text-[#1E1E1E] hover:border-[#8A9C7A]'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-1">
                            <strong className="font-display text-xl font-black leading-none">{option.tier}g</strong>
                            {isSelected && <Check size={14} className="text-[#B8C8AA]" strokeWidth={3} />}
                          </span>
                          <span className={`mt-2 block font-mono text-[10px] font-bold ${isSelected ? 'text-[#B8C8AA]' : 'text-[#647554]'}`}>
                            Rp {option.price.toLocaleString('id-ID')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex min-w-0 items-start gap-3 rounded-lg border border-[#8A9C7A]/50 bg-[#E7EEE1] p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#647554] text-white">
                      <Truck size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[11px] font-extrabold uppercase text-[#33402B]">
                        {t('orderDeliveryHighlight')}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-[#526049]">
                        {t('orderDeliveryDetail')}
                      </p>
                    </div>
                    <div className="hidden shrink-0 flex-col gap-1 font-mono text-[8px] font-bold uppercase text-[#647554] sm:flex">
                      <span className="inline-flex items-center gap-1"><Clock3 size={10} /> 1x / day</span>
                      <span className="inline-flex items-center gap-1"><UtensilsCrossed size={10} /> 1 box / day</span>
                    </div>
                  </div>
                </section>
              </div>

              <section aria-labelledby={`${fieldId}-delivery-title`} className="min-w-0">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">03</span>
                  <h3 id={`${fieldId}-delivery-title`} className="min-w-0 font-display text-xs font-extrabold uppercase">
                    {t('orderDeliverySchedule')}
                  </h3>
                  <span className="h-px flex-1 min-w-[8px] bg-[#1E1E1E]/15" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <label htmlFor={`${fieldId}-start`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderStartDate')}
                    </label>
                    <div className="relative w-full min-w-0">
                      <Input
                        id={`${fieldId}-start`}
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(event) => {
                          handleStartDateChange(event.target.value);
                          if (errors.startDate || errors.endDate) {
                            setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
                          }
                        }}
                        className={`h-11 w-full max-w-full min-w-0 rounded-lg px-3 font-sans text-xs font-semibold text-[#1E1E1E] transition-all duration-200 ${
                          errors.startDate
                            ? 'border-2 border-[#C93B2B] bg-[#FDF5F5] focus-visible:ring-2 focus-visible:ring-[#C93B2B]/20'
                            : 'border-[#1E1E1E]/25 bg-white'
                        }`}
                      />
                      {errors.startDate && (
                        <div
                          role="alert"
                          className="absolute left-0 top-full z-20 mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg border border-[#F4C4BF] bg-[#FFF5F4] px-3 py-1.5 font-sans text-[11px] font-bold text-[#8A1F17] shadow-[0_4px_16px_rgba(201,59,43,0.18)] animate-in fade-in slide-in-from-top-1"
                        >
                          <AlertCircle size={13} className="shrink-0 text-[#C93B2B]" />
                          <span className="leading-tight">{errors.startDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label htmlFor={`${fieldId}-end`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderEndDate')}
                    </label>
                    <div className="relative w-full min-w-0">
                      <Input
                        id={`${fieldId}-end`}
                        type="date"
                        value={endDate}
                        min={startDate || today}
                        onChange={(event) => {
                          setEndDate(event.target.value);
                          if (errors.endDate) {
                            setErrors((prev) => ({ ...prev, endDate: undefined }));
                          }
                        }}
                        className={`h-11 w-full max-w-full min-w-0 rounded-lg px-3 font-sans text-xs font-semibold text-[#1E1E1E] transition-all duration-200 ${
                          errors.endDate
                            ? 'border-2 border-[#C93B2B] bg-[#FDF5F5] focus-visible:ring-2 focus-visible:ring-[#C93B2B]/20'
                            : 'border-[#1E1E1E]/25 bg-white'
                        }`}
                      />
                      {errors.endDate && (
                        <div
                          role="alert"
                          className="absolute left-0 top-full z-20 mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg border border-[#F4C4BF] bg-[#FFF5F4] px-3 py-1.5 font-sans text-[11px] font-bold text-[#8A1F17] shadow-[0_4px_16px_rgba(201,59,43,0.18)] animate-in fade-in slide-in-from-top-1"
                        >
                          <AlertCircle size={13} className="shrink-0 text-[#C93B2B]" />
                          <span className="leading-tight">{errors.endDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
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

                <div className="mt-4 grid grid-cols-1 min-[360px]:grid-cols-[1fr_auto] items-center gap-3 rounded-lg border-2 border-[#8A9C7A] bg-[#E7EEE1] p-3.5 sm:p-4" aria-live="polite">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#526049]">
                      <PackageCheck size={14} /> {t('orderSummary')}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-bold">
                      {selectedTier.tier}g · {totalDays} {t('orderDaysUnit')} · {totalDays} box
                    </p>
                    <p className="mt-1 text-[9px] text-[#647554]">{t('orderSundayExcluded')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase text-[#526049]">{t('orderEstimatedTotal')}</p>
                    <p className="whitespace-nowrap font-display text-xl font-black">Rp {totalCost.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  disabled={totalDays === 0}
                  className="mt-4 h-auto min-h-12 w-full min-w-0 whitespace-normal rounded-lg bg-[#1E1E1E] px-4 py-3 text-center text-xs leading-tight text-white hover:bg-[#647554]"
                >
                  <MessageCircle size={18} />
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
                <div className="flex items-center justify-between border-b border-[#8A9C7A]/25 pb-3">
                  <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#33402B]">
                    {t('orderTicketTitle')}
                  </span>
                  <span className="rounded-full border border-[#8A9C7A]/50 bg-[#647554] px-3 py-0.5 font-mono text-[10px] font-bold text-white">
                    {selectedTier.tier}g Protein
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
                      {formatOrderDate(startDate)} – {formatOrderDate(endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="font-display text-[9px] font-bold uppercase tracking-wider text-[#647554]">{t('orderSummary')}</p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-[#1E1E1E]">
                      {totalDays} {t('orderDaysUnit')} ({totalDays} Box)
                    </p>
                  </div>
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
