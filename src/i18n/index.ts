import { getLocales } from 'expo-localization';
import { ru, type Messages } from './ru';
import { supportedLocales, type UiLocale } from './types';

const messages: Record<UiLocale, Messages> = {
  ru,
};

export function getSystemLocale(): string | undefined {
  return getLocales()[0]?.languageCode ?? undefined;
}

export function getUiLocale(): UiLocale {
  const systemLocale = getSystemLocale();
  return supportedLocales.find((locale) => locale === systemLocale) ?? 'ru';
}

export function getMessages(locale: UiLocale = getUiLocale()): Messages {
  return messages[locale];
}

/** Сообщения, выбранные по языку системы с fallback на русский. */
export const strings = getMessages();

export type { Messages, UiLocale };
