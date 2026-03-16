// Data migration helpers for localStorage schema changes
interface MigrationStep { version: number; description: string; migrate: () => void; }
const MIGRATION_KEY = 'travelviet_schema_version';
export function getCurrentSchemaVersion(): number { try { return parseInt(localStorage.getItem(MIGRATION_KEY) || '0', 10); } catch { return 0; } }
export function setSchemaVersion(version: number): void { localStorage.setItem(MIGRATION_KEY, String(version)); }
export function runMigrations(migrations: MigrationStep[]): { ran: number; errors: string[] } {
  const currentVersion = getCurrentSchemaVersion();
  const pending = migrations.filter(m => m.version > currentVersion).sort((a, b) => a.version - b.version);
  const errors: string[] = [];
  let ran = 0;
  for (const migration of pending) {
    try { migration.migrate(); setSchemaVersion(migration.version); ran++; console.log(`Migration v${migration.version}: ${migration.description}`); }
    catch (err) { errors.push(`v${migration.version}: ${err instanceof Error ? err.message : 'Unknown error'}`); break; }
  }
  return { ran, errors };
}
export const APP_MIGRATIONS: MigrationStep[] = [
  { version: 1, description: 'Initialize storage schema', migrate: () => { if (!localStorage.getItem('travelviet_theme')) localStorage.setItem('travelviet_theme', '"system"'); } },
  { version: 2, description: 'Add notification settings', migrate: () => { if (!localStorage.getItem('travelviet_notification_settings')) localStorage.setItem('travelviet_notification_settings', JSON.stringify({ enabled: true, sound: true, desktop: false })); } },
  { version: 3, description: 'Add map preferences', migrate: () => { if (!localStorage.getItem('travelviet_map_preferences')) localStorage.setItem('travelviet_map_preferences', JSON.stringify({ defaultZoom: 10, showLabels: true, mapStyle: 'standard' })); } },
];