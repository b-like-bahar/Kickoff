import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/supabase-middleware";
import { logger } from "@/utils/logger";

export async function proxy(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  const method = req.method;
  const url = req.nextUrl.pathname;
  const requestId = crypto.randomUUID();

  logger.info({ method, url, ip, ua, requestId }, "Incoming request");

  // update user's auth session
  const res = await updateSession(req);

  // Add request ID to response headers
  res.headers.set("x-request-id", requestId);

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
