// ============================================================================
// ROUTES
// ============================================================================

export const routes: {
  publicRoutes: { [key: string]: string };
  protectedRoutes: { [key: string]: string };
} = {
  publicRoutes: {
    home: "/",
    auth: "/auth",
    authCallback: "/auth/callback",
    confirmationPage: "/confirmation-page",
  },
  protectedRoutes: {
    settings: "/settings",
    timeline: "/timeline",
    userProfile: "/user",
  },
} as const;

export const apiRoutes = {} as const;

export const queryKeys = {} as const;
