// =============================================================================
// FILE 1: PrivateRoute.tsx
// =============================================================================
// Save this file at: src/components/PrivateRoute.tsx
//
// This component protects admin routes by checking authentication status
// via the tRPC auth.me query. It redirects unauthenticated users to
// /admin/login and shows a loading spinner while the auth check runs.
// =============================================================================

import { type ReactNode } from "react";
import { Redirect } from "wouter";
import { trpc } from "../lib/trpc";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // auth.me returns the current user from the session cookie, or null/undefined
  // if no valid session exists. The query runs automatically on mount.
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery();

  // Show a centered spinner while the auth check is in flight.
  // This prevents a flash of the login page on slow connections.
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
        role="status"
        aria-label="Checking authentication"
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        {/* Inline keyframes so this works without any extra CSS imports */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If the query failed or returned no user, redirect to login.
  // The `replace` prop replaces the history entry so pressing "Back"
  // does not land the user on the protected page again.
  if (isError || !user) {
    return <Redirect to="/admin/login" replace />;
  }

  // User is authenticated -- render the protected content.
  return <>{children}</>;
}


// =============================================================================
// FILE 2: Updated App.tsx routes section (admin routes only)
// =============================================================================
// Replace your existing admin route block (~lines 50-75 in App.tsx) with the
// code below. The only change is wrapping each protected page component in
// <PrivateRoute>. The /admin/login route stays public so users can reach it.
//
// Make sure to add this import at the top of App.tsx:
//   import { PrivateRoute } from "./components/PrivateRoute";
// =============================================================================

/*
  -- PASTE THIS INTO App.tsx (routes section) --

  {/* Public: login page must be accessible without auth *\/}
  <Route path="/admin/login">
    <AdminLogin />
  </Route>

  {/* Protected admin routes *\/}
  <Route path="/admin/analytics">
    <PrivateRoute>
      <AdminAnalytics />
    </PrivateRoute>
  </Route>

  <Route path="/admin/assessments">
    <PrivateRoute>
      <AdminAssessments />
    </PrivateRoute>
  </Route>

  <Route path="/admin/orders">
    <PrivateRoute>
      <AdminOrders />
    </PrivateRoute>
  </Route>

  <Route path="/admin/nonprofits">
    <PrivateRoute>
      <AdminNonprofits />
    </PrivateRoute>
  </Route>
*/


// =============================================================================
// INTEGRATION CHECKLIST
// =============================================================================
//
// 1. Create src/components/PrivateRoute.tsx with the PrivateRoute component
//    from FILE 1 above (lines 14-62).
//
// 2. In App.tsx, add the import:
//      import { PrivateRoute } from "./components/PrivateRoute";
//
// 3. Replace your admin route block with the routes from FILE 2 above.
//
// 4. Make sure your tRPC auth router exposes a "me" query that returns
//    the user from ctx (which comes from the cookie-based session).
//    It should look something like:
//
//      me: publicProcedure.query((opts) => opts.ctx.user),
//
//    Returning null/undefined when there is no session is fine --
//    PrivateRoute treats that as "not authenticated."
//
// 5. Your server's cookies.ts should already be setting an HTTP-only
//    session cookie. The tRPC client sends cookies automatically as
//    long as you have `credentials: "include"` (or "same-origin") set
//    on your fetch/httpBatchLink configuration in lib/trpc.ts.
//
// 6. Test by:
//    - Visiting /admin/analytics while logged out -> should redirect to /admin/login
//    - Logging in -> should be able to access all admin routes
//    - Clearing cookies -> should redirect back to /admin/login
// =============================================================================
