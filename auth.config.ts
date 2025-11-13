import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      console.log("--------Proxy authorized", { isOnDashboard, isLoggedIn, path: nextUrl.pathname });

      // ✅ 未登录访问 /dashboard → 重定向到 /login
      if (isOnDashboard && !isLoggedIn) {
        const redirectUrl = new URL("/login", nextUrl);
        // 把原始目标页带上，登录后可回跳
        redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }

      // ✅ 已登录访问 /login → 跳转到 /dashboard
      if (!isOnDashboard && isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // 其余情况正常访问
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
