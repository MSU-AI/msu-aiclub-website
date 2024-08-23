"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"


export function ThemeSwitcherButton() {
  const [ mounted, setMounted ] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log('theme', theme)
    setMounted(true);
  }, [theme]);

  return (
    <div>
      {theme === 'light' ? (
        <Button variant="outline" size="icon" onClick={() => setTheme('dark')}> <MoonIcon /> </Button>
      ) : (
        <Button variant="outline" size="icon" onClick={() => setTheme('light')}> <SunIcon /> </Button>
      )}
    </div>
  );
}

export default ThemeSwitcherButton;

