import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Users, Sliders, Database, BookOpen, MessageSquare, Settings, 
  Globe, Shield, Trash2, Eye, Plus, Edit, ToggleLeft, ToggleRight, Check,
  Search, AlertCircle, Save, Info, RefreshCw, Star, Share2, Tag, KeyRound
} from 'lucide-react';
import { getInitialLanguage, t } from '../data/translations';
import { tools, categories } from '../data/toolsData';

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export function AdminPanel({ language }: { language: 'en' | 'ar' }) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tools' | 'categories' | 'blogs' | 'feedback' | 'seo' | 'translations'>('overview');
  
  // Data State managed locally in sync with client tools list, categories, blogs, feedbacks
  const [localTools, setLocalTools] = useState<any[]>(() => {
    const saved = localStorage.getItem('devbox_custom_tools') || localStorage.getItem('devbox_tools');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('devbox_custom_tools', JSON.stringify(tools));
    return tools;
  });

  const [localCats, setLocalCats] = useState<any[]>(() => {
    const saved = localStorage.getItem('devbox_custom_categories');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('devbox_custom_categories', JSON.stringify(categories));
    return categories;
  });

  const [localBlogs, setLocalBlogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('devbox_blog_articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>(() => {
    const saved = localStorage.getItem('devbox_feedbacks');
    if (saved) return JSON.parse(saved);
    const initial: FeedbackMessage[] = [
      {
        id: 'fb-1',
        name: 'Ahmad Al-Qarni',
        email: 'ahmad@qarni.sa',
        subject: 'YAML Converter request',
        message: 'Could you please expand YAML conversion tools so we can parse nested configuration mappings client-side?',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        resolved: false
      }
    ];
    localStorage.setItem('devbox_feedbacks', JSON.stringify(initial));
    return initial;
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('devbox_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Panel Action Forms (Adding/Editing objects)
  const [editingTool, setEditingTool] = useState<any | null>(null);
  const [showToolModal, setShowToolModal] = useState(false);
  const [toolForm, setToolForm] = useState({
    id: '', name: '', description: '', categoryId: 'developer', icon: 'Code', tags: ''
  });

  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({
    titleEn: '', titleAr: '', excerptEn: '', excerptAr: '', contentEn: '', contentAr: '', category: 'Security', tags: ''
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('devbox_site_settings');
    return saved ? JSON.parse(saved) : {
      maintenanceMode: false,
      enableComments: true,
      robotsTxt: "User-agent: *\nDisallow: /admin\nSitemap: https://devbox.io/sitemap.xml",
      seoTitleTemplate: "%s - DevBox Offline Tools Portfolio",
      googleAnalyticsSimKey: "UA-983451-22"
    };
  });

  const [successMsg, setSuccessMsg] = useState('');

  // Save customized lists
  const saveTools = (updated: any[]) => {
    setLocalTools(updated);
    localStorage.setItem('devbox_custom_tools', JSON.stringify(updated));
    localStorage.setItem('devbox_tools', JSON.stringify(updated)); // sync for home
  };

  const saveBlogs = (updated: any[]) => {
    setLocalBlogs(updated);
    localStorage.setItem('devbox_blog_articles', JSON.stringify(updated));
  };

  const saveFeedbacks = (updated: FeedbackMessage[]) => {
    setFeedbacks(updated);
    localStorage.setItem('devbox_feedbacks', JSON.stringify(updated));
  };

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // User Actions
  const deleteUser = (userId: string) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this user?')) return;
    const updated = registeredUsers.filter(u => u.id !== userId);
    setRegisteredUsers(updated);
    localStorage.setItem('devbox_registered_users', JSON.stringify(updated));
    triggerToast(language === 'ar' ? 'تم حذف العضو بنجاح.' : 'User deleted successfully.');
  };

  // Feedback Actions
  const resolveFeedback = (id: string) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, resolved: !f.resolved } : f);
    saveFeedbacks(updated);
    triggerToast(language === 'ar' ? 'تم تحديث حالة الرسالة.' : 'Feedback resolution status updated.');
  };

  const deleteFeedback = (id: string) => {
    if (!window.confirm('Confirm delete suggestion log?')) return;
    const updated = feedbacks.filter(f => f.id !== id);
    saveFeedbacks(updated);
  };

  // Tool Actions (Add / Edit)
  const handleOpenAddTool = () => {
    setEditingTool(null);
    setToolForm({ id: '', name: '', description: '', categoryId: 'developer', icon: 'Code', tags: 'developer, code' });
    setShowToolModal(true);
  };

  const handleOpenEditTool = (tl: any) => {
    setEditingTool(tl);
    setToolForm({
      id: tl.id,
      name: tl.name,
      description: tl.description,
      categoryId: tl.categoryId,
      icon: tl.icon,
      tags: tl.tags.join(', ')
    });
    setShowToolModal(true);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTool) {
      // Edit
      const updated = localTools.map(t => {
        if (t.id === editingTool.id) {
          return {
            ...t,
            name: toolForm.name,
            description: toolForm.description,
            categoryId: toolForm.categoryId,
            icon: toolForm.icon,
            tags: toolForm.tags.split(',').map(tag => tag.trim())
          };
        }
        return t;
      });
      saveTools(updated);
      triggerToast('Tool specifications updated!');
    } else {
      // Create
      const newTool = {
        id: toolForm.id.trim() || 'tool_' + Date.now(),
        name: toolForm.name,
        description: toolForm.description,
        categoryId: toolForm.categoryId,
        icon: toolForm.icon,
        tags: toolForm.tags.split(',').map(tag => tag.trim())
      };
      saveTools([...localTools, newTool]);
      triggerToast('New tool created successfully in Category list!');
    }
    setShowToolModal(false);
  };

  const handleDeleteTool = (toolId: string) => {
    if (!window.confirm('Delete this tool from navigation catalog?')) return;
    const updated = localTools.filter(t => t.id !== toolId);
    saveTools(updated);
    triggerToast('Tool removed successfully.');
  };

  // Blog Actions
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      titleEn: '', titleAr: '', excerptEn: '', excerptAr: '', contentEn: '', contentAr: '', category: 'Security', tags: ''
    });
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (post: any) => {
    setEditingBlog(post);
    setBlogForm({
      titleEn: post.titleEn,
      titleAr: post.titleAr,
      excerptEn: post.excerptEn,
      excerptAr: post.excerptAr,
      contentEn: post.contentEn,
      contentAr: post.contentAr,
      category: post.category,
      tags: post.tags.join(', ')
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      const updated = localBlogs.map(b => {
        if (b.id === editingBlog.id) {
          return {
            ...b,
            ...blogForm,
            tags: blogForm.tags.split(',').map(t => t.trim())
          };
        }
        return b;
      });
      saveBlogs(updated);
      triggerToast('Blog article modified successfully!');
    } else {
      const newBlog = {
        id: 'post-' + Date.now(),
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim()),
        author: {
          name: 'System Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
          bioEn: 'System Administrator and platform operations manager.',
          bioAr: 'مدير النظام ومسؤول إدارة العمليات للمنصة.'
        },
        createdAt: new Date().toISOString(),
        readingTimeMin: Math.max(1, Math.ceil(blogForm.contentEn.split(' ').length / 200)),
        likesCount: 0,
        viewsCount: 0,
        comments: []
      };
      saveBlogs([newBlog, ...localBlogs]);
      triggerToast('New article published successfully to Blog reader!');
    }
    setShowBlogModal(false);
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!window.confirm('Delete blog article permanently?')) return;
    const updated = localBlogs.filter(b => b.id !== blogId);
    saveBlogs(updated);
  };

  // SEO Save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('devbox_site_settings', JSON.stringify(siteSettings));
    triggerToast('Site SEO & crawl metadata configurations saved!');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-fade-in text-start">
      {/* Toast Alert */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3 px-5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700/20 z-50 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Admin block */}
      <div className="bg-slate-50 dark:bg-slate-850 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-base text-slate-850 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ar' ? 'لوحة تحكم المدير الاحترافية' : 'Admin Control Center'}</span>
          </h1>
          <p className="text-[11px] text-slate-450 dark:text-slate-500">
            {language === 'ar' ? 'إدارة الأعضاء، الأدوات، الأبحاث، الرسائل، وإعدادات SEO.' : 'Real-time CRUD management of catalogs, users, feedback lists, and crawlers metadata.'}
          </p>
        </div>
        <span className="px-2.5 py-1 bg-red-500/15 text-red-600 dark:text-red-400 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono">
          MASTER ROOT ADMIN
        </span>
      </div>

      {/* Admin navigation and Content grids */}
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[450px]">
        {/* Navigation Rail */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-1 bg-slate-50/25">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${activeTab === 'overview' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between border ${activeTab === 'users' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </div>
            <span className="text-[9px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">{registeredUsers.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${activeTab === 'tools' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tools CRUD</span>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${activeTab === 'blogs' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog Articles</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between border ${activeTab === 'feedback' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedbacks</span>
            </div>
            {feedbacks.some(f => !f.resolved) && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${activeTab === 'seo' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 border-blue-600/15' : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO Settings</span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="md:col-span-4 p-5 sm:p-6 overflow-x-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">System Dashboard Overview</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Real-time telemetry and resource usage statistics.</p>
              </div>

              {/* Statistics Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Hits</h5>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">452,180</p>
                </div>
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Uptime Index</h5>
                  <p className="text-sm font-black text-emerald-600 mt-1">100.0%</p>
                </div>
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Wiped Storage</h5>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">0.0 Bytes</p>
                </div>
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Sandbox</h5>
                  <p className="text-sm font-black text-blue-500 mt-1">VERIFIED</p>
                </div>
              </div>

              {/* simulated traffic chart using HTML and Tailwind */}
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                <h4 className="text-[11px] font-black uppercase text-slate-500 mb-4 tracking-wider">Browser Egress & Call Logs (Offline Sandbox)</h4>
                <div className="flex items-end justify-between h-24 gap-1.5 pt-2 font-mono">
                  {[20, 45, 12, 60, 34, 90, 80, 5, 45, 95, 40, 100].map((hVal, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: `${hVal}%` }}></div>
                      <span className="text-[8px] text-slate-400 mt-1">{idx + 1}H</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Registered Sandbox User accounts</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">CRUD and edit credentials inside this sandbox session.</p>
              </div>

              {registeredUsers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 border border-dashed rounded-xl">No active user accounts recorded locally.</p>
              ) : (
                <div className="space-y-2">
                  {registeredUsers.map((usr) => (
                    <div key={usr.id} className="p-3 border border-slate-150 dark:border-slate-850 bg-slate-50/30 rounded-2xl flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={usr.avatar} alt={usr.username} className="w-8 h-8 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{usr.username}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{usr.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteUser(usr.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Tools Catalog Manager</h3>
                  <p className="text-[11px] text-slate-450 mt-0.5">Extend, delete, or re-route developer and design utilities.</p>
                </div>
                <button
                  onClick={handleOpenAddTool}
                  className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Tool</span>
                </button>
              </div>

              {/* Tools List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {localTools.map((t) => (
                  <div key={t.id} className="p-2.5 border border-slate-150 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-250">{t.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.id} • {t.categoryId}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEditTool(t)}
                        className="p-1 text-blue-500 hover:bg-blue-500/10 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTool(t.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Blog Manager</h3>
                  <p className="text-[11px] text-slate-450 mt-0.5">Author articles, update resources, and adjust layouts.</p>
                </div>
                <button
                  onClick={handleOpenAddBlog}
                  className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write Article</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {localBlogs.map((b) => (
                  <div key={b.id} className="p-2.5 border border-slate-150 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-250">{b.titleEn}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEditBlog(b)}
                        className="p-1 text-blue-500 hover:bg-blue-500/10 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Feedback suggestions inbox</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Review, resolve, or flag contact suggestions.</p>
              </div>

              <div className="space-y-3">
                {feedbacks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Inbox is empty!</p>
                ) : (
                  feedbacks.map((fb) => (
                    <div key={fb.id} className={`p-3 border rounded-2xl text-xs space-y-1.5 ${fb.resolved ? 'border-slate-150 bg-slate-50/20' : 'border-blue-200 bg-blue-500/5'}`}>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-800 dark:text-slate-250">{fb.subject}</h4>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 font-medium leading-relaxed">{fb.message}</p>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-150/50">
                        <span className="text-[10px] text-slate-400 font-semibold">{fb.name} • {fb.email}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolveFeedback(fb.id)}
                            className="px-2 py-0.5 border border-slate-250 text-[10px] rounded hover:bg-slate-50"
                          >
                            {fb.resolved ? 'Unresolve' : 'Mark Resolved'}
                          </button>
                          <button
                            onClick={() => deleteFeedback(fb.id)}
                            className="px-2 py-0.5 bg-rose-500 text-white text-[10px] rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Metadata & Crawler SEO configurations</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Maintain title templates, sitemaps, canonicals, and crawler rules.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Title Meta Template</label>
                  <input
                    type="text"
                    required
                    value={siteSettings.seoTitleTemplate}
                    onChange={(e) => setSiteSettings({ ...siteSettings, seoTitleTemplate: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Robots.txt contents</label>
                  <textarea
                    rows={3}
                    required
                    value={siteSettings.robotsTxt}
                    onChange={(e) => setSiteSettings({ ...siteSettings, robotsTxt: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-[10px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Meta Configurations
              </button>
            </form>
          )}
        </div>
      </div>

      {/* TOOL MODAL CREATE / EDIT */}
      {showToolModal && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleSaveTool} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <h3 className="font-display font-black text-sm text-slate-800 dark:text-slate-200">
              {editingTool ? 'Edit Tool Parameters' : 'Add Custom Browser Tool'}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unique Tool ID</label>
                <input
                  type="text"
                  required
                  disabled={!!editingTool}
                  placeholder="json-validator-pro"
                  value={toolForm.id}
                  onChange={(e) => setToolForm({ ...toolForm, id: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tool Name</label>
                <input
                  type="text"
                  required
                  placeholder="JSON Pro"
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Deconstruct and inspect..."
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category ID</label>
                  <select
                    value={toolForm.categoryId}
                    onChange={(e) => setToolForm({ ...toolForm, categoryId: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  >
                    {localCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Icon Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Braces"
                    value={toolForm.icon}
                    onChange={(e) => setToolForm({ ...toolForm, icon: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="json, parse, formatter"
                  value={toolForm.tags}
                  onChange={(e) => setToolForm({ ...toolForm, tags: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowToolModal(false)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BLOG MODAL CREATE / EDIT */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleSaveBlog} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto animate-scale-up">
            <h3 className="font-display font-black text-sm text-slate-800 dark:text-slate-200">
              {editingBlog ? 'Modify Published Blog' : 'Author New Blog Article'}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.titleEn}
                    onChange={(e) => setBlogForm({ ...blogForm, titleEn: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title (Arabic)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.titleAr}
                    onChange={(e) => setBlogForm({ ...blogForm, titleAr: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excerpt (English)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.excerptEn}
                    onChange={(e) => setBlogForm({ ...blogForm, excerptEn: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excerpt (Arabic)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.excerptAr}
                    onChange={(e) => setBlogForm({ ...blogForm, excerptAr: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Markdown (English)</label>
                <textarea
                  rows={4}
                  required
                  value={blogForm.contentEn}
                  onChange={(e) => setBlogForm({ ...blogForm, contentEn: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Markdown (Arabic)</label>
                <textarea
                  rows={4}
                  required
                  value={blogForm.contentAr}
                  onChange={(e) => setBlogForm({ ...blogForm, contentAr: e.target.value })}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-mono text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <input
                    type="text"
                    required
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBlogModal(false)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
