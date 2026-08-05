import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

/** Format a YYYY-MM-DD string to display parts */
function parseDateParts(dateStr, locale = 'id-ID') {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00+08:00`);
  return {
    day: date.toLocaleDateString(locale, { day: '2-digit', timeZone: 'Asia/Makassar' }),
    dayName: date.toLocaleDateString(locale, { weekday: 'short', timeZone: 'Asia/Makassar' }),
    monthName: date.toLocaleDateString(locale, { month: 'short', timeZone: 'Asia/Makassar' }),
    year: date.toLocaleDateString(locale, { year: 'numeric', timeZone: 'Asia/Makassar' }),
    full: date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Makassar' }),
  };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // Mon=0
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES_ID = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const DAY_NAMES_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function MonthCalendar({ year, month, startDate, endDate, hoverDate, today, onDayClick, onDayHover, isIndonesian }) {
  const monthNames = isIndonesian ? MONTH_NAMES_ID : MONTH_NAMES_EN;
  const dayNames = isIndonesian ? DAY_NAMES_ID : DAY_NAMES_EN;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const effectiveEnd = endDate || hoverDate;

  return (
    <div className="cpl-cal-month">
      <p className="cpl-cal-month-title">{monthNames[month]} {year}</p>
      <div className="cpl-cal-weekdays">
        {dayNames.map((d) => <span key={d} className="cpl-cal-weekday">{d}</span>)}
      </div>
      <div className="cpl-cal-days">
        {cells.map((day, idx) => {
          if (!day) return <span key={`e-${idx}`} className="cpl-cal-day-wrapper" />;
          const dateStr = toDateStr(year, month, day);
          const isPast = dateStr < today;
          const isStart = dateStr === startDate;
          const isEnd = effectiveEnd && dateStr === effectiveEnd && effectiveEnd !== startDate;
          const isToday = dateStr === today;
          const inRange = startDate && effectiveEnd && effectiveEnd !== startDate && dateStr > startDate && dateStr < effectiveEnd;
          const isHovered = !endDate && dateStr === hoverDate && startDate && dateStr > startDate;

          let cellClass = 'cpl-cal-day-wrapper';
          if (!isPast && startDate && effectiveEnd && effectiveEnd !== startDate) {
            if (isStart) cellClass += ' range-start-cap';
            else if (isEnd) cellClass += ' range-end-cap';
            else if (inRange) cellClass += ' range-mid';
          }

          let btnClass = 'cpl-cal-day';
          if (isPast) btnClass += ' past';
          else if (isStart) btnClass += ' start';
          else if (isEnd) btnClass += ' end';
          else if (inRange) btnClass += ' in-range';
          else if (isHovered) btnClass += ' hovered';
          if (isToday && !isStart && !isEnd) btnClass += ' today';

          return (
            <div key={dateStr} className={cellClass}>
              <button
                type="button"
                disabled={isPast}
                className={btnClass}
                onClick={() => !isPast && onDayClick(dateStr)}
                onMouseEnter={() => !isPast && onDayHover(dateStr)}
                onMouseLeave={() => onDayHover(null)}
                aria-label={dateStr}
                aria-pressed={isStart || isEnd}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Detect if we're on a small/mobile screen — includes portrait tablets */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

/** Calendar content shared by both desktop popup and mobile sheet */
function CalendarContent({
  selecting, startDate, endDate, hoverDate, today,
  calOffset, setCalOffset, handleDayClick, setHoverDate,
  handleClearDates, startParts, endParts, startLabel, endLabel,
  dayLabel, totalDays, isIndonesian, isMobile, onClose,
  leftYear, leftMonth, rightYear, rightMonth, MONTH_NAMES,
}) {
  return (
    <>
      {/* Header */}
      <div className="cpl-cal-popup-header">
        <div className="cpl-cal-header-info">
          <span className={`cpl-cal-selecting-badge${selecting === 'start' ? ' badge-start' : ' badge-end'}`}>
            <CalendarDays size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {selecting === 'start'
              ? (isIndonesian ? 'Pilih tanggal mulai' : 'Select start date')
              : (isIndonesian ? 'Pilih tanggal selesai' : 'Select end date')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {startDate && endDate && (
              <button type="button" className="cpl-cal-clear-btn" onClick={handleClearDates}>
                <X size={12} /> {isIndonesian ? 'Reset' : 'Clear'}
              </button>
            )}
            {isMobile && (
              <button type="button" className="cpl-cal-close-btn" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="cpl-cal-nav">
          <button
            type="button"
            className="cpl-cal-nav-btn"
            onClick={() => setCalOffset((o) => Math.max(0, o - 1))}
            disabled={calOffset === 0}
            aria-label={isIndonesian ? 'Bulan sebelumnya' : 'Previous month'}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="cpl-cal-nav-label">
            {MONTH_NAMES[leftMonth]} {leftYear}
            {!isMobile && <> – {MONTH_NAMES[rightMonth]} {rightYear}</>}
          </span>
          <button
            type="button"
            className="cpl-cal-nav-btn"
            onClick={() => setCalOffset((o) => o + 1)}
            aria-label={isIndonesian ? 'Bulan berikutnya' : 'Next month'}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Month grids */}
      <div className={isMobile ? 'cpl-cal-months-mobile' : 'cpl-cal-months'}>
        <MonthCalendar
          year={leftYear} month={leftMonth}
          startDate={startDate} endDate={endDate}
          hoverDate={hoverDate} today={today}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
          isIndonesian={isIndonesian}
        />
        {!isMobile && (
          <>
            <div className="cpl-cal-month-sep" />
            <MonthCalendar
              year={rightYear} month={rightMonth}
              startDate={startDate} endDate={endDate}
              hoverDate={hoverDate} today={today}
              onDayClick={handleDayClick} onDayHover={setHoverDate}
              isIndonesian={isIndonesian}
            />
          </>
        )}
        {isMobile && (
          <MonthCalendar
            year={rightYear} month={rightMonth}
            startDate={startDate} endDate={endDate}
            hoverDate={hoverDate} today={today}
            onDayClick={handleDayClick} onDayHover={setHoverDate}
            isIndonesian={isIndonesian}
          />
        )}
      </div>

      {/* Footer */}
      {startDate && endDate && totalDays > 0 && (
        <div className="cpl-cal-footer">
          <div className="cpl-cal-footer-dates">
            <span className="cpl-cal-footer-item">
              <span className="cpl-cal-footer-label">{startLabel}</span>
              <strong>{startParts?.full}</strong>
            </span>
            <span className="cpl-cal-footer-arrow">→</span>
            <span className="cpl-cal-footer-item">
              <span className="cpl-cal-footer-label">{endLabel}</span>
              <strong>{endParts?.full}</strong>
            </span>
          </div>
          <div className="cpl-cal-footer-nights">
            <CalendarDays size={13} />
            <span>{dayLabel}</span>
          </div>
        </div>
      )}
    </>
  );
}

export function DateRangePicker({
  startDate,
  endDate,
  today,
  onStartDateChange,
  onEndDateChange,
  isIndonesian,
  hasError,
  errorMsg,
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState('start');
  const [hoverDate, setHoverDate] = useState(null);
  const [calOffset, setCalOffset] = useState(0);
  const [popupStyle, setPopupStyle] = useState({});
  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  const isMobile = useIsMobile();

  // Notify parent when picker opens/closes
  const setOpenWithCallback = useCallback((val) => {
    setOpen(val);
    onOpenChange?.(val);
  }, [onOpenChange]);

  const todayDate = new Date(`${today}T00:00:00+08:00`);
  const baseYear = todayDate.getFullYear();
  const baseMonth = todayDate.getMonth();

  const leftDate = new Date(baseYear, baseMonth + calOffset, 1);
  const rightDate = new Date(baseYear, baseMonth + calOffset + 1, 1);
  const leftYear = leftDate.getFullYear();
  const leftMonth = leftDate.getMonth();
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  /** Compute & update portal position from trigger rect.
   *  getBoundingClientRect() returns viewport-relative coords,
   *  so we use position:fixed — NO scrollX/Y offsets needed. */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || isMobile) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const PADDING = 12;
    const popupWidth = Math.min(640, window.innerWidth - PADDING * 2);

    // Align left edge with trigger, but clamp inside viewport
    let left = rect.left;
    if (left + popupWidth > window.innerWidth - PADDING) {
      left = window.innerWidth - popupWidth - PADDING;
    }
    if (left < PADDING) left = PADDING;

    // Show below trigger; if not enough room flip above
    const spaceBelow = window.innerHeight - rect.bottom - PADDING;
    const estimatedHeight = 500;
    let top;
    if (spaceBelow >= estimatedHeight || spaceBelow >= window.innerHeight * 0.45) {
      top = rect.bottom + 6;
    } else {
      top = rect.top - estimatedHeight - 6;
      if (top < PADDING) top = rect.bottom + 6; // fallback
    }

    setPopupStyle({ position: 'fixed', top, left, width: popupWidth, zIndex: 9999 });
  }, [isMobile]);

  useEffect(() => {
    if (!open) return undefined;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  /* Close on outside click — skip if click is inside popup */
  useEffect(() => {
    if (!open) return undefined;
    function handleClick(e) {
      const clickedTrigger = triggerRef.current?.contains(e.target);
      const clickedPopup = popupRef.current?.contains(e.target);
      if (!clickedTrigger && !clickedPopup) setOpenWithCallback(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpenWithCallback]);

  const openPicker = useCallback((mode) => {
    setSelecting(mode);
    const refDate = mode === 'start' ? startDate : (endDate || startDate);
    if (refDate) {
      const d = new Date(`${refDate}T00:00:00+08:00`);
      const diff = (d.getFullYear() - baseYear) * 12 + (d.getMonth() - baseMonth);
      setCalOffset(Math.max(0, diff));
    }
    setOpenWithCallback(true);
  }, [startDate, endDate, baseYear, baseMonth, setOpenWithCallback]);

  const handleDayClick = useCallback((dateStr) => {
    if (selecting === 'start') {
      onStartDateChange(dateStr);
      if (endDate && dateStr > endDate) onEndDateChange(dateStr);
      setSelecting('end');
    } else {
      if (dateStr < startDate) {
        onStartDateChange(dateStr);
        onEndDateChange(startDate);
      } else {
        onEndDateChange(dateStr);
      }
      setOpenWithCallback(false);
    }
  }, [selecting, startDate, endDate, onStartDateChange, onEndDateChange]);

  const handleClearDates = useCallback((e) => {
    e.stopPropagation();
    onStartDateChange(today);
    onEndDateChange(today);
    setOpenWithCallback(false);
  }, [today, onStartDateChange, onEndDateChange, setOpenWithCallback]);

  const locale = isIndonesian ? 'id-ID' : 'en-GB';
  const startParts = parseDateParts(startDate, locale);
  const endParts = parseDateParts(endDate, locale);

  const totalDays = (() => {
    if (!startDate || !endDate) return 0;
    const a = new Date(`${startDate}T00:00:00Z`);
    const b = new Date(`${endDate}T00:00:00Z`);
    return Math.max(0, Math.round((b - a) / 86400000));
  })();

  const dayLabel = isIndonesian ? `${totalDays} hari` : `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
  const periodLabel = isIndonesian ? 'Periode Katering' : 'Catering Period';
  const startLabel = isIndonesian ? 'Mulai' : 'Start';
  const endLabel = isIndonesian ? 'Selesai' : 'End';
  const selectStart = isIndonesian ? 'Pilih tanggal mulai' : 'Select start date';
  const selectEnd = isIndonesian ? 'Pilih tanggal selesai' : 'Select end date';
  const MONTH_NAMES = isIndonesian ? MONTH_NAMES_ID : MONTH_NAMES_EN;

  const sharedProps = {
    selecting, startDate, endDate, hoverDate, today,
    calOffset, setCalOffset, handleDayClick, setHoverDate,
    handleClearDates, startParts, endParts, startLabel, endLabel,
    dayLabel, totalDays, isIndonesian, isMobile,
    onClose: () => setOpen(false),
    leftYear, leftMonth, rightYear, rightMonth, MONTH_NAMES,
  };

  // ── Render via portal to document.body so position:fixed escapes
  // the CSS transform on Radix DialogContent. We intercept
  // onPointerDownOutside in OrderModal to prevent Radix from
  // dismissing the dialog when clicking the calendar.
  const calendarEl = open ? createPortal(
    isMobile ? (
      /* ── Mobile/tablet: bottom sheet ───────────────────────── */
      <>
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, backdropFilter: 'blur(2px)' }}
          onClick={() => setOpenWithCallback(false)}
          aria-hidden="true"
        />
        <div className="cpl-cal-sheet" ref={popupRef}>
          <div className="cpl-cal-sheet-handle" aria-hidden="true" />
          <CalendarContent {...sharedProps} />
        </div>
      </>
    ) : (
      /* ── Desktop/landscape: fixed popup ────────────────────── */
      <div className="cpl-cal-popup" style={popupStyle} ref={popupRef}>
        <CalendarContent {...sharedProps} />
      </div>
    ),
    document.body
  ) : null;

  return (
    <div className="cpl-drp-root" ref={triggerRef}>
      {/* Trigger card */}
      <div
        className={`cpl-drp-trigger${hasError ? ' error' : ''}${open ? ' open' : ''}`}
        role="group"
        aria-label={periodLabel}
      >
        <div className="cpl-drp-top-row">
          <span className="cpl-drp-stay-label">
            <CalendarDays size={13} className="cpl-drp-cal-icon" />
            {periodLabel}
          </span>
          {totalDays > 0 && (
            <span className="cpl-drp-nights-badge">
              <CalendarDays size={10} />
              {dayLabel}
            </span>
          )}
        </div>
        <div className="cpl-drp-cols">
          <button
            type="button"
            className={`cpl-drp-slot${open && selecting === 'start' ? ' active' : ''}`}
            onClick={() => openPicker('start')}
            aria-label={isIndonesian ? 'Pilih tanggal mulai katering' : 'Select catering start date'}
          >
            <span className="cpl-drp-slot-label">{startLabel}</span>
            {startParts ? (
              <span className="cpl-drp-slot-date">
                <strong className="cpl-drp-slot-day">{startParts.day}</strong>
                <span className="cpl-drp-slot-rest">{startParts.dayName}, {startParts.monthName} {startParts.year}</span>
              </span>
            ) : (
              <span className="cpl-drp-slot-placeholder">{selectStart}</span>
            )}
          </button>

          <div className="cpl-drp-divider" aria-hidden="true">
            <div className="cpl-drp-divider-line" />
            {totalDays > 0 && <span className="cpl-drp-divider-badge">{dayLabel}</span>}
          </div>

          <button
            type="button"
            className={`cpl-drp-slot${open && selecting === 'end' ? ' active' : ''}`}
            onClick={() => openPicker('end')}
            aria-label={isIndonesian ? 'Pilih tanggal selesai katering' : 'Select catering end date'}
          >
            <span className="cpl-drp-slot-label">{endLabel}</span>
            {endParts ? (
              <span className="cpl-drp-slot-date">
                <strong className="cpl-drp-slot-day">{endParts.day}</strong>
                <span className="cpl-drp-slot-rest">{endParts.dayName}, {endParts.monthName} {endParts.year}</span>
              </span>
            ) : (
              <span className="cpl-drp-slot-placeholder">{selectEnd}</span>
            )}
          </button>
        </div>
      </div>

      {hasError && errorMsg && (
        <div role="alert" className="cpl-drp-error animate-in fade-in slide-in-from-top-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {calendarEl}
    </div>
  );
}
