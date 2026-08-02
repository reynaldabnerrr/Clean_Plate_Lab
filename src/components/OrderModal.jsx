import React, { useId, useState } from 'react';
import confetti from 'canvas-confetti';
import { useCpl } from '../hooks/useCpl';
import { CplLogoImage } from './CplLogo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
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
  const [proteinTier, setProteinTier] = useState(25);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(toDateInputValue(new Date(Date.now() + 4 * DAY_IN_MS)));
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      onClose();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        style={{ width: 'min(calc(100vw - 1rem), 56rem)', maxWidth: 'none' }}
        className="max-h-[calc(100dvh-1.5rem)] overflow-x-hidden overflow-y-auto rounded-[28px] border border-black/10 bg-[#F7F5EF] p-0 text-[#1E1E1E] shadow-2xl sm:rounded-[32px] [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border-2 [&>button]:border-white/70 [&>button]:bg-white [&>button]:p-0 [&>button]:text-[#1E1E1E] [&>button]:opacity-100 [&>button]:shadow-[0_8px_24px_rgba(0,0,0,0.28)] [&>button]:transition-[transform,background-color,box-shadow] [&>button:hover]:scale-105 [&>button:hover]:bg-[#EBF0E6] [&>button:active]:scale-95 [&>button:focus-visible]:ring-2 [&>button:focus-visible]:ring-[#B8C8AA] [&>button:focus-visible]:ring-offset-2 [&>button:focus-visible]:ring-offset-[#1E1E1E] sm:[&>button]:right-4 sm:[&>button]:top-4"
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} className="min-w-0">
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

            <div className="grid min-w-0 gap-6 p-5 sm:p-7 md:grid-cols-2 md:gap-7">
              <div className="min-w-0 space-y-5">
                <section aria-labelledby={`${fieldId}-contact-title`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">01</span>
                    <h3 id={`${fieldId}-contact-title`} className="font-display text-xs font-extrabold uppercase">
                      {t('orderCustomerDetails')}
                    </h3>
                    <span className="h-px flex-1 bg-[#1E1E1E]/15" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="min-w-0 space-y-1.5">
                      <label htmlFor={`${fieldId}-name`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                        {t('orderName')}
                      </label>
                      <div className="relative">
                        <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#647554]" />
                        <Input
                          id={`${fieldId}-name`}
                          type="text"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Alex Pratama"
                          className="h-11 min-w-0 rounded-lg border-[#1E1E1E]/25 bg-white pl-9 pr-3 font-sans text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <label htmlFor={`${fieldId}-phone`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                        {t('orderPhone')}
                      </label>
                      <div className="relative">
                        <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#647554]" />
                        <Input
                          id={`${fieldId}-phone`}
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="+62 812 3456 7890"
                          className="h-11 min-w-0 rounded-lg border-[#1E1E1E]/25 bg-white pl-9 pr-3 font-sans text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section aria-labelledby={`${fieldId}-protein-title`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">02</span>
                    <h3 id={`${fieldId}-protein-title`} className="font-display text-xs font-extrabold uppercase">
                      {t('orderProteinTier')}
                    </h3>
                    <span className="h-px flex-1 bg-[#1E1E1E]/15" />
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">03</span>
                  <h3 id={`${fieldId}-delivery-title`} className="font-display text-xs font-extrabold uppercase">
                    {t('orderDeliverySchedule')}
                  </h3>
                  <span className="h-px flex-1 bg-[#1E1E1E]/15" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <label htmlFor={`${fieldId}-start`} className="block truncate font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderStartDate')}
                    </label>
                    <Input
                      id={`${fieldId}-start`}
                      type="date"
                      required
                      value={startDate}
                      min={today}
                      onChange={(event) => handleStartDateChange(event.target.value)}
                      className="h-11 min-w-0 rounded-lg border-[#1E1E1E]/25 bg-white px-2 font-mono text-[10px]"
                    />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label htmlFor={`${fieldId}-end`} className="block truncate font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                      {t('orderEndDate')}
                    </label>
                    <Input
                      id={`${fieldId}-end`}
                      type="date"
                      required
                      value={endDate}
                      min={startDate || today}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="h-11 min-w-0 rounded-lg border-[#1E1E1E]/25 bg-white px-2 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <label htmlFor={`${fieldId}-address`} className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]">
                    {t('orderAddress')}
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3 top-3 text-[#647554]" />
                    <textarea
                      id={`${fieldId}-address`}
                      required
                      rows={2}
                      autoComplete="street-address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder={t('orderAddressPlaceholder')}
                      className="block h-20 w-full resize-none rounded-lg border border-[#1E1E1E]/25 bg-white py-3 pl-9 pr-3 font-sans text-xs font-semibold text-[#1E1E1E] outline-none placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-[#8A9C7A]"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border-2 border-[#8A9C7A] bg-[#E7EEE1] p-4" aria-live="polite">
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
          <div className="grid min-h-[340px] bg-[#F7F5EF] sm:grid-cols-[0.75fr_1.25fr]">
            <div className="flex items-center justify-center bg-[#1E1E1E] p-5 text-white sm:p-8">
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#B8C8AA]/50 bg-[#8A9C7A]">
                  <CheckCircle size={30} />
                </span>
                <p className="mt-3 font-mono text-[8px] font-bold uppercase text-[#B8C8AA]">CPL order recorded</p>
              </div>
            </div>

            <div className="flex items-center p-5 sm:p-8">
              <div className="w-full min-w-0">
                <p className="font-display text-[8px] font-bold uppercase text-[#647554]">WhatsApp handoff</p>
                <h3 className="mt-1 font-display text-lg font-black uppercase sm:text-2xl">{t('orderSuccessMsg')}</h3>
                <p className="mt-2 text-[9px] leading-relaxed text-[#555] sm:text-xs">
                  {t('orderSuccessDetail').replace('{name}', name).replace('{plan}', planString)}
                </p>

                <div className="mt-4 rounded-lg border border-[#1E1E1E]/20 bg-white p-3">
                  <div className="flex items-center justify-between gap-3 text-[9px]">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {totalDays} {t('orderDaysUnit')}</span>
                    <span className="font-display text-base font-black">Rp {totalCost.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Button variant="dark" onClick={handleReset} className="mt-4 rounded-lg px-5">
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
