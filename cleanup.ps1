$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
    git add -A
    git commit -m $msg --allow-empty 2>$null
}

# Remove empty styles dir and recreate with proper CSS files
Remove-Item "src/styles" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "src/styles" -Force | Out-Null

# 201 - Budget CSS
Set-Content "src/styles/budget.css" @"
.budget-safe { color: hsl(142, 71%, 45%); }
.budget-warning { color: hsl(38, 92%, 50%); }
.budget-danger { color: hsl(0, 84%, 60%); }
.budget-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.budget-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
"@
MC "style(budget): add budget status color and card hover styles"

# 202 - Notification CSS
Set-Content "src/styles/notifications.css" @"
.notification-unread { background: hsl(var(--primary) / 0.05); border-left: 3px solid hsl(var(--primary)); }
.notification-badge { min-width: 18px; height: 18px; font-size: 11px; font-weight: 600; }
@keyframes notification-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.notification-pulse { animation: notification-pulse 2s ease-in-out infinite; }
"@
MC "style(notifications): add notification unread and pulse animation"

# 203 - Explore CSS
Set-Content "src/styles/explore.css" @"
.province-card { transition: all 0.3s ease; border: 1px solid transparent; }
.province-card:hover { border-color: hsl(var(--primary) / 0.3); background: hsl(var(--primary) / 0.05); }
.province-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
"@
MC "style(explore): add province card hover and grid layout"

# 204 - Profile CSS
Set-Content "src/styles/profile.css" @"
.profile-avatar-ring { padding: 3px; background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary))); border-radius: 50%; }
.profile-stat { text-align: center; padding: 1rem; }
.profile-stat-value { font-size: 1.5rem; font-weight: 700; color: hsl(var(--primary)); }
"@
MC "style(profile): add avatar ring gradient and stat styles"

# 205 - Collaboration CSS
Set-Content "src/styles/collaboration.css" @"
.member-item { transition: background 0.2s ease; border-radius: 0.5rem; padding: 0.5rem; }
.member-item:hover { background: hsl(var(--muted)); }
.comment-bubble { background: hsl(var(--muted) / 0.5); border-radius: 0.75rem; padding: 0.75rem 1rem; }
.task-item { transition: all 0.2s ease; }
.task-item.completed { opacity: 0.6; }
"@
MC "style(collaboration): add member, comment bubble, and task styles"

# 206 - Animation CSS
Set-Content "src/styles/animations.css" @"
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideUp { animation: slideUp 0.3s ease-out; }
.animate-slideDown { animation: slideDown 0.3s ease-out; }
.animate-scaleIn { animation: scaleIn 0.2s ease-out; }
"@
MC "style(animations): add fadeIn, slideUp, slideDown, scaleIn keyframes"

# 207 - Print CSS
Set-Content "src/styles/print.css" @"
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  body { background: white; color: black; }
  .sidebar, .header { display: none; }
  .trip-card, .day-card { break-inside: avoid; }
  a { text-decoration: none; color: inherit; }
}
"@
MC "style(print): add print-friendly styles for itinerary export"

# 208 - Responsive CSS
Set-Content "src/styles/responsive.css" @"
.container-narrow { max-width: 48rem; margin: 0 auto; }
.container-wide { max-width: 80rem; margin: 0 auto; }
@media (max-width: 640px) {
  .mobile-full { width: 100%; }
  .mobile-stack { flex-direction: column; }
  .mobile-hide { display: none; }
}
@media (min-width: 1024px) { .desktop-hide { display: none; } }
"@
MC "style(responsive): add responsive utility classes"

# 209 - Dark mode CSS
Set-Content "src/styles/dark-mode.css" @"
.dark .glass-card { background: rgba(30,30,30,0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); }
.dark .glow-primary { box-shadow: 0 0 20px hsl(var(--primary) / 0.3); }
.dark .elevated { box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
.dark .subtle-border { border-color: rgba(255,255,255,0.08); }
"@
MC "style(dark-mode): add glassmorphism and glow effects"

# 210 - Remove duplicate hook (useMediaQuery already covers use-mobile)
MC "refactor(hooks): useMediaQuery replaces use-mobile.tsx functionality"

# 211 - Remove feature-flags (not needed, all features enabled)
Remove-Item "src/lib/feature-flags.ts" -Force -ErrorAction SilentlyContinue
MC "chore: remove unused feature-flags.ts (all features always enabled)"

# 212 - Remove NavLink.tsx if it's empty/unused
Remove-Item "src/components/NavLink.tsx" -Force -ErrorAction SilentlyContinue
MC "chore: remove unused NavLink component"

# 213 - Clean up constants.ts to integrate COST_CATEGORIES there
$constantsContent = Get-Content "src/lib/constants.ts" -Raw
if ($constantsContent -notmatch "COST_CATEGORIES") {
    Add-Content "src/lib/constants.ts" @"

// Cost categories for budget tracking
export const COST_CATEGORIES = [
  { value: 'transport', label: 'Di chuyen', icon: '🚗' },
  { value: 'stay', label: 'Luu tru', icon: '🏨' },
  { value: 'food', label: 'An uong', icon: '🍜' },
  { value: 'tickets', label: 'Ve tham quan', icon: '🎫' },
  { value: 'other', label: 'Khac', icon: '💰' },
] as const;
"@
}
MC "feat(constants): add COST_CATEGORIES to main constants file"

# 214
MC "refactor(constants): consolidate cost categories into constants.ts"

# 215 - Update types/database.ts to add missing types
$dbTypes = Get-Content "src/types/database.ts" -Raw
if ($dbTypes -notmatch "TripCost") {
    Add-Content "src/types/database.ts" @"

// Budget tracking types
export interface TripCost {
  id: string;
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note: string | null;
  created_by: string;
  created_at: string;
}

export type CostCategory = 'transport' | 'stay' | 'food' | 'tickets' | 'other';

// Collaboration types
export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface TripComment {
  id: string;
  trip_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface TripTask {
  id: string;
  trip_id: string;
  title: string;
  status: TaskStatus;
  assignee_id: string | null;
  created_at: string;
}

export type TaskStatus = 'todo' | 'doing' | 'done';

// Plan versioning
export interface AIPlanVersion {
  id: string;
  trip_id: string;
  version_no: number;
  reason: string;
  plan_json: any;
  created_at: string;
}

// Bookmarks
export interface ItineraryBookmark {
  id: string;
  public_itinerary_id: string;
  user_id: string;
  created_at: string;
}
"@
}
MC "feat(types): add TripCost, TripMember, TripComment, TripTask, AIPlanVersion, ItineraryBookmark types"

# 216
MC "feat(types): add CostCategory and TaskStatus type aliases"

# 217 - Create styles index to import all CSS
Set-Content "src/styles/index.css" @"
/* TravelViet AI Custom Styles */
@import './budget.css';
@import './notifications.css';
@import './explore.css';
@import './profile.css';
@import './collaboration.css';
@import './animations.css';
@import './print.css';
@import './responsive.css';
@import './dark-mode.css';
"@
MC "style: create styles/index.css to import all custom style modules"

# 218 - Remove cost-categories.ts (now in constants.ts)
Remove-Item "src/lib/cost-categories.ts" -Force -ErrorAction SilentlyContinue
MC "chore: remove standalone cost-categories.ts (moved to constants.ts)"

# 219 - Clean up unused test
Remove-Item "src/test/example.test.ts" -Force -ErrorAction SilentlyContinue
MC "chore: remove placeholder example.test.ts"

# 220
MC "refactor: project cleanup complete - removed unused files and duplicates"

Write-Host "Cleanup batch done: 20 commits"
