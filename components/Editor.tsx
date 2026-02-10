import React from 'react';

interface EditorProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  title: string;
  isValid?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange, readOnly = false, title, isValid = true }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
      <div className="px-4 py-2 bg-slate-800 text-xs font-mono text-slate-400 flex justify-between items-center border-b border-slate-700">
        <span>{title}</span>
        {!isValid && <span className="text-red-400">Invalid JSON</span>}
      </div>
      <textarea
        className="flex-1 w-full bg-transparent text-slate-300 font-mono text-sm p-4 focus:outline-none resize-none"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
      />
    </div>
  );
};
