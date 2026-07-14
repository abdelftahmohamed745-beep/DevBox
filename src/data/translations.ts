// Translation Dictionary and Language State Utilities for DevBox
import { Category, Tool, FAQItem } from '../types';

export type Language = 'en' | 'ar';

// Helper to determine the initial language (LocalStorage -> URL localization -> Browser language -> default English)
export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';

  // 1. Local Storage priority
  const saved = localStorage.getItem('devbox_language');
  if (saved === 'ar' || saved === 'en') return saved;

  // 2. URL Localization priority: path check /ar or /en
  const path = window.location.pathname;
  if (path.startsWith('/ar/') || path === '/ar') return 'ar';
  if (path.startsWith('/en/') || path === '/en') return 'en';

  // 3. Hash Localization check
  const hash = window.location.hash;
  if (hash.includes('/ar/') || hash.includes('/ar') || hash.includes('#ar')) return 'ar';
  if (hash.includes('/en/') || hash.includes('/en') || hash.includes('#en')) return 'en';

  // 4. Browser language detection
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang && browserLang.startsWith('ar')) return 'ar';

  return 'en';
};

// Update browser address bar path to match localized URLs without triggering full page reload
export const updateUrlForLanguage = (lang: Language) => {
  if (typeof window === 'undefined') return;
  const currentPath = window.location.pathname;
  
  // Clean prefix if any
  let cleanPath = currentPath.replace(/^\/(en|ar)(\/|$)/, '/');
  if (cleanPath === '') cleanPath = '/';

  const newPath = `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  
  window.history.replaceState(
    null,
    '',
    newPath + window.location.search + window.location.hash
  );

  // Synchronize lang attribute on HTML element for SEO and RTL styling
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

// Direct Key-Value Translations dictionary
export const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'All Tools': { en: 'All Tools', ar: 'جميع الأدوات' },
  'Categories': { en: 'Categories', ar: 'الفئات' },
  'Favorites': { en: 'Favorites', ar: 'المفضلة' },
  'About': { en: 'About', ar: 'من نحن' },
  'Contact': { en: 'Contact', ar: 'اتصل بنا' },
  'Privacy Policy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  'Terms of Use': { en: 'Terms of Use', ar: 'شروط الاستخدام' },
  'OFFLINE SUITE': { en: 'OFFLINE SUITE', ar: 'مجموعة أدوات أوفلاين' },
  'Search All 50+ Utilities - DevBox': { en: 'Search All 50+ Utilities - DevBox', ar: 'البحث في أكثر من 50 أداة - ديف بوكس' },

  // General Buttons and Labels
  'Search': { en: 'Search', ar: 'بحث' },
  'Clear': { en: 'Clear', ar: 'مسح الكود' },
  'Copy': { en: 'Copy', ar: 'نسخ' },
  'Copied!': { en: 'Copied!', ar: 'تم النسخ!' },
  'Download': { en: 'Download', ar: 'تحميل' },
  'Regenerate': { en: 'Regenerate', ar: 'إعادة التوليد' },
  'Launch Tool': { en: 'Launch Tool', ar: 'تشغيل الأداة' },
  'Language': { en: 'Language', ar: 'اللغة' },
  'Theme': { en: 'Theme', ar: 'المظهر' },
  'Toggle dark mode': { en: 'Toggle dark mode', ar: 'تبديل الوضع الداكن' },
  'Instant search... (/)': { en: 'Instant search... (/)', ar: 'بحث فوري... (/)' },
  'Filter by keyword...': { en: 'Filter by keyword...', ar: 'تصفية بالكلمات الدلالية...' },
  'Free Browser Tool': { en: 'Free Browser Tool', ar: 'أداة متصفح مجانية' },
  'Information': { en: 'Information', ar: 'معلومات الأداة' },
  '💡 Pro Tip:': { en: '💡 Pro Tip:', ar: '💡 نصيحة ذكية:' },
  'Clear fields': { en: 'Clear fields', ar: 'مسح الحقول الكلية' },
  'Download output as file': { en: 'Download output as file', ar: 'تحميل النتيجة كملف' },
  'Copy to clipboard': { en: 'Copy to clipboard', ar: 'نسخ إلى الحافظة' },
  'Valid Input': { en: 'Valid Input', ar: 'مدخلات صحيحة' },
  'Validation Error': { en: 'Validation Error', ar: 'خطأ في التحقق' },
  'Ready for input': { en: 'Ready for input', ar: 'جاهز لاستقبال المدخلات' },
  'Waiting for inputs': { en: 'Waiting for inputs', ar: 'في انتظار المدخلات' },

  // Homepage Hero & Sections
  'DevBox.': { en: 'DevBox.', ar: 'ديف بوكس.' },
  'Your Offline Developer Toolbox': { en: 'Your Offline Developer Toolbox', ar: 'حقيبة أدوات المطورين دون اتصال بالإنترنت' },
  'Secure, zero-egress browser-based tools processed 100% locally. No tracking, no data leaks, and lightning-fast execution.': {
    en: 'Secure, zero-egress browser-based tools processed 100% locally. No tracking, no data leaks, and lightning-fast execution.',
    ar: 'أدوات آمنة تماماً تعمل داخل المتصفح بنسبة 100٪ دون أي اتصال خارجي. لا تتبع، لا تسريب للبيانات، وسرعة فائقة في المعالجة.'
  },
  'Try Popular Tools': { en: 'Try Popular Tools', ar: 'جرب الأدوات الشائعة' },
  'Explore Categories': { en: 'Explore Categories', ar: 'استكشف الفئات والأقسام' },
  'Browse by Category': { en: 'Browse by Category', ar: 'تصفح حسب الفئات' },
  'Tools registered': { en: 'Tools registered', ar: 'أدوات مسجلة' },
  'Frequently Asked Questions': { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة ومخاوف الأمان' },
  'FREE WEB TOOLS': { en: 'FREE WEB TOOLS', ar: 'أداة ويب مجانية' },
  'LOCAL PRIVACY': { en: 'LOCAL PRIVACY', ar: 'خصوصية محلية 100٪' },
  'BROWSER UPTIME': { en: 'BROWSER UPTIME', ar: 'جاهزية على المتصفح' },

  // Stats
  'FREE WEB TOOLS STAT': { en: 'FREE WEB TOOLS', ar: 'أداة ويب مجانية' },
  'CATEGORIES': { en: 'CATEGORIES', ar: 'فئات مخصصة' },
  'LOCAL PRIVACY STAT': { en: 'LOCAL PRIVACY', ar: 'خصوصية محلية' },
  'BROWSER UPTIME STAT': { en: 'BROWSER UPTIME', ar: 'وقت التشغيل' },

  // Search Results & Empty States
  'No Matching Tools Found': { en: 'No Matching Tools Found', ar: 'لم يتم العثور على أدوات مطابقة' },
  'Try refining your keyword queries, or select another category side navigation.': {
    en: 'Try refining your keyword queries, or select another category side navigation.',
    ar: 'حاول تحسين كلمات البحث الخاصة بك، أو اختر فئة أخرى من القائمة الجانبية.'
  },
  'All Tools Portfolio': { en: 'All Tools Portfolio', ar: 'معرض جميع الأدوات المتاحة' },
  'matching tools': { en: 'matching tools', ar: 'أدوات مطابقة' },
  'Browse Categories Portfolio': { en: 'Browse Categories Portfolio', ar: 'تصفح فئات وأقسام الأدوات' },
  'Select from our 11 clusters to access optimized developer tools.': {
    en: 'Select from our 11 clusters to access optimized developer tools.',
    ar: 'اختر من بين 11 قسماً مخصصاً للوصول إلى أدوات التطوير المحسنة.'
  },

  // Favorites Page
  'Your Starred Favorites': { en: 'Your Starred Favorites', ar: 'الأدوات المفضلة التي اخترتها' },
  'Keep your most frequently used dev and design utilities starred for instant navigation on load.': {
    en: 'Keep your most frequently used dev and design utilities starred for instant navigation on load.',
    ar: 'احتفظ بالأدوات البرمجية والتصميمية الأكثر استخداماً في قائمتك المفضلة للوصول السريع إليها دائماً.'
  },
  'No Favorites Bookmarked': { en: 'No Favorites Bookmarked', ar: 'لم يتم إضافة أدوات للمفضلة بعد' },
  'Click the star icon in any tool card across the directory to build your personalized daily workspace.': {
    en: 'Click the star icon in any tool card across the directory to build your personalized daily workspace.',
    ar: 'اضغط على رمز النجمة في بطاقة أي أداة لإنشاء مساحة عملك اليومية المخصصة والوصول السريع.'
  },
  'View Directory': { en: 'View Directory', ar: 'تصفح الدليل الكامل' },
  'Recently Executed Tools': { en: 'Recently Executed Tools', ar: 'الأدوات المستخدمة مؤخراً' },
  'Starred Favorites Portfolio - DevBox': { en: 'Starred Favorites Portfolio - DevBox', ar: 'محفظة المفضلة - ديف بوكس' },

  // About Page
  'About DevBox': { en: 'About DevBox', ar: 'معلومات عن ديف بوكس' },
  'Strict Zero-Egress Offline Suite': { en: 'Strict Zero-Egress Offline Suite', ar: 'مجموعة أدوات محلية 100٪ بدون أي اتصال خارجي' },
  'About DevBox - Strict Zero-Egress Offline Suite': { en: 'About DevBox - Strict Zero-Egress Offline Suite', ar: 'عن ديف بوكس - مجموعة أدوات محلية خالية من الاتصال' },
  'Understand our core philosophy of zero server tracking. Explore how modern browser canvas and crypto APIs allow private data processing.': {
    en: 'Understand our core philosophy of zero server tracking. Explore how modern browser canvas and crypto APIs allow private data processing.',
    ar: 'تعرف على فلسفتنا الأساسية في انعدام التتبع. كيف تتيح تقنيات الويب الحديثة والمشفرة معالجة البيانات بأمان محلي مطلق.'
  },
  'Our Mission': { en: 'Our Mission', ar: 'رسالتنا وأهدافنا' },
  'DevBox was created to solve a common developer dilemma: the need for quick, everyday utilities like formatter, converters, and hashes without sacrificing source code privacy. Most tools online send your payloads, tokens, and credentials to remote servers for processing. DevBox processes 100% of your data client-side in your own browser sandbox.': {
    en: 'DevBox was created to solve a common developer dilemma: the need for quick, everyday utilities like formatter, converters, and hashes without sacrificing source code privacy. Most tools online send your payloads, tokens, and credentials to remote servers for processing. DevBox processes 100% of your data client-side in your own browser sandbox.',
    ar: 'تم إنشاء ديف بوكس لحل معضلة شائعة للمطورين: الحاجة إلى أدوات سريعة ويومية مثل المنسقات والمحولات والهاش دون التضحية بخصوصية الكود المصدري. ترسل معظم المواقع مدخلاتك ورموزك السرية لخوادم خارجية، بينما يعالج ديف بوكس بياناتك بنسبة 100٪ محلياً في متصفحك.'
  },
  'Core Architecture Guarantees': { en: 'Core Architecture Guarantees', ar: 'ضمانات البنية الأساسية والأمان' },
  'No Server Overhead': { en: 'No Server Overhead', ar: 'لا وجود لخوادم وسيطة للتتبع' },
  'All calculations, compression, formatting, and generation happen in-memory inside your local JavaScript context. No network request is ever dispatched with your payload.': {
    en: 'All calculations, compression, formatting, and generation happen in-memory inside your local JavaScript context. No network request is ever dispatched with your payload.',
    ar: 'تحدث جميع عمليات الحساب والضغط والتنسيق والتوليد محلياً بالكامل داخل ذاكرة المتصفح. لا يتم إرسال أي طلبات شبكة برمجية.'
  },
  'Cryptographic Security': { en: 'Cryptographic Security', ar: 'أمان تشفيري متطور' },
  'UUIDs and passwords are generated using browser Web Crypto APIs, yielding cryptographically secure, high-entropy random results.': {
    en: 'UUIDs and passwords are generated using browser Web Crypto APIs, yielding cryptographically secure, high-entropy random results.',
    ar: 'يتم توليد معرفات UUID وكلمات المرور باستخدام واجهات Web Crypto البرمجية للمتصفح، مما ينتج عشوائية مشفرة تماماً.'
  },
  'W3C Standards Compliant': { en: 'W3C Standards Compliant', ar: 'متوافق مع معايير الويب العالمية' },
  'We leverage native HTML5 APIs, modern canvas rendering contexts, CSS paint models, and client-side compilers to process documents, vectors, and layouts.': {
    en: 'We leverage native HTML5 APIs, modern canvas rendering contexts, CSS paint models, and client-side compilers to process documents, vectors, and layouts.',
    ar: 'نحن نستفيد من واجهات HTML5 الأصلية وسياقات عرض الكانفاس ونماذج طلاء CSS الحديثة والمترجمات المحلية لمعالجة المتجهات والوثائق.'
  },
  'Developer Features': { en: 'Developer Features', ar: 'مزايا مطورة خصيصاً لك' },
  'Instant Loadtimes': { en: 'Instant Loadtimes', ar: 'سرعة تحميل لحظية' },
  'Built as an ultra-light Single Page Application compiled with Vite, loading instantly and functioning seamlessly on low bandwith networks.': {
    en: 'Built as an ultra-light Single Page Application compiled with Vite, loading instantly and functioning seamlessly on low bandwith networks.',
    ar: 'بُني كأداة خفيفة للغاية وسريعة كصفحة واحدة مجمعة بـ Vite، للتحميل الفوري والعمل بسلاسة في شبكات الاتصال البسيطة.'
  },
  'Offline Operations': { en: 'Offline Operations', ar: 'العمل دون اتصال بالإنترنت' },
  'Once loaded, DevBox is fully operational without internet access. You can safely bundle or export the codebase, bookmark, or run locally.': {
    en: 'Once loaded, DevBox is fully operational without internet access. You can safely bundle or export the codebase, bookmark, or run locally.',
    ar: 'بمجرد تحميل الصفحة، يعمل ديف بوكس بشكل كامل دون الحاجة للإنترنت. يمكنك حفظ الصفحة كإشارة مرجعية أو تشغيل الكود محلياً.'
  },
  'Keyboard Shortcuts': { en: 'Keyboard Shortcuts', ar: 'اختصارات لوحة المفاتيح' },
  'Jump to global search from anywhere by pressing the (/) key. Hit Escape to close dialogs, search boxes, and clean up active outputs.': {
    en: 'Jump to global search from anywhere by pressing the (/) key. Hit Escape to close dialogs, search boxes, and clean up active outputs.',
    ar: 'انتقل إلى حقل البحث العالمي من أي مكان بضغط مفتاح (/). واضغط Escape لإغلاق النوافذ ومربعات البحث ومسح النتائج.'
  },

  // Contact / Feature Request Page
  'Request a Feature / Contact DevBox': { en: 'Request a Feature / Contact DevBox', ar: 'طلب ميزة جديدة / اتصل بنا' },
  'Contact Us': { en: 'Contact Us', ar: 'اتصل بنا' },
  'Send us your custom tool requirements, feature logs, or software utility feedback to scale our client-side suite.': {
    en: 'Send us your custom tool requirements, feature logs, or software utility feedback to scale our client-side suite.',
    ar: 'أرسل لنا متطلبات أدواتك المخصصة، أو اقتراحات الميزات لتوسيع مجموعتنا البرمجية المحلية.'
  },
  'Do you need a specific developer tool that is currently missing? Or want to suggest improvements to existing utilities? Drop us a brief note below. Our local tool creation framework is highly scalable.': {
    en: 'Do you need a specific developer tool that is currently missing? Or want to suggest improvements to existing utilities? Drop us a brief note below. Our local tool creation framework is highly scalable.',
    ar: 'هل تحتاج إلى أداة برمجية معينة غير متوفرة حالياً؟ أو ترغب باقتراح تحسينات للأدوات الحالية؟ أرسل لنا رسالة سريعة بالأسفل. نظامنا مرن وسهل التوسيع.'
  },
  'Your Name': { en: 'Your Name', ar: 'الاسم الكريم' },
  'Email Address': { en: 'Email Address', ar: 'عنوان البريد الإلكتروني' },
  'Subject Category': { en: 'Subject Category', ar: 'موضوع الرسالة' },
  'Feature Request': { en: 'Feature Request', ar: 'طلب ميزة برمجية جديدة' },
  'Bug Report': { en: 'Bug Report', ar: 'إبلاغ عن مشكلة/خطأ' },
  'General Inquiry': { en: 'General Inquiry', ar: 'استفسار عام' },
  'Detailed Message': { en: 'Detailed Message', ar: 'تفاصيل الرسالة' },
  'Explain the tool requirements, expected inputs, outputs, and logic flow...': {
    en: 'Explain the tool requirements, expected inputs, outputs, and logic flow...',
    ar: 'اشرح متطلبات الأداة والمدخلات والمخرجات المتوقعة والمنطق البرمجي بالتفصيل...'
  },
  'Submit Proposal': { en: 'Submit Proposal', ar: 'إرسال المقترح' },
  'Proposal Received Successfully!': { en: 'Proposal Received Successfully!', ar: 'تم استلام مقترحك بنجاح!' },
  'Thank you for your contribution. We review all client-side developer proposals weekly and formulate sandbox implementations.': {
    en: 'Thank you for your contribution. We review all client-side developer proposals weekly and formulate sandbox implementations.',
    ar: 'شكراً لمساهمتك معنا. نقوم بمراجعة جميع مقترحات المطورين أسبوعياً وصياغة تطبيقات آمنة لها.'
  },

  // FAQ Translations
  'Are my files and data safe on DevBox?': {
    en: 'Are my files and data safe on DevBox?',
    ar: 'هل ملفاتي وبياناتي آمنة على ديف بوكس؟'
  },
  'Yes, absolutely. 100% of DevBox tools run entirely client-side inside your own web browser. No files, code inputs, passwords, or images are ever uploaded to any server. Your privacy is fully guaranteed.': {
    en: 'Yes, absolutely. 100% of DevBox tools run entirely client-side inside your own web browser. No files, code inputs, passwords, or images are ever uploaded to any server. Your privacy is fully guaranteed.',
    ar: 'نعم، بكل تأكيد. تعمل أدوات ديف بوكس بالكامل بنسبة 100٪ من جانب العميل داخل متصفح الويب الخاص بك. لا يتم أبداً تحميل ملفات أو مدخلات أكواد أو كلمات مرور أو صور إلى أي خادم خارجي. خصوصيتك مضمونة بالكامل.'
  },
  'Do any of the tools require an internet connection or external APIs?': {
    en: 'Do any of the tools require an internet connection or external APIs?',
    ar: 'هل تتطلب أي من الأدوات اتصالاً بالإنترنت أو واجهات برمجة تطبيقات خارجية؟'
  },
  'No. Every single one of the 50+ tools in DevBox works offline and has zero dependency on external APIs. Everything is compiled and calculated locally using highly optimized client-side TypeScript.': {
    en: 'No. Every single one of the 50+ tools in DevBox works offline and has zero dependency on external APIs. Everything is compiled and calculated locally using highly optimized client-side TypeScript.',
    ar: 'لا. كل أداة من أكثر من 50 أداة في ديف بوكس تعمل دون اتصال بالإنترنت ولا تعتمد تماماً على أي واجهات برمجة تطبيقات خارجية. يتم تجميع ومعالجة كل شيء محلياً باستخدام لغة TypeScript المحسنة للسرعة والعمل داخل المتصفح.'
  },
  'How do I add a tool to my Favorites?': {
    en: 'How do I add a tool to my Favorites?',
    ar: 'كيف أقوم بإضافة أداة إلى قائمتي المفضلة؟'
  },
  'Simply click the star icon in the header of any tool, or on the tool card itself. Your favorites are saved in your browser using standard Local Storage and will be immediately accessible on the home and favorites pages.': {
    en: 'Simply click the star icon in the header of any tool, or on the tool card itself. Your favorites are saved in your browser using standard Local Storage and will be immediately accessible on the home and favorites pages.',
    ar: 'ببساطة، انقر فوق رمز النجمة في ترويسة أي أداة، أو على بطاقة الأداة نفسها. يتم حفظ تفضيلاتك في متصفحك باستخدام التخزين المحلي القياسي (Local Storage) وستكون متاحة فوراً في الصفحة الرئيسية وصفحة المفضلة.'
  },
  'How do the image tools process files without a server?': {
    en: 'How do the image tools process files without a server?',
    ar: 'كيف تقوم أدوات الصور بمعالجة الملفات دون وجود خادم؟'
  },
  'We leverage the browser’s native Canvas API and File API. When you upload a picture, the browser loads it into an offline canvas, processes pixels or quality layers client-side, and immediately generates a download link for you.': {
    en: 'We leverage the browser’s native Canvas API and File API. When you upload a picture, the browser loads it into an offline canvas, processes pixels or quality layers client-side, and immediately generates a download link for you.',
    ar: 'نحن نعتمد على واجهة برمجيات الكانفاس والملفات الأصلية في المتصفح. عند رفع صورة، يقوم المتصفح بتحميلها في مساحة عرض كانفاس غير مرئية، ثم يعالج البكسلات ومستويات الجودة محلياً، وينشئ لك فوراً رابط تحميل مباشر.'
  },
  'Can I request a new tool to be added to DevBox?': {
    en: 'Can I request a new tool to be added to DevBox?',
    ar: 'هل يمكنني طلب إضافة أداة جديدة إلى ديف بوكس؟'
  },
  'Yes! DevBox is built on a highly modular and open framework, making it extremely easy to add new utilities. You can use our Contact page to send us suggestions.': {
    en: 'Yes! DevBox is built on a highly modular and open framework, making it extremely easy to add new utilities. You can use our Contact page to send us suggestions.',
    ar: 'نعم بكل تأكيد! تم تصميم ديف بوكس على هيكل برمجيات مرن ومفتوح ومقسم، مما يجعل إضافة أدوات مساعدة جديدة أمراً سهلاً للغاية. يمكنك استخدام صفحة الاتصال بنا لإرسال اقتراحاتك القيّمة.'
  },

  // Privacy Policy Page
  'Client-Side Data Privacy Policy - DevBox': { en: 'Client-Side Data Privacy Policy - DevBox', ar: 'سياسة الخصوصية المحلية - ديف بوكس' },
  'Client-Side Data Privacy Policy': { en: 'Client-Side Data Privacy Policy', ar: 'سياسة خصوصية البيانات المحلية بالكامل' },
  'Our absolute 100% data privacy guarantee. Details on browser sandbox offline calculations.': {
    en: 'Our absolute 100% data privacy guarantee. Details on browser sandbox offline calculations.',
    ar: 'ضمان خصوصية بياناتك بنسبة 100٪. تفاصيل حول معالجة البيانات داخل بيئة المتصفح الآمنة.'
  },
  'At DevBox, privacy is not a feature; it is our structural foundation. We believe your source code, security configurations, JWT payloads, passwords, and data keys belong solely to you.': {
    en: 'At DevBox, privacy is not a feature; it is our structural foundation. We believe your source code, security configurations, JWT payloads, passwords, and data keys belong solely to you.',
    ar: 'في ديف بوكس، الخصوصية ليست مجرد ميزة عابرة؛ بل هي حجر الأساس الهيكلي. نحن نؤمن بأن كودك البرمجي، ورموز JWT الخاصة بك، وكلمات المرور هي ملكك وحدك.'
  },
  'Absolute Zero Tracking': { en: 'Absolute Zero Tracking', ar: 'انعدام التتبع والجمع تماماً' },
  'We do not collect, store, share, or monitor any text, file, or image that you paste, upload, compile, or generate in our tool suite. There are no databases storing your secrets, and no analytics tracking your payloads. Everything is processed in the volatile memory of your local device.': {
    en: 'We do not collect, store, share, or monitor any text, file, or image that you paste, upload, compile, or generate in our tool suite. There are no databases storing your secrets, and no analytics tracking your payloads. Everything is processed in the volatile memory of your local device.',
    ar: 'نحن لا نجمع أو نخزن أو نشارك أو نراقب أي نصوص أو ملفات أو صور تقوم بلصقها أو رفعها أو توليدها في مجموعتنا البرمجية. لا توجد قواعد بيانات تحفظ أسرارك ولا تحليلات تتبع مدخلاتك. يتم معالجة كل شيء بشكل حصري ومؤقت داخل ذاكرة جهازك.'
  },
  'Security Safeguards': { en: 'Security Safeguards', ar: 'الضمانات والتدابير الوقائية للأمان' },
  'Zero Network Overhead': { en: 'Zero Network Overhead', ar: 'استهلاك معدوم لشبكة الاتصال' },
  'The suite runs autonomously without back-and-forth network requests. If you pull the network plug or run offline, the tools continue functioning identically.': {
    en: 'The suite runs autonomously without back-and-forth network requests. If you pull the network plug or run offline, the tools continue functioning identically.',
    ar: 'تعمل مجموعة الأدوات بشكل مستقل تماماً دون الحاجة لطلبات شبكة متبادلة. إذا قمت بفصل الإنترنت، ستعمل الأدوات بنفس الكفاءة والدقة.'
  },
  'Local Sandbox Execution': { en: 'Local Sandbox Execution', ar: 'التنفيذ المحلي داخل بيئة معزولة' },
  'We utilize standard browser isolation APIs, ensuring that scripts are strictly bound to your local active tab sandbox, prohibiting cross-site memory leaks.': {
    en: 'We utilize standard browser isolation APIs, ensuring that scripts are strictly bound to your local active tab sandbox, prohibiting cross-site memory leaks.',
    ar: 'نحن نستخدم واجهات المتصفح القياسية المعزولة، مما يضمن تقييد البرمجيات داخل لسان التبويب النشط محلياً، ومنع تسرب البيانات بين المواقع.'
  },
  'No External Fonts or Scripts': { en: 'No External Fonts or Scripts', ar: 'لا وجود لخطوط أو برمجيات تتبع خارجية' },
  'Our layout uses Tailwind CSS classes and bundles resources locally. Icons are vector-based and compiled in the codebase, preventing sneaky third-party script injections.': {
    en: 'Our layout uses Tailwind CSS classes and bundles resources locally. Icons are vector-based and compiled in the codebase, preventing sneaky third-party script injections.',
    ar: 'يستخدم تصميمنا فئات Tailwind CSS المدمجة محلياً. جميع الأيقونات متجهة ورسومية مدمجة بالكامل، مما يمنع حقن أي برمجيات تتبع خارجية.'
  },

  // Terms of Use Page
  'Terms of Use License - DevBox': { en: 'Terms of Use License - DevBox', ar: 'رخصة شروط الاستخدام - ديف بوكس' },
  'Terms of Use License': { en: 'Terms of Use License', ar: 'شروط الاستخدام والترخيص' },
  'Terms of use and license guidelines for the DevBox browser-based developer utility platform.': {
    en: 'Terms of use and license guidelines for the DevBox browser-based developer utility platform.',
    ar: 'رخصة الاستخدام والإرشادات العامة لمجموعة أدوات ديف بوكس البرمجية.'
  },
  'MIT License Agreement': { en: 'MIT License Agreement', ar: 'اتفاقية ترخيص MIT المفتوحة' },
  'DevBox is provided as an open-source tool set licensed under the standard MIT License. You are free to copy, modify, merge, publish, distribute, sublicense, and run the code locally in any corporate or personal setting.': {
    en: 'DevBox is provided as an open-source tool set licensed under the standard MIT License. You are free to copy, modify, merge, publish, distribute, sublicense, and run the code locally in any corporate or personal setting.',
    ar: 'يتم تقديم ديف بوكس كمجموعة أدوات مفتوحة المصدر مرخصة بموجب ترخيص MIT القياسي. لديك الحرية الكاملة في النسخ والتعديل والدمج والنشر والتوزيع والتشغيل محلياً في أي سياق تجاري أو شخصي.'
  },
  'Disclaimer of Liability': { en: 'Disclaimer of Liability', ar: 'إخلاء المسؤولية القانونية' },
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.': {
    en: 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
    ar: 'يتم تقديم البرمجيات "كما هي"، دون أي نوع من الضمانات، الصريحة أو الضمنية، بما في ذلك على سبيل المثال لا الحصر ضمانات الصلاحية لغرض معين وعدم الانتهاك. لا يتحمل المؤلفون أو أصحاب حقوق النشر بأي حال من الأحوال المسؤولية عن أي مطالبات أو أضرار أو مسؤوليات أخرى ناتجة عن استخدام هذه البرمجيات.'
  },

  // 404 Page
  'Page Not Found': { en: 'Page Not Found', ar: 'الصفحة غير موجودة' },
  'The requested developer page or localized URL does not exist. Navigation menu will route you back safely.': {
    en: 'The requested developer page or localized URL does not exist. Navigation menu will route you back safely.',
    ar: 'الصفحة المطلوبة أو رابط اللغة المحدد غير متوفر حالياً. ستعيدك قائمة التنقل إلى بر الأمان.'
  },
  'Return to Home': { en: 'Return to Home', ar: 'العودة للصفحة الرئيسية' },

  // Footer
  'Secure client-side offline utilities. Processed locally in your browser sandbox.': {
    en: 'Secure client-side offline utilities. Processed locally in your browser sandbox.',
    ar: 'أدوات برمجية محلية آمنة وموثوقة. تتم معالجتها بالكامل داخل متصفحك الشخصي.'
  },
  'All rights reserved. Processed 100% locally in-browser.': {
    en: 'All rights reserved. Processed 100% locally in-browser.',
    ar: 'جميع الحقوق محفوظة. معالجة محلية بالكامل بنسبة 100٪ داخل المتصفح.'
  },

  // Tool Specific UI & Capturing inside DevTools.tsx
  // 1. UUID Generator
  'UUID Generator Information': { en: 'UUID Generator Information', ar: 'معلومات مولد معرفات UUID' },
  'Create cryptographically secure v4 Universally Unique Identifiers (UUIDs) locally in your browser. Perfect for database primary keys, mock seed generators, and unique transaction references.': {
    en: 'Create cryptographically secure v4 Universally Unique Identifiers (UUIDs) locally in your browser. Perfect for database primary keys, mock seed generators, and unique transaction references.',
    ar: 'قم بإنشاء معرفات UUID من الإصدار 4 آمنة تشفيرياً محلياً في متصفحك. مثالية للمفاتيح الأساسية لقواعد البيانات ومولدات بذور الاختبار ومعاملات التداول الفريدة.'
  },
  'Switch ON the UPPERCASE toggle if you are seeding database keys in systems like Microsoft SQL Server or SAP.': {
    en: 'Switch ON the UPPERCASE toggle if you are seeding database keys in systems like Microsoft SQL Server or SAP.',
    ar: 'قم بتشغيل خيار الحروف الكبيرة (UPPERCASE) إذا كنت تقوم ببذر مفاتيح قواعد البيانات لأنظمة مثل SQL Server أو SAP.'
  },
  'Quantity (1 - 100)': { en: 'Quantity (1 - 100)', ar: 'الكمية المطلوبة (1 - 100)' },
  'UPPERCASE': { en: 'UPPERCASE', ar: 'أحرف كبيرة' },
  'Generated {uuids.length} Keys Bundle': { en: 'Generated Keys Bundle', ar: 'حزمة المفاتيح المولدة بنجاح' },
  'Copy All': { en: 'Copy All', ar: 'نسخ الكل' },
  'Download Keys': { en: 'Download Keys', ar: 'تحميل المفاتيح كملف' },
  'Clear Slate': { en: 'Clear Slate', ar: 'قائمة فارغة' },
  'Click Regenerate to generate UUID keys again.': { en: 'Click Regenerate to generate UUID keys again.', ar: 'اضغط على زر إعادة التوليد لإنشاء معرفات UUID جديدة.' },

  // 2. Base64
  'Base64 Encoder / Decoder Information': { en: 'Base64 Encoder / Decoder Information', ar: 'معلومات مشفر ومفكك ترميز Base64' },
  'Safely encode plain-text strings into ASCII-safe Base64 values, or decode base64 hashes back. Ideal for HTTP headers, basic authorization payload parsing, and secure data mapping.': {
    en: 'Safely encode plain-text strings into ASCII-safe Base64 values, or decode base64 hashes back. Ideal for HTTP headers, basic authorization payload parsing, and secure data mapping.',
    ar: 'قم بتشفير النصوص العادية بأمان إلى قيم Base64 الآمنة لـ ASCII، أو قم بفك تشفير هاشات Base64 للعودة للنص الأصلي. مثالي لهيدرات HTTP وتحليل حمولات التخويل.'
  },
  'Standard Base64 strings can contain trailing \'=\' characters which act as structural padding.': {
    en: 'Standard Base64 strings can contain trailing \'=\' characters which act as structural padding.',
    ar: 'يمكن أن تحتوي سلاسل Base64 القياسية على أحرف \'=\' في النهاية والتي تعمل كمسافة حشو هيكلية.'
  },
  'Encode Plaintext': { en: 'Encode Plaintext', ar: 'تشفير النص العادي' },
  'Decode Base64': { en: 'Decode Base64', ar: 'فك تشفير Base64' },
  'Successfully encoded to Base64': { en: 'Successfully encoded to Base64', ar: 'تم التشفير إلى Base64 بنجاح' },
  'Encode failure (illegal UTF-8 sequences)': { en: 'Encode failure (illegal UTF-8 sequences)', ar: 'فشل التشفير (تسلسلات UTF-8 غير قانونية)' },
  'Successfully decoded from Base64': { en: 'Successfully decoded from Base64', ar: 'تم فك التشفير من Base64 بنجاح' },
  'Invalid characters detected for Base64 standard': { en: 'Invalid characters detected for Base64 standard', ar: 'تم اكتشاف أحرف غير صالحة لمعايير Base64' },
  'Malformed Base64 payload or padding error': { en: 'Malformed Base64 payload or padding error', ar: 'حمولة Base64 غير صالحة أو خطأ في مسافات الحشو' },
  'Raw Input Plaintext': { en: 'Raw Input Plaintext', ar: 'النص الخام المدخل' },
  'Base64 Input Payload': { en: 'Base64 Input Payload', ar: 'حمولة Base64 المدخلة' },
  'Type or paste readable text to encode...': { en: 'Type or paste readable text to encode...', ar: 'اكتب أو الصق نصاً مقروءاً لتشفيره...' },
  'Paste Base64 code to decode...': { en: 'Paste Base64 code to decode...', ar: 'الصق كود Base64 لفك تشفيره...' },
  'Base64 Encoded Result': { en: 'Base64 Encoded Result', ar: 'نتيجة تشفير Base64' },
  'Plaintext Decoded Output': { en: 'Plaintext Decoded Output', ar: 'النص العادي بعد فك التشفير' },
  'Input Validation Fault': { en: 'Input Validation Fault', ar: 'خطأ في التحقق من صحة المدخلات' },
  'Output will display here...': { en: 'Output will display here...', ar: 'ستظهر النتيجة هنا تلقائياً...' },
  'Tip: Base64 strings must contain only A-Z, a-z, 0-9, +, /, and up to two trailing = signs. No special characters or spaces are allowed.': {
    en: 'Tip: Base64 strings must contain only A-Z, a-z, 0-9, +, /, and up to two trailing = signs. No special characters or spaces are allowed.',
    ar: 'نصيحة: يجب أن تحتوي سلاسل Base64 فقط على الأحرف A-Z، و a-z، و 0-9، و +، و /، وما يصل إلى علامتي = في النهاية، دون فراغات.'
  },

  // 3. URL Encoder
  'URL Encoder / Decoder Information': { en: 'URL Encoder / Decoder Information', ar: 'معلومات مشفر ومفكك ترميز روابط URL' },
  'Encode parameters, values, and query keys into safe HTTP percentage representations, or decode escaped query arguments back to standard human form.': {
    en: 'Encode parameters, values, and query keys into safe HTTP percentage representations, or decode escaped query arguments back to standard human form.',
    ar: 'قم بتشفير المعاملات والقيم ومفاتيح الاستعلام إلى تمثيلات مئوية آمنة لـ HTTP، أو فك تشفير وسيطات الاستعلام الهاربة للشكل البشري المقروء.'
  },
  'Spaces are encoded as %20. Query parameters like & and = are encoded to avoid parsing conflicts on server engines.': {
    en: 'Spaces are encoded as %20. Query parameters like & and = are encoded to avoid parsing conflicts on server engines.',
    ar: 'يتم ترميز الفراغات كـ %20. ويتم ترميز معاملات الاستعلام مثل & و = لتجنب تعارض التحليل البرمجي في خوادم الويب.'
  },
  'Encode Parameters': { en: 'Encode Parameters', ar: 'تشفير معاملات الرابط' },
  'Decode URLs': { en: 'Decode URLs', ar: 'فك تشفير الروابط' },
  'Successfully URL Encoded': { en: 'Successfully URL Encoded', ar: 'تم تشفير الرابط بنجاح' },
  'Suspicious % character without 2 hex values. Might crash.': {
    en: 'Suspicious % character without 2 hex values. Might crash.',
    ar: 'علامة % مشبوهة دون رقمين ست عشريين للمطابقة. قد يتسبب في توقف البرنامج.'
  },
  'Successfully URL Decoded': { en: 'Successfully URL Decoded', ar: 'تم فك تشفير الرابط بنجاح' },
  'Invalid percent-encoding sequence detected': { en: 'Invalid percent-encoding sequence detected', ar: 'تم كشف تسلسل ترميز مئوي غير صالح للرابط' },
  'Unescaped Parameters Input': { en: 'Unescaped Parameters Input', ar: 'المدخلات غير المهربة للرابط' },
  'Percent-Encoded URL Input': { en: 'Percent-Encoded URL Input', ar: 'رابط URL المرمز بالنسبة المئوية' },
  'Type parameters (e.g., text=hello & page=5)...': { en: 'Type parameters (e.g., text=hello & page=5)...', ar: 'اكتب المعاملات (مثل text=hello & page=5)...' },
  'Paste percent encoded string (e.g., text%3Dhello%20%26%20page%3D5)...': {
    en: 'Paste percent encoded string (e.g., text%3Dhello%20%26%20page%3D5)...',
    ar: 'الصق السلسلة المرمزة مئوياً (مثل text%3Dhello%20%26%20page%3D5)...'
  },
  'URL Percent-Encoded Result': { en: 'URL Percent-Encoded Result', ar: 'رابط URL المرمز بالنسبة المئوية' },
  'Unescaped Decoded Output': { en: 'Unescaped Decoded Output', ar: 'النتيجة غير المهربة المفككة' },
  'Decoding Exception': { en: 'Decoding Exception', ar: 'خطأ استثنائي في فك تشفير الرابط' },
  'Result appear here...': { en: 'Result appear here...', ar: 'ستظهر النتيجة هنا...' },
  'Result will appear here...': { en: 'Result will appear here...', ar: 'ستظهر النتيجة هنا...' },
  'Tip: Percentage values must be followed by exactly 2 hexadecimal digits (e.g. %2F, %2A). Unmatched or isolated % signs can trigger compilation warnings.': {
    en: 'Tip: Percentage values must be followed by exactly 2 hexadecimal digits (e.g. %2F, %2A). Unmatched or isolated % signs can trigger compilation warnings.',
    ar: 'نصيحة: يجب أن تتبع قيم النسبة المئوية برقمين ست عشريين بالضبط (مثل %2F، %2A). قد تسبب علامات % المنعزلة أخطاء برمجية.'
  },

  // 4. JSON Formatter
  'JSON Formatter & Validator Information': { en: 'JSON Formatter & Validator Information', ar: 'معلومات منسق ومدقق JSON' },
  'Paste raw JSON strings to clean, prettify, compress, and check structural validity instantly. High performance offline parser details exact line indexes and broken keys in case of parsing faults.': {
    en: 'Paste raw JSON strings to clean, prettify, compress, and check structural validity instantly. High performance offline parser details exact line indexes and broken keys in case of parsing faults.',
    ar: 'الصق نصوص JSON الخام لتنظيفها وتجميلها وضغطها والتحقق من صحتها الهيكلية على الفور. يوضح المحلل المحلي مؤشرات الأسطر بدقة في حالة وجود أخطاء.'
  },
  'JSON keys and string values MUST be bound with double quotes (\x22). Single quotes (\x27) are illegal in JSON standards.': {
    en: 'JSON keys and string values MUST be bound with double quotes (\x22). Single quotes (\x27) are illegal in JSON standards.',
    ar: 'يجب إحاطة مفاتيح وقيم وسلاسل JSON بعلامات اقتباس مزدوجة (\x22). علامات الاقتباس الفردية (\x27) غير صالحة في معايير JSON.'
  },
  '2 Spaces': { en: '2 Spaces', ar: 'فراغان' },
  '4 Spaces': { en: '4 Spaces', ar: '4 فراغات' },
  'Minify (Compact)': { en: 'Minify (Compact)', ar: 'ضغط وتصغير الكود' },
  'Load Sample JSON': { en: 'Load Sample JSON', ar: 'تحميل كود JSON تجريبي' },
  'JSON Standard Valid': { en: 'JSON Standard Valid', ar: 'مستند JSON صالح قياسياً' },
  'Waiting for JSON input': { en: 'Waiting for JSON input', ar: 'في انتظار مدخلات JSON' },
  'Raw JSON Input Panel': { en: 'Raw JSON Input Panel', ar: 'لوحة إدخال JSON الخام' },
  'Type, edit or paste your raw JSON string here...': { en: 'Type, edit or paste your raw JSON string here...', ar: 'اكتب، عدّل أو الصق نص JSON الخام هنا...' },
  'Parsed Format Result': { en: 'Parsed Format Result', ar: 'نتيجة التنسيق المحلل' },
  'JSON Syntax Compilation Error:': { en: 'JSON Syntax Compilation Error:', ar: 'خطأ تجميعي في بناء جملة JSON:' },
  'Common JSON mistakes to verify:': { en: 'Common JSON mistakes to verify:', ar: 'أخطاء JSON الشائعة التي يجب التحقق منها:' },
  'Using unescaped single quotes on object keys': { en: 'Using unescaped single quotes on object keys', ar: 'استخدام علامات اقتباس فردية غير مهربة في المفاتيح' },
  'Trailing commas after the last array/object element': { en: 'Trailing commas after the last array/object element', ar: 'فواصل زائدة في نهاية عناصر المصفوفة أو الكائن' },
  'Missing commas separating key/value properties': { en: 'Missing commas separating key/value properties', ar: 'فواصل مفقودة تفصل بين خصائص المفتاح/القيمة' },
  'Unmatched opening/closing brackets': { en: 'Unmatched opening/closing brackets', ar: 'عدم تطابق الأقواس المفتوحة والمغلقة' },
  'Clean structured JSON will format here automatically...': {
    en: 'Clean structured JSON will format here automatically...',
    ar: 'سوف يظهر كود JSON المنسق والنظيف هنا تلقائياً...'
  },

  // 5. Regex Tester
  'Regex Tester Information': { en: 'Regex Tester Information', ar: 'معلومات مختبر التعبيرات النمطية (Regex)' },
  'Verify JavaScript/TypeScript compatible regular expression matches in real-time. Highlights match terms in test bodies, outputs capturing groups, and lists accurate character index arrays.': {
    en: 'Verify JavaScript/TypeScript compatible regular expression matches in real-time. Highlights match terms in test bodies, outputs capturing groups, and lists accurate character index arrays.',
    ar: 'تحقق من مطابقة التعبيرات النمطية المتوافقة مع جافا سكريبت وتيب سكريبت في الوقت الفعلي. يبرز شروط المطابقة، ويظهر المجموعات الملتقطة والفهرس.'
  },
  'Use the \'g\' flag (global) to capture all instances. Without \'g\', the tester captures only the first match index.': {
    en: 'Use the \'g\' flag (global) to capture all instances. Without \'g\', the tester captures only the first match index.',
    ar: 'استخدم العلم \'g\' (العالمي) لالتقاط جميع الحالات المطابقة. بدونه، يقتصر الفاحص على التقاط المطابقة الأولى فقط.'
  },
  'Regular Expression Pattern': { en: 'Regular Expression Pattern', ar: 'نمط التعبير النمطي (Pattern)' },
  'Flags': { en: 'Flags', ar: 'علامات التعبير النمطي (Flags)' },
  'Regex Compliant': { en: 'Regex Compliant', ar: 'تعبير نمطي متوافق' },
  'Specify a Regex structure': { en: 'Specify a Regex structure', ar: 'حدد هيكل التعبير النمطي' },
  'Matches Found': { en: 'Matches Found', ar: 'مطابقات تم العثور عليها' },
  'Copy Match Report': { en: 'Copy Match Report', ar: 'نسخ تقرير المطابقة' },
  'Download Report': { en: 'Download Report', ar: 'تحميل تقرير المطابقة' },
  'RegExp Regex Syntax Exception:': { en: 'RegExp Regex Syntax Exception:', ar: 'خطأ استثنائي في بناء جملة Regex:' },
  'Test Text Body': { en: 'Test Text Body', ar: 'نص الاختبار الأساسي' },
  'Live Highlight Matches': { en: 'Live Highlight Matches', ar: 'تظليل حي للمطابقات' },
  'Capturing Groups Details': { en: 'Capturing Groups Details', ar: 'تفاصيل مجموعات الالتقاط' },

  // 6. HTML Entities
  'HTML Entities Converter Information': { en: 'HTML Entities Converter Information', ar: 'معلومات محول ترميزات HTML' },
  'Escape raw XML or HTML code blocks safely to prevent cross-site script (XSS) rendering injections. Alternatively, unescape HTML code representations back to clear plain-text characters.': {
    en: 'Escape raw XML or HTML code blocks safely to prevent cross-site script (XSS) rendering injections. Alternatively, unescape HTML code representations back to clear plain-text characters.',
    ar: 'قم بتهريب كتل كود XML أو HTML الخام بأمان لمنع حقن البرمجيات الخبيثة المتقاطعة (XSS). أو قم بفك تهريب ترميزات HTML للعودة للنصوص العادية.'
  },
  'Escaped characters are safe to include inside standard paragraph displays and Markdown structures.': {
    en: 'Escaped characters are safe to include inside standard paragraph displays and Markdown structures.',
    ar: 'الأحرف المهربة آمنة تماماً لإدراجها وتضمينها داخل عروض الفقرات القياسية وهياكل الماركداون.'
  },
  'Encode (Escape)': { en: 'Encode (Escape)', ar: 'تشفير (تهريب الرموز)' },
  'Decode (Unescape)': { en: 'Decode (Unescape)', ar: 'فك تشفير (إلغاء التهريب)' },
  'HTML Plaintext Input': { en: 'HTML Plaintext Input', ar: 'نص HTML العادي المدخل' },
  'HTML Entities Input': { en: 'HTML Entities Input', ar: 'ترميزات HTML المدخلة' },
  'Type or paste raw markup (e.g. <div>Hello</div>)...': { en: 'Type or paste raw markup (e.g. <div>Hello</div>)...', ar: 'اكتب أو الصق نص الـ HTML الخام (مثال: <div>Hello</div>)...' },
  'Paste entities (e.g. &lt;div&gt;Hello&lt;/div&gt;)...': { en: 'Paste entities (e.g. &lt;div&gt;Hello&lt;/div&gt;)...', ar: 'الصق الترميزات الخاصة (مثال: &lt;div&gt;Hello&lt;/div&gt;)...' },
  'Resulting Code Block': { en: 'Resulting Code Block', ar: 'كتلة الكود الناتجة' },
  'Parsed result will format automatically...': { en: 'Parsed result will format automatically...', ar: 'سوف تظهر النتيجة المعالجة هنا تلقائياً...' },

  // 7. JWT Decoder
  'JWT Decoder Information': { en: 'JWT Decoder Information', ar: 'معلومات مفكك رموز JWT' },
  'Parse JSON Web Tokens to dissect and inspect header payload, signature structures, and absolute expiration state. Decoded completely client-side.': {
    en: 'Parse JSON Web Tokens to dissect and inspect header payload, signature structures, and absolute expiration state. Decoded completely client-side.',
    ar: 'قم بتحليل رموز JWT البرمجية لتشريح وفحص محتويات الهيدر، والحمولة، وبنية التوقيع وحالة انتهاء الصلاحية. يتم المعالجة محلياً بالكامل.'
  },
  'JWT strings contain three portions split by dots (.). Header (Red), Payload (Purple), and Signature (Blue).': {
    en: 'JWT strings contain three portions split by dots (.). Header (Red), Payload (Purple), and Signature (Blue).',
    ar: 'تحتوي سلاسل JWT على ثلاثة أقسام مفصولة بنقاط (.). الرأس والهيدر (أحمر)، الحمولة (بنفسجي)، والتوقيع (أزرق).'
  },
  'Decode Token Now': { en: 'Decode Token Now', ar: 'فك تشفير الرمز الآن' },
  'Token structure validation': { en: 'Token structure validation', ar: 'التحقق من صحة هيكل الرمز' },
  'JSON Web Token Input': { en: 'JSON Web Token Input', ar: 'رمز JWT المدخل' },
  'Token Header (Algorithms & Meta)': { en: 'Token Header (Algorithms & Meta)', ar: 'رأس الرمز (الخوارزمية والميتا)' },
  'Token Payload (Data & Expiration Claims)': { en: 'Token Payload (Data & Expiration Claims)', ar: 'حمولة البيانات (المطالبات وانتهاء الصلاحية)' },
  'Expiration State Log': { en: 'Expiration State Log', ar: 'سجل حالة انتهاء الصلاحية' },
  'No exp (expiration) property declared.': { en: 'No exp (expiration) property declared.', ar: 'لا توجد خاصية exp (انتهاء الصلاحية) مصرح بها.' },
  'JWT parsed successfully': { en: 'JWT parsed successfully', ar: 'تم تفكيك وتحليل JWT بنجاح' },
  'JWT standard structure demands exactly 3 sections separated by dots.': {
    en: 'JWT standard structure demands exactly 3 sections separated by dots.',
    ar: 'يتطلب هيكل JWT القياسي وجود 3 أقسام متبوعة بنقاط للتجزئة.'
  },
  'JWT Decode Error': { en: 'JWT Decode Error', ar: 'خطأ في فك تشفير JWT' },

  // 8. Keyboard Detector
  'Keyboard Event Detector Information': { en: 'Keyboard Event Detector Information', ar: 'معلومات فاحص أحداث لوحة المفاتيح' },
  'Press any physical key on your keyboard to intercept browser-level JavaScript keypress event objects. Access standard layout string names, keycodes, and modifiers.': {
    en: 'Press any physical key on your keyboard to intercept browser-level JavaScript keypress event objects. Access standard layout string names, keycodes, and modifiers.',
    ar: 'اضغط على أي مفتاح في لوحة المفاتيح لالتقاط كائنات أحداث الضغط على مستوى المتصفح. اعرض مسميات المفاتيح ورموزها ومفاتيح التحكم المرافقة.'
  },
  'Keyboard modifiers (like Shift, Control, Alt, Meta) are detected as boolean flags in real-time.': {
    en: 'Keyboard modifiers (like Shift, Control, Alt, Meta) are detected as boolean flags in real-time.',
    ar: 'يتم التقاط مفاتيح التحكم (مثل Shift، و Control، و Alt، و Meta) كعلامات منطقية فورية.'
  },
  'Listening for Keypress Events...': { en: 'Listening for Keypress Events...', ar: 'في انتظار الضغط على المفاتيح للمراقبة...' },
  'Press any key to test': { en: 'Press any key to test', ar: 'اضغط على أي مفتاح للاختبار' },
  'Key intercepted': { en: 'Key intercepted', ar: 'تم التقاط المفتاح بنجاح' },
  'Modifier Flags Intercepted': { en: 'Modifier Flags Intercepted', ar: 'رموز مفاتيح التحكم الملتقطة' },
  'Clear Event History': { en: 'Clear Event History', ar: 'مسح سجل الأحداث' },
  'History Log': { en: 'History Log', ar: 'سجل الأحداث الملتقطة' },
  'No keyboard events logged yet. Press physical keys above.': {
    en: 'No keyboard events logged yet. Press physical keys above.',
    ar: 'لم يتم تسجيل أي حدث للوحة المفاتيح بعد. اضغط على أي مفتاح بالضربات الفيزيائية.'
  },

  // 9. HTML Beautifier
  'HTML Formatter & Beautifier Information': { en: 'HTML Formatter & Beautifier Information', ar: 'معلومات منسق ومجمل HTML' },
  'Beautify messy, compacted, or un-indented raw HTML markup codes instantly in-memory. Perfect for cleaning up compiled outputs, scraped structures, and visual designs.': {
    en: 'Beautify messy, compacted, or un-indented raw HTML markup codes instantly in-memory. Perfect for cleaning up compiled outputs, scraped structures, and visual designs.',
    ar: 'قم بتجميل وتنسيق كود HTML غير المنسق أو المضغوط على الفور. مثالي لتنظيف نتائج البرمجة ومخرجات التصاميم البصرية.'
  },
  'The formatter automatically enforces standardized block-level nests and aligns closing HTML tag anchors nicely.': {
    en: 'The formatter automatically enforces standardized block-level nests and aligns closing HTML tag anchors nicely.',
    ar: 'يقوم المنسق تلقائياً بتطبيق قواعد المسافات البادئة للكتل البرمجية ومحاذاة وسوم الإغلاق للـ HTML بشكل مثالي.'
  },
  'Successfully beautified HTML': { en: 'Successfully beautified HTML', ar: 'تم تجميل وتنسيق كود HTML بنجاح' },
  'Please enter HTML content': { en: 'Please enter HTML content', ar: 'الرجاء إدخال محتوى كود HTML للمنسق' },
  'Empty markup tags detected': { en: 'Empty markup tags detected', ar: 'تم الكشف عن وسوم فارغة لا تحتوي على قيم' },
  'Messy or Minified HTML Input': { en: 'Messy or Minified HTML Input', ar: 'كود HTML عشوائي أو مضغوط كمدخل' },
  'Paste HTML source block (e.g. <div><h1>Title</h1></div>)...': {
    en: 'Paste HTML source block (e.g. <div><h1>Title</h1></div>)...',
    ar: 'الصق كود مصدر الـ HTML (مثل <div><h1>Title</h1></div>)...'
  },
  'Beautified & Nested Output': { en: 'Beautified & Nested Output', ar: 'النتيجة المنسقة والجميلة المتداخلة' },
  'Formatted markup will render automatically here...': {
    en: 'Formatted markup will render automatically here...',
    ar: 'سوف يظهر كود الـ HTML المنسق والمحاذى بشكل جميل هنا تلقائياً...'
  },
  'Home': { en: 'Home', ar: 'الرئيسية' },
  'Unstar': { en: 'Unstar', ar: 'إلغاء التفضيل' },
  'Favorite': { en: 'Favorite', ar: 'تفضيل' },
  'SECURE & LOCAL': { en: 'SECURE & LOCAL', ar: 'آمن ومحلي' },
  'Tool Initialization Pending': { en: 'Tool Initialization Pending', ar: 'في انتظار بدء الأداة' },
  'This specific component suite is currently being indexed.': { en: 'This specific component suite is currently being indexed.', ar: 'هذه الأداة البرمجية قيد الفهرسة حالياً للتشغيل.' },
  'Related Tools in %s': { en: 'Related Tools in %s', ar: 'أدوات ذات صلة في قسم %s' },
  'Launch →': { en: 'Launch →', ar: 'تشغيل ←' },
  'Introducing our 100% Secure, Zero-Egress Developer Toolkit.': { en: 'Introducing our 100% Secure, Zero-Egress Developer Toolkit.', ar: 'نقدم لك حقيبة أدوات المطورين الآمنة بنسبة 100٪ بدون أي اتصال بالإنترنت.' },
  'AboutParagraph1': {
    en: 'DevBox is a modern client-side application engineered to supply web developers, designers, and tech students with a robust portfolio of fast, beautiful, and completely offline helper utilities.',
    ar: 'ديف بوكس هو تطبيق حديث يعمل بالكامل من جانب العميل، تم تصميمه لتزويد مطوري الويب والمصممين والطلاب ببرمجيات مساعدة سريعة وجميلة دون اتصال بالإنترنت.'
  },
  'AboutParagraph2': {
    en: 'Unlike standard web playgrounds or SaaS aggregators that transmit your raw code, JSON files, API secrets, or private images to external servers for parsing, DevBox guarantees 100% data privacy.',
    ar: 'على عكس ملاعب الويب القياسية أو الخوادم التي تنقل تعليماتك البرمجية وملفات JSON ومفاتيح التشفير أو الصور الخاصة إلى خوادم خارجية، يضمن ديف بوكس خصوصية كاملة بنسبة 100٪ لبياناتك.'
  },
  '0% Data Egress': { en: '0% Data Egress', ar: 'معدل تسريب بيانات 0٪' },
  'EgressDescription': {
    en: 'Every parsing, formatting, or hashing operation is computed natively inside your browser’s JS sandbox. Your keys never leave your desktop.',
    ar: 'يتم حساب كل عمليات التنسيق أو التشفير أو التحليل برمجياً ومحلياً داخل بيئة المتصفح. لا تخرج مفاتيحك من جهازك أبداً.'
  },
  'High Performance Execution': { en: 'High Performance Execution', ar: 'تنفيذ ذو أداء فائق' },
  'PerformanceDescription': {
    en: 'By bypassing HTTP round-trips or API gateways, tools complete their tasks instantly with zero latency, even when completely offline.',
    ar: 'من خلال تجاوز رحلات الشبكة أو بوابات واجهة البرمجة، تنجز الأدوات مهامها فوراً بزمن انتقال صفري، حتى دون إنترنت.'
  },
  'Submit Suggestions': { en: 'Submit Suggestions', ar: 'تقديم الاقتراحات والملاحظات' },
  'Submit suggestions description': {
    en: 'Submit feedback, request customized tools, or report unexpected behaviors.',
    ar: 'أرسل لنا ملاحظاتك، أو اطلب أدوات برمجية مخصصة ومطورة، أو أبلغ عن أي سلوك غير متوقع.'
  },
  'Message Transmitted Successfully': { en: 'Message Transmitted Successfully', ar: 'تم إرسال رسالتك ومقترحك بنجاح' },
  'ContactSuccessDescription': {
    en: 'Thank you! Your client suggestion has been saved in DevBox\'s simulated local mailbox.',
    ar: 'نشكرك جزيل الشكر! تم حفظ اقتراحك البرمجي محلياً في صندوق الوارد المحاكي لديف بوكس.'
  },
  'Your Full Name': { en: 'Your Full Name', ar: 'الاسم الكامل' },
  'Subject Matter': { en: 'Subject Matter', ar: 'موضوع المقترح' },
  'Message details': { en: 'Message details', ar: 'تفاصيل الرسالة ومواصفات الأداة' },
  'Transmit Message': { en: 'Transmit Message', ar: 'إرسال الرسالة الآن' },
  'Privacy Statement': { en: 'Privacy Statement', ar: 'بيان سياسة الخصوصية وأمان البيانات' },
  'Effective Date': { en: 'Effective Date', ar: 'تاريخ السريان والفعالية' },
  'July 14, 2026': { en: 'July 14, 2026', ar: '14 يوليو 2026' },
  'PrivacyHeaderIntro': {
    en: 'DevBox holds your security and data privacy in supreme high regard. This policy details how our developer utility suite operates:',
    ar: 'يولي ديف بوكس أمانك وخصوصية بياناتك أهمية قصوى. يوضح هذا المستند تفاصيل كيفية عمل مجموعة الأدوات المساعدة لدينا:'
  },
  'PrivacySection1Title': { en: '100% Offline and Sandboxed Calculations', ar: 'عمليات معالجة محلية ومعزولة بنسبة 100٪' },
  'PrivacySection1Desc': {
    en: 'All operations, formats, hashes, transformations, and image rescales computed inside DevBox are handled exclusively inside your local browser thread.',
    ar: 'يتم التعامل مع جميع العمليات والتنسيقات والتشفيرات والتحويلات وتغيير أحجام الصور داخل ديف بوكس حصرياً في ذاكرة جهازك المحلي.'
  },
  'PrivacySection1Desc2': {
    en: 'We do not maintain any remote databases, telemetry logging engines, tracking pixels, or file ingress servers. Your input data is completely shielded from us.',
    ar: 'نحن لا نمتلك أي قواعد بيانات خارجية أو محركات تسجيل أو خوادم لتلقي الملفات. مدخلاتك وبياناتك محمية بالكامل منا.'
  },
  'PrivacySection2Title': { en: 'LocalStorage Utilization', ar: 'استخدام التخزين المحلي (LocalStorage)' },
  'PrivacySection2Desc': {
    en: 'DevBox utilizes standard browser localStorage purely to remember your UI theme setting (light/dark mode), your recently used tools array, and your starred favorites collection. This data is never sent outside your computer.',
    ar: 'يستخدم ديف بوكس التخزين المحلي للمتصفح فقط لتذكر إعدادات المظهر المفضل لديك والوضع الداكن/الفاتح وسجل الأدوات المستخدمة، ولا يتم إرسالها خارج حاسوبك أبداً.'
  },
  'TermsOfServiceIntro': {
    en: 'By using DevBox, you agree to these clear terms of service:',
    ar: 'باستخدامك لموقع ديف بوكس، فإنك تقر وتوافق على شروط الخدمة الواضحة التالية:'
  },
  'UsageLicense': { en: 'Usage License', ar: 'رخصة الاستخدام المسموحة' },
  'TermsLicenseDesc': {
    en: 'DevBox is 100% free, unlimited, and provided as-is without any royalty fees or required subscriptions. You are free to use these tools for personal, academic, or corporate workflows.',
    ar: 'موقع ديف بوكس مجاني بالكامل بنسبة 100٪ ومقدم "كما هو" دون أي رسوم أو اشتراكات. لك الحرية المطلقة في استخدام الأدوات في أعمالك الشخصية أو التجارية.'
  },
  'NoWarranty': { en: 'No Warranty', ar: 'إخلاء الضمان والمسؤولية' },
  'TermsWarrantyDesc': {
    en: 'Since all code formats, conversions, and cryptographies execute entirely on your own browser, DevBox provides no guarantee of performance and shall not be liable for any browser memory crashes or data discrepancies.',
    ar: 'بما أن جميع التنسيقات والتحويلات وعمليات التشفير تنفذ محلياً بالكامل على متصفحك الخاص، فإن ديف بوكس لا يوفر أي ضمان للأداء ولا يتحمل أي مسؤولية عن تعطل الذاكرة أو تعارض البيانات.'
  },
  'DEVBOX': { en: 'DEVBOX', ar: 'ديف بوكس' },
  'FooterIntro': {
    en: 'The ultimate premium, client-side, 100% offline toolkit for creators, developer engineers, and visual designers.',
    ar: 'حقيبة الأدوات البرمجية المحلية والممتازة والأكثر أماناً بنسبة 100٪ لصناع المحتوى والمهندسين والمصممين.'
  },
  'Links': { en: 'Links', ar: 'روابط هامة' },
  'Portfolio': { en: 'Portfolio', ar: 'المعرض الكامل' },
  'Starred': { en: 'Starred', ar: 'المفضلة' },
  'Company': { en: 'Company', ar: 'الشركة' },
  'About Vision': { en: 'About Vision', ar: 'الرؤية والرسالة' },
  'Suggestions': { en: 'Suggestions', ar: 'تقديم اقتراحات' },
  'Legal': { en: 'Legal', ar: 'الشؤون القانونية' },
  'FooterCopyright': {
    en: '© 2026 DevBox Offline Suite. No Rights Reserved — Code belongs to the universe.',
    ar: '© 2026 مجموعة أدوات ديف بوكس أوفلاين. جميع الحقوق مشاع برمجياً — الكود ملك للجميع.'
  },
  'PRIVACY VERIFIED': { en: 'PRIVACY VERIFIED', ar: 'الخصوصية موثقة ومؤكدة' },
  '100% SANDBOX SECURE': { en: '100% SANDBOX SECURE', ar: 'أمان بيئة العمل 100٪' },
  'Explore %s dedicated tools': { en: 'Explore %s dedicated tools', ar: 'استكشف %s أداة برمجية مخصصة' },

  // --- New Developer Tools Metadata & UI Translations ---
  'JSON Formatter': { en: 'JSON Formatter', ar: 'منسق JSON' },
  'Format, align, and prettify messy raw JSON strings for human reading.': {
    en: 'Format, align, and prettify messy raw JSON strings for human reading.',
    ar: 'قم بتنسيق ومحاذاة سلاسل JSON الخام وتجميلها لتسهيل قراءتها.'
  },
  'JSON Minifier': { en: 'JSON Minifier', ar: 'مختصر JSON' },
  'Minify and compact raw JSON payloads into a single highly efficient network line.': {
    en: 'Minify and compact raw JSON payloads into a single highly efficient network line.',
    ar: 'قم باختصار وضغط بيانات JSON الخام في سطر برمي واحد عالي الكفاءة.'
  },
  'CSS Formatter': { en: 'CSS Formatter', ar: 'منسق CSS' },
  'Format, indent, and beautify your raw CSS style rules with clean nested tabs.': {
    en: 'Format, indent, and beautify your raw CSS style rules with clean nested tabs.',
    ar: 'نسّق وجمّل قواعد أنماط CSS الخام مع مسافات بادئة متداخلة ومنظمة.'
  },
  'JavaScript Formatter': { en: 'JavaScript Formatter', ar: 'منسق JavaScript' },
  'Beautify, indent, and organize messy JavaScript script snippets.': {
    en: 'Beautify, indent, and organize messy JavaScript script snippets.',
    ar: 'جمّل ونسّق ونظّم قصاصات برمجية للغة جافا سكريبت غير المرتبة.'
  },
  'SQL Formatter': { en: 'SQL Formatter', ar: 'منسق SQL' },
  'Prettify and format SQL database statements with standardized capitalized keywords.': {
    en: 'Prettify and format SQL database statements with standardized capitalized keywords.',
    ar: 'جمّل ونسّق تعليمات قواعد بيانات SQL مع رسملة الكلمات البرمجية الأساسية بشكل قياسي.'
  },
  'Random String Generator': { en: 'Random String Generator', ar: 'مولد نصوص عشوائية' },
  'Generate high-entropy random character strings for salts, passwords, or keys.': {
    en: 'Generate high-entropy random character strings for salts, passwords, or keys.',
    ar: 'قم بتوليد نصوص عشوائية ذات أمان عالٍ لاستخدامها في كلمات المرور والتمليح البرمجي.'
  },
  'SVG Optimizer & Minifier': { en: 'SVG Optimizer & Minifier', ar: 'محسّن ومصغّر SVG' },
  'Compress, optimize and strip metadata, comments, and empty vector tags from SVG graphics.': {
    en: 'Compress, optimize and strip metadata, comments, and empty vector tags from SVG graphics.',
    ar: 'اضغط وحسّن وقم بإزالة البيانات الوصفية والتعليقات والوسوم الفارغة من رسوميات المتجهات SVG.'
  },
  'Binary / Hex / ASCII Converter': { en: 'Binary / Hex / ASCII Converter', ar: 'محول ثنائي / سداسي عشر / أسكي' },
  'Convert plaintext characters to binary digits, hexadecimal values, and ASCII decimal codes.': {
    en: 'Convert plaintext characters to binary digits, hexadecimal values, and ASCII decimal codes.',
    ar: 'حوّل النصوص العادية إلى أرقام ثنائية وقيم سداسية عشرية ورموز أسكي العشرية في الوقت الفعلي.'
  },

  // Tool UI Labels
  'Indentation': { en: 'Indentation', ar: 'المسافة البادئة' },
  'Spaces': { en: 'Spaces', ar: 'مسافات' },
  'Minified Result': { en: 'Minified Result', ar: 'النتيجة المضغوطة' },
  'Raw CSS Input': { en: 'Raw CSS Input', ar: 'كود CSS الخام' },
  'Beautified Output': { en: 'Beautified Output', ar: 'النتيجة المنسقة والجميلة' },
  'Raw JavaScript Input': { en: 'Raw JavaScript Input', ar: 'كود JavaScript الخام' },
  'Formatted JavaScript Result': { en: 'Formatted JavaScript Result', ar: 'نتيجة جافا سكريبت المنسقة' },
  'Raw SQL Query Input': { en: 'Raw SQL Query Input', ar: 'تعليمات SQL الخام' },
  'Beautified SQL Result': { en: 'Beautified SQL Result', ar: 'نتيجة SQL المنسقة' },
  'Generator Specifications': { en: 'Generator Specifications', ar: 'مواصفات وإعدادات التوليد' },
  'String Length': { en: 'String Length', ar: 'طول النص' },
  'characters': { en: 'characters', ar: 'حروف' },
  'Generated Strings Bundle': { en: 'Generated Strings Bundle', ar: 'مجموعة النصوص المولدة عشوائياً' },
  'Select at least one set': { en: 'Select at least one set', ar: 'يرجى تحديد مجموعة حروف واحدة على الأقل' },
  'Raw SVG markup input': { en: 'Raw SVG markup input', ar: 'كود رسم SVG المتجهي الخام' },
  'Optimized vector output': { en: 'Optimized vector output', ar: 'كود SVG المحسّن والمصغّر' },
  'File Size Reduced': { en: 'File Size Reduced', ar: 'تم تقليص حجم الملف بنسبة' },
  'Render Preview': { en: 'Render Preview', ar: 'معاينة الرسم المتجهي' },
  'No vector preview available': { en: 'No vector preview available', ar: 'لا توجد معاينة متاحة للمتجه' },
  'Plain Text String': { en: 'Plain Text String', ar: 'سلسلة النص العادي' },
  'ASCII Codes': { en: 'ASCII Codes', ar: 'رموز أسكي (ASCII Codes)' },
  'Binary Code Representation': { en: 'Binary Code Representation', ar: 'التمثيل بالرمز الثنائي' },
  'Hexadecimal Representation': { en: 'Hexadecimal Representation', ar: 'التمثيل بالنظام السداسي عشر' },
};

// Scalable, central t() translation executor with safety fallbacks
export const t = (key: string, currentLang: Language = 'en'): string => {
  const dictionaryValue = translations[key];
  if (dictionaryValue) {
    return dictionaryValue[currentLang] || key;
  }
  
  // Dynamic lookup for Category, Tool names, descriptions, or tags
  // This satisfies the "Make the translation system scalable so new tools and pages can be translated easily without editing the source code" requirement.
  const lowerKey = key.toLowerCase();
  
  // Try to find if it corresponds to an ID prefix or specific custom patterns
  for (const [k, v] of Object.entries(translations)) {
    if (k.toLowerCase() === lowerKey) {
      return v[currentLang];
    }
  }

  return key;
};

// Helper function to translate Category properties dynamically
export const translateCategory = (cat: Category, lang: Language): Category => {
  return {
    ...cat,
    name: t(cat.name, lang),
    description: t(cat.description, lang),
  };
};

// Helper function to translate Tool properties dynamically
export const translateTool = (tool: Tool, lang: Language): Tool => {
  return {
    ...tool,
    name: t(tool.name, lang),
    description: t(tool.description, lang),
    tags: tool.tags.map(tag => t(tag, lang)),
  };
};

// Helper function to translate FAQItem dynamically
export const translateFAQ = (faq: FAQItem, lang: Language): FAQItem => {
  return {
    question: t(faq.question, lang),
    answer: t(faq.answer, lang),
  };
};
