import { useEffect, useState } from "react";
import "./CountdownTimer.css";

export function CountdownTimer({ targetDate, onExpire }) {
  const calc = () => {
    const diff = +new Date(targetDate) - +new Date();
    if (diff <= 0) return { isExpired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      isExpired: false,
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => {
      const next = calc();
      setT(next);
      if (next.isExpired) { clearInterval(id); if (onExpire) onExpire(); }
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (t.isExpired) return <span className="cd-unlocked">✓ Unlocked</span>;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="countdown">
      <div className="cd-block"><span>{pad(t.days)}</span><span className="cd-unit">d</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-block"><span>{pad(t.hours)}</span><span className="cd-unit">h</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-block"><span>{pad(t.minutes)}</span><span className="cd-unit">m</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-block"><span>{pad(t.seconds)}</span><span className="cd-unit">s</span></div>
    </div>
  );
}
