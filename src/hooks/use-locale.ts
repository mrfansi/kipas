"use client";

import { useCallback, useState, useEffect } from "react";

type Locale = "id" | "en";

export function useLocale() {
	const [locale, setLocaleState] = useState<Locale>("id");

	useEffect(() => {
		const cookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith("locale="));
		const stored = cookie?.split("=")[1] as Locale | undefined;
		if (stored) setLocaleState(stored);
	}, []);

	const setLocale = useCallback((newLocale: Locale) => {
		setLocaleState(newLocale);
		document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
		window.location.reload();
	}, []);

	return { locale, setLocale };
}
