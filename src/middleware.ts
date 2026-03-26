import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
	const isApiAuthRoute = context.url.pathname.startsWith("/api/auth");
	if (isApiAuthRoute) {
		return next();
	}
	
	const session = await auth.api.getSession({
        headers: context.request.headers
    });
    
    // Explicitly using explicit routes to avoid SSR mismatch on statics if needed
    const isAdminRoute = context.url.pathname.startsWith("/admin");
    const isLoginRoute = context.url.pathname === "/admin/login" || context.url.pathname === "/admin/setup";

    if (isAdminRoute && !isLoginRoute && !session) {
        return context.redirect("/admin/login");
    }

    if (isLoginRoute && session) {
        return context.redirect("/admin");
    }

    return next();
});
