import React, { useState, useEffect } from 'react';
import {
  Folder, FolderPlus, Bookmark, Pin, Trash2, Download, Upload, Undo2, Redo2,
  Copy, Check, FileCode, History, Settings, Sparkles, Plus, Star, Link, ExternalLink,
  ChevronRight, AlertCircle, Info, FileText, Code, Database, RefreshCw
} from 'lucide-react';
import { t } from '../data/translations';
import { tools } from '../data/toolsData';

interface Project {
  id: string;
  name: string;
  description: string;
  pinnedTools: string[];
  notes: string;
  createdAt: string;
}

interface ToolCollection {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
}

interface SavedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  timestamp: string;
  dataUrl?: string;
}

interface WorkspaceState {
  projects: Project[];
  activeProjectId: string;
  collections: ToolCollection[];
  savedFiles: SavedFile[];
  pinnedToolsGlobal: string[];
  autosaveEnabled: boolean;
}

const TEMPLATES = [
  {
    name: 'HTML5 Semantic Canvas Boilerplate',
    category: 'web',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Sandbox</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; }
    canvas { background: #1e293b; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
  <canvas id="stage" width="800" height="600"></canvas>
  <script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(100, 100, 600, 400);
  </script>
</body>
</html>`
  },
  {
    name: 'Tailwind V4 Config Preset',
    category: 'css',
    language: 'javascript',
    code: `import { defineConfig } from 'tailwindcss';

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          500: '#6366f1',
          900: '#312e81',
        }
      }
    }
  },
  plugins: [],
});`
  },
  {
    name: 'Clean SQL Database Table',
    category: 'sql',
    language: 'sql',
    code: `CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);`
  },
  {
    name: 'Standard Gitignore Web Preset',
    category: 'git',
    language: 'ignore',
    code: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Output directory
dist/
build/
.next/

# Environment local secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`
  }
];

