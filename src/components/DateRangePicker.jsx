import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getDefaultOrderStartDate } from "../lib/order";

const MONTH_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTH_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DAY_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

function firstDayOfWeek(y, m) {
  return (new Date(y, m, 1).getDay() + 6) % 7;
}

function toStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function fmtDate(value, locale) {
  if (!value) return null;

  const d = new Date(`${value}T00:00:00+08:00`);
  const tz = { timeZone: "Asia/Makassar" };

  return {
    day: d.toLocaleDateString(locale, { day: "2-digit", ...tz }),
    dayName: d.toLocaleDateString(locale, { weekday: "short", ...tz }),
    monthName: d.toLocaleDateString(locale, { month: "short", ...tz }),
    year: d.toLocaleDateString(locale, { year: "numeric", ...tz }),
    full: d.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      ...tz,
    }),
  };
}

function countDeliveryDays(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate < startDate
  )
    return 0;

  let days = 0;
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    if (cursor.getUTCDay() !== 0) days += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function getMonthOffset(value, baseYear, baseMonth) {
  if (!value) return 0;

  const d = new Date(`${value}T00:00:00+08:00`);
  return Math.max(
    0,
    (d.getFullYear() - baseYear) * 12 + (d.getMonth() - baseMonth),
  );
}

