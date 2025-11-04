# Project Instructions

- When working within `react-vite`, don't spin up dev servers with `npm run dev` to test your changes. Just be thorough writing the code.
- When working with `node-serve` don't try to spin up a dev server to verify changes; just be thorough with writing the code.

---

## Repository Findings (2025-11-04)

### Current State
**Tech Touchdown** - Sports + Tech news podcast application ("Hacker News meets Barstool")

### Authentication
- GitHub OAuth implementation via `githubAuth.ts` service + `AuthContext`
- Backend token exchange in `node-service/routes/auth.ts`
- Token stored in localStorage, validated against GitHub API
- **Current behavior**: Entire app guarded by `Layout` component - redirects to `/login` if unauthenticated

### Main Experience (Dashboard)
- **Dual feed layout**: Sports (left) + Tech (right)
- **Team Picker**: Multi-sport selection modal (NFL/NBA/MLB/NHL) - stored in localStorage
- **Tech Picker**: Multi-category selection modal (languages/frameworks/industries/companies)
- **Feed components**: `SportsSearch` + `TechSearch` using shared `SearchInterface`
- **Onboarding**: Team selection → Tech selection → Dashboard (both skippable)

### Routing Structure
```
/ → Layout (auth guard)
  ├─ / → Dashboard (dual feeds)
  ├─ /sports → Sports page
  ├─ /fantasy → Fantasy League
  ├─ /profile → Profile
  └─ /slideshow → Slideshow
```

### Task: Remove Auth Wall ✅ COMPLETED

**Implementation Summary:**
1. **Layout.tsx** - Removed auth guard that redirected to `/login`
   - Now shows "Sign in with GitHub" button in header when not authenticated
   - Shows user avatar and logout button when authenticated
   - Main experience loads immediately without authentication check

2. **AuthContext.tsx** - Made authentication optional
   - No longer throws errors when GitHub OAuth is not configured
   - App continues to load even if auth initialization fails
   - Gracefully handles unauthenticated state

3. **Profile.tsx** - Protected with ProtectedRoute
   - Only accessible when authenticated (redirects to `/login` if not)
   - Appropriate for pages that require user data

4. **GameChat.tsx** - Fixed fallback username
   - Uses `user?.login || 'Guest'` when user is not authenticated

5. **Routing** - Already properly structured
   - `/login` route remains available but optional
   - `/auth/callback` handles OAuth redirect flow
   - All main routes accessible without authentication

**Result:** Users can now access the main experience (Dashboard, Sports, Fantasy, Slideshow) without authentication. GitHub login is available via header button for optional features like Profile.

---

## UI Improvements (2025-11-04) ✅ COMPLETED

### Sports Page Loading Enhancements
**Problem:** Initial page load showed simple spinner, but refresh showed comprehensive loading UI with progress bar.

**Changes:**
1. **Sports.tsx** - Removed early returns for loading/error states
   - Deleted simple loading spinner early return (lines 223-229)
   - Deleted error early return (lines 231-261)
   - Now shows comprehensive loading UI during active loading states

2. **Comprehensive Loading UI** - Shows during manual refresh and first-time auto-processing
   - Condition: `(isAutoProcessing || isRefreshing)`
   - Displays: Progress bar, status message, plaintextsports.com processing info
   - Consistent UX for all active loading scenarios

3. **Error Handling** - Unified error display
   - Now shows API errors (`error`), Jina errors (`jinaError`), and Sports AI errors (`sportsAIError`) inline
   - Error message adapts based on error type
   - "Try again" button calls appropriate refetch function

4. **Auto-Load Behavior** - Smart initialization to prevent unnecessary fetches
   - Added `hasInitialized` state to track if component has loaded data
   - Auto-fetch only runs on very first visit when localStorage has no saved data
   - Subsequent page visits (navigation back to /sports) load from localStorage without fetching
   - Manual refresh required for updates after initial load

### Sidebar Navigation
**Change:** Re-exposed Fantasy League route
- Uncommented Fantasy League navigation item in `Sidebar.tsx`
- Users can now access `/fantasy` route from sidebar menu

**Result:** Improved user experience with consistent, informative loading states and restored Fantasy League access.
