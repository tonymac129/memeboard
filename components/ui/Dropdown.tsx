"use client";

import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  options: string[];
  label?: string;
  styles?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function Dropdown({ options, label, styles, value, setValue }: DropdownProps) {
  const [selecting, setSelecting] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleSelect(option: string) {
    setValue(option);
    setSelecting(false);
  }

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setSelecting(false);
      }
    };

    document.addEventListener("click", clickListener);

    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={
          "bg-zinc-900 rounded w-30 py-1.5 text-center cursor-pointer font-bold px-5 " +
          styles
        }
        onClick={() => setSelecting(!selecting)}
      >
        {value}
      </div>
      {selecting && (
        <div className="absolute top-[calc(100%+5px)] left-[-10%] w-[120%] bg-zinc-950 rounded border-2 border-zinc-700">
          {label && <div className="font-bold text-center py-1.5">{label}</div>}
          {options.map((option, i) => {
            return (
              <div
                key={i}
                className={`cursor-pointer px-4 py-2 hover:bg-zinc-900 text-center ${value === option && "text-green-500 font-bold"}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