export function WorkspaceSystem({ language, onLaunchTool }: { language: 'en' | 'ar'; onLaunchTool: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'projects' | 'collections' | 'templates' | 'files' | 'settings'>('projects');

  // Core state
  const [state, setState] = useState<WorkspaceState>(() => {
    try {
      const saved = localStorage.getItem('devbox_workspace_system');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load workspace state', e);
    }

    return {
      projects: [
        {
          id: 'proj_default',
          name: 'Default Workspace Project',
          description: 'A primary offline canvas to group pinned dev helpers, workspace notes and saved file collections.',
          pinnedTools: ['json-formatter', 'media-quality-enhancer', 'video-studio'],
          notes: 'DevBox private notes. Stored 100% locally on your computer.',
          createdAt: new Date().toLocaleDateString()
        }
      ],
      activeProjectId: 'proj_default',
      collections: [
        {
          id: 'coll_media',
          name: 'Media Creation Suite',
          description: 'Custom folders to organize essential audio and video assets editors.',
          toolIds: ['video-studio', 'media-quality-enhancer']
        }
      ],
      savedFiles: [],
      pinnedToolsGlobal: ['json-formatter', 'media-quality-enhancer'],
      autosaveEnabled: true
    };
  });

  // Undo/Redo Stacks
  const [historyStack, setHistoryStack] = useState<WorkspaceState[]>([]);
  const [redoStack, setRedoStack] = useState<WorkspaceState[]>([]);

  // Feedback notifications
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New item forms
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newCollName, setNewCollName] = useState('');
  const [newCollDesc, setNewCollDesc] = useState('');

  // Active Project Ref/State helpers
  const activeProject = state.projects.find(p => p.id === state.activeProjectId) || state.projects[0];

  // Save State with history capture (Undo/Redo)
  const updateState = (newState: WorkspaceState, isHistoryTransition = false) => {
    if (!isHistoryTransition) {
      setHistoryStack(prev => [...prev, state].slice(-30)); // limit depth to 30
      setRedoStack([]); // Clear redo
    }
    setState(newState);
    localStorage.setItem('devbox_workspace_system', JSON.stringify(newState));
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [...prev, state]);
    setHistoryStack(prev => prev.slice(0, -1));
    updateState(previous, true);
    triggerToast(language === 'ar' ? 'تم التراجع عن التغيير الأخير' : 'Undone last workspace action');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(prev => [...prev, state]);
    setRedoStack(prev => prev.slice(0, -1));
    updateState(next, true);
    triggerToast(language === 'ar' ? 'تمت إعادة تطبيق التغيير' : 'Redone workspace action');
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: Project = {
      id: 'proj_' + Date.now(),
      name: newProjectName,
      description: newProjectDesc || 'Custom workspace project sandbox.',
      pinnedTools: [],
      notes: '',
      createdAt: new Date().toLocaleDateString()
    };

    updateState({
      ...state,
      projects: [...state.projects, newProj],
      activeProjectId: newProj.id
    });

    setNewProjectName('');
    setNewProjectDesc('');
    triggerToast(language === 'ar' ? 'تم إنشاء المشروع الجديد بنجاح' : 'New project created successfully');
  };

  // Delete Project
  const handleDeleteProject = (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.projects.length <= 1) {
      alert(language === 'ar' ? 'لا يمكن حذف آخر مشروع نشط.' : 'Cannot delete the only active project.');
      return;
    }

    const filtered = state.projects.filter(p => p.id !== projId);
    const fallbackActive = filtered[0].id;

    updateState({
      ...state,
      projects: filtered,
      activeProjectId: state.activeProjectId === projId ? fallbackActive : state.activeProjectId
    });

    triggerToast(language === 'ar' ? 'تم حذف المشروع' : 'Project deleted successfully');
  };

  // Toggle Pinned Tool in Active Project
  const toggleToolPinInProject = (toolId: string) => {
    if (!activeProject) return;
    const isPinned = activeProject.pinnedTools.includes(toolId);
    const updatedPinned = isPinned
      ? activeProject.pinnedTools.filter(id => id !== toolId)
      : [...activeProject.pinnedTools, toolId];

    const updatedProjects = state.projects.map(p =>
      p.id === activeProject.id ? { ...p, pinnedTools: updatedPinned } : p
    );

    updateState({
      ...state,
      projects: updatedProjects
    });

    triggerToast(isPinned
      ? (language === 'ar' ? 'تم إلغاء تثبيت الأداة' : 'Tool unpinned from project')
      : (language === 'ar' ? 'تم تثبيت الأداة في المشروع' : 'Tool pinned to project')
    );
  };

  // Update Notes in Active Project
  const handleUpdateNotes = (notesText: string) => {
    if (!activeProject) return;
    const updatedProjects = state.projects.map(p =>
      p.id === activeProject.id ? { ...p, notes: notesText } : p
    );
    updateState({
      ...state,
      projects: updatedProjects
    });
  };

  // Create Collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollName.trim()) return;

    const newColl: ToolCollection = {
      id: 'coll_' + Date.now(),
      name: newCollName,
      description: newCollDesc || 'Custom collection of tools.',
      toolIds: []
    };

    updateState({
      ...state,
      collections: [...state.collections, newColl]
    });

    setNewCollName('');
    setNewCollDesc('');
    triggerToast(language === 'ar' ? 'تم إنشاء المجموعة بنجاح' : 'New tool collection created');
  };

  // Delete Collection
  const handleDeleteCollection = (collId: string) => {
    updateState({
      ...state,
      collections: state.collections.filter(c => c.id !== collId)
    });
    triggerToast(language === 'ar' ? 'تم حذف المجموعة' : 'Tool collection deleted');
  };

  // Toggle Tool in Collection
  const toggleToolInCollection = (collId: string, toolId: string) => {
    const updated = state.collections.map(c => {
      if (c.id === collId) {
        const exists = c.toolIds.includes(toolId);
        return {
          ...c,
          toolIds: exists ? c.toolIds.filter(id => id !== toolId) : [...c.toolIds, toolId]
        };
      }
      return c;
    });

    updateState({
      ...state,
      collections: updated
    });
  };

  // Copy Template code
  const handleCopyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTemplate(name);
    setTimeout(() => setCopiedTemplate(null), 3000);
  };

  // Import / Export JSON backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `devbox_workspace_backup_${Date.now()}.json`);
    dlAnchorElem.click();
    triggerToast(language === 'ar' ? 'تم تصدير نسخة احتياطية' : 'Workspace configuration exported!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.collections)) {
            updateState(parsed);
            triggerToast(language === 'ar' ? 'تم استيراد النسخة بنجاح' : 'Workspace imported successfully!');
          } else {
            alert('Invalid backup structure.');
          }
        } catch {
          alert('Failed to parse backup JSON.');
        }
      };
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 text-left relative">
      
      {/* Toast Alert Indicator */}
      {successToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-500 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Folder className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              {language === 'ar' ? 'مساحة العمل المتقدمة للمطورين' : 'Advanced Developer Workspace'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar' 
              ? 'إدارة مشروعات التطوير، وتثبيت الأدوات المفضلة، وحفظ الملفات والنصوص البرمجية محلياً في متصفحك.' 
              : 'Create custom development projects, organize lists of utilities, store local draft files, and sync settings completely offline.'}
          </p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer"
            title={language === 'ar' ? 'تراجع' : 'Undo'}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer"
            title={language === 'ar' ? 'إعادة تطبيق' : 'Redo'}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50 scrollbar-none">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'projects' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'المشاريع والملفات' : 'Projects & Context'}</span>
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'collections' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'مجموعات الأدوات' : 'Tool Collections'}</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'templates' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'القوالب الجاهزة' : 'Starter Templates'}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'النسخ والنسخ الاحتياطي' : 'Backup & Settings'}</span>
        </button>
      </div>

      {/* Grid workspace workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* -------------------------------------------------- TAB: PROJECTS -------------------------------------------------- */}
        {activeTab === 'projects' && (
          <>
            {/* Left side list: projects index */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {language === 'ar' ? 'المشاريع النشطة' : 'Active Projects'}
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {state.projects.map(proj => {
                    const isActive = state.activeProjectId === proj.id;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => updateState({ ...state, activeProjectId: proj.id })}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${isActive ? 'bg-indigo-50/50 dark:bg-indigo-950/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-850'}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Folder className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                          <div className="truncate">
                            <p className="text-xs leading-none truncate">{proj.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-none truncate">{proj.createdAt}</p>
                          </div>
                        </div>
                        
                        {state.projects.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteProject(proj.id, e)}
                            className="p-1 rounded-md text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title={language === 'ar' ? 'حذف المشروع' : 'Delete Project'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Create Project Form */}
                <form onSubmit={handleCreateProject} className="border-t border-slate-150 dark:border-slate-800/60 pt-4 space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'إنشاء مشروع جديد' : 'New Project Sandbox'}
                  </div>
                  <input
                    required
                    type="text"
                    placeholder={language === 'ar' ? 'اسم المشروع...' : 'Project title...'}
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-150"
                  />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'الوصف اختياري...' : 'Short description...'}
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-150"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة مشروع' : 'Add Project'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right side: Active Project board details */}
            <div className="lg:col-span-8 space-y-6">
              {activeProject ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Title & Desc */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Folder className="w-5 h-5 text-indigo-500" />
                          <span>{activeProject.name}</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">{activeProject.description}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-2 py-0.5">
                        CREATED: {activeProject.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Project Pinned Tools */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                      <span>{language === 'ar' ? 'الأدوات المثبتة للمشروع' : 'Pinned Project Tools'}</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 rounded font-mono">
                        {activeProject.pinnedTools.length}
                      </span>
                    </div>

                    {activeProject.pinnedTools.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                        <Pin className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-2 animate-bounce" />
                        <p>{language === 'ar' ? 'لم يتم تثبيت أي أدوات في هذا المشروع بعد.' : 'No helper tools pinned inside this project sandbox yet.'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'تستطيع تثبيت أدواتك المفضلة من الأسفل للتنقل السريع.' : 'Pin relevant developer utilities from the panel below.'}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeProject.pinnedTools.map(toolId => {
                          const tItem = tools.find(tl => tl.id === toolId);
                          if (!tItem) return null;
                          return (
                            <div
                              key={toolId}
                              onClick={() => onLaunchTool(toolId)}
                              className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/80 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400/50 hover:bg-slate-100/35 dark:hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between"
                            >
                              <div className="min-w-0 flex items-center gap-2.5">
                                <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
                                  <Code className="w-4 h-4" />
                                </span>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{tItem.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{tItem.description}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleToolPinInProject(toolId); }}
                                className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                                title={language === 'ar' ? 'إلغاء التثبيت' : 'Unpin tool'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pin Helper Selector Box */}
                  <div className="bg-slate-50 dark:bg-slate-950/45 border border-slate-150 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'تثبيت أدوات التطوير الأساسية' : 'Pin Essential Utilities'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tools.slice(0, 10).map(tItem => {
                        const isPinned = activeProject.pinnedTools.includes(tItem.id);
                        return (
                          <button
                            key={tItem.id}
                            onClick={() => toggleToolPinInProject(tItem.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border cursor-pointer ${isPinned ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                          >
                            <Pin className={`w-3 h-3 ${isPinned ? 'fill-white' : ''}`} />
                            <span>{tItem.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Notes draft area */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{language === 'ar' ? 'ملاحظات ومسودات المشروع' : 'Project Draft Notes & Logs'}</span>
                    </div>
                    <textarea
                      rows={5}
                      value={activeProject.notes}
                      onChange={(e) => handleUpdateNotes(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب ملاحظاتك، أو الأكواد المنسوخة، أو تذكيرات المهام الخاصة بالمشروع هنا...' : 'Write workspace reminders, JSON logs, code fragments, or deployment guides here. Stored locally...'}
                      className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 leading-relaxed"
                    />
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Info className="w-3 h-3 text-indigo-400" />
                      <span>{language === 'ar' ? 'يتم حفظ التغييرات تلقائياً في ذاكرة المتصفح المحلية.' : 'Draft logs autosaved safely via browser key-value state.'}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  <p>{language === 'ar' ? 'حدد مشروعاً أو قم بإنشاء مشروع جديد للبدء.' : 'Select a project sandbox or configure a new workspace.'}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* -------------------------------------------------- TAB: COLLECTIONS -------------------------------------------------- */}
        {activeTab === 'collections' && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-indigo-500" />
                    <span>{language === 'ar' ? 'مجموعات أدوات المطور المخصصة' : 'Custom Developer Tool Collections'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{language === 'ar' ? 'أنشئ مجموعات من الأدوات التي تستخدمها بانتظام لمهام مختلفة.' : 'Group multiple developer utilities into customizable workflow buckets.'}</p>
                </div>

                <form onSubmit={handleCreateCollection} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <input
                    required
                    type="text"
                    placeholder={language === 'ar' ? 'اسم المجموعة...' : 'Collection name...'}
                    value={newCollName}
                    onChange={(e) => setNewCollName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-150"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء مجموعة' : 'Add Collection'}</span>
                  </button>
                </form>
              </div>

              {state.collections.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                  <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p>{language === 'ar' ? 'لا توجد مجموعات مخصصة حالياً.' : 'No custom collections generated yet.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.collections.map(coll => (
                    <div
                      key={coll.id}
                      className="border border-slate-150 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Bookmark className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                            <span>{coll.name}</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">{coll.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCollection(coll.id)}
                          className="p-1 rounded-md text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                          title={language === 'ar' ? 'حذف المجموعة' : 'Delete Collection'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tool ids list */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {language === 'ar' ? 'الأدوات المدرجة' : 'Included Utilities'}
                        </div>

                        {coll.toolIds.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">{language === 'ar' ? 'لم يتم إضافة أدوات بعد.' : 'No items added yet.'}</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {coll.toolIds.map(toolId => {
                              const tItem = tools.find(t => t.id === toolId);
                              if (!tItem) return null;
                              return (
                                <button
                                  key={toolId}
                                  onClick={() => onLaunchTool(toolId)}
                                  className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 flex items-center gap-1"
                                >
                                  <span>{tItem.name}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Add tools checklist in this collection */}
                      <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-3 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'ar' ? 'إضافة / إزالة الأدوات' : 'Manage Included Tools'}
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1">
                          {tools.slice(0, 10).map(tItem => {
                            const isIncluded = coll.toolIds.includes(tItem.id);
                            return (
                              <button
                                key={tItem.id}
                                onClick={() => toggleToolInCollection(coll.id, tItem.id)}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition flex items-center gap-1 border cursor-pointer ${isIncluded ? 'bg-indigo-50/80 border-indigo-300 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-400 hover:bg-slate-50'}`}
                              >
                                {isIncluded ? '✓' : '+'} {tItem.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* -------------------------------------------------- TAB: TEMPLATES -------------------------------------------------- */}
        {activeTab === 'templates' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-500" />
                  <span>{language === 'ar' ? 'مكتبة قوالب المطورين الأساسية' : 'Starter Templates Portfolio'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">{language === 'ar' ? 'انسخ أكواد ونصوص برمجية جاهزة للبدء في مشروعاتك فوراً.' : 'Instant-copy clean configuration files and canvas code snippets.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TEMPLATES.map(tmpl => {
                  const isCopied = copiedTemplate === tmpl.name;
                  return (
                    <div
                      key={tmpl.name}
                      className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between"
                    >
                      <div className="p-4 border-b border-slate-150 dark:border-slate-800/60 flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/30">
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{tmpl.name}</h4>
                          <span className="text-[9px] font-mono font-bold uppercase text-indigo-500 bg-indigo-500/10 rounded px-1.5 py-0.2 mt-1 inline-block">
                            {tmpl.category} / {tmpl.language}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(tmpl.code, tmpl.name)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition shadow-xs flex items-center gap-1.5 text-[10px] font-bold cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                        </button>
                      </div>

                      <div className="p-4 flex-1">
                        <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto p-3 bg-slate-950 rounded-lg max-h-[140px] text-left leading-normal">
                          <code>{tmpl.code}</code>
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------- TAB: SETTINGS -------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <span>{language === 'ar' ? 'إعدادات مساحة العمل والنسخ الاحتياطي' : 'Workspace Sync & Backup Configuration'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">{language === 'ar' ? 'تصدير كامل إعداداتك وملاحظاتك المفضلة كملف احتياطي مشفر محلياً.' : 'Export all local projects, starred items, and logs, or load an existing configuration backup.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export Card */}
                <div className="border border-slate-150 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-lg">
                      <Download className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150">{language === 'ar' ? 'تصدير نسخة احتياطية (JSON)' : 'Export Backup file (JSON)'}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'احفظ إعدادات المشروعات والملاحظات ومثبتات الأدوات كملف.' : 'Generates a private json backup of all workspace parameters.'}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تصدير ملف الإعدادات' : 'Export Workspace Backup'}</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="border border-slate-150 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-lg">
                      <Upload className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150">{language === 'ar' ? 'استيراد نسخة احتياطية' : 'Import Configuration Backup'}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'حمل ملف JSON لتطبيق إعدادات المشروعات السابقة.' : 'Load back a saved JSON file to instantly rebuild your layout.'}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      id="import-backup-file-input"
                      className="hidden"
                    />
                    <label
                      htmlFor="import-backup-file-input"
                      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>{language === 'ar' ? 'اختر ملف استيراد' : 'Import Saved File'}</span>
                    </label>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
