import React, { useState } from 'react';
import { jsonFormatterLogic } from './Logic';
import { jsonFormatterTranslations } from './Translation';
import { jsonFormatterConfig } from './Configuration';
import { runJsonFormatterTests, TestResult } from './Tests';
import { Braces, Copy, Check, Trash2, ShieldCheck, AlertCircle, PlayCircle } from 'lucide-react';

interface Props {
  language?: 'en' | 'ar';
}

export const JsonFormatterModular: React.FC<Props> = ({ language = 'en' }) => {
  const t = jsonFormatterTranslations[language] || jsonFormatterTranslations.en;
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationMsg, setValidationMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  const handleBeautify = () => {
    try {
      const formatted = jsonFormatterLogic.beautify(input, jsonFormatterConfig.defaultIndent);
      setOutput(formatted);
      setValidationMsg({ text: t.validationSuccess, isError: false });
    } catch (e: any) {
      setValidationMsg({ text: t.validationError + (e.message || ''), isError: true });
    }
  };

  const handleMinify = () => {
    try {
      const compacted = jsonFormatterLogic.minify(input);
      setOutput(compacted);
      setValidationMsg({ text: t.validationSuccess, isError: false });
    } catch (e: any) {
      setValidationMsg({ text: t.validationError + (e.message || ''), isError: true });
    }
  };

  const handleValidate = () => {
    const res = jsonFormatterLogic.validate(input);
    if (res.isValid) {
      setValidationMsg({ text: t.validationSuccess, isError: false });
    } else {
      setValidationMsg({ text: t.validationError + (res.error || ''), isError: true });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setValidationMsg(null);
    setTestResults(null);
  };

  const handleRunTests = () => {
    const results = runJsonFormatterTests();
    setTestResults(results);
  };

  return (
    <div className="space-y-6 text-start">
      {/* Description Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
          <Braces className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            {language === 'ar' ? 'منسق ومعالج الـ JSON المعياري' : 'Modular JSON Processor & Validator'}
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {language === 'ar' 
              ? 'معالج JSON مستقل، تم إنشاؤه ليوضح هيكلية التطوير المعزولة والحديثة.'
              : 'Isolated standalone engine illustrating strict failure protection and code-splitting principles.'}
          </p>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wide">
            {t.inputLabel}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-72 p-3.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-mono leading-relaxed text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none shadow-inner"
          />
        </div>

        {/* Output box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wide">
              {t.outputLabel}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-500 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyBtn}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={language === 'ar' ? 'المخرجات المنسقة ستظهر هنا تلقائياً...' : 'Processed formatted output appears here...'}
            className="w-full h-72 p-3.5 bg-slate-50/20 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono leading-relaxed text-slate-850 dark:text-slate-100 resize-none select-all"
          />
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        <button
          onClick={handleBeautify}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          <span>{t.beautifyBtn}</span>
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-755 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>{t.minifyBtn}</span>
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <span>{t.validateBtn}</span>
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-slate-100/60 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800/40 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-slate-500 rounded-xl transition-all cursor-pointer flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearBtn}</span>
        </button>
      </div>

      {/* Validation Banner */}
      {validationMsg && (
        <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all ${validationMsg.isError ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationMsg.text}</span>
        </div>
      )}

      {/* Integrated Test Runner to satisfy Stability Audits */}
      <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4.5 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-black tracking-wide text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'اختبارات الاستقرار المعزولة' : 'Modular Stability Self-Audit Tests'}</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {language === 'ar' 
                ? 'قم بتشغيل اختبارات التحقق من صحة الخوارزمية معزولة تماماً في المتصفح.'
                : 'Execute the modular self-healing and assertion suite completely client-side.'}
            </p>
          </div>
          <button
            onClick={handleRunTests}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تشغيل الاختبارات' : 'Run Self-Tests'}</span>
          </button>
        </div>

        {testResults && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {testResults.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-[11px] font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">{res.name}</span>
                <span className={`font-black text-[10px] px-2 py-0.5 rounded-full ${res.passed ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 text-rose-600'}`}>
                  {res.passed ? 'PASSED ✓' : 'FAILED ✗'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default JsonFormatterModular;
