import { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Download, RotateCcw, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CN_WEEKDAYS, FORTUNE_LEGEND, PROFESSION_PROFILES, PROFESSIONS, type Profession } from "./almanacData";
import {
  dateSeed,
  dayGanzhi,
  fortuneColor,
  fortuneDot,
  getDailyData,
  isSameDay,
  lunarDate,
  yearGanzhi,
  yearZodiac,
} from "./almanac";

function formatSolarDate(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = "";
  for (const char of text) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function createShareImage(date: Date, profession: Profession) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const profile = PROFESSION_PROFILES[profession];
  const data = getDailyData(date, profession);
  const lunar = lunarDate(date);
  const sealColor = fortuneColor(data.fortune);
  const dateText = formatSolarDate(date);

  ctx.fillStyle = "#F0E6CC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(26,18,8,0.08)";
  ctx.lineWidth = 1;
  for (let y = 40; y < canvas.height; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(139,26,26,0.28)";
  ctx.lineWidth = 8;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);
  ctx.strokeStyle = "rgba(26,18,8,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

  ctx.fillStyle = "#8B1A1A";
  ctx.font = "700 34px 'Noto Serif SC', serif";
  ctx.textAlign = "center";
  ctx.fillText("职 场 黄 历", canvas.width / 2, 150);
  ctx.fillStyle = "#6B5C3E";
  ctx.font = "24px 'Noto Serif SC', serif";
  ctx.fillText(`${profile.label} · ${dayGanzhi(date)} · 农历${lunar.month}月${lunar.day}`, canvas.width / 2, 205);

  ctx.fillStyle = "#1A1208";
  ctx.font = "600 46px 'Noto Serif SC', serif";
  ctx.fillText(dateText, canvas.width / 2, 290);
  ctx.fillStyle = "#6B5C3E";
  ctx.font = "24px 'Noto Serif SC', serif";
  ctx.fillText(CN_WEEKDAYS[date.getDay()], canvas.width / 2, 335);

  ctx.strokeStyle = sealColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(358, 390, 184, 184);
  ctx.strokeStyle = `${sealColor}66`;
  ctx.lineWidth = 2;
  ctx.strokeRect(372, 404, 156, 156);
  ctx.fillStyle = sealColor;
  ctx.font = "24px 'Noto Serif SC', serif";
  ctx.fillText("今日", canvas.width / 2, 462);
  ctx.font = "700 58px 'Noto Serif SC', serif";
  ctx.fillText(data.fortune, canvas.width / 2, 532);

  ctx.textAlign = "left";
  ctx.fillStyle = "#3A2818";
  ctx.font = "25px 'Noto Serif SC', serif";
  const meta = [
    `喜神 ${data.luckyGod}    财神 ${data.wealthGod}`,
    `贵人 ${data.noble}    冲煞 ${data.clash}`,
    `吉星 ${data.star}    值日 ${data.officer}日 · ${data.element}气主事`,
  ];
  meta.forEach((line, index) => ctx.fillText(line, 130, 650 + index * 44));

  const drawList = (title: string, items: string[], x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.font = "700 46px 'Noto Serif SC', serif";
    ctx.fillText(title, x, y);
    ctx.strokeStyle = `${color}55`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 60, y - 16);
    ctx.lineTo(x + 650, y - 16);
    ctx.stroke();
    ctx.font = "26px 'Noto Serif SC', serif";
    ctx.fillStyle = title === "宜" ? "#1A1208" : "#4A3828";
    items.slice(0, 6).forEach((item, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      ctx.fillText(`· ${item}`, x + col * 310, y + 56 + row * 45);
    });
  };

  drawList("宜", data.auspicious, 130, 830, "#8B1A1A");
  drawList("忌", data.inauspicious, 130, 1040, "#3A2818");

  ctx.fillStyle = "#A07020";
  ctx.font = "600 23px 'Noto Serif SC', serif";
  ctx.fillText(`${profile.shortLabel}箴言`, 130, 1245);
  ctx.fillStyle = "#5A4A2E";
  ctx.font = "23px 'Noto Serif SC', serif";
  wrapCanvasText(ctx, data.quote, 130, 1285, 640, 36);

  return canvas.toDataURL("image/png");
}

function downloadImage(dataUrl: string, date: Date, profession: Profession) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `职场黄历-${PROFESSION_PROFILES[profession].label}-${dateSeed(date)}.png`;
  link.click();
}