function MonthGrid({
  year,
  month,
  startDate,
  endDate,
  hoverDate,
  today,
  onDayClick,
  onDayHover,
  isIndonesian,
}) {
  const monthNames = isIndonesian ? MONTH_ID : MONTH_EN;
  const dayNames = isIndonesian ? DAY_ID : DAY_EN;
  const total = daysInMonth(year, month);
  const offset = firstDayOfWeek(year, month);
  const effectiveEnd = endDate || hoverDate;

  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= total; day += 1) cells.push(day);

  return (
    <div className="cpl-cal-month">
      <p className="cpl-cal-month-title">
        {monthNames[month]} {year}
      </p>
      <div className="cpl-cal-weekdays">
        {dayNames.map((day) => (
          <span key={day} className="cpl-cal-weekday">
            {day}
          </span>
        ))}
      </div>
      <div className="cpl-cal-days">
        {cells.map((day, index) => {
          if (!day) {
            return (
              <span key={`empty-${index}`} className="cpl-cal-day-wrapper" />
            );
          }

          const ds = toStr(year, month, day);
          const isPast = ds < today;
          const isSunday = new Date(`${ds}T00:00:00Z`).getUTCDay() === 0;
          const isStart = ds === startDate;
          const isEnd = Boolean(
            effectiveEnd && ds === effectiveEnd && effectiveEnd !== startDate,
          );
          const isInRange = Boolean(
            startDate &&
            effectiveEnd &&
            effectiveEnd !== startDate &&
            ds > startDate &&
            ds < effectiveEnd,
          );
          const isHovered =
            !endDate &&
            ds === hoverDate &&
            Boolean(startDate && ds > startDate);

          let wrapperClass = "cpl-cal-day-wrapper";
          if (
            !isPast &&
            !isSunday &&
            startDate &&
            effectiveEnd &&
            effectiveEnd !== startDate
          ) {
            if (isStart) wrapperClass += " range-start-cap";
            else if (isEnd) wrapperClass += " range-end-cap";
            else if (isInRange) wrapperClass += " range-mid";
          }

          let buttonClass = "cpl-cal-day";
          if (isPast) buttonClass += " past";
          else if (isSunday) buttonClass += " sunday";
          else if (isStart) buttonClass += " start";
          else if (isEnd) buttonClass += " end";
          else if (isInRange) buttonClass += " in-range";
          else if (isHovered) buttonClass += " hovered";
          if (ds === today && !isStart && !isEnd) buttonClass += " today";

          return (
            <div key={ds} className={wrapperClass}>
              <button
                type="button"
                disabled={isPast || isSunday}
                className={buttonClass}
                onPointerDown={(event) => {
                  if (isPast || isSunday) return;
                  if (event.pointerType === "mouse" && event.button !== 0)
                    return;
                  event.preventDefault();
                  event.stopPropagation();
                  onDayClick(ds);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onMouseEnter={() => !isPast && !isSunday && onDayHover(ds)}
                onMouseLeave={() => onDayHover(null)}
                aria-label={ds}
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

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return mobile;
}

export function DateRangePicker({
  startDate,
  endDate,
  today,
  onStartDateChange,
  onEndDateChange,
  onOpenChange,
  isIndonesian,
  hasError,
  errorMsg,
}) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState("start");
  const [hoverDate, setHoverDate] = useState(null);
  const [offset, setOffset] = useState(0);
  const [popupStyle, setPopupStyle] = useState({});
  const rootRef = useRef(null);
  const popupRef = useRef(null);
  const selectingRef = useRef(selecting);
  const onOpenChangeRef = useRef(onOpenChange);
  const isMobile = useIsMobile();

  selectingRef.current = selecting;
  onOpenChangeRef.current = onOpenChange;

  const notifyOpen = useCallback((value) => {
    onOpenChangeRef.current?.(value);
  }, []);

  const todayDate = new Date(`${today}T00:00:00+08:00`);
  const baseY = todayDate.getFullYear();
  const baseM = todayDate.getMonth();

  const leftDate = new Date(baseY, baseM + offset, 1);
  const rightDate = new Date(baseY, baseM + offset + 1, 1);
  const lY = leftDate.getFullYear();
  const lM = leftDate.getMonth();
  const rY = rightDate.getFullYear();
  const rM = rightDate.getMonth();

  const updatePos = useCallback(() => {
    if (!rootRef.current || isMobile) return;

    const rect = rootRef.current.getBoundingClientRect();
    const pad = 12;
    const width = Math.min(640, window.innerWidth - pad * 2);
    let left = rect.left;

    if (left + width > window.innerWidth - pad)
      left = window.innerWidth - width - pad;
    if (left < pad) left = pad;

    const below = window.innerHeight - rect.bottom - pad;
    const top =
      below >= 500 || below >= window.innerHeight * 0.45
        ? rect.bottom + 6
        : rect.top - 506;
    setPopupStyle({
      position: "fixed",
      top: top < pad ? rect.bottom + 6 : top,
      left,
      width,
      zIndex: 9999,
    });
  }, [isMobile]);

  useEffect(() => {
    if (!open) return undefined;

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open || isMobile) return undefined;

    const popupEl = popupRef.current;
    if (!popupEl) return undefined;

    const handleWheel = (event) => {
      const scrollable =
        rootRef.current?.closest(".overflow-y-auto") ||
        rootRef.current?.closest("[role='dialog']") ||
        document.querySelector(".overflow-y-auto");

      if (scrollable) {
        scrollable.scrollTop += event.deltaY;
      } else {
        window.scrollBy(0, event.deltaY);
      }
    };

    popupEl.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      popupEl.removeEventListener("wheel", handleWheel);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return undefined;

    const handler = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (rootRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      if (target.closest("[data-cpl-datepicker]")) return;

      setOpen(false);
      setHoverDate(null);
      notifyOpen(false);
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, notifyOpen]);

  const openPicker = useCallback(
    (mode = "start") => {
      setSelecting(mode);
      selectingRef.current = mode;

      const referenceDate = mode === "start" ? startDate : endDate || startDate;
      if (referenceDate) {
        setOffset(getMonthOffset(referenceDate, baseY, baseM));
      } else {
        setOffset(0);
      }

      setHoverDate(null);
      setOpen(true);
      notifyOpen(true);
    },
    [startDate, endDate, baseY, baseM, notifyOpen],
  );

  const [sheetTranslateY, setSheetTranslateY] = useState(0);
  const touchStartYRef = useRef(0);
  const isSwipingSheetRef = useRef(false);

  const handleSheetTouchStart = useCallback((e) => {
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingSheetRef.current = true;
  }, []);

  const handleSheetTouchMove = useCallback((e) => {
    if (!isSwipingSheetRef.current) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - touchStartYRef.current;
    if (diffY > 0) {
      setSheetTranslateY(diffY);
    }
  }, []);

  const closePicker = useCallback(() => {
    setOpen(false);
    setHoverDate(null);
    setSheetTranslateY(0);
    notifyOpen(false);
  }, [notifyOpen]);

  const handleSheetTouchEnd = useCallback(
    (e) => {
      if (!isSwipingSheetRef.current) return;
      const currentY = e.changedTouches[0]?.clientY || touchStartYRef.current;
      const diffY = currentY - touchStartYRef.current;

      if (diffY > 60 || sheetTranslateY > 60) {
        closePicker();
      }
      setSheetTranslateY(0);
      isSwipingSheetRef.current = false;
    },
    [closePicker, sheetTranslateY],
  );

  const handleDayClick = useCallback(
    (ds) => {
      const mode = selectingRef.current;

      if (mode === "start") {
        onStartDateChange(ds);
        if (endDate && ds > endDate) onEndDateChange(ds);
        setSelecting("end");
        selectingRef.current = "end";
        setHoverDate(null);
        setOffset(getMonthOffset(ds, baseY, baseM));
        return;
      }

      let nextStartDate = startDate;
      let nextEndDate = ds;

      if (ds < startDate) {
        nextStartDate = ds;
        nextEndDate = startDate;
      }

      onStartDateChange(nextStartDate);
      onEndDateChange(nextEndDate);
      setHoverDate(null);
      closePicker();
    },
    [
      startDate,
      endDate,
      baseY,
      baseM,
      onStartDateChange,
      onEndDateChange,
      closePicker,
    ],
  );

  const handleClear = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const defaultDate = getDefaultOrderStartDate(today);
      onStartDateChange(defaultDate);
      onEndDateChange(defaultDate);
      setSelecting("start");
      selectingRef.current = "start";
      setHoverDate(null);
      setOffset(0);
      closePicker();
    },
    [today, onStartDateChange, onEndDateChange, closePicker],
  );

  const locale = isIndonesian ? "id-ID" : "en-GB";
  const sp = fmtDate(startDate, locale);
  const ep = fmtDate(endDate, locale);
  const totalDays = countDeliveryDays(startDate, endDate);

  const dayLabel = isIndonesian
    ? `${totalDays} hari`
    : `${totalDays} ${totalDays === 1 ? "day" : "days"}`;
  const periodLabel = isIndonesian ? "Periode Katering" : "Catering Period";
  const startLabel = isIndonesian ? "Mulai" : "Start";
  const endLabel = isIndonesian ? "Selesai" : "End";
  const monthNames = isIndonesian ? MONTH_ID : MONTH_EN;

  const handleBackdropClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      closePicker();
    },
    [closePicker],
  );

  const handlePopupPointer = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const calendar = open
    ? createPortal(
        <>
          {isMobile && (
            <div
              className="cpl-cal-backdrop"
              data-cpl-datepicker=""
              onClick={handleBackdropClick}
              aria-hidden="true"
            />
          )}
          {isMobile ? (
            <div
              className="cpl-cal-sheet"
              data-cpl-datepicker=""
              ref={popupRef}
              onPointerDown={handlePopupPointer}
              onPointerUp={handlePopupPointer}
              onTouchStart={handlePopupPointer}
              onTouchEnd={handlePopupPointer}
              onClick={handlePopupPointer}
            >
              <div className="cpl-cal-sheet-handle" aria-hidden="true" />
              {renderCalendar()}
            </div>
          ) : (
            <div
              className="cpl-cal-popup"
              data-cpl-datepicker=""
              style={popupStyle}
              ref={popupRef}
              onPointerDown={handlePopupPointer}
              onClick={handlePopupPointer}
            >
              {renderCalendar()}
            </div>
          )}
        </>,
        document.body,
      )
    : null;

  function renderCalendar() {
    return (
      <>
        <div className="cpl-cal-popup-header">
          <div className="cpl-cal-header-info">
            <span
              className={`cpl-cal-selecting-badge${selecting === "start" ? " badge-start" : " badge-end"}`}
            >
              <CalendarDays
                size={11}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              />
              {selecting === "start"
                ? isIndonesian
                  ? "Pilih tanggal mulai"
                  : "Select start date"
                : isIndonesian
                  ? "Pilih tanggal selesai"
                  : "Select end date"}
            </span>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {startDate && endDate && (
                <button
                  type="button"
                  className="cpl-cal-clear-btn"
                  onClick={handleClear}
                >
                  <X size={12} /> {isIndonesian ? "Reset" : "Clear"}
                </button>
              )}
              {isMobile && (
                <button
                  type="button"
                  className="cpl-cal-close-btn"
                  onClick={closePicker}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="cpl-cal-nav">
            <button
              type="button"
              className="cpl-cal-nav-btn"
              onClick={() => setOffset((value) => Math.max(0, value - 1))}
              disabled={offset === 0}
              aria-label={isIndonesian ? "Bulan sebelumnya" : "Previous month"}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="cpl-cal-nav-label">
              {monthNames[lM]} {lY}
              {!isMobile && (
                <>
                  {" "}
                  – {monthNames[rM]} {rY}
                </>
              )}
            </span>
            <button
              type="button"
              className="cpl-cal-nav-btn"
              onClick={() => setOffset((value) => value + 1)}
              aria-label={isIndonesian ? "Bulan berikutnya" : "Next month"}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={isMobile ? "cpl-cal-months-mobile" : "cpl-cal-months"}>
          <MonthGrid
            year={lY}
            month={lM}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            today={today}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            isIndonesian={isIndonesian}
          />
          {!isMobile && (
            <>
              <div className="cpl-cal-month-sep" />
              <MonthGrid
                year={rY}
                month={rM}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                today={today}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                isIndonesian={isIndonesian}
              />
            </>
          )}
          {isMobile && (
            <MonthGrid
              year={rY}
              month={rM}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              today={today}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
              isIndonesian={isIndonesian}
            />
          )}
        </div>
        {startDate && endDate && totalDays > 0 && (
          <div className="cpl-cal-footer">
            <div className="cpl-cal-footer-dates">
              <span className="cpl-cal-footer-item">
                <span className="cpl-cal-footer-label">{startLabel}</span>
                <strong>{sp?.full}</strong>
              </span>
              <span className="cpl-cal-footer-arrow">→</span>
              <span className="cpl-cal-footer-item">
                <span className="cpl-cal-footer-label">{endLabel}</span>
                <strong>{ep?.full}</strong>
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

  return (
    <div className="cpl-drp-root" ref={rootRef}>
      <button
        type="button"
        className={`cpl-drp-trigger${hasError ? " error" : ""}${open ? " open" : ""}`}
        role="group"
        aria-label={periodLabel}
        onClick={() => openPicker("start")}
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
          <div
            className={`cpl-drp-slot${open && selecting === "start" ? " active" : ""}`}
          >
            <span className="cpl-drp-slot-label">{startLabel}</span>
            {sp ? (
              <span className="cpl-drp-slot-date">
                <strong className="cpl-drp-slot-day">{sp.day}</strong>
                <span className="cpl-drp-slot-rest">
                  {sp.dayName}, {sp.monthName} {sp.year}
                </span>
              </span>
            ) : (
              <span className="cpl-drp-slot-placeholder">
                {isIndonesian ? "Pilih tanggal mulai" : "Select start date"}
              </span>
            )}
          </div>
          <div className="cpl-drp-divider" aria-hidden="true">
            <div className="cpl-drp-divider-line" />
          </div>
          <div
            className={`cpl-drp-slot${open && selecting === "end" ? " active" : ""}`}
          >
            <span className="cpl-drp-slot-label">{endLabel}</span>
            {ep ? (
              <span className="cpl-drp-slot-date">
                <strong className="cpl-drp-slot-day">{ep.day}</strong>
                <span className="cpl-drp-slot-rest">
                  {ep.dayName}, {ep.monthName} {ep.year}
                </span>
              </span>
            ) : (
              <span className="cpl-drp-slot-placeholder">
                {isIndonesian ? "Pilih tanggal selesai" : "Select end date"}
              </span>
            )}
          </div>
        </div>
      </button>
      {hasError && errorMsg && (
        <div
          role="alert"
          className="cpl-drp-error animate-in fade-in slide-in-from-top-1"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}
      {calendar}
    </div>
  );
}
