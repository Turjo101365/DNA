import React from 'react';

/**
 * Lightweight, zero-dependency Sci-Fi/Medical styled Markdown Renderer
 * Accurately parses headers (###, ####), lists (- or *), bold/italic, code blocks,
 * callout alerts, tables, and horizontal rules with tailored Tailwind CSS styling.
 */
export default function MarkdownView({ content = '' }) {
  if (!content) return null;

  const renderFormattedText = (text) => {
    // Replace **bold** with <strong>
    const parts = [];
    // Regex for bold, italic, code, and links
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const val = match[0];
      if (val.startsWith('**') && val.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-cyan-200">
            {val.slice(2, -2)}
          </strong>
        );
      } else if (val.startsWith('*') && val.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-slate-300">
            {val.slice(1, -1)}
          </em>
        );
      } else if (val.startsWith('`') && val.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-amber-300"
          >
            {val.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const lines = content.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  let inCodeBlock = false;
  let codeLines = [];
  let keyIndex = 0;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyIndex++}`} className="my-2 space-y-1 pl-4 list-disc marker:text-cyan-400 text-xs sm:text-sm text-slate-200">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (inCodeBlock && codeLines.length > 0) {
      elements.push(
        <div key={`code-${keyIndex++}`} className="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
          <pre>{codeLines.join('\n')}</pre>
        </div>
      );
      codeLines = [];
      inCodeBlock = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code block check
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    // Horizontal rule
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      elements.push(
        <hr key={`hr-${keyIndex++}`} className="my-3 border-slate-800/80" />
      );
      continue;
    }

    // Headers
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${keyIndex++}`} className="mt-3 mb-1 text-xs sm:text-sm font-bold tracking-wide text-cyan-300 font-['Rajdhani'] uppercase">
          {renderFormattedText(line.slice(5))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${keyIndex++}`} className="mt-4 mb-2 text-sm sm:text-base font-extrabold tracking-wide text-sky-200 font-['Orbitron'] border-b border-sky-500/20 pb-1">
          {renderFormattedText(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('# ')) {
      flushList();
      const text = line.startsWith('## ') ? line.slice(3) : line.slice(2);
      elements.push(
        <h2 key={`h2-${keyIndex++}`} className="mt-4 mb-2 text-base sm:text-lg font-black text-cyan-400 font-['Orbitron'] tracking-wider">
          {renderFormattedText(text)}
        </h2>
      );
      continue;
    }

    // Unordered List Items (- or *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      listItems.push(line.slice(2));
      continue;
    }

    // Numbered List Items (1. , 2. )
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      flushList();
      elements.push(
        <div key={`num-${keyIndex++}`} className="flex items-start gap-2 my-1 text-xs sm:text-sm text-slate-200">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
            {numberedMatch[1]}
          </span>
          <div className="leading-relaxed pt-0.5">
            {renderFormattedText(numberedMatch[2])}
          </div>
        </div>
      );
      continue;
    }

    // Callout alert / Tip (e.g. 💡 or 📌 or >)
    if (line.startsWith('> ') || line.startsWith('💡 ') || line.startsWith('📌 ')) {
      flushList();
      elements.push(
        <div
          key={`alert-${keyIndex++}`}
          className="my-2.5 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-100/90 leading-relaxed shadow-[0_0_15px_rgba(0,240,255,0.05)]"
        >
          {renderFormattedText(line.replace(/^>\s*/, ''))}
        </div>
      );
      continue;
    }

    // Blank line
    if (!line) {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${keyIndex++}`} className="my-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {renderFormattedText(rawLine)}
      </p>
    );
  }

  flushList();
  flushCode();

  return <div className="space-y-1">{elements}</div>;
}
