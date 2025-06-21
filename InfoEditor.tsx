import React, { useEffect, useRef } from 'react';

interface InfoEditorProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

export function InfoEditor({ value, onChange, maxLength = 3000 }: InfoEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const lastValue = useRef(value);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== value) {
      divRef.current.innerHTML = value;
    }
    lastValue.current = value;
  }, [value]);

  const exec = (command: string, val?: string) => {
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, val);
    if (divRef.current) {
      onChange(divRef.current.innerHTML);
      lastValue.current = divRef.current.innerHTML;
    }
  };

  const handleInput = () => {
    const el = divRef.current;
    if (!el) return;
    const textLength = el.innerText.length;
    if (textLength > maxLength) {
      el.innerHTML = lastValue.current;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return;
    }
    lastValue.current = el.innerHTML;
    onChange(el.innerHTML);
  };

  const textLength = divRef.current?.innerText.length ?? value.replace(/<[^>]*>/g, '').length;

  return (
    <div className="border border-gray-300 rounded-lg">
      <div className="flex items-center space-x-2 p-2 border-b">
        <select
          className="border rounded px-1 text-xs"
          defaultValue="3"
          onChange={(e) => exec('fontSize', e.target.value)}
        >
          <option value="2">Petit</option>
          <option value="3">Normal</option>
          <option value="5">Grand</option>
        </select>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="text-sm font-bold px-1 border rounded"
        >
          U
        </button>
        <div className="flex space-x-1">
          {['#000000', '#dc2626', '#2563eb', '#16a34a'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => exec('foreColor', c)}
              style={{ backgroundColor: c }}
              className="w-4 h-4 rounded border"
            />
          ))}
        </div>
      </div>
      <div
        ref={divRef}
        className="p-2 h-[200px] overflow-auto focus:outline-none"
        contentEditable
        onInput={handleInput}
      />
      <div className="text-right text-xs text-gray-500 border-t px-2 py-1">
        {textLength} / {maxLength}
      </div>
    </div>
  );
}
