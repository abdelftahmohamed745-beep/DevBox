import React, { useState, useEffect } from 'react';
import {
  Search, Star, Moon, Sun, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Clock, AlertTriangle, Menu, X, Mail, Send, ExternalLink, Globe
} from 'lucide-react';
import { categories, tools, faqs, appStats } from './data/toolsData';
import { allToolComponents } from './components/tools';
import { LucideIcon } from './components/LucideIcon';
import { getInitialLanguage, updateUrlForLanguage, t, translateCategory, translateTool, translateFAQ, Language } from './data/translations';

export default function App() {
  // Navigation & Theme State
  const [currentPage, setCurrentPage] = useState<'home' | 'tools' | 'categories' | 'favorites' | 'about' | 'contact' | 'privacy' | 'terms' | 'tool' | '404'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('devbox_theme') === 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Synchronize Language to LocalStorage, document, and URLs
  useEffect(() => {
    localStorage.setItem('devbox_language', language);
    updateUrlForLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle browser back/forward history buttons to sync language state
  useEffect(() => {
    const handlePopState = () => {
      const urlLang = getInitialLanguage();
      if (urlLang !== language) {
        setLanguage(urlLang);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

  // Dynamically translate tools, categories and faqs based on current language
  const translatedCategories = categories.map(cat => translateCategory(cat, language));
  const translatedTools = tools.map(tool => translateTool(tool, language));
  const translatedFaqs = faqs.map(faq => translateFAQ(faq, language));

  // Favorites & Recents State
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('devbox_favorites') || '[]');
  });
  const [recents, setRecents] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('devbox_recents') || '[]');
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Feature Request', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Accordion state for FAQ
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Find tool by ID
  const activeTool = translatedTools.find(t => t.id === selectedToolId);
  const activeToolCategory = activeTool ? translatedCategories.find(c => c.id === activeTool.categoryId) : null;
  const ActiveToolComponent = activeTool ? allToolComponents[activeTool.id] : null;

  // Synchronize Dark Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('devbox_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('devbox_theme', 'light');
    }
  }, [darkMode]);

  // Synchronize Dynamic SEO Metadata (Page Titles & Meta Descriptions) with language and hreflangs
  useEffect(() => {
    let title = t('DevBox - Secure Offline Developer Suite', language);
    let metaDescription = t('DevBox is a secure, browser-based offline toolbox containing over 50+ optimized developer, designer, image, and text utilities processing 100% data locally.', language);

    if (currentPage === 'about') {
      title = t('About DevBox - Strict Zero-Egress Offline Suite', language);
      metaDescription = t('Understand our core philosophy of zero server tracking. Explore how modern browser canvas and crypto APIs allow private data processing.', language);
    } else if (currentPage === 'categories') {
      title = `${t('Browse Categories Portfolio', language)} - DevBox`;
      metaDescription = t('Browse over 11 utility folders including developer, designer, formatting, security, color, and PDF tool sets.', language);
    } else if (currentPage === 'favorites') {
      title = `${t('Your Starred Favorites', language)} - DevBox`;
      metaDescription = t('Keep your most frequently used dev and design utilities starred for instant navigation on load.', language);
    } else if (currentPage === 'contact') {
      title = `${t('Request a Feature / Contact DevBox', language)} - DevBox`;
      metaDescription = t('Send us your custom tool requirements, feature logs, or software utility feedback to scale our client-side suite.', language);
    } else if (currentPage === 'privacy') {
      title = `${t('Client-Side Data Privacy Policy - DevBox', language)}`;
      metaDescription = t('Our absolute 100% data privacy guarantee. Details on browser sandbox offline calculations.', language);
    } else if (currentPage === 'terms') {
      title = `${t('Terms of Use License - DevBox', language)}`;
      metaDescription = t('Terms of use and license guidelines for the DevBox browser-based developer utility platform.', language);
    } else if (currentPage === 'tools') {
      if (selectedCategory) {
        const cat = translatedCategories.find(c => c.id === selectedCategory);
        if (cat) {
          title = `${cat.name} Portfolio - DevBox`;
          metaDescription = `${t('Browse and execute our complete suite of', language)} ${cat.name}: ${cat.description}`;
        }
      } else {
        title = t('Search All 50+ Utilities - DevBox', language);
        metaDescription = t('Search and instant-filter our entire catalog of developer code formatters, JWT parsers, regex matches, and secure hash utilities.', language);
      }
    } else if (currentPage === 'tool' && activeTool) {
      title = `${activeTool.name} - ${t('Free Browser Tool', language)} | DevBox`;
      metaDescription = `${activeTool.description} ${t('Run 100% securely and offline within your browser with instantaneous results.', language)}`;
    }

    document.title = title;

    // Dynamically synchronize meta description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', metaDescription);

    // Multilingual SEO Hreflang Link tags
    if (typeof window !== 'undefined') {
      const cleanPathname = window.location.pathname.replace(/^\/(en|ar)/, '');
      const basePath = cleanPathname === '/' ? '' : cleanPathname;

      let linkEn = document.querySelector('link[hreflang="en"]') as HTMLLinkElement;
      if (!linkEn) {
        linkEn = document.createElement('link');
        linkEn.setAttribute('rel', 'alternate');
        linkEn.setAttribute('hreflang', 'en');
        document.head.appendChild(linkEn);
      }
      linkEn.href = `${window.location.origin}/en${basePath}`;

      let linkAr = document.querySelector('link[hreflang="ar"]') as HTMLLinkElement;
      if (!linkAr) {
        linkAr = document.createElement('link');
        linkAr.setAttribute('rel', 'alternate');
        linkAr.setAttribute('hreflang', 'ar');
        document.head.appendChild(linkAr);
      }
      linkAr.href = `${window.location.origin}/ar${basePath}`;

      let linkDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;
      if (!linkDefault) {
        linkDefault = document.createElement('link');
        linkDefault.setAttribute('rel', 'alternate');
        linkDefault.setAttribute('hreflang', 'x-default');
        document.head.appendChild(linkDefault);
      }
      linkDefault.href = `${window.location.origin}/en${basePath}`;
    }
  }, [currentPage, selectedCategory, selectedToolId, activeTool, language]);

  // Handle Favorites toggle
  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('devbox_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Launch a specific tool
  const launchTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentPage('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track as recently used
    setRecents((prev) => {
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 5);
      localStorage.setItem('devbox_recents', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter tools by search or category
  const getFilteredTools = () => {
    let list = translatedTools;
    if (selectedCategory) {
      list = list.filter(t => t.categoryId === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return list;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: 'Feature Request', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  // Recommendations: 4 related tools from the same category
  const relatedTools = activeTool
    ? translatedTools.filter(t => t.categoryId === activeTool.categoryId && t.id !== activeTool.id).slice(0, 4)
    : [];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-200 dark' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Dynamic Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <button
              onClick={() => { setCurrentPage('home'); setSelectedCategory(null); }}
              className="flex items-center gap-2 px-1 text-start focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  DevBox<span className="text-blue-500 underline decoration-2 underline-offset-4">.</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  {t('OFFLINE SUITE', language)}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => { setCurrentPage('tools'); setSelectedCategory(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${currentPage === 'tools' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent'}`}
              >
                {t('All Tools', language)}
              </button>
              <button
                onClick={() => setCurrentPage('categories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${currentPage === 'categories' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent'}`}
              >
                {t('Categories', language)}
              </button>
              <button
                onClick={() => setCurrentPage('favorites')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${currentPage === 'favorites' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent'}`}
              >
                <Star className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span>{t('Favorites', language)}</span>
                {favorites.length > 0 && (
                  <span className={`${language === 'ar' ? 'mr-1' : 'ml-1'} px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[9px] font-bold`}>
                    {favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${currentPage === 'about' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent'}`}
              >
                {t('About', language)}
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${currentPage === 'contact' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent'}`}
              >
                {t('Contact', language)}
              </button>
            </div>

            {/* Actions / Theme Toggle */}
            <div className="hidden md:flex items-center gap-3">
              {/* Instant Search Bar input */}
              <div className="relative">
                <Search className={`absolute ${language === 'ar' ? 'right-2.5' : 'left-2.5'} top-2 w-3.5 h-3.5 text-slate-400`} />
                <input
                  type="text"
                  placeholder={t('Instant search... (/)', language)}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentPage !== 'tools' && currentPage !== 'tool') setCurrentPage('tools');
                  }}
                  className={`py-1.5 w-44 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500/50 dark:focus:border-blue-500/30 focus:bg-white dark:focus:bg-slate-950 rounded-lg text-xs transition-all focus:w-56 focus:outline-none text-slate-900 dark:text-white ${language === 'ar' ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'}`}
                />
              </div>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold"
                title={language === 'en' ? 'تحويل للغة العربية' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-sans font-semibold">
                  {language === 'en' ? 'العربية' : 'English'}
                </span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer"
                title={language === 'en' ? 'تحويل للغة العربية' : 'Switch to English'}
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1.5 transition-all">
            <button
              onClick={() => { setCurrentPage('tools'); setSelectedCategory(null); setMobileMenuOpen(false); }}
              className="block w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {t('All Tools', language)}
            </button>
            <button
              onClick={() => { setCurrentPage('categories'); setMobileMenuOpen(false); }}
              className="block w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {t('Categories', language)}
            </button>
            <button
              onClick={() => { setCurrentPage('favorites'); setMobileMenuOpen(false); }}
              className="block w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 flex justify-between items-center"
            >
              <span>{t('Favorites', language)}</span>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-650 text-white rounded-full text-xs font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
              className="block w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {t('About', language)}
            </button>
            <button
              onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }}
              className="block w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {t('Contact', language)}
            </button>
          </div>
        )}
      </nav>

      {/* Main Core Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Collapsible Left Sidebar (Category Quick Nav & Recents) */}
          <aside className="lg:col-span-1 space-y-5 hidden lg:block">
            
            {/* Quick Categories list */}
            <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm transition-colors">
              <h3 className="font-display font-bold text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3 block">
                {t('Browse Categories', language)}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentPage('tools'); }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${selectedCategory === null && currentPage === 'tools' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent'}`}
                >
                  <span>{t('All Categories', language)}</span>
                  <span className={`${language === 'ar' ? 'mr-1' : 'ml-1'} px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 dark:text-slate-500 rounded-md font-mono`}>{translatedTools.length}</span>
                </button>
                {translatedCategories.map((cat) => {
                  const catCount = translatedTools.filter(t => t.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentPage('tools'); }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${selectedCategory === cat.id && currentPage === 'tools' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent'}`}
                    >
                      <div className="flex items-center gap-2">
                        <LucideIcon name={cat.icon} className="w-3.5 h-3.5" />
                        <span>{cat.name}</span>
                      </div>
                      <span className={`${language === 'ar' ? 'mr-1' : 'ml-1'} px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 dark:text-slate-500 rounded-md font-mono`}>{catCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recently Used Tools section */}
            {recents.length > 0 && (
              <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm transition-colors">
                <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('Recently Used', language)}</span>
                </div>
                <div className="space-y-1.5">
                  {recents.map((id) => {
                    const tool = translatedTools.find(t => t.id === id);
                    if (!tool) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => launchTool(id)}
                        className="w-full text-start px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LucideIcon name={tool.icon} className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Global Security Policy badge */}
            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-100/40 dark:border-blue-900/20 rounded-2xl p-4 text-center">
              <ShieldCheck className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
              <h4 className="font-display font-bold text-xs text-slate-700 dark:text-slate-250 mb-1">
                {t('Privacy Policy Guaranteed', language)}
              </h4>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                {t('100% Client-side. All processing is processed completely offline inside your browser secure sandbox.', language)}
              </p>
            </div>

          </aside>

          {/* Primary Main Pages Panel */}
          <main className="col-span-1 lg:col-span-3">
            
            {/* 1. HOME PAGE VIEW */}
            {currentPage === 'home' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Premium Hero Section */}
                <section className="text-center py-10 sm:py-14 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-10 relative overflow-hidden transition-all shadow-sm">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full blur-3xl" />

                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold tracking-widest rounded-full uppercase border border-blue-200/30">
                    {t('🔒 Client-Side & 100% Secure', language)}
                  </span>
                  <h1 className="font-display text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 dark:text-white mt-4 max-w-2xl mx-auto leading-none">
                    {t('The Ultimate Swiss-Army Knife for Modern Creators', language)}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed">
                    {t('Over 50+ beautifully designed tools to fast-track your development, designer layouts, image conversion, metadata tags, and calculations — fully offline and serverless.', language)}
                  </p>

                  {/* High Performance Search query input */}
                  <div className="max-w-md mx-auto mt-6 relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-3.5' : 'left-3.5'} top-3.5 w-5 h-5 text-slate-400`} />
                    <input
                      type="text"
                      placeholder={t('Search across 50+ free tools...', language)}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage('tools');
                      }}
                      className={`w-full py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-950 text-sm shadow-inner transition-all text-slate-900 dark:text-white ${language === 'ar' ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                    />
                  </div>
                </section>

                {/* Popular / Featured Tools Grid */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">{t('FEATURED AIDS', language)}</span>
                      <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-0.5">{t('Popular Utilities', language)}</h2>
                    </div>
                    <button
                      onClick={() => setCurrentPage('tools')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('Explore all', language)}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {translatedTools.filter(t => t.featured || t.popular).slice(0, 4).map((tool) => {
                      const category = translatedCategories.find(c => c.id === tool.categoryId);
                      const isFav = favorites.includes(tool.id);
                      return (
                        <div
                          key={tool.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden text-start"
                        >
                          <div className={`absolute top-0 ${language === 'ar' ? 'left-0 -ml-8' : 'right-0 -mr-8'} w-16 h-16 bg-blue-500/5 rounded-full -mt-8 group-hover:scale-150 transition-transform`}></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                              <LucideIcon name={tool.icon} className="w-5 h-5" />
                            </div>
                            <button
                              onClick={() => toggleFavorite(tool.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer text-slate-400 hover:text-amber-500"
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                            </button>
                          </div>
                          <div className="relative z-10">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest block mb-1">
                              {category?.name.toUpperCase()}
                            </span>
                            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <button
                            onClick={() => launchTool(tool.id)}
                            className="w-full py-1.5 bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/40 dark:border-slate-800/60 relative z-10"
                          >
                            <span>{t('Launch Tool', language)}</span>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Popular Categories Overview */}
                <section className="space-y-4">
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white text-start">{t('Browse by Category', language)}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {translatedCategories.map((cat) => {
                      const count = translatedTools.filter(t => t.categoryId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.id); setCurrentPage('tools'); }}
                          className="bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-start group transition-all cursor-pointer relative overflow-hidden"
                        >
                          <div className={`absolute top-0 ${language === 'ar' ? 'left-0 -ml-8' : 'right-0 -mr-8'} w-16 h-16 bg-blue-500/5 rounded-full -mt-8 group-hover:scale-150 transition-transform`}></div>
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors relative z-10">
                            <LucideIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                          <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors relative z-10">
                            {cat.name}
                          </h3>
                          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1 block relative z-10">
                            {count} {t('Tools registered', language)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Statistics Grid */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-center">
                    <span className="text-2xl sm:text-3.5xl font-black font-display text-blue-600 dark:text-blue-400 tracking-tight">{appStats.totalTools}+</span>
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 block mt-0.5 uppercase">{t('FREE WEB TOOLS', language)}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl sm:text-3.5xl font-black font-display text-blue-600 dark:text-blue-400 tracking-tight">{appStats.totalCategories}</span>
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 block mt-0.5 uppercase">{t('CATEGORIES', language)}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl sm:text-3.5xl font-black font-display text-blue-600 dark:text-blue-400 tracking-tight">100%</span>
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 block mt-0.5 uppercase">{t('LOCAL PRIVACY', language)}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl sm:text-3.5xl font-black font-display text-blue-600 dark:text-blue-400 tracking-tight">{appStats.uptime}</span>
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 block mt-0.5 uppercase">{t('BROWSER UPTIME', language)}</span>
                  </div>
                </section>

                {/* Frequently Asked Questions */}
                <section className="space-y-4">
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white text-start">{t('Frequently Asked Questions', language)}</h2>
                  <div className="space-y-3 text-start">
                    {translatedFaqs.map((faq, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                          className="w-full text-start p-4 flex justify-between items-center text-xs font-bold font-display text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <span className="text-blue-500 font-mono text-base">{faqOpenIndex === idx ? '−' : '+'}</span>
                        </button>
                        {faqOpenIndex === idx && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850/60 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* 2. ALL TOOLS / SEARCH FILTER PAGE */}
            {currentPage === 'tools' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Search / Filter Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="text-start">
                    <h1 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                      {selectedCategory ? `${translatedCategories.find(c => c.id === selectedCategory)?.name}` : t('All Tools Portfolio', language)}
                    </h1>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5 uppercase">
                      {getFilteredTools().length} {t('matching tools', language)}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-2.5' : 'left-2.5'} top-2.5 w-3.5 h-3.5 text-slate-400`} />
                    <input
                      type="text"
                      placeholder={t('Filter by keyword...', language)}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 focus:border-blue-500/50 rounded-lg text-xs w-full sm:w-48 outline-none transition-all text-slate-900 dark:text-white ${language === 'ar' ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'}`}
                    />
                  </div>
                </div>

                {/* Grid Lists of matching tools */}
                {getFilteredTools().length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" />
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">{t('No Matching Tools Found', language)}</h3>
                    <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">{t('Try refining your keyword queries, or select another category side navigation.', language)}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredTools().map((tool) => {
                      const cat = translatedCategories.find(c => c.id === tool.categoryId);
                      const isFav = favorites.includes(tool.id);
                      return (
                        <div
                          key={tool.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden text-start"
                        >
                          <div className={`absolute top-0 ${language === 'ar' ? 'left-0 -ml-8' : 'right-0 -mr-8'} w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                              <LucideIcon name={tool.icon} className="w-5 h-5" />
                            </div>
                            <button
                              onClick={() => toggleFavorite(tool.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer text-slate-400 hover:text-amber-500"
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                            </button>
                          </div>
                          <div className="relative z-10">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest block mb-1 uppercase">
                              {cat?.name}
                            </span>
                            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <button
                            onClick={() => launchTool(tool.id)}
                            className="w-full py-1.5 bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/40 dark:border-slate-800/60 relative z-10"
                          >
                            <span>{t('Launch Tool', language)}</span>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* 3. CATEGORIES INDEX PAGE */}
            {currentPage === 'categories' && (
              <div className="space-y-6 animate-fade-in text-start">
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('Browse Categories Portfolio', language)}</h1>
                  <p className="text-xs text-slate-400 mt-1">{t('Select from our 11 clusters to access optimized developer tools.', language)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {translatedCategories.map((cat) => {
                    const count = translatedTools.filter(t => t.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setCurrentPage('tools'); }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-start shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden"
                      >
                        <div className={`absolute top-0 ${language === 'ar' ? 'left-0 -ml-8' : 'right-0 -mr-8'} w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
                        <div className="relative z-10">
                          <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                            <LucideIcon name={cat.icon} className="w-5 h-5" />
                          </div>
                          <h3 className="font-display font-bold text-base text-slate-850 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-4 block relative z-10">
                          {t('Explore %s dedicated tools', language).replace('%s', count.toString())}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. FAVORITES VIEW PAGE */}
            {currentPage === 'favorites' && (
              <div className="space-y-6 animate-fade-in text-start">
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('My Starred Favorites', language)}</h1>
                  <p className="text-xs text-slate-400 mt-1">{t('Quick-access utilities saved locally in your current browser session.', language)}</p>
                </div>

                {favorites.length === 0 ? (
                  <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <Star className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">{t('No Favorites Starred Yet', language)}</h3>
                    <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">{t('To add any tool, click the star icon in the header or in lists previews.', language)}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((favId) => {
                      const tool = translatedTools.find(t => t.id === favId);
                      if (!tool) return null;
                      const cat = translatedCategories.find(c => c.id === tool.categoryId);
                      return (
                        <div
                          key={tool.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden text-start"
                        >
                          <div className={`absolute top-0 ${language === 'ar' ? 'left-0 -ml-8' : 'right-0 -mr-8'} w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                              <LucideIcon name={tool.icon} className="w-5 h-5" />
                            </div>
                            <button
                              onClick={() => toggleFavorite(tool.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer text-amber-500"
                            >
                              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                            </button>
                          </div>
                          <div className="relative z-10">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest block mb-1 uppercase">
                              {cat?.name}
                            </span>
                            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <button
                            onClick={() => launchTool(tool.id)}
                            className="w-full py-1.5 bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/40 dark:border-slate-800/60 relative z-10"
                          >
                            <span>{t('Launch Tool', language)}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. INDIVIDUAL TOOL VIEW PAGE */}
            {currentPage === 'tool' && activeTool && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Tool Meta / Title Block */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-1">
                      <button onClick={() => setCurrentPage('home')} className="hover:underline">{t('Home', language)}</button>
                      <span>/</span>
                      <button onClick={() => { setSelectedCategory(activeTool.categoryId); setCurrentPage('tools'); }} className="hover:underline">
                        {t(activeToolCategory?.name || '', language)}
                      </button>
                    </div>

                    <h1 className="font-display font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                      <LucideIcon name={activeTool.icon} className="w-5 h-5 text-blue-500" />
                      <span>{t(activeTool.name, language)}</span>
                    </h1>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-lg mt-0.5">
                      {t(activeTool.description, language)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => toggleFavorite(activeTool.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-355"
                    >
                      <Star className={`w-3.5 h-3.5 ${favorites.includes(activeTool.id) ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                      <span>{favorites.includes(activeTool.id) ? t('Unstar', language) : t('Favorite', language)}</span>
                    </button>
                    <span className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl text-[10px] font-bold border border-emerald-500/10 flex items-center gap-1 uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t('SECURE & LOCAL', language)}</span>
                    </span>
                  </div>
                </div>

                {/* Main Interactive Tool Render Container */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm min-h-[220px]">
                  {ActiveToolComponent ? (
                    <ActiveToolComponent />
                  ) : (
                    <div className="p-8 text-center">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <h4 className="font-display font-bold text-sm">{t('Tool Initialization Pending', language)}</h4>
                      <p className="text-xs text-neutral-400 mt-1">{t('This specific component suite is currently being indexed.', language)}</p>
                    </div>
                  )}
                </div>

                {/* Related Recommended Tools Section */}
                {relatedTools.length > 0 && (
                  <section className="space-y-4 pt-4">
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white">
                      {t('Related Tools in %s', language).replace('%s', t(activeToolCategory?.name || '', language))}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {relatedTools.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => launchTool(rel.id)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm text-left group hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
                          <div className="relative z-10">
                            <LucideIcon name={rel.icon} className="w-4 h-4 text-blue-500 mb-2" />
                            <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                              {t(rel.name, language)}
                            </h4>
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 mt-2 block uppercase font-mono relative z-10">{t('Launch →', language)}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            )}

            {/* 6. ABOUT VISION PAGE */}
            {currentPage === 'about' && (
              <div className="space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('About DevBox', language)}</h1>
                  <p className="text-xs text-slate-400 mt-1">{t('Introducing our 100% Secure, Zero-Egress Developer Toolkit.', language)}</p>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed font-medium">
                  <p>
                    <strong>{t('DEVBOX', language)}</strong> {t('AboutParagraph1', language)}
                  </p>
                  <p>
                    {t('AboutParagraph2', language)}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">{t('0% Data Egress', language)}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('EgressDescription', language)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">{t('High Performance Execution', language)}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('PerformanceDescription', language)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONTACT / FEEDBACK PAGE */}
            {currentPage === 'contact' && (
              <div className="space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('Submit Suggestions', language)}</h1>
                  <p className="text-xs text-slate-400 mt-1">{t('Submit suggestions description', language)}</p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="font-display font-bold text-sm">{t('Message Transmitted Successfully', language)}</h3>
                    <p className="text-xs">{t('ContactSuccessDescription', language)}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{t('Your Full Name', language)}</span>
                        <input
                          required
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{t('Email Address', language)}</span>
                        <input
                          required
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{t('Subject Matter', language)}</span>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-xs font-bold text-slate-800 dark:text-slate-200"
                      >
                        <option>{t('Feature Request', language)}</option>
                        <option>{t('Bug Report', language)}</option>
                        <option>{t('General Praise', language)}</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{t('Message details', language)}</span>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 dark:text-slate-100"
                      />
                    </label>

                    <button type="submit" className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer">
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('Transmit Message', language)}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 8. PRIVACY POLICY */}
            {currentPage === 'privacy' && (
              <div className="space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('Privacy Statement', language)}</h1>
                <div className="text-xs text-slate-500 dark:text-slate-450 space-y-4 leading-relaxed font-medium">
                  <p><strong>{t('Effective Date', language)}: {t('July 14, 2026', language)}</strong></p>
                  <p>
                    {t('PrivacyHeaderIntro', language)}
                  </p>
                  <h3 className="font-display font-bold text-slate-850 dark:text-white text-sm">{t('PrivacySection1Title', language)}</h3>
                  <p>
                    {t('PrivacySection1Desc', language)}
                  </p>
                  <p>
                    {t('PrivacySection1Desc2', language)}
                  </p>
                  <h3 className="font-display font-bold text-slate-855 dark:text-white text-sm">{t('PrivacySection2Title', language)}</h3>
                  <p>
                    {t('PrivacySection2Desc', language)}
                  </p>
                </div>
              </div>
            )}

            {/* 9. TERMS OF SERVICE */}
            {currentPage === 'terms' && (
              <div className="space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{t('Terms of Service', language)}</h1>
                <div className="text-xs text-slate-500 dark:text-slate-450 space-y-4 leading-relaxed font-medium">
                  <p><strong>{t('Effective Date', language)}: {t('July 14, 2026', language)}</strong></p>
                  <p>
                    {t('TermsOfServiceIntro', language)}
                  </p>
                  <h3 className="font-display font-bold text-slate-855 dark:text-white text-sm">{t('UsageLicense', language)}</h3>
                  <p>
                    {t('TermsLicenseDesc', language)}
                  </p>
                  <h3 className="font-display font-bold text-slate-855 dark:text-white text-sm">{t('NoWarranty', language)}</h3>
                  <p>
                    {t('TermsWarrantyDesc', language)}
                  </p>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* Unified Professional Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-12 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-display font-black text-sm tracking-tight text-slate-800 dark:text-white">
                  {t('DEVBOX', language)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs">
                {t('FooterIntro', language)}
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">{t('Links', language)}</h4>
              <ul className="space-y-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400">
                <li><button onClick={() => { setCurrentPage('tools'); setSelectedCategory(null); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Portfolio', language)}</button></li>
                <li><button onClick={() => setCurrentPage('categories')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Categories', language)}</button></li>
                <li><button onClick={() => setCurrentPage('favorites')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Starred', language)}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">{t('Company', language)}</h4>
              <ul className="space-y-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400">
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('About Vision', language)}</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Suggestions', language)}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">{t('Legal', language)}</h4>
              <ul className="space-y-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400">
                <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Privacy Statement', language)}</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left">{t('Terms of Service', language)}</button></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
              {t('FooterCopyright', language)}
            </span>
            <div className="flex gap-2.5 items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
              <span>● {t('PRIVACY VERIFIED', language)}</span>
              <span>● {t('100% SANDBOX SECURE', language)}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
