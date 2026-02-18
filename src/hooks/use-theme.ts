"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>("light");

	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial = stored || (systemDark ? "dark" : "light");
		setThemeState(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
	}, []);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);

	return { theme, setTheme, toggleTheme };
}
