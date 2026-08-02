import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCpl } from '../context/CplContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { CheckCircle, Send, ShieldCheck, Calendar, Calculator, CreditCard, Sparkles, MapPin, Phone, User, Flame } from 'lucide-react';

export function OrderModal({ isOpen, onClose }) {
  const { addOrder, t } = useCpl();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getDefaultEndString = () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [proteinTier, setProteinTier] = useState(25);
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getDefaultEndString());
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const TIER_OPTIONS = [
    { tier: 25, label: "25g Protein", price: 25000, desc: "Light & Fit Prep" },
    { tier: 60, label: "60g Protein", price: 40000, desc: "Lean Muscle Prep" },
    { tier: 80, label: "80g Protein", price: 50000, desc: "High Athlete Prep" },
    { tier: 100, label: "100g Protein", price: 60000, desc: "Pro Performance" },
  ];

  const selectedTierObj = TIER_OPTIONS.find(t => t.tier === proteinTier) || TIER_OPTIONS[0];
  const planString = `${selectedTierObj.label} Plan - Rp ${selectedTierObj.price.toLocaleString('id-ID')} / porsi`;

  const calculateTotalDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) || diff < 1 ? 1 : diff;
  };

  const totalDays = calculateTotalDays(startDate, endDate);
  const totalCost = totalDays * selectedTierObj.price;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addOrder({
      customerName: name,
      phone,
      plan: planString,
      startDate,
      endDate,
      totalDays,
      address,
      amount: totalCost
    });

    setSubmitted(true);

    // Formulate WhatsApp message to +62 899-6727-181 using 100% clean universal typography
    const message = `*CLEAN PLATE LAB MAKASSAR*
_High Protein Clinical Nutrition_
----------------------------------

Halo Admin Clean Plate Lab!
Saya mau konfirmasi pemesanan Meal Plan:

*Detail Pemesan*
• Nama: *${name}*
• WhatsApp: *${phone}*

*Paket Meal Plan*
• Porsi Protein: *${planString}*
• Periode Delivery: *${startDate}* s/d *${endDate}*
• Total Durasi: *${totalDays} ${t('orderDaysUnit')}*

*Rincian Pembayaran*
• Total Estimasi: *Rp ${totalCost.toLocaleString('id-ID')}*

*Alamat Pengiriman*
${address}

----------------------------------
Mohon info rekening & instruksi pembayarannya. Terima kasih!`;
    const waUrl = `https://api.whatsapp.com/send?phone=628996727181&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log("Confetti trigger error", err);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto bg-[#F5F2EA] text-[#1E1E1E] p-6 sm:p-8 space-y-5 border-2 border-[#1E1E1E] rounded-3xl shadow-2xl">
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="border-b-2 border-[#1E1E1E]/20 pb-4">
              <Badge variant="default" className="w-fit mb-2 bg-[#8A9C7A] text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                <Sparkles size={12} className="mr-1" />
                <span>{t('orderInquiryBadge')}</span>
              </Badge>
              <DialogTitle className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[#1E1E1E]">
                {t('orderModalTitle')}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--cpl-dark-muted)] font-medium leading-relaxed mt-1">
                {t('orderModalSub')}
              </DialogDescription>
            </DialogHeader>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                <User size={14} className="text-[#8A9C7A]" />
                <span>{t('orderName')}:</span>
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Pratama"
                className="bg-white text-black font-bold h-11 border-2 border-gray-300 rounded-2xl focus:border-[#8A9C7A] focus:ring-0 text-xs px-4"
              />
            </div>

            {/* WhatsApp Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                <Phone size={14} className="text-[#8A9C7A]" />
                <span>{t('orderPhone')}:</span>
              </label>
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +62 812 3456 7890"
                className="bg-white text-black font-bold h-11 border-2 border-gray-300 rounded-2xl focus:border-[#8A9C7A] focus:ring-0 text-xs px-4"
              />
            </div>

            {/* Interactive Protein Tier Cards (2x2 Grid) */}
            <div className="space-y-2">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                <Flame size={14} className="text-[#8A9C7A]" />
                <span>Pilih Porsi Protein Katering:</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {TIER_OPTIONS.map((item) => {
                  const isSelected = proteinTier === item.tier;
                  return (
                    <button
                      key={item.tier}
                      type="button"
                      onClick={() => setProteinTier(item.tier)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-md scale-[1.02]"
                          : "bg-white text-[#1E1E1E] border-gray-300 hover:border-[#8A9C7A]"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-display font-extrabold text-xs">{item.label}</span>
                        {isSelected && <Sparkles size={12} className="text-[#8A9C7A]" />}
                      </div>
                      <div className={`text-[11px] font-mono font-bold mt-1 ${isSelected ? "text-[#8A9C7A]" : "text-gray-600"}`}>
                        Rp {item.price.toLocaleString('id-ID')} <span className="text-[9px] font-sans font-normal opacity-80">/ porsi</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-[#647554] bg-[#EBF0E6] p-2.5 rounded-2xl border border-[#8A9C7A]/40 text-center font-sans mt-2">
                💡 Pengiriman katering harian dikirim 1x sehari (1 Box Makanan / Hari)
              </div>
            </div>

            {/* Date Range Selection (Start Date & End Date) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#8A9C7A]" />
                  <span>{t('orderStartDate')}:</span>
                </label>
                <Input
                  type="date"
                  required
                  value={startDate}
                  min={getTodayString()}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white text-black font-bold h-11 border-2 border-gray-300 rounded-2xl text-xs px-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#8A9C7A]" />
                  <span>{t('orderEndDate')}:</span>
                </label>
                <Input
                  type="date"
                  required
                  value={endDate}
                  min={startDate || getTodayString()}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white text-black font-bold h-11 border-2 border-gray-300 rounded-2xl text-xs px-3"
                />
              </div>
            </div>

            {/* Live Calculation Summary Card */}
            <div className="p-4 bg-[#EBF0E6] border-2 border-[#8A9C7A] rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-display font-bold text-[#1E1E1E]">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <Calculator size={15} className="text-[#647554]" />
                  <span>{t('orderTotalDays')}:</span>
                </span>
                <span className="font-black text-sm text-[#647554]">
                  {totalDays} {t('orderDaysUnit')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-display font-extrabold text-[#1E1E1E] pt-2 border-t border-[#8A9C7A]/40">
                <span>{t('orderTotalCost')}:</span>
                <span className="font-display font-black text-lg text-[#1E1E1E]">
                  Rp {totalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Delivery Address Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E] flex items-center gap-1.5">
                <MapPin size={14} className="text-[#8A9C7A]" />
                <span>{t('orderAddress')}:</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('orderAddressPlaceholder')}
                className="w-full p-3 border-2 border-gray-300 rounded-2xl text-xs font-display bg-white text-black font-bold focus:border-[#8A9C7A] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center gap-2 bg-[#8A9C7A] hover:bg-[#647554] text-white font-black text-sm rounded-full h-12 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Send size={18} />
                <span>{t('orderSubmit')}</span>
              </Button>
            </div>

            {/* Guarantee Trust Note */}
            <div className="text-[10px] text-center text-gray-600 font-mono flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck size={14} className="text-[#8A9C7A]" />
              <span>{t('orderGuaranteeNote')}</span>
            </div>
          </form>
        ) : (
          /* Submitted Confirmation Card */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 bg-[#EBF0E6] text-[#647554] rounded-full flex items-center justify-center mx-auto border-2 border-[#8A9C7A] shadow-sm">
              <CheckCircle size={36} />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1E1E1E]">
              {t('orderSuccessMsg')}
            </h3>

            <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed max-w-sm mx-auto font-sans">
              {t('orderSuccessDetail').replace('{name}', name).replace('{plan}', planString)}
            </p>

            <div className="p-5 bg-white border-2 border-[#1E1E1E] rounded-3xl shadow-sm text-left space-y-3 my-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-display font-extrabold uppercase text-[#1E1E1E]">
                  <Calendar size={16} className="text-[#8A9C7A]" />
                  <span>Periode Pengiriman</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-[#EBF0E6] text-[#647554] rounded-full border border-[#8A9C7A]/30">
                  {totalDays} {t('orderDaysUnit')}
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-[#1E1E1E] flex items-center justify-between">
                <span className="text-gray-500">Rentang Tanggal:</span>
                <span className="text-[#1E1E1E]">{startDate} &nbsp;➜&nbsp; {endDate}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2 text-xs font-display font-extrabold uppercase text-[#1E1E1E]">
                  <CreditCard size={16} className="text-[#8A9C7A]" />
                  <span>Total Estimasi Biaya</span>
                </div>
                <span className="text-lg font-display font-black text-[#647554]">
                  Rp {totalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <Button 
              variant="default" 
              onClick={handleReset} 
              className="bg-[#1E1E1E] hover:bg-[#333] text-white font-extrabold rounded-full px-8 py-3 text-xs"
            >
              {t('orderBackBtn')}
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
