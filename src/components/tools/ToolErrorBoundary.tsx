import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  language: 'en' | 'ar';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ToolErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ToolErrorBoundary] Trapped crash inside sandboxed tool:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    const { language } = this.props;
    const isAr = language === 'ar';

    if (this.state.hasError) {
      return (
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-rose-500/20 shadow-sm text-start space-y-6 max-w-2xl mx-auto my-4 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'تعثرت أداة التطوير مؤقتاً' : 'Tool Sandboxing Failure trapped'}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                {isAr
                  ? 'تم عزل هذا الخطأ بنجاح لحماية بقية التطبيق. لم يفقد أي من بياناتك في صندوق التطوير الآخر.'
                  : 'This specific tool encountered a runtime exception. The rest of DevBox remains unaffected and continues to run perfectly.'}
              </p>
            </div>
          </div>

          {/* Collapsible Error Technical Logs */}
          <div className="bg-slate-900 dark:bg-black/80 rounded-xl p-4 border border-slate-800 font-mono text-[10px] text-rose-400 space-y-2 overflow-x-auto">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 mb-1 text-slate-400">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-widest text-[9px]">Sandboxed Crash Logs</span>
            </div>
            <div className="font-bold">{this.state.error?.toString()}</div>
            {this.state.errorInfo && (
              <pre className="whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto text-slate-400/90 scrollbar-thin">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10 flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة تشغيل الأداة المعزولة' : 'Reset Isolated Tool'}</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <span>{isAr ? 'إعادة تحميل الصفحة بالكامل' : 'Reload Full Workspace'}</span>
            </button>
          </div>

          <div className="text-[10px] font-medium text-slate-450 dark:text-slate-500">
            {isAr
              ? 'ملاحظة: يمكنك الإبلاغ عن هذا الخلل البرمجي عبر صفحة الاتصال لإصلاحها في التحديث القادم.'
              : 'Note: You can submit this crash telemetry log through our Contact section to fix it.'}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ToolErrorBoundary;
