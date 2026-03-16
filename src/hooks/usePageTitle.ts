import { useEffect, useRef } from 'react';

const APP_NAME = 'TravelViet AI';
const SEPARATOR = ' | ';

/**
 * Set the document title with app name suffix
 * Restores the original title on unmount
 */
export function usePageTitle(title: string, restoreOnUnmount = true): void {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    const fullTitle = title ? `${title}${SEPARATOR}${APP_NAME}` : APP_NAME;
    document.title = fullTitle;

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle.current;
      }
    };
  }, [title, restoreOnUnmount]);
}

/**
 * Set a notification badge count in the title
 */
export function useNotificationTitle(count: number, baseTitle: string): void {
  useEffect(() => {
    const prefix = count > 0 ? `(${count}) ` : '';
    document.title = `${prefix}${baseTitle}${SEPARATOR}${APP_NAME}`;
  }, [count, baseTitle]);
}