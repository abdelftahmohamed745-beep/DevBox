import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Layers, Sparkles } from 'lucide-react';

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
      className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-150 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

// 1. Word & Character Counter
const WordCounter = () => {
  const [text, setText] = useState('Type or paste your editorial text here. DevBox will analyze words, characters, whitespace layouts, paragraphs, and estimate the human reading duration in real-time.');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = trimmed ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const sentences = trimmed ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    // Assume 200 WPM average reading speed
    const readingTime = Math.ceil(words / 200);

    setStats({ words, chars, charsNoSpaces, paragraphs, sentences, readingTime });
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing text here..."
        className="w-full h-44 p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
      />

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">WORDS</span>
          <span className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">{stats.words}</span>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">CHARACTERS</span>
          <span className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">{stats.chars}</span>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">NO SPACES</span>
          <span className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">{stats.charsNoSpaces}</span>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">SENTENCES</span>
          <span className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">{stats.sentences}</span>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">PARAGRAPHS</span>
          <span className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">{stats.paragraphs}</span>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">READ TIME</span>
          <span className="text-base font-bold text-violet-600 dark:text-violet-400 font-mono">~{stats.readingTime} min</span>
        </div>
      </div>
    </div>
  );
};

// 2. Text Case Converter
const CaseConverter = () => {
  const [text, setText] = useState('The Quick Brown Fox Jumps Over the Lazy Dog');
  const [output, setOutput] = useState('');

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w]/g, '');
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Input Text</span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOutput(e.target.value);
          }}
          placeholder="Type or paste plain text..."
          className="w-full h-56 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
        />
      </div>

      <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-400 mb-1">TRANSFORMATIONS</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setOutput(text.toUpperCase())} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            UPPERCASE
          </button>
          <button onClick={() => setOutput(text.toLowerCase())} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            lowercase
          </button>
          <button onClick={() => setOutput(toTitleCase(text))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            Title Case
          </button>
          <button onClick={() => setOutput(toSentenceCase(text))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            Sentence Case
          </button>
          <button onClick={() => setOutput(toCamelCase(text))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            camelCase
          </button>
          <button onClick={() => setOutput(toSnakeCase(text))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            snake_case
          </button>
          <button onClick={() => setOutput(toKebabCase(text))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left col-span-2">
            kebab-case
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-200/50 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-neutral-400">RESULT OUTPUT</span>
            {output && <CopyButton text={output} />}
          </div>
          <div className="w-full min-h-[50px] max-h-20 p-2.5 bg-white dark:bg-neutral-950 border border-neutral-150 rounded-lg text-xs font-mono break-all overflow-y-auto select-all">
            {output || text}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Lorem Ipsum Generator
const LoremIpsumGen = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const loremSource = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Proin imperdiet tristique eleifend. Aliquam nec finibus diam, sit amet feugiat massa.',
    'Duis luctus ante sed arcu sodales posuere. Pellentesque hendrerit dolor vel augue tristique laoreet.',
    'Sed eleifend finibus nisl ac rhoncus. Suspendisse pulvinar arcu vel leo tincidunt rhoncus.',
    'Quisque ac est vel dui eleifend tempor.',
    'Curabitur facilisis augue in ipsum pellentesque volutpat.',
    'Nulla facilisi. Morbi quis mi vel magna feugiat pulvinar in id ex.',
    'Mauris varius felis sed sem molestie accumsan. Donec rhoncus ipsum in urna posuere tempor.',
    'Vivamus volutpat nisl vitae mi scelerisque egestas.',
    'Sed eget tristique eros, vel eleifend justo. Nam feugiat lectus feugiat est pharetra efficitur.',
  ];

  const generateLorem = () => {
    let result = '';
    if (type === 'paragraphs') {
      const paras = [];
      for (let i = 0; i < count; i++) {
        // shuffle source to generate paragraph
        const shuffled = [...loremSource].sort(() => 0.5 - Math.random());
        paras.push(shuffled.slice(0, 5).join(' '));
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents = [];
      for (let i = 0; i < count; i++) {
        sents.push(loremSource[Math.floor(Math.random() * loremSource.length)]);
      }
      result = sents.join(' ');
    } else {
      const wordsPool = loremSource.join(' ').replace(/[.,]/g, '').split(' ');
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(wordsPool[Math.floor(Math.random() * wordsPool.length)].toLowerCase());
      }
      result = words.join(' ');
      result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
    }
    setOutput(result);
  };

  useEffect(() => {
    generateLorem();
  }, [count, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-4">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Generate Count</span>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="px-3 py-1.5 w-20 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-bold"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>
        </div>
        <button
          onClick={generateLorem}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs transition-colors mt-4 sm:mt-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Regenerate Text</span>
        </button>
      </div>

      <div className="relative border border-neutral-200 dark:border-neutral-850 rounded-xl bg-white dark:bg-neutral-950 p-4">
        <div className="absolute top-3 right-3 z-10">
          {output && <CopyButton text={output} />}
        </div>
        <div className="w-full h-64 overflow-y-auto pr-16 whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-200 font-serif leading-relaxed">
          {output}
        </div>
      </div>
    </div>
  );
};

// 4. Text Compare & Diff (Simple Word Line Diff)
const TextCompare = () => {
  const [original, setOriginal] = useState('DevBox is a robust client-side software helper.\nAll tools are 100% offline.\nEnjoy simple responsive UI design.');
  const [modified, setModified] = useState('DevBox is an amazing client-side software platform.\nAll tools are 100% serverless and offline.\nEnjoy responsive visual layouts.');

  const getDiffLines = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const list = [];

    const maxLines = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLines; i++) {
      const o = origLines[i] || '';
      const m = modLines[i] || '';

      if (o === m) {
        list.push({ type: 'equal', text: o });
      } else {
        if (o) list.push({ type: 'removed', text: o });
        if (m) list.push({ type: 'added', text: m });
      }
    }
    return list;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-500">Original Text</span>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full h-36 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-500">Modified Text</span>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full h-36 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs font-mono"
          />
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-neutral-400 mb-2">LINE DIFF HIGHLIGHTS</h4>
        <div className="font-mono text-xs space-y-1 overflow-x-auto whitespace-pre">
          {getDiffLines().map((line, idx) => (
            <div
              key={idx}
              className={`px-2 py-0.5 rounded flex gap-2 ${
                line.type === 'added'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                  : line.type === 'removed'
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                  : 'text-neutral-500'
              }`}
            >
              <span className="w-4 select-none opacity-50">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Find and Replace
const FindReplace = () => {
  const [text, setText] = useState('DevBox offers 50 free web tools. These web tools are completely client-side.');
  const [findText, setFindText] = useState('web tools');
  const [replaceText, setReplaceText] = useState('responsive utilities');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [output, setOutput] = useState('');

  const triggerReplace = () => {
    if (!findText) {
      setOutput(text);
      return;
    }
    const escapedFind = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(escapedFind, flags);
    setOutput(text.replace(regex, replaceText));
  };

  useEffect(() => {
    triggerReplace();
  }, [text, findText, replaceText, caseSensitive]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Find Text</span>
          <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Replace With</span>
          <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs" />
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer pt-5">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded text-violet-600 w-4 h-4" />
          <span>Case Sensitive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-neutral-500">Source Text</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-neutral-500">Result Output</span>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-40 p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-sm font-mono select-all text-neutral-800 dark:text-neutral-200"
          />
        </div>
      </div>
    </div>
  );
};

// 6. Markdown Live Editor (With standard regex Markdown to HTML translator)
const MarkdownPreview = () => {
  const [markdown, setMarkdown] = useState('# DevBox Rocks!\n\nWelcome to **DevBox**. This is a **live Markdown editor** supporting:\n\n- Headers\n- Bullet items\n- Bold and Italics\n- Code blocks\n\n```javascript\nconst dev = "DevBox";\nconsole.log(dev);\n```');
  const [html, setHtml] = useState('');

  const parseMarkdown = (md: string) => {
    let clean = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers
    clean = clean.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold border-b pb-1 mb-2 text-violet-600 dark:text-violet-400">$1</h1>');
    clean = clean.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold border-b pb-1 mb-2 text-violet-500">$1</h2>');
    clean = clean.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mb-1">$1</h3>');

    // Code blocks
    clean = clean.replace(/```([\s\S]*?)```/g, '<pre class="bg-neutral-100 dark:bg-neutral-900 p-3 rounded font-mono text-xs overflow-auto my-2">$1</pre>');
    clean = clean.replace(/`([^`]+)`/g, '<code class="bg-neutral-150 dark:bg-neutral-850 px-1 py-0.5 rounded font-mono text-xs">$1</code>');

    // Bold & Italic
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    clean = clean.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet points
    clean = clean.replace(/^\- (.*?)$/gm, '<li class="list-disc list-inside ml-2">$1</li>');

    // Paragraphs / double newlines
    clean = clean.replace(/\n\n/g, '</p><p class="my-2">');

    return `<p class="my-2">${clean}</p>`;
  };

  useEffect(() => {
    setHtml(parseMarkdown(markdown));
  }, [markdown]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-500">Markdown Editor</span>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-80 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs font-mono"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-500">Live HTML Preview</span>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="w-full h-80 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-auto text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed markdown-body"
        />
      </div>
    </div>
  );
};

// 7. ROT13 & Text Reverser
const Rot13Reverser = () => {
  const [text, setText] = useState('Secret Message 123!');
  const [output, setOutput] = useState('');

  const runRot13 = () => {
    const rot = text.replace(/[a-zA-Z]/g, (c: string) => {
      const code = c.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(((code - base + 13) % 26) + base);
    });
    setOutput(rot);
  };

  const runReverse = () => {
    setOutput(text.split('').reverse().join(''));
  };

  const runReverseWords = () => {
    setOutput(text.split(/\s+/).reverse().join(' '));
  };

  useEffect(() => {
    runRot13();
  }, [text]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Input Text</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write text..."
          className="w-full h-56 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
        />
      </div>

      <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-400 mb-1">TRANSFORM ACTIONS</h4>
        <div className="flex flex-col gap-2">
          <button onClick={runRot13} className="px-3 py-2 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            Apply ROT13 Cipher
          </button>
          <button onClick={runReverse} className="px-3 py-2 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            Reverse Character Order
          </button>
          <button onClick={runReverseWords} className="px-3 py-2 bg-white dark:bg-neutral-950 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-neutral-800 border text-xs font-bold rounded-lg transition-all text-left">
            Reverse Word Positions
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-200/50 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-neutral-400">OUTPUT</span>
            {output && <CopyButton text={output} />}
          </div>
          <div className="w-full min-h-[50px] p-2.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono break-all overflow-y-auto select-all">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};

export const textToolsComponents: Record<string, () => React.JSX.Element> = {
  'word-counter': WordCounter,
  'case-converter': CaseConverter,
  'lorem-gen': LoremIpsumGen,
  'text-compare': TextCompare,
  'find-replace': FindReplace,
  'markdown-preview': MarkdownPreview,
  'rot13-reverser': Rot13Reverser,
};