// ─── Day View ─────────────────────────────────────────────────────────────────
function DayView({ date, profession }: { date: Date; profession: Profession }) {
  const lunar = lunarDate(date);
  const ganzhiDay = dayGanzhi(date);
  const data = getDailyData(date, profession);
  const profile = PROFESSION_PROFILES[profession];
  const fColor = fortuneColor(data.fortune);
  const solarYear = date.getFullYear();
  const solarMonth = date.getMonth() + 1;
  const solarDay = date.getDate();
  const weekdayStr = CN_WEEKDAYS[date.getDay()];
  const metaItems = [
    { label: "喜神", value: data.luckyGod, tone: "#A07020" },
    { label: "财神", value: data.wealthGod, tone: "#A07020" },
    { label: "贵人", value: data.noble },
    { label: "冲煞", value: `${data.clash}（宜回避）`, wide: true },
    { label: "吉星", value: data.star, tone: "#8B1A1A" },
    { label: "值日", value: `${data.officer}日 · ${data.element}气主事` },
  ];

  return (
    <div>
      {/* Date Hero */}
      <div className="text-center pt-4 pb-6 mb-5" style={{ borderBottom: "1px solid rgba(26,18,8,0.12)" }}>
        <div
          className="text-[11px] tracking-[0.18em] mb-2"
          style={{ color: "#6B5C3E" }}
        >
          {ganzhiDay} · 农历{lunar.month}月{lunar.day}
        </div>
        <div className="flex items-end justify-center gap-1.5 mb-1" style={{ color: "#1A1208" }}>
          <span className="text-[18px] leading-none tabular-nums" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {solarYear}
          </span>
          <span className="text-[13px] leading-none pb-[2px]" style={{ color: "#6B5C3E" }}>年</span>
          <span className="text-[32px] leading-none tabular-nums font-semibold" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {solarMonth}
          </span>
          <span className="text-[13px] leading-none pb-[3px]" style={{ color: "#6B5C3E" }}>月</span>
          <span className="text-[32px] leading-none tabular-nums font-semibold" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {solarDay}
          </span>
          <span className="text-[13px] leading-none pb-[3px]" style={{ color: "#6B5C3E" }}>日</span>
        </div>
        <div className="text-xs tracking-[0.25em]" style={{ color: "#6B5C3E" }}>
          {weekdayStr}
        </div>
      </div>

      {/* Fortune seal + meta info */}
      <div className="flex gap-4 mb-7">
        {/* Seal stamp */}
        <div className="flex-shrink-0">
          <div
            className="w-[76px] h-[76px] flex flex-col items-center justify-center"
            style={{
              border: `2.5px double ${fColor}`,
              boxShadow: `inset 0 0 0 1px ${fColor}22`,
            }}
          >
            <div className="text-[9px] tracking-[0.3em] mb-[2px]" style={{ color: fColor }}>
              今日
            </div>
            <div
              className="text-[22px] font-bold leading-none"
              style={{ color: fColor, fontFamily: '"ZCOOL XiaoWei", serif' }}
            >
              {data.fortune}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2 text-[12.5px]" style={{ color: "#3A2818" }}>
          {metaItems.map(item => (
            <div
              key={item.label}
              className={item.wide ? "col-span-2 min-w-0" : "min-w-0"}
            >
              <div className="text-[10px] leading-none tracking-[0.18em] mb-1" style={{ color: "#8B7455" }}>
                {item.label}
              </div>
              <div className="leading-[1.35] break-words" style={{ color: item.tone ?? "#3A2818" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auspicious */}
      <section className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[22px] font-bold leading-none"
            style={{ color: "#8B1A1A", fontFamily: '"ZCOOL XiaoWei", serif' }}
          >
            宜
          </span>
          <div className="flex-1" style={{ height: "1px", background: "rgba(139,26,26,0.25)" }} />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[10px]">
          {data.auspicious.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "#1A1208" }}>
              <span
                className="flex-shrink-0 w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: "#8B1A1A" }}
              />
              <span className="tracking-[0.05em]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-5" style={{ height: "1px", background: "rgba(26,18,8,0.1)" }} />

      {/* Inauspicious */}
      <section className="mb-7">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[22px] font-bold leading-none"
            style={{ color: "#3A2818", fontFamily: '"ZCOOL XiaoWei", serif' }}
          >
            忌
          </span>
          <div className="flex-1" style={{ height: "1px", background: "rgba(58,40,24,0.25)" }} />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[10px]">
          {data.inauspicious.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "#4A3828" }}>
              <span
                className="flex-shrink-0 w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: "#4A3828" }}
              />
              <span className="tracking-[0.05em]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PM Quote */}
      <div
        className="px-4 py-[14px] text-[11.5px] leading-[1.9] tracking-[0.06em]"
        style={{
          border: "1px solid rgba(181,133,42,0.4)",
          background: "rgba(181,133,42,0.06)",
          color: "#5A4A2E",
        }}
      >
        <span className="font-medium" style={{ color: "#A07020" }}>{profile.shortLabel}箴言 · </span>
        {data.quote}
      </div>
    </div>
  );
}

// ─── Month View ───────────────────────────────────────────────────────────────
function MonthView({
  calYear, calMonth, today, selectedDate, profession, onSelect, onPrev, onNext,
}: {
  calYear: number; calMonth: number; today: Date; selectedDate: Date;
  profession: Profession;
  onSelect: (d: Date) => void; onPrev: () => void; onNext: () => void;
}) {
  const calDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= total; i++) cells.push(new Date(calYear, calMonth, i));
    return cells;
  }, [calYear, calMonth]);

  return (
    <div>
      {/* Month navigation */}
      <div
        className="flex items-center justify-between py-4 mb-4"
        style={{ borderBottom: "1px solid rgba(26,18,8,0.12)" }}
      >
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
          style={{ color: "#6B5C3E" }}
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <span
          className="text-[16px] tracking-[0.08em] font-medium tabular-nums"
          style={{ fontFamily: '"ZCOOL XiaoWei", serif', color: "#1A1208" }}
        >
          {calYear}年{calMonth + 1}月
        </span>
        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
          style={{ color: "#6B5C3E" }}
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {["日","一","二","三","四","五","六"].map((w, i) => (
          <div
            key={w}
            className="text-center text-[10.5px] tracking-widest py-1"
            style={{ color: i === 0 || i === 6 ? "#8B1A1A" : "#6B5C3E" }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calDays.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-14" />;
          const dd = getDailyData(day, profession);
          const dot = fortuneDot(dd.fortune);
          const lun = lunarDate(day);
          const isT = isSameDay(day, today);
          const isSel = isSameDay(day, selectedDate);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className="h-14 flex flex-col items-center justify-center gap-[2px] transition-all duration-150 rounded-sm"
              style={{
                background: isSel ? "rgba(139,26,26,0.08)" : "transparent",
              }}
            >
              <span
                className="w-7 h-7 flex items-center justify-center text-[13px] rounded-[2px] transition-colors font-medium"
                style={{
                  background: isSel ? "#8B1A1A" : isT ? "transparent" : "transparent",
                  color: isSel ? "#F0E6CC" : isT ? "#8B1A1A" : isWeekend ? "#8B1A1A" : "#1A1208",
                  border: isT && !isSel ? "1px solid #8B1A1A" : "1px solid transparent",
                  fontFamily: '"Noto Serif SC", serif',
                }}
              >
                {day.getDate()}
              </span>
              <span
                className="text-[9px] tracking-tight"
                style={{ color: "#8B7455" }}
              >
                {lun.day === "初一" ? `${lun.month}月` : lun.day}
              </span>
              <span
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: dot }}
              />
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-6 pt-4 flex gap-5 justify-center text-[10.5px]"
        style={{ borderTop: "1px solid rgba(26,18,8,0.1)", color: "#6B5C3E" }}
      >
        {FORTUNE_LEGEND.map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
            {label}
          </div>
        ))}
      </div>

      <p
        className="text-center text-[10.5px] mt-4 tracking-wide"
        style={{ color: "#8B7455" }}
      >
        点击日期查看当日宜忌
      </p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<"day" | "month">("day");
  const [profession, setProfession] = useState<Profession>("product");
  const [selectedDate, setSelectedDate] = useState(today);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [shareImage, setShareImage] = useState<string | null>(null);

  const ganzhiYear = yearGanzhi(selectedDate.getFullYear());
  const zodiac = yearZodiac(selectedDate.getFullYear());
  const isSelectedToday = isSameDay(selectedDate, today);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }
  function selectDate(d: Date) {
    setSelectedDate(d);
    setView("day");
  }
  function backToToday() {
    setSelectedDate(today);
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
    setView("day");
  }
  function showMonth() {
    setCalYear(selectedDate.getFullYear());
    setCalMonth(selectedDate.getMonth());
    setView("month");
  }
  function shareCurrentDay() {
    const image = createShareImage(selectedDate, profession);
    if (image) setShareImage(image);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F0E6CC",
        fontFamily: '"Noto Serif SC", "STSong", "SimSun", "FangSong", serif',
        color: "#1A1208",
      }}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(26,18,8,0.03) 32px)",
          zIndex: 0,
        }}
      />

      <div className="relative max-w-[460px] mx-auto min-h-screen flex flex-col" style={{ zIndex: 1 }}>
        {/* Header */}
        <header className="px-6 pt-8 pb-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {isSelectedToday ? (
                <h1
                  className="text-[13px] tracking-[0.55em] font-medium pt-1"
                  style={{ color: "#8B1A1A" }}
                >
                  职 场 黄 历
                </h1>
              ) : (
                <button
                  onClick={backToToday}
                  className="flex items-center gap-1.5 text-[12px] tracking-[0.2em] transition-opacity hover:opacity-65"
                  style={{ color: "#8B1A1A" }}
                >
                  <RotateCcw size={14} strokeWidth={1.6} />
                  返回今日
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareCurrentDay}
                className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-65"
                style={{ color: "#6B5C3E" }}
                title="生成分享图片"
              >
                <Share2 size={17} strokeWidth={1.6} />
              </button>
              <button
                onClick={showMonth}
                className="h-8 px-2.5 flex items-center gap-1.5 transition-opacity hover:opacity-65"
                style={{
                  color: view === "month" ? "#8B1A1A" : "#6B5C3E",
                  border: "1px solid rgba(107,92,62,0.25)",
                }}
                title="月历"
              >
                <CalendarDays size={16} strokeWidth={1.6} />
                <span className="text-[11px] tracking-[0.16em]">月历</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-1.5">
              {PROFESSIONS.map(item => (
                <button
                  key={item}
                  onClick={() => setProfession(item)}
                  className="px-2.5 h-7 text-[11px] tracking-[0.08em] transition-colors"
                  style={{
                    color: profession === item ? "#F0E6CC" : "#6B5C3E",
                    background: profession === item ? "#8B1A1A" : "rgba(255,255,255,0.18)",
                    border: `1px solid ${profession === item ? "#8B1A1A" : "rgba(107,92,62,0.25)"}`,
                  }}
                >
                  {PROFESSION_PROFILES[item].label}
                </button>
              ))}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] tracking-wider" style={{ color: "#6B5C3E" }}>
                {ganzhiYear}年 · {zodiac}年
              </div>
            </div>
          </div>
          <div style={{ height: "1px", background: "rgba(26,18,8,0.2)" }} />
        </header>

        {/* Main content */}
        <main
          className="flex-1 px-6 pb-16 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <AnimatePresence mode="wait">
            {view === "day" ? (
              <motion.div
                key={`day-${dateSeed(selectedDate)}-${profession}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <DayView date={selectedDate} profession={profession} />
              </motion.div>
            ) : (
              <motion.div
                key="month"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <MonthView
                  calYear={calYear}
                  calMonth={calMonth}
                  today={today}
                  selectedDate={selectedDate}
                  profession={profession}
                  onSelect={selectDate}
                  onPrev={prevMonth}
                  onNext={nextMonth}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <div
          className="px-6 pb-6 text-center text-[10px] tracking-widest"
          style={{ color: "#8B7455" }}
        >
          ── 诸事顺遂，万事如意 ──
        </div>
      </div>
      {shareImage && (
        <div
          className="fixed inset-0 flex items-center justify-center px-5 py-8"
          style={{ zIndex: 20, background: "rgba(26,18,8,0.45)" }}
          onClick={() => setShareImage(null)}
        >
          <div
            className="w-full max-w-[360px]"
            style={{ background: "#F0E6CC", border: "1px solid rgba(26,18,8,0.22)" }}
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(26,18,8,0.14)" }}>
              <span className="text-[12px] tracking-[0.18em]" style={{ color: "#6B5C3E" }}>分享图片</span>
              <button
                onClick={() => setShareImage(null)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: "#6B5C3E" }}
                title="关闭"
              >
                <X size={16} strokeWidth={1.6} />
              </button>
            </div>
            <img src={shareImage} alt="职场黄历分享图" className="block w-full" />
            <div className="p-3">
              <button
                onClick={() => downloadImage(shareImage, selectedDate, profession)}
                className="w-full h-10 flex items-center justify-center gap-2 text-[13px] tracking-[0.18em]"
                style={{ color: "#F0E6CC", background: "#8B1A1A" }}
              >
                <Download size={16} strokeWidth={1.6} />
                下载图片
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
