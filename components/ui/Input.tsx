"use client";

interface InputProps {
  placeholder: string;
  type?: string;
  value: string;
  setValue: (value: string) => void;
  styles?: string;
}

function Input({ placeholder, type, value, setValue, styles }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={
        "text-base border-2 border-zinc-700 rounded px-4 py-2 text-zinc-300 outline-none " +
        styles
      }
    />
  );
}

export default Input;
