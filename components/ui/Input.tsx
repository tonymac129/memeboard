"use client";

interface InputProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

function Input({ placeholder, value, setValue }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-zinc-300 outline-none"
    />
  );
}

export default Input;
