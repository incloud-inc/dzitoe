import React, { useRef } from 'react';
import { Bold, Italic, Underline, Link2, Image as ImageIcon, Sigma } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Tulis sesuatu...", minHeight = "120px" }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + startTag + selectedText + endTag + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startTag.length + (selectedText ? end : start);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border border-slate-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-300 px-3 py-2 flex items-center gap-1">
        <button type="button" onClick={() => insertTag('<b>', '</b>')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertTag('<i>', '</i>')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertTag('<u>', '</u>')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button type="button" onClick={() => insertTag('\\(', '\\)')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded" title="Sisipkan Rumus LaTeX"><Sigma className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertTag('<img src="', '" alt="" />')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded"><ImageIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertTag('<a href="', '" target="_blank">tautan</a>')} className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded"><Link2 className="w-4 h-4" /></button>
      </div>
      {/* Editor */}
      <textarea
        ref={textareaRef}
        className="w-full p-3 resize-y focus:outline-none text-sm text-slate-900 font-sans"
        style={{ minHeight }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
