import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCpl } from '../context/CplContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { CheckCircle, Send, ShieldCheck } from 'lucide-react';

export function OrderModal({ isOpen, onClose }) {
  const { addOrder, t } = useCpl();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("5-Day Lunch Plan (5 Meal Boxes)");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addOrder({
      customerName: name,
      phone,
      plan,
      address,
      amount: plan.includes("14-Day") ? 1850000 : plan.includes("30-Day") ? 3600000 : 350000
    });

    setSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
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
      <DialogContent className="max-w-lg bg-[#F5F2EA] text-[#1E1E1E] p-6 sm:p-8 space-y-6 border-2 border-[#1E1E1E]">
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="border-b border-gray-300 pb-4">
              <Badge variant="default" className="w-fit mb-1 bg-[#EBF0E6] text-[#647554]">
                <span>CPL Order Inquiry</span>
              </Badge>
              <DialogTitle className="text-2xl font-extrabold uppercase tracking-tight">
                {t('orderModalTitle')}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600">
                {t('orderModalSub')}
              </DialogDescription>
            </DialogHeader>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1">
                {t('orderName')}:
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Pratama"
                className="bg-white text-black font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1">
                {t('orderPhone')}:
              </label>
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +62 812 3456 7890"
                className="bg-white text-black font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1">
                {t('orderPlan')}:
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full h-11 p-3 border-2 border-[#1E1E1E] text-xs font-display font-bold bg-white text-black focus:outline-none"
              >
                <option value="5-Day Lunch Plan (5 Meal Boxes)">5-Day Lunch Plan (5 Meal Boxes) - Rp 350.000</option>
                <option value="5-Day Full Day Plan (10 Meal Boxes)">5-Day Full Day Plan (10 Meal Boxes) - Rp 680.000</option>
                <option value="14-Day Pro Athlete High Protein">14-Day Pro Athlete High Protein - Rp 1.850.000</option>
                <option value="30-Day Lean Muscle Cut Transformation">30-Day Lean Muscle Cut Transformation - Rp 3.600.000</option>
                <option value="Corporate B2B Custom Catering Inquiry">Corporate B2B Custom Catering Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1">
                {t('orderAddress')}:
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building name, unit number..."
                className="w-full p-3 border-2 border-[#1E1E1E] text-xs font-display bg-white text-black font-bold focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center gap-2 bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold"
              >
                <Send size={16} />
                <span>{t('orderSubmit')}</span>
              </Button>
            </div>

            <div className="text-[10px] text-center text-gray-500 font-mono flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-[#8A9C7A]" />
              <span>Lab Fresh Guarantee • Direct Sync with CPL CMS</span>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#EBF0E6] text-[#647554] rounded-full flex items-center justify-center mx-auto border-2 border-[#8A9C7A]">
              <CheckCircle size={36} />
            </div>

            <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight">
              {t('orderSuccessMsg')}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto font-sans">
              Thank you, <strong>{name}</strong>. Your Clean Plate Lab order request for <strong>{plan}</strong> has been logged into our CMS. Our nutrition concierge will contact you via WhatsApp shortly.
            </p>

            <div className="p-3 bg-white border border-[#1E1E1E] text-[10px] font-mono uppercase text-gray-700 font-bold">
              Synced to CPL Admin CMS Order Dashboard
            </div>

            <Button variant="default" onClick={handleReset} className="bg-[#1E1E1E] text-white font-bold">
              Back to Overview
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
