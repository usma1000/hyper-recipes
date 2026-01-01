// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c17ad27a357882ec9caa8494dcf727bb@o4507369009709056.ingest.us.sentry.io/4507369017507840",

  // Only enable in production to save quota
  enabled: process.env.NODE_ENV === "production",

  // Sample 100% of traces in production for performance monitoring
  // Consider reducing to 0.1-0.2 for high-traffic production apps
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable Spotlight for local development debugging
  spotlight: process.env.NODE_ENV === "development",

  // Capture breadcrumbs for better context
  beforeBreadcrumb(breadcrumb) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
      return null;
    }
    return breadcrumb;
  },
});
