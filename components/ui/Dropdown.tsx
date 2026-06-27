"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Input from "./Input";

interface DropdownProps {
  options: string[];
  label?: string;
  styles?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  hasSearch?: boolean;
}

function Dropdown({
  options,
  label,
  styles,
  value,
  setValue,
  hasSearch,
}: DropdownProps) {
  const [selecting, setSelecting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const displayedOptions = useMemo(() => {
    return options.filter((o) =>
      o.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [search, options]);
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
        <div
          className="absolute top-[calc(100%+5px)] left-[-10%] w-[120%] max-h-80 overflow-auto
         bg-zinc-950 rounded border-2 border-zinc-700"
        >
          {label && <div className="font-bold text-center py-1.5">{label}</div>}
          {hasSearch && (
            <Input
              placeholder="Search options"
              value={search}
              setValue={(s) => setSearch(s)}
              styles="w-[calc(100%-16px)] px-2! py-1 my-2 mx-2 text-sm"
            />
          )}
          {displayedOptions.length > 0 ? (
            displayedOptions.map((option, i) => {
              return (
                <div
                  key={i}
                  className={`cursor-pointer px-4 py-2 hover:bg-zinc-900 text-center ${value === option && "text-green-500 font-bold"}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              );
            })
          ) : (
            <div className="text-center py-3">No tags found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
