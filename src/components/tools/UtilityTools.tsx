import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, RefreshCw, Play, Pause, Trash2 } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// 1. Percentage Calculator
const PercentCalc = () => {
  // Formula A: What is X% of Y?
  const [xa, setXa] = useState(15);
  const [ya, setYa] = useState(200);
  const [resultA, setResultA] = useState(30);

  // Formula B: X is what % of Y?
  const [xb, setXb] = useState(30);
  const [yb, setYb] = useState(200);
  const [resultB, setResultB] = useState(15);

  // Formula C: Percent increase/decrease from X to Y?
  const [xc, setXc] = useState(100);
  const [yc, setYc] = useState(150);
  const [resultC, setResultC] = useState(50);

  useEffect(() => {
    setResultA(parseFloat(((xa / 100) * ya).toFixed(4)));
  }, [xa, ya]);

  useEffect(() => {
    if (yb === 0) { setResultB(0); return; }
    setResultB(parseFloat(((xb / yb) * 100).toFixed(4)));
  }, [xb, yb]);

  useEffect(() => {
    if (xc === 0) { setResultC(0); return; }
    const diff = yc - xc;
    setResultC(parseFloat(((diff / xc) * 100).toFixed(4)));
  }, [xc, yc]);

  return (
    <div className="space-y-4">
      {/* Formula A */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border items-center">
        <span className="text-xs font-bold text-neutral-500">What is</span>
        <div className="flex gap-2">
          <input type="number" value={xa} onChange={(e) => setXa(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs w-full font-mono" />
          <span className="text-xs font-bold pt-2">% of</span>
        </div>
        <input type="number" value={ya} onChange={(e) => setYa(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono" />
        <div className="flex justify-between items-center bg-white dark:bg-neutral-950 p-2 border rounded-lg">
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{resultA}</span>
          <CopyButton text={resultA.toString()} />
        </div>
      </div>

      {/* Formula B */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border items-center">
        <input type="number" value={xb} onChange={(e) => setXb(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono" />
        <span className="text-xs font-bold text-center">is what % of</span>
        <input type="number" value={yb} onChange={(e) => setYb(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono" />
        <div className="flex justify-between items-center bg-white dark:bg-neutral-950 p-2 border rounded-lg">
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{resultB}%</span>
          <CopyButton text={resultB.toString() + '%'} />
        </div>
      </div>

      {/* Formula C */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border items-center">
        <span className="text-xs font-bold text-neutral-500">What is % shift from</span>
        <input type="number" value={xc} onChange={(e) => setXc(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono" />
        <div className="flex gap-2">
          <span className="text-xs font-bold pt-2">to</span>
          <input type="number" value={yc} onChange={(e) => setYc(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs w-full font-mono" />
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-neutral-950 p-2 border rounded-lg">
          <span className={`text-xs font-bold font-mono ${resultC >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {resultC >= 0 ? '+' : ''}{resultC}%
          </span>
          <CopyButton text={(resultC >= 0 ? '+' : '') + resultC + '%'} />
        </div>
      </div>
    </div>
  );
};

// 2. Age Calculator with Live Ticking
const AgeCalc = () => {
  const [bday, setBday] = useState('1998-05-15');
  const [ageStats, setAgeStats] = useState({
    years: 0,
    months: 0,
    days: 0,
    weeks: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateAge = () => {
      if (!bday) return;
      const bDate = new Date(bday);
      const now = new Date();
      const diffMs = now.getTime() - bDate.getTime();

      if (diffMs < 0) {
        setAgeStats({ years: 0, months: 0, days: 0, weeks: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor(diffMs / 1000);
      const days = Math.floor(seconds / 86400);
      const weeks = Math.floor(days / 7);
      const years = Math.floor(days / 365.25);
      const months = Math.floor(days / 30.437);

      setAgeStats({ years, months, days, weeks, seconds });
    };

    calculateAge();
    const ticker = setInterval(calculateAge, 1000);
    return () => clearInterval(ticker);
  }, [bday]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Choose Birth Date</span>
          <input type="date" value={bday} onChange={(e) => setBday(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <div className="p-3 bg-white dark:bg-neutral-950 border rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">TOTAL SECONDS LIVED</span>
            <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{ageStats.seconds.toLocaleString()}</span>
          </div>
          <CopyButton text={ageStats.seconds.toString()} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white dark:bg-neutral-950 border rounded-xl text-center shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">YEARS OLD</span>
          <span className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">{ageStats.years}</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-950 border rounded-xl text-center shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">MONTHS COUNT</span>
          <span className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">{ageStats.months}</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-950 border rounded-xl text-center shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">WEEKS COUNT</span>
          <span className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">{ageStats.weeks}</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-950 border rounded-xl text-center shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">DAYS COUNT</span>
          <span className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">{ageStats.days}</span>
        </div>
      </div>
    </div>
  );
};

// 3. BMI Index Progress Meter
const BmiCalc = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBmi] = useState(22.9);
  const [rating, setRating] = useState('Normal Weight');

  const calculateBMI = () => {
    if (height === 0) return;
    const hMeters = height / 100;
    const score = weight / (hMeters * hMeters);
    const parsed = parseFloat(score.toFixed(1));
    setBmi(parsed);

    if (score < 18.5) setRating('Underweight 🔵');
    else if (score < 25) setRating('Normal Weight 🟢');
    else if (score < 30) setRating('Overweight 🟡');
    else setRating('Obese 🔴');
  };

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Weight (kg)</span>
            <input type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Height (cm)</span>
            <input type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-5 flex flex-col justify-center items-center shadow-inner">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Body Mass Index</span>
          <span className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">{bmi}</span>
          <span className="text-xs font-bold block mt-1.5">{rating}</span>
        </div>
      </div>
    </div>
  );
};

// 4. Date Range & Diff Calculator
const DateDiff = () => {
  const [start, setStart] = useState('2026-01-01');
  const [end, setEnd] = useState('2026-12-31');
  const [days, setDays] = useState(364);

  const calculateDiff = () => {
    if (!start || !end) return;
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e.getTime() - s.getTime();
    setDays(Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    calculateDiff();
  }, [start, end]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Select Date Scope</h4>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Start Date</span>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>End Date</span>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-5 flex flex-col justify-center items-center shadow-inner">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">DATE DELTA</span>
          <span className="text-3xl font-black font-sans text-emerald-600 dark:text-emerald-400">{days} Days</span>
          <span className="text-[10px] font-bold text-neutral-400 mt-1">~{(days / 7).toFixed(1)} Weeks</span>
        </div>
      </div>
    </div>
  );
};

// 5. Precision StopWatch
const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const mil = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mil.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <div className="text-center py-6">
          <span className="text-4xl font-black font-mono tracking-wider block text-emerald-600 dark:text-emerald-400">
            {formatTime(time)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRunning(!running)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-white ${
              running ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{running ? 'Pause' : 'Start'}</span>
          </button>
          {running && (
            <button onClick={handleLap} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold">
              Lap
            </button>
          )}
          <button onClick={handleReset} className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 border rounded-xl p-4 max-h-[190px] overflow-y-auto pr-2">
        <span className="text-[10px] font-bold text-neutral-400 block mb-2 uppercase">Stopwatch Laps ({laps.length})</span>
        {laps.length === 0 ? (
          <span className="text-xs text-neutral-400 italic font-medium block">No laps captured yet.</span>
        ) : (
          <div className="space-y-1.5 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between border-b border-neutral-100/50 pb-1">
                <span>Lap {idx + 1}</span>
                <span>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const utilityToolsComponents: Record<string, () => React.JSX.Element> = {
  'percent-calc': PercentCalc,
  'age-calc': AgeCalc,
  'bmi-calc': BmiCalc,
  'date-diff': DateDiff,
  'stopwatch': StopWatch,
};
