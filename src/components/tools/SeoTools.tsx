import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Globe, Search } from 'lucide-react';

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

// 1. URL Slug Generator
const SlugGen = () => {
  const [input, setInput] = useState('DevBox: The 100% Free Online Developer Toolkit!');
  const [slug, setSlug] = useState('');

  const generateSlug = () => {
    const clean = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special chars
      .replace(/[\s_-]+/g, '-') // replace spaces or underscores with single dash
      .replace(/^-+|-+$/g, ''); // trim starting/ending dashes
    setSlug(clean);
  };

  useEffect(() => {
    generateSlug();
  }, [input]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Headline Text</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 bg-white dark:bg-neutral-950 border rounded-xl text-xs" />
      </div>

      <div className="flex flex-col justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 border rounded-xl p-4">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">SEO URL SLUG</span>
          <code className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 break-all select-all block p-2.5 bg-white dark:bg-neutral-950 border rounded-lg">
            {slug}
          </code>
        </div>
        <CopyButton text={slug} />
      </div>
    </div>
  );
};

// 2. Meta Tags Generator
const MetaTagsGen = () => {
  const [title, setTitle] = useState('My Awesome Web App');
  const [desc, setDesc] = useState('DevBox provides completely free client-side tools to make development easier.');
  const [keys, setKeys] = useState('tools, developer, web dev, design');
  const [author, setAuthor] = useState('DevBox Team');
  const [url, setUrl] = useState('https://myapp.com');
  const [output, setOutput] = useState('');

  const generateTags = () => {
    const code = `<!-- Primary HTML Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
<meta name="keywords" content="${keys}">
<meta name="author" content="${author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">`;
    setOutput(code);
  };

  useEffect(() => {
    generateTags();
  }, [title, desc, keys, author, url]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Website Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>App URL</span>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold sm:col-span-2">
          <span>Keywords (Comma separated)</span>
          <input type="text" value={keys} onChange={(e) => setKeys(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold sm:col-span-2">
          <span>Meta Description</span>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs h-16" />
        </label>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-500">GENERATED META TAGS</span>
          {output && <CopyButton text={output} />}
        </div>
        <textarea readOnly value={output} className="w-full h-48 p-2.5 bg-white dark:bg-neutral-950 border rounded text-xs font-mono focus:outline-none select-all" />
      </div>
    </div>
  );
};

// 3. Robots.txt Generator
const RobotsGen = () => {
  const [sitemap, setSitemap] = useState('https://myapp.com/sitemap.xml');
  const [crawlers, setCrawlers] = useState({ google: true, bing: true, yahoo: true });
  const [output, setOutput] = useState('');

  const generateRobots = () => {
    let code = '';
    if (crawlers.google) code += 'User-agent: Googlebot\nAllow: /\n\n';
    if (crawlers.bing) code += 'User-agent: Bingbot\nAllow: /\n\n';
    if (crawlers.yahoo) code += 'User-agent: Slurp\nAllow: /\n\n';

    code += 'User-agent: *\nDisallow: /admin/\nDisallow: /private/\n\n';
    if (sitemap) code += `Sitemap: ${sitemap}\n`;

    setOutput(code);
  };

  useEffect(() => {
    generateRobots();
  }, [sitemap, crawlers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Crawl Specifications</h4>
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Sitemap Location</span>
            <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-neutral-500 block">Allow Specific Crawlers</span>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={crawlers.google} onChange={(e) => setCrawlers({ ...crawlers, google: e.target.checked })} className="rounded text-blue-600" />
              <span>Googlebot (Google Search)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={crawlers.bing} onChange={(e) => setCrawlers({ ...crawlers, bing: e.target.checked })} className="rounded text-blue-600" />
              <span>Bingbot (Microsoft Bing)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={crawlers.yahoo} onChange={(e) => setCrawlers({ ...crawlers, yahoo: e.target.checked })} className="rounded text-blue-600" />
              <span>Slurp (Yahoo Search)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-4 flex flex-col justify-center shadow-inner">
          <span className="text-[9px] font-bold text-neutral-400 block mb-1">ROBOTS.TXT</span>
          <textarea readOnly value={output} className="w-full h-32 p-2 bg-neutral-50 dark:bg-neutral-900 border rounded text-xs font-mono focus:outline-none select-all" />
        </div>
        <CopyButton text={output} />
      </div>
    </div>
  );
};

// 4. XML Sitemap Generator
const SitemapGen = () => {
  const [domain, setDomain] = useState('https://myapp.com');
  const [paths, setPaths] = useState('/\n/about\n/tools\n/contact');
  const [freq, setFreq] = useState('weekly');
  const [output, setOutput] = useState('');

  const generateSitemap = () => {
    const list = paths.split('\n').map(x => x.trim()).filter(x => x.length > 0);
    let code = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    list.forEach((path) => {
      const fullUrl = domain + (path.startsWith('/') ? path : '/' + path);
      code += `  <url>\n    <loc>${fullUrl}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    code += `</urlset>`;
    setOutput(code);
  };

  useEffect(() => {
    generateSitemap();
  }, [domain, paths, freq]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Website Domain URL</span>
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Change Frequency</span>
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-bold">
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold sm:col-span-2">
          <span>Webpages Paths (One per line)</span>
          <textarea value={paths} onChange={(e) => setPaths(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs h-20 font-mono" />
        </label>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-500">GENERATED SITEMAP.XML</span>
          {output && <CopyButton text={output} />}
        </div>
        <textarea readOnly value={output} className="w-full h-44 p-2.5 bg-white dark:bg-neutral-950 border rounded text-xs font-mono focus:outline-none select-all" />
      </div>
    </div>
  );
};

export const seoToolsComponents: Record<string, () => React.JSX.Element> = {
  'slug-gen': SlugGen,
  'meta-tags': MetaTagsGen,
  'robots-gen': RobotsGen,
  'sitemap-gen': SitemapGen,
};
