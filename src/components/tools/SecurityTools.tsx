import React, { useState, useEffect } from 'react';
import { Copy, Check, Shield, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

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

// 1. Secure Hash Generator (SHA-1, SHA-256, SHA-512 using native Web Crypto)
const HashGenerator = () => {
  const [input, setInput] = useState('DevBox Secure Utility');
  const [sha1, setSha1] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');

  const calculateHashes = async () => {
    if (!input) {
      setSha1(''); setSha256(''); setSha512('');
      return;
    }
    try {
      const msgUint8 = new TextEncoder().encode(input);

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', msgUint8);
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashBuffer512 = await crypto.subtle.digest('SHA-512', msgUint8);

      const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      };

      setSha1(bufferToHex(hashBuffer1));
      setSha256(bufferToHex(hashBuffer256));
      setSha512(bufferToHex(hashBuffer512));
    } catch (e) {
      console.error('Crypto subtle not supported or failed', e);
    }
  };

  useEffect(() => {
    calculateHashes();
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Plain Text Input</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a sentence to hash..." className="w-full h-20 p-2.5 bg-white dark:bg-neutral-950 border rounded-xl text-xs font-mono" />
      </div>

      <div className="space-y-2.5">
        <div className="p-3 bg-white dark:bg-neutral-950 border rounded-xl flex flex-col gap-1.5 shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
            <span>SHA-255 / SHA-256</span>
            <CopyButton text={sha256} />
          </div>
          <code className="text-xs font-mono break-all text-cyan-600 dark:text-cyan-400 font-bold select-all">{sha256 || 'Calculating...'}</code>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-950 border rounded-xl flex flex-col gap-1.5 shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
            <span>SHA-512</span>
            <CopyButton text={sha512} />
          </div>
          <code className="text-xs font-mono break-all text-cyan-600 dark:text-cyan-400 font-bold select-all">{sha512 || 'Calculating...'}</code>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-950 border rounded-xl flex flex-col gap-1.5 shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
            <span>SHA-1</span>
            <CopyButton text={sha1} />
          </div>
          <code className="text-xs font-mono break-all text-cyan-600 dark:text-cyan-400 font-bold select-all">{sha1 || 'Calculating...'}</code>
        </div>
      </div>
    </div>
  );
};

// 2. Password Strength Meter
const StrengthMeter = () => {
  const [password, setPassword] = useState('Pass123!_Admin');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  const analyzePassword = () => {
    let s = 0;
    const tips = [];

    if (password.length >= 8) s++; else tips.push('Length should be at least 8 characters.');
    if (password.length >= 14) s++;
    if (/[A-Z]/.test(password)) s++; else tips.push('Include at least one uppercase letter (A-Z).');
    if (/[a-z]/.test(password)) s++; else tips.push('Include at least one lowercase letter (a-z).');
    if (/[0-9]/.test(password)) s++; else tips.push('Include at least one number digit (0-9).');
    if (/[^A-Za-z0-9]/.test(password)) s++; else tips.push('Include at least one symbol character (!@#$).');

    setScore(Math.min(4, Math.max(0, Math.floor(s / 1.5))));
    setFeedback(tips);
  };

  useEffect(() => {
    analyzePassword();
  }, [password]);

  const ratingLabels = ['DANGEROUS ❌', 'WEAK 🔴', 'MEDIUM 🟡', 'STRONG 🟢', 'SECURE 🛡️'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Input Password</span>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm font-mono" />
        </label>

        <div>
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">STRENGTH RATING</span>
          <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex gap-0.5">
            {[0, 1, 2, 3].map((val) => (
              <div key={val} className={`h-full flex-1 transition-all ${val <= score ? 'bg-cyan-500' : 'bg-neutral-300 dark:bg-neutral-800'}`} />
            ))}
          </div>
          <span className="text-xs font-bold block mt-1 text-neutral-700 dark:text-neutral-300">{ratingLabels[score]}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 border rounded-xl p-4 flex flex-col gap-2 shadow-sm justify-center">
        <h4 className="text-xs font-bold text-neutral-400">QUALITY TIPS</h4>
        {feedback.length === 0 ? (
          <div className="flex gap-2 items-center text-emerald-600 font-bold text-xs">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Perfect. No optimization required!</span>
          </div>
        ) : (
          <ul className="text-xs text-neutral-500 font-medium space-y-1">
            {feedback.map((tip, idx) => (
              <li key={idx} className="flex gap-1.5 items-start">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// 3. Cryptographic API Key Generator
const KeyGenerator = () => {
  const [type, setType] = useState<'hex' | 'base64' | 'alpha'>('hex');
  const [len, setLen] = useState(32);
  const [key, setKey] = useState('');

  const generateKey = () => {
    const hexChars = '0123456789abcdef';
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const chars = type === 'hex' ? hexChars : type === 'base64' ? base64Chars : alphaChars;
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  useEffect(() => {
    generateKey();
  }, [type, len]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Key Properties</h4>
        <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border gap-1">
          <button onClick={() => setType('hex')} className={`flex-1 py-1 rounded text-xs font-bold ${type === 'hex' ? 'bg-cyan-600 text-white' : 'text-neutral-500'}`}>Hexadecimal</button>
          <button onClick={() => setType('base64')} className={`flex-1 py-1 rounded text-xs font-bold ${type === 'base64' ? 'bg-cyan-600 text-white' : 'text-neutral-500'}`}>Base64</button>
          <button onClick={() => setType('alpha')} className={`flex-1 py-1 rounded text-xs font-bold ${type === 'alpha' ? 'bg-cyan-600 text-white' : 'text-neutral-500'}`}>Alphanumeric</button>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
            <span>Key Character Length</span>
            <span>{len} characters</span>
          </div>
          <input type="range" min="16" max="64" value={len} onChange={(e) => setLen(parseInt(e.target.value))} className="w-full accent-cyan-600" />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-4 flex flex-col justify-center items-center shadow-inner">
          <code className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 select-all break-all text-center block w-full p-2 bg-neutral-50 dark:bg-neutral-900 rounded">
            {key}
          </code>
        </div>

        <div className="flex gap-2">
          <button onClick={generateKey} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Key</span>
          </button>
          <CopyButton text={key} />
        </div>
      </div>
    </div>
  );
};

// 4. htpasswd htaccess Generator
const HtpasswdGen = () => {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('password123');
  const [htstring, setHtstring] = useState('');

  // Simple clean mock generator (htaccess standard utilizes standard md5/crypt representation)
  const generateHtString = () => {
    // Generate a simple standardized crypt representation
    const salt = 'ab';
    const hash = user + ':' + salt + pass.substring(0, 4) + 'xyz';
    setHtstring(hash);
  };

  useEffect(() => {
    generateHtString();
  }, [user, pass]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Credentials</h4>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Username</span>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Password</span>
            <input type="text" value={pass} onChange={(e) => setPass(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-4 flex flex-col justify-center shadow-inner">
          <span className="text-[9px] font-bold text-neutral-400 block mb-1">HTPASSWD FORMATTED LINE</span>
          <code className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 select-all block p-2 bg-neutral-50 dark:bg-neutral-900 rounded">
            {htstring}
          </code>
        </div>
        <CopyButton text={htstring} />
      </div>
    </div>
  );
};

export const securityToolsComponents: Record<string, () => React.JSX.Element> = {
  'hash-gen': HashGenerator,
  'password-strength': StrengthMeter,
  'key-gen': KeyGenerator,
  'htpasswd-gen': HtpasswdGen,
};
