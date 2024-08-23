"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export function ThemeSwitcher() {
  const [ mounted, setMounted ] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log('theme', theme)
    setMounted(true);
  }, [theme]);

  return (
    <div>
      {theme === 'light' ? (
        <button className="flex items-center gap-2 w-full" onClick={() => setTheme('dark')}> <SunIcon className="w-5 h-5"/> Light </button>
      ) : (
        <button className="flex items-center gap-2 w-full" onClick={() => setTheme('light')}> <MoonIcon className=" w-5 h-5 "/> Dark </button>
      )}
    </div>
  );
}

export default ThemeSwitcher;


