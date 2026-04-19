// ═══════════════════════════════════════════════════════
// MYSTIC STORE — persistent user profile via localStorage
// Keeps name + DOB across sessions and flows.
// Used by WelcomeBack.jsx and App.jsx.
// ═══════════════════════════════════════════════════════

const PROFILE_KEY = 'mf_profile';

/**
 * Save the user's name and date of birth to localStorage.
 * Call this whenever a user completes the DetailsPage.
 */
export function saveProfile(name, dob) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      name,
      dob,
      savedAt: Date.now(),
    }));
  } catch (e) {
    // localStorage may be unavailable in some browsers — fail silently
  }
}

/**
 * Read the saved profile. Returns { name, dob, savedAt } or null.
 */
export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic sanity check
    if (!parsed?.name || !parsed?.dob) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

/**
 * Mark that the user has successfully completed a palm scan.
 * Only call this after BiometricScan onComplete fires for the user (not partner).
 * WelcomeBack checks this flag before allowing the scan to be skipped on return visits.
 */
export function markScanComplete() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    parsed.scanComplete = true;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed));
  } catch (e) {}
}

/**
 * Remove the saved profile (used when user taps "Not {name}?").
 */
export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {}
}
