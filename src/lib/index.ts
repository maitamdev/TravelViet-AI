// Utils index - export commonly used utilities
export { cn } from './utils';
export { formatVND, formatDateVN, formatShortDateVN, calculateTripDuration, generateShareSlug, VIETNAM_PROVINCES } from './constants';
export { fuzzySearch, highlightMatch, normalizeVietnamese, searchScore, sortByRelevance } from './search-utils';
export { truncateText, capitalizeFirst, slugify, pluralize, formatDuration, formatPercentage } from './format-utils';
export { getDaysUntil, isDateInPast, isDateInFuture, getDateRange, formatRelativeTime } from './date-utils';
export { calculateBudgetPerDay, calculateBudgetPerPerson, getBudgetStatus, formatBudgetShort } from './budget-utils';
export { removeVietnameseDiacritics, getInitials, maskEmail, formatFileSize, escapeHtml, stringToColor } from './string-utils';
export { clamp, roundTo, percentage, formatNumberVN, randomInt, average, sum, compactNumber } from './number-utils';
export { groupBy, uniqueBy, chunk, shuffle, sample } from './array-utils';
export { getErrorMessage, isNetworkError, logError, AppError, ErrorCodes } from './error-handling';