export const supportedLocales = ['ru'] as const;

export type UiLocale = (typeof supportedLocales)[number];
