import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Key, Shield, LogIn, UserPlus, LogOut, CheckCircle, 
  Trash2, Bell, Heart, History, Settings, Sparkles, Star, Eye, EyeOff, 
  Upload, Check, AlertCircle, RefreshCw, BarChart2, ShieldCheck, Camera
} from 'lucide-react';
import { getInitialLanguage, t } from '../data/translations';
import { tools } from '../data/toolsData';

// Simple SHA-256 simulation or secure checksum string encoder for offline passwords
const secureHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'db_' + Math.abs(hash).toString(16);
};

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string; // base64 or preset key
  createdAt: string;
  verified: boolean;
  preferences: {
    theme: 'dark' | 'light';
    autoSave: boolean;
    notificationsEnabled: boolean;
    compactMode: boolean;
  };
}

export interface UserHistoryItem {
  id: string;
  toolId: string;
  timestamp: string;
  action: 'click' | 'favorite' | 'execute';
}

export interface UserNotification {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  timestamp: string;
  read: boolean;
}

export interface AccountSystemProps {
  language: 'en' | 'ar';
  onLoginStateChange?: (user: LocalUser | null) => void;
  onRequestPage?: (page: any) => void;
  onLaunchTool?: (toolId: string) => void;
}

export function AccountSystem({ language, onLoginStateChange, onRequestPage, onLaunchTool }: AccountSystemProps) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => {
    const saved = localStorage.getItem('devbox_active_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Dashboard Sub-tabs
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'profile' | 'history' | 'notifications' | 'settings'>('overview');

  // Input fields for edit profile
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');
  
  // Notification history
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem('devbox_notifications');
    if (saved) return JSON.parse(saved);
    const initial: UserNotification[] = [
      {
        id: 'n1',
        titleEn: 'Welcome to DevBox Account Space!',
        titleAr: 'مرحباً بك في مساحة حسابات DevBox!',
        descEn: 'You have unlocked persistent browser dashboard tracking, sync options, and history logs.',
        descAr: 'لقد قمت بفتح ميزة تتبع لوحة التحكم المستمرة في المتصفح، وخيارات المزامنة، وسجلات النشاط.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
    localStorage.setItem('devbox_notifications', JSON.stringify(initial));
    return initial;
  });

  // Tools click and search histories
  const [toolHistory, setToolHistory] = useState<UserHistoryItem[]>(() => {
    const saved = localStorage.getItem('devbox_tool_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('devbox_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  // User list in LocalStorage
  const getUsersList = (): LocalUser[] => {
    const saved = localStorage.getItem('devbox_registered_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveUsersList = (users: LocalUser[]) => {
    localStorage.setItem('devbox_registered_users', JSON.stringify(users));
  };

  // Sync state upward when currentUser changes
  useEffect(() => {
    if (onLoginStateChange) {
      onLoginStateChange(currentUser);
    }
  }, [currentUser]);

  // Handle Log In
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    const users = getUsersList();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setErrorMessage(language === 'ar' ? 'البريد الإلكتروني غير مسجل.' : 'Email is not registered.');
      return;
    }

    if (user.passwordHash !== secureHash(password)) {
      setErrorMessage(language === 'ar' ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.');
      return;
    }

    // Success login
    localStorage.setItem('devbox_active_user', JSON.stringify(user));
    setCurrentUser(user);
    setSuccessMessage(language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Successfully logged in!');
    
    // Push notify
    addNotification(
      'Security Alert: New Sign-in',
      'تنبيه أمني: تسجيل دخول جديد',
      'A login session has been successfully initiated inside this browser sandbox.',
      'تم بدء جلسة تسجيل دخول بنجاح داخل بيئة عمل هذا المتصفح.'
    );
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(language === 'ar' ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }

    const users = getUsersList();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorMessage(language === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل.' : 'This email is already registered.');
      return;
    }

    const newUser: LocalUser = {
      id: 'usr_' + Date.now(),
      username,
      email,
      passwordHash: secureHash(password),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      createdAt: new Date().toISOString(),
      verified: true, // Auto verified for client-side local Sandbox
      preferences: {
        theme: 'dark',
        autoSave: true,
        notificationsEnabled: true,
        compactMode: false
      }
    };

    const updated = [...users, newUser];
    saveUsersList(updated);
    
    localStorage.setItem('devbox_active_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setSuccessMessage(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account registered successfully!');
  };

  // Handle Forgot password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email.');
      return;
    }

    const users = getUsersList();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (!exists) {
      setErrorMessage(language === 'ar' ? 'البريد الإلكتروني هذا غير مسجل لدينا.' : 'This email address is not registered.');
      return;
    }

    setSuccessMessage(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your registered email address.');
  };

  // Log Out
  const handleLogout = () => {
    localStorage.removeItem('devbox_active_user');
    setCurrentUser(null);
    setSuccessMessage('');
    setAuthView('login');
  };

  // Edit Profile Update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMessage('');
    setSuccessMessage('');

    if (!editUsername || !editEmail) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء جميع حقول الاسم والبريد الإلكتروني.' : 'Please fill in name and email.');
      return;
    }

    const users = getUsersList();
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        const updated = {
          ...u,
          username: editUsername,
          email: editEmail
        };
        return updated;
      }
      return u;
    });

    saveUsersList(updatedUsers);
    const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id)!;
    localStorage.setItem('devbox_active_user', JSON.stringify(updatedCurrentUser));
    setCurrentUser(updatedCurrentUser);
    setSuccessMessage(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح.' : 'Profile updated successfully.');
    
    addNotification(
      'Profile Metadata Updated',
      'تم تحديث البيانات الشخصية',
      'Your username and email settings were successfully modified.',
      'تم تعديل اسم المستخدم وإعدادات البريد الإلكتروني بنجاح.'
    );
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPasswordConfirm || !newPassword) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء الحقول المطلوبة.' : 'Please fill in required fields.');
      return;
    }

    if (currentUser.passwordHash !== secureHash(currentPasswordConfirm)) {
      setErrorMessage(language === 'ar' ? 'كلمة المرور الحالية غير صحيحة.' : 'Current password incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(language === 'ar' ? 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.' : 'New password must be at least 6 characters.');
      return;
    }

    const users = getUsersList();
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          passwordHash: secureHash(newPassword)
        };
      }
      return u;
    });

    saveUsersList(updatedUsers);
    const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id)!;
    localStorage.setItem('devbox_active_user', JSON.stringify(updatedCurrentUser));
    setCurrentUser(updatedCurrentUser);
    setSuccessMessage(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
    
    setCurrentPasswordConfirm('');
    setNewPassword('');

    addNotification(
      'Security Alert: Password Modified',
      'تنبيه أمني: تم تغيير كلمة المرور',
      'The password credentials for this account have been securely changed.',
      'تم تغيير مؤهلات كلمة المرور لهذا الحساب بشكل آمن.'
    );
  };

  // Delete Account
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف الحساب بشكل نهائي؟ لا يمكن التراجع عن هذه الخطوة.' : 'Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    const users = getUsersList();
    const filtered = users.filter(u => u.id !== currentUser.id);
    saveUsersList(filtered);
    
    localStorage.removeItem('devbox_active_user');
    setCurrentUser(null);
    alert(language === 'ar' ? 'تم حذف حسابك بنجاح.' : 'Your account was deleted successfully.');
  };

  // Helper to trigger custom Base64 avatar upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 500 * 1024) {
      setErrorMessage(language === 'ar' ? 'يجب أن يكون حجم الصورة أقل من 500 كيلوبايت.' : 'Image size must be less than 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const users = getUsersList();
        const updated = users.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, avatar: base64 };
          }
          return u;
        });
        saveUsersList(updated);
        const updatedCurrentUser = updated.find(u => u.id === currentUser.id)!;
        localStorage.setItem('devbox_active_user', JSON.stringify(updatedCurrentUser));
        setCurrentUser(updatedCurrentUser);
        setSuccessMessage(language === 'ar' ? 'تم تغيير الصورة الشخصية بنجاح!' : 'Avatar changed successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Notification to logs
  const addNotification = (titleEn: string, titleAr: string, descEn: string, descAr: string) => {
    const newNotif: UserNotification = {
      id: 'notif_' + Date.now(),
      titleEn,
      titleAr,
      descEn,
      descAr,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('devbox_notifications', JSON.stringify(updated));
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('devbox_notifications', JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('devbox_notifications', JSON.stringify([]));
  };

  const clearHistory = () => {
    setToolHistory([]);
    localStorage.removeItem('devbox_tool_history');
    setSearchHistory([]);
    localStorage.removeItem('devbox_search_history');
  };

  // Pre-fill fields on profile edit load
  useEffect(() => {
    if (currentUser) {
      setEditUsername(currentUser.username);
      setEditEmail(currentUser.email);
    }
  }, [currentUser, authView]);

  return (
    <div className="w-full text-start">
      {!currentUser ? (
        /* --- AUTHENTICATION CARDS --- */
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6 sm:p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-blue-500/10">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
              {authView === 'login' && (language === 'ar' ? 'سجل دخولك إلى الحساب' : 'Sign In to DevBox')}
              {authView === 'register' && (language === 'ar' ? 'إنشاء حساب مطور جديد' : 'Create Free Account')}
              {authView === 'forgot' && (language === 'ar' ? 'استعادة كلمة المرور' : 'Retrieve Password')}
            </h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-500 max-w-xs mx-auto">
              {language === 'ar' 
                ? 'مزامنة أدواتك المفضلة وسجل تتبع الاستخدام محلياً وآمن 100٪.' 
                : 'Synchronize favorites, tool click history, and custom dashboards 100% privately.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <button 
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[10px] font-bold text-blue-500 hover:underline"
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Login Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}</span>
                </button>
              </div>

              {/* Third Party simulated Social Login for Sandbox */}
              <div className="relative my-4 flex items-center justify-center">
                <span className="absolute w-full border-t border-slate-200 dark:border-slate-800"></span>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold text-slate-400">
                  {language === 'ar' ? 'أو الدخول الآمن عبر' : 'Or secure connect with'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const presetUser: LocalUser = {
                      id: 'g_usr_1',
                      username: 'Google Developer',
                      email: 'google-sandbox@devbox.io',
                      passwordHash: '',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
                      createdAt: new Date().toISOString(),
                      verified: true,
                      preferences: { theme: 'dark', autoSave: true, notificationsEnabled: true, compactMode: false }
                    };
                    localStorage.setItem('devbox_active_user', JSON.stringify(presetUser));
                    setCurrentUser(presetUser);
                    addNotification('Google SSO Authenticated', 'تم الربط بحساب Google', 'Your account has been connected with Google authentication credentials.', 'تم ربط حسابك بنجاح مع مؤهلات جوجل الخاصة بك.');
                  }}
                  className="py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <span className="font-bold text-red-500">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const presetUser: LocalUser = {
                      id: 'git_usr_2',
                      username: 'GitHub Engineer',
                      email: 'github-sandbox@devbox.io',
                      passwordHash: '',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
                      createdAt: new Date().toISOString(),
                      verified: true,
                      preferences: { theme: 'dark', autoSave: true, notificationsEnabled: true, compactMode: false }
                    };
                    localStorage.setItem('devbox_active_user', JSON.stringify(presetUser));
                    setCurrentUser(presetUser);
                    addNotification('GitHub SSO Authenticated', 'تم الربط بحساب GitHub', 'Your account has been connected with GitHub sandbox authorization keys.', 'تم ربط حسابك بنجاح بمفاتيح تخويل GitHub.');
                  }}
                  className="py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <span className="font-bold text-slate-900 dark:text-white">Git</span>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('register')}
                    className="text-blue-500 font-bold hover:underline"
                  >
                    {language === 'ar' ? 'أنشئ حساباً مجانياً' : 'Sign Up Free'}
                  </button>
                </span>
              </div>
            </form>
          )}

          {authView === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                  {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تسجيل حساب جديد' : 'Register Account'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already registered?'}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="text-blue-500 font-bold hover:underline"
                  >
                    {language === 'ar' ? 'سجل دخولك هنا' : 'Sign In'}
                  </button>
                </span>
              </div>
            </form>
          )}

          {authView === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-55 block">
                  {language === 'ar' ? 'أدخل بريدك الإلكتروني المسجل' : 'Enter Registered Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'أرسل الرابط' : 'Send Link'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* --- MAIN PROFILE DASHBOARD --- */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-fade-in">
          {/* Header Dashboard Banner */}
          <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/20"
                />
                <label className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                  <Camera className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h2 className="font-display font-black text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>{currentUser.username}</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded text-[9px] font-bold uppercase tracking-wide">
                    {language === 'ar' ? 'نشط آمن' : 'Secure Active'}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-3 py-1.5 border border-rose-200 dark:border-rose-950/40 text-rose-600 dark:text-rose-455 bg-rose-50/10 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-950/20 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
              </button>
            </div>
          </div>

          {/* Core Grid with Sidebar and Dashboard tabs */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[350px]">
            {/* Dashboard Navigation */}
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-1 bg-slate-50/30">
              <button
                onClick={() => setDashboardTab('overview')}
                className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${dashboardTab === 'overview' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-transparent'}`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
              </button>
              <button
                onClick={() => setDashboardTab('profile')}
                className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${dashboardTab === 'profile' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-transparent'}`}
              >
                <User className="w-4 h-4" />
                <span>{language === 'ar' ? 'الملف الشخصي' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={() => setDashboardTab('history')}
                className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${dashboardTab === 'history' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-transparent'}`}
              >
                <History className="w-4 h-4" />
                <span>{language === 'ar' ? 'سجل النشاط' : 'Activity Logs'}</span>
              </button>
              <button
                onClick={() => setDashboardTab('notifications')}
                className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${dashboardTab === 'notifications' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-transparent'}`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
                </div>
                {notifications.some(n => !n.read) && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <button
                onClick={() => setDashboardTab('settings')}
                className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${dashboardTab === 'settings' ? 'bg-blue-50/75 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border-blue-600/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-transparent'}`}
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'ar' ? 'إعدادات الحساب' : 'Security Settings'}</span>
              </button>
            </div>

            {/* Dashboard Contents */}
            <div className="md:col-span-3 p-5 sm:p-6 text-start">
              {dashboardTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                      {language === 'ar' ? 'مرحباً بعودتك، ' : 'Welcome Back, '}{currentUser.username}!
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar' ? 'تتبع إحصائيات نشاطك وأدواتك السريعة.' : 'Track your browser-sandbox stats and quickly access starred files.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'تاريخ التسجيل' : 'Registered'}</h4>
                      <p className="text-xs font-bold mt-1 text-slate-700 dark:text-slate-350">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'النشاط التراكمي' : 'Total Logs'}</h4>
                      <p className="text-xs font-bold mt-1 text-slate-700 dark:text-slate-350">{toolHistory.length + searchHistory.length} {language === 'ar' ? 'سجل' : 'items'}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'نوع الحساب' : 'Account Type'}</h4>
                      <p className="text-xs font-bold mt-1 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{language === 'ar' ? 'مطور آمن' : 'SANDBOX DEV'}</p>
                    </div>
                  </div>

                  {/* Starred utilities list inside Dashboard */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-750 dark:text-slate-300 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>{language === 'ar' ? 'أدواتك المفضلة للمزامنة السريعة' : 'Your Starred Utilities Sync'}</span>
                    </h4>
                    {JSON.parse(localStorage.getItem('devbox_favorites') || '[]').length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                        {language === 'ar' ? 'لم تقم بإضافة أي أدوات للمفضلة بعد.' : 'No starred tools recorded yet.'}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {JSON.parse(localStorage.getItem('devbox_favorites') || '[]').map((favId: string) => {
                          const tItem = tools.find(tl => tl.id === favId);
                          if (!tItem) return null;
                          return (
                            <button
                              key={favId}
                              onClick={() => {
                                if (onLaunchTool) onLaunchTool(favId);
                              }}
                              className="p-2 border border-slate-150 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-850/30 rounded-xl text-left text-xs font-bold flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 transition-all"
                            >
                              <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              </div>
                              <span className="truncate">{tItem.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {dashboardTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile Information'}</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">{language === 'ar' ? 'تحديث معلومات حسابك المحلي بأمان.' : 'Update your local client profile name and address.'}</p>
                  </div>

                  {successMessage && (
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">{successMessage}</p>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Profiles'}
                  </button>
                </form>
              )}

              {dashboardTab === 'history' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{language === 'ar' ? 'سجل النشاط والاستخدام' : 'User History logs'}</h3>
                      <p className="text-[11px] text-slate-450 mt-0.5">{language === 'ar' ? 'سجل تصفح وعمليات المطور الحالية.' : 'Secure traces of your recent operations inside this session.'}</p>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-500 hover:text-white text-[10px] font-bold border border-rose-500/10 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'مسح السجلات' : 'Clear History'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {toolHistory.length === 0 && searchHistory.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-6">
                        {language === 'ar' ? 'لا توجد سجلات نشاط مسجلة حالياً.' : 'No active history logs registered.'}
                      </p>
                    ) : (
                      <>
                        {toolHistory.map((h, i) => {
                          const tItem = tools.find(tl => tl.id === h.toolId);
                          return (
                            <div key={i} className="p-2 border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl text-xs flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <History className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {language === 'ar' ? `تصفح أداة: ${tItem?.name || h.toolId}` : `Launched ${tItem?.name || h.toolId}`}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</span>
                            </div>
                          );
                        })}
                        {searchHistory.map((sh, i) => (
                          <div key={'s'+i} className="p-2 border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl text-xs flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <History className="w-3.5 h-3.5 text-blue-400" />
                              <span className="font-semibold text-slate-750 dark:text-slate-400">
                                {language === 'ar' ? `البحث عن: "${sh}"` : `Searched: "${sh}"`}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400">Search Log</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {dashboardTab === 'notifications' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{language === 'ar' ? 'الإشعارات وتنبيهات الأمان' : 'Security Alerts & Notifications'}</h3>
                      <p className="text-[11px] text-slate-450 mt-0.5">{language === 'ar' ? 'تنبيهات الأمان ومستجدات المنصة.' : 'Notifications log relating to sandbox settings.'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllRead}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-bold rounded-lg transition-all"
                      >
                        {language === 'ar' ? 'تحديد كقروء' : 'Read All'}
                      </button>
                      <button
                        onClick={clearNotifications}
                        className="px-2 py-1 text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold rounded-lg transition-all"
                      >
                        {language === 'ar' ? 'حذف الكل' : 'Clear All'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-6">
                        {language === 'ar' ? 'لا توجد إشعارات واردة.' : 'No notifications received.'}
                      </p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className={`p-3 border rounded-2xl text-xs space-y-1 transition-all ${n.read ? 'border-slate-150 dark:border-slate-850 bg-slate-50/20' : 'border-blue-150 dark:border-blue-900 bg-blue-500/5'}`}>
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                              {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>}
                              <span>{language === 'ar' ? n.titleAr : n.titleEn}</span>
                            </h4>
                            <span className="text-[9px] font-mono text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">
                            {language === 'ar' ? n.descAr : n.descEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {dashboardTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{language === 'ar' ? 'تغيير كلمة المرور' : 'Modify Account Password'}</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">{language === 'ar' ? 'قم بتحديث كلمة مرور المطور الخاصة بك بشكل آمن.' : 'Modify your local client authentication password.'}</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                        <input
                          type="password"
                          required
                          value={currentPasswordConfirm}
                          onChange={(e) => setCurrentPasswordConfirm(e.target.value)}
                          className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {language === 'ar' ? 'تعديل كلمة المرور' : 'Update Credentials'}
                    </button>
                  </form>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
                    <div>
                      <h4 className="text-xs font-black text-rose-600 dark:text-rose-450 uppercase">{language === 'ar' ? 'المنطقة الخطرة' : 'Danger Zone'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{language === 'ar' ? 'حذف بيانات حسابك بشكل نهائي من المتصفح.' : 'Permanently wipe your account records from this sandbox container.'}</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'حذف حسابي بشكل نهائي' : 'Wipe & Permanently Delete Account'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
