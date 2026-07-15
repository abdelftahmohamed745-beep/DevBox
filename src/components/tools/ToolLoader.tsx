import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  language: 'en' | 'ar';
}

export const ToolLoader: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-spin flex items-center justify-center"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-blue-500/80 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="font-display font-black text-sm text-slate-800 dark:text-slate-200">
          {isAr ? 'جاري تهيئة الأداة بأمان...' : 'Sandboxing Tool Securely...'}
        </h4>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono font-bold tracking-widest uppercase">
          {isAr ? 'تحميل 100% محلي' : '100% Local execution module'}
        </p>
      </div>
    </div>
  );
};
export default ToolLoader;
