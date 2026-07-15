import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, User, Share2, MessageSquare, ArrowRight, 
  Search, Tag, ChevronLeft, Link2, Send, Heart, Eye, ThumbsUp, Check
} from 'lucide-react';
import { getInitialLanguage, t } from '../data/translations';

export interface BlogPost {
  id: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bioEn: string;
    bioAr: string;
  };
  createdAt: string;
  readingTimeMin: number;
  likesCount: number;
  viewsCount: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

const PRESET_ARTICLES: BlogPost[] = [
  {
    id: 'post-1',
    titleEn: 'Why Modern Web Development Benefits From 100% Offline Sandboxes',
    titleAr: 'لماذا تستفيد بيئات العمل الحديثة من الصناديق الآمنة غير المتصلة بالإنترنت 100٪',
    excerptEn: 'Learn how zero-egress tools preserve proprietary source code, optimize CPU execution times, and guard private data from tracking.',
    excerptAr: 'تعرف على كيفية حفاظ الأدوات الخالية من الخروج على كود المصدر الخاص، وتحسين أوقات معالجة المعالجات، وحماية خصوصية بياناتك.',
    contentEn: `In modern software engineering, web application security and proprietary source code protection represent vital assets. When developers utilize online formatters, decoders, or converters, they routinely paste highly confidential API keys, JWT access payloads, and production database dumps.

This article details why browser sandbox environments change the paradigm:
1. **0% Data Leakage**: Calculations remain exclusively inside the browser runtime.
2. **Instant Performance**: No network overhead, socket delays, or payload handshakes.
3. **True Security Compliance**: Security officers can safely whitelist 100% offline utilities knowing that egress is architecturally impossible.

By running decoders locally, organizations adhere to ISO 27001 guidelines without compromising programmer productivity.`,
    contentAr: `في هندسة البرمجيات الحديثة، يمثل أمن تطبيقات الويب وحماية الكود المصدري أصولاً حيوية. عندما يستخدم المطورون المنسقات أو أجهزة فك التشفير عبر الإنترنت، فإنهم يعرضون مفاتيح API الحساسة وحمولات JWT ومقاطع قواعد البيانات لخطر التسريب.

يستعرض هذا المقال بالتفصيل أهمية بيئات العمل الآمنة والمنفصلة:
1. **تجنب تسريب البيانات نهائياً**: تظل الحسابات حصرياً في ذاكرة المتصفح النشط.
2. **أداء فوري فائق**: لا توجد تكاليف شبكة أو تأخيرات في المقابس أو مصافحات بيانات.
3. **امتثال أمني حقيقي**: يمكن لضباط الأمن السماح للبرامج بالعمل مع ثقة كاملة باستحالة تسريب البيانات.

من خلال تشغيل المعالجة محلياً، تلتزم المؤسسات بإرشادات ISO 27001 دون التأثير على إنتاجية المطورين.`,
    category: 'Security',
    tags: ['Sandbox', 'Privacy', 'Compliance'],
    author: {
      name: 'Yousef Al-Masri',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
      bioEn: 'Principal Cryptography Engineer with a focus on web application sandboxing standards.',
      bioAr: 'مهندس تشفير رئيسي يركز على معايير بيئات العمل الآمنة وتطبيقات الويب.'
    },
    createdAt: '2026-07-01T10:00:00Z',
    readingTimeMin: 4,
    likesCount: 148,
    viewsCount: 1240,
    comments: [
      {
        id: 'c1',
        authorName: 'Ahmad Al-Harbi',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
        content: 'Excellent insights! This tool helps our developer team stay completely compliant with our strict internal privacy constraints.',
        createdAt: '2026-07-02T14:30:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    titleEn: 'Decoding JSON Web Tokens (JWT) Safely Without Leaking Secret Claims',
    titleAr: 'فك ترميز كود JSON Web Tokens (JWT) بأمان دون تسريب المطالبات السرية',
    excerptEn: 'A deep dive into how online JWT decoders expose cryptographic parameters and user identities to proxy servers, and how local decoding mitigates risks.',
    excerptAr: 'تحليل عميق لكيفية تعرض أدوات فك ترميز JWT الخارجية للبيانات والمطالبات السرية، وكيف يحمي فك الترميز المحلي الحسابات.',
    contentEn: `Every day, millions of security engineers and full-stack developers decode authorization tokens to inspect audience details, user IDs, and permissions. However, pasting keys into external sites is a major breach hazard.

### How local decoding saves the day:
When using a secure local sandbox tool, the parsing occurs purely in client-side JavaScript memory:
- **No server traffic**: The JWT is split and converted back into base64 characters with a JSON parser locally.
- **Crypto keys protection**: Private variables and verification tokens stay behind browser walls.
- **Speed**: Renders the header and claims instantly, making development cycles smoother.

Always prefer offline decoders when debugging OAuth flows or verifying authorization claims in your terminal or web tools.`,
    contentAr: `يومياً، يقوم الملايين من مهندسي الأمن ومطوري الويب بفك ترميز رموز المصادقة لفحص تفاصيل الجلسات وهويات المستخدمين. ومع ذلك، فإن لصق هذه الرموز في مواقع خارجية يشكل خطراً حقيقياً.

### كيف ينقذ فك الترميز المحلي الموقف:
عند استخدام أداة Sandbox المحلية، يتم التحليل بالكامل في ذاكرة المتصفح الخاصة بك:
- **منع انتقال البيانات عبر الويب**: يتم تفكيك JWT وتحويله باستخدام محلل JSON محلياً دون أي استدعاء خارجي.
- **حماية مفاتيح التشفير**: تظل المتغيرات الخاصة ورموز التحقق خلف جدران المتصفح الآمنة.
- **سرعة فائقة**: يقوم بعرض البيانات وتفاصيل المطالبات في لمح البصر.

يفضل دائماً استخدام أجهزة فك تشفير غير متصلة بالإنترنت عند تصحيح تدفقات OAuth أو التحقق من مطالبات الأذونات.`,
    category: 'Developer Tools',
    tags: ['JWT', 'Cryptography', 'Authorization'],
    author: {
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
      bioEn: 'Security analyst, technical writer, and OAuth protocol expert.',
      bioAr: 'محللة أمن برمجيات، كاتبة تقنية، وخبير بروتوكول OAuth.'
    },
    createdAt: '2026-07-05T12:00:00Z',
    readingTimeMin: 3,
    likesCount: 95,
    viewsCount: 890,
    comments: []
  },
  {
    id: 'post-3',
    titleEn: 'Advanced Design Systems: Mastering Soft Tactile Neumorphism',
    titleAr: 'أنظمة التصميم المتقدمة: احتراف نمط النيومورفيزم الناعم والملموس',
    excerptEn: 'Mastering shadows and highlights layout constraints in modern UI systems to build responsive interfaces.',
    excerptAr: 'احتراف تنسيق الظلال واللمسات المضيئة في واجهات المستخدم الحديثة لبناء لوحات متكاملة ومتناسقة.',
    contentEn: `Neumorphism (soft UI) has emerged as an evocative and tactile design framework. Unlike flat design, neumorphism pairs subtle outer shadows with matching highlights to make items appear extruded or recessed from the page canvas.

### The CSS formula:
To design perfect neumorphic surfaces, you must maintain absolute coordinates:
- The background color must match the container.
- Use a soft drop shadow on the bottom right (e.g. \`box-shadow: 8px 8px 16px #bebebe\`).
- Use a crisp white highlight on the top left (e.g. \`box-shadow: -8px -8px 16px #ffffff\`).

By adjusting blur and inset factors, developers build soft, interactive panels that react dynamically to mouse presses.`,
    contentAr: `برز تصميم النيومورفيزم (واجهات الاستخدام الناعمة) كإطار تصميم مميز يعطي إحساساً بالملمس والعمق البصري. بخلاف التصميم المسطح، يزاوج النيومورفيزم بين الظلال واللمسات المضيئة لجعل الصناديق تبدو بارزة أو غائرة.

### صيغة CSS المثالية:
لتصميم أسطح نيومورفية مثالية، يجب مراعاة المبادئ الأساسية:
- يجب أن يكون لون الخلفية مطابقاً تماماً للون الحاوية.
- استخدم ظلاً ناعماً في الركن الأيمن السفلي.
- استخدم ضوءاً أبيض ناصعاً في الركن الأيسر العلوي.

من خلال تعديل عوامل التمويه والبروز، يصنع المطورون واجهات أنيقة ومثيرة تتفاعل ديناميكياً مع حركات الفأرة والنقرات.`,
    category: 'Designers',
    tags: ['CSS', 'Neumorphism', 'Design-System'],
    author: {
      name: 'Rami Mansour',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
      bioEn: 'UX Architect specializing in modern styling presets and CSS layouts.',
      bioAr: 'مهندس تجربة مستخدم متخصص في أنساق التنسيق الحديثة ومخططات CSS.'
    },
    createdAt: '2026-07-10T15:00:00Z',
    readingTimeMin: 5,
    likesCount: 210,
    viewsCount: 1650,
    comments: []
  }
];

export interface BlogSystemProps {
  language: 'en' | 'ar';
}

export function BlogSystem({ language }: BlogSystemProps) {
  // Articles local state (persisted to localStorage)
  const [articles, setArticles] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('devbox_blog_articles');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('devbox_blog_articles', JSON.stringify(PRESET_ARTICLES));
    return PRESET_ARTICLES;
  });

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('devbox_liked_posts') || '[]');
  });

  // Comment submission form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync likes list to storage
  useEffect(() => {
    localStorage.setItem('devbox_liked_posts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const activePost = articles.find(a => a.id === activePostId);

  // Categories list
  const categoriesList = Array.from(new Set(articles.map(a => a.category)));
  // Tags list
  const tagsList = Array.from(new Set(articles.flatMap(a => a.tags)));

  // Filter and search articles
  const filteredArticles = articles.filter(a => {
    const title = language === 'ar' ? a.titleAr : a.titleEn;
    const excerpt = language === 'ar' ? a.excerptAr : a.excerptEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || a.category === selectedCategory;
    const matchesTag = !selectedTag || a.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Increment views count on opening a post
  const openPost = (id: string) => {
    const updated = articles.map(a => {
      if (a.id === id) {
        return { ...a, viewsCount: a.viewsCount + 1 };
      }
      return a;
    });
    setArticles(updated);
    localStorage.setItem('devbox_blog_articles', JSON.stringify(updated));
    setActivePostId(id);
    setCommentAuthor('');
    setCommentContent('');
  };

  // Like Toggle
  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(p => p !== id));
      const updated = articles.map(a => {
        if (a.id === id) {
          return { ...a, likesCount: Math.max(0, a.likesCount - 1) };
        }
        return a;
      });
      setArticles(updated);
      localStorage.setItem('devbox_blog_articles', JSON.stringify(updated));
    } else {
      setLikedPosts([...likedPosts, id]);
      const updated = articles.map(a => {
        if (a.id === id) {
          return { ...a, likesCount: a.likesCount + 1 };
        }
        return a;
      });
      setArticles(updated);
      localStorage.setItem('devbox_blog_articles', JSON.stringify(updated));
    }
  };

  // Handle write comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePostId || !commentAuthor.trim() || !commentContent.trim()) return;

    const newComment: BlogComment = {
      id: 'comm_' + Date.now(),
      authorName: commentAuthor,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
      content: commentContent,
      createdAt: new Date().toISOString()
    };

    const updated = articles.map(a => {
      if (a.id === activePostId) {
        return {
          ...a,
          comments: [...a.comments, newComment]
        };
      }
      return a;
    });

    setArticles(updated);
    localStorage.setItem('devbox_blog_articles', JSON.stringify(updated));
    setCommentContent('');
  };

  // Handle Share triggers
  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full text-start">
      {activePost ? (
        /* --- INDIVIDUAL ARTICLE VIEW PAGE --- */
        <article className="space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          {/* Back Trigger */}
          <button
            onClick={() => setActivePostId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-550 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-800/80 mb-2 self-start"
          >
            <ChevronLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span>{language === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}</span>
          </button>

          {/* Title & Metadata Header */}
          <div className="space-y-3 border-b border-slate-150 dark:border-slate-800/80 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {activePost.category}
              </span>
              {activePost.tags.map((tg, i) => (
                <span key={i} className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>#{tg}</span>
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
              {language === 'ar' ? activePost.titleAr : activePost.titleEn}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-450 dark:text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(activePost.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activePost.readingTimeMin} {language === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{activePost.viewsCount} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
              </span>
            </div>
          </div>

          {/* Article Main Markdown Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-medium text-justify">
            {language === 'ar' ? activePost.contentAr : activePost.contentEn}
          </div>

          {/* Author Card Block */}
          <div className="bg-slate-50 dark:bg-slate-950/35 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img
              src={activePost.author.avatar}
              alt={activePost.author.name}
              className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
            />
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">{activePost.author.name}</h4>
              <p className="text-[10px] leading-relaxed text-slate-450 dark:text-slate-450">
                {language === 'ar' ? activePost.author.bioAr : activePost.author.bioEn}
              </p>
            </div>
          </div>

          {/* Interaction Bar (Like, Share, Copy Links) */}
          <div className="flex flex-wrap justify-between items-center gap-3 border-y border-slate-150 dark:border-slate-800/80 py-3.5">
            <div className="flex gap-2">
              <button
                onClick={() => toggleLike(activePost.id)}
                className={`px-3.5 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${likedPosts.includes(activePost.id) ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-650'}`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${likedPosts.includes(activePost.id) ? 'fill-rose-500' : ''}`} />
                <span>{activePost.likesCount} {language === 'ar' ? 'إعجاب' : 'likes'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyLink(activePost.id)}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Copy Link Address"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الرابط' : 'Copy link')}</span>
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(language === 'ar' ? activePost.titleAr : activePost.titleEn)}&url=${encodeURIComponent(window.location.href)}`)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors"
              >
                Twitter
              </button>
            </div>
          </div>

          {/* Related Articles Recommender */}
          <div className="space-y-3 pt-3">
            <h3 className="font-display font-black text-xs text-slate-850 dark:text-slate-300 uppercase tracking-wider">{language === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articles.filter(a => a.id !== activePost.id && (a.category === activePost.category || a.tags.some(t => activePost.tags.includes(t)))).slice(0, 2).map(rel => (
                <button
                  key={rel.id}
                  onClick={() => openPost(rel.id)}
                  className="bg-slate-50/55 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 p-3.5 rounded-2xl hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between text-left h-24"
                >
                  <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                    {language === 'ar' ? rel.titleAr : rel.titleEn}
                  </h4>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-500">Read Article →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-800/80">
            <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>{activePost.comments.length} {language === 'ar' ? 'تعليقات' : 'Comments'}</span>
            </h3>

            {/* Comment Submission Form */}
            <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50/65 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="py-1.5 px-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  placeholder={language === 'ar' ? 'اكتب تعليقك البناء هنا...' : 'Write your comment here...'}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-900 dark:text-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{language === 'ar' ? 'إرسال التعليق' : 'Post Comment'}</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {activePost.comments.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-4 text-center">
                  {language === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No comments yet. Be the first to start a discussion!'}
                </p>
              ) : (
                activePost.comments.map(c => (
                  <div key={c.id} className="p-3 border border-slate-150 dark:border-slate-850/80 bg-slate-50/20 rounded-2xl flex gap-3 items-start animate-fade-in">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-7 h-7 rounded-xl object-cover border border-slate-200 dark:border-slate-850"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">{c.authorName}</span>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      ) : (
        /* --- MAIN ARTICLES INDEX LISTS --- */
        <div className="space-y-6">
          {/* Categories Horizontal Pills and search filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="font-display font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>{language === 'ar' ? 'أبحاث ومقالات المطورين' : 'DevBox Blog Insights'}</span>
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {language === 'ar' ? 'شروحات تشفير متقدمة، استشارات أمان، وحيل برمجية.' : 'Advanced cryptography guides, design systems tutorials, and cybersecurity insights.'}
                </p>
              </div>

              {/* Text Search Input */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-450" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث في المدونة...' : 'Search posts...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg pl-7 pr-3 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tags / Categories Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${!selectedCategory && !selectedTag ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200'}`}
              >
                {language === 'ar' ? 'الكل' : 'All Articles'}
              </button>
              {categoriesList.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedCategory(cat); setSelectedTag(null); }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
              {tagsList.map((tg, i) => (
                <button
                  key={'t'+i}
                  onClick={() => { setSelectedTag(tg); setSelectedCategory(null); }}
                  className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer border ${selectedTag === tg ? 'bg-violet-650 text-white border-violet-650' : 'bg-transparent border-slate-250 dark:border-slate-800 text-slate-500 hover:border-slate-400'}`}
                >
                  #{tg}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-755 mx-auto mb-2" />
                <h4 className="font-display font-bold text-sm">{language === 'ar' ? 'لم نجد مقالات مطابقة' : 'No articles matching filters'}</h4>
                <p className="text-xs text-slate-400 mt-1">{language === 'ar' ? 'يرجى مراجعة معايير التصفية والبحث.' : 'Refine your query filters or tags search.'}</p>
              </div>
            ) : (
              filteredArticles.map(post => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTimeMin} min read</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {language === 'ar' ? post.titleAr : post.titleEn}
                    </h3>

                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-450 line-clamp-2 font-medium text-justify">
                      {language === 'ar' ? post.excerptAr : post.excerptEn}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-150 dark:border-slate-850/80">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-850"
                      />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-350">{post.author.name}</span>
                    </div>
                    <button
                      onClick={() => openPost(post.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer hover:underline"
                    >
                      <span>{language === 'ar' ? 'اقرأ المزيد' : 'Read more'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
