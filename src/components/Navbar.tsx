"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="ICL home"
          className="text-2xl font-black tracking-tight text-zinc-900 transition-colors hover:text-zinc-600"
        >
          icl<span className="text-zinc-400">.</span>
        </Link>

        {status === "loading" ? (
          <div className="h-9 w-20" aria-hidden="true" />
        ) : status === "authenticated" ? (
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden text-sm text-zinc-600 sm:inline">

              <span className="font-semibold text-zinc-900">
                {session.user?.name ?? session.user?.username ?? "there"}
              </span>
            </span>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="rounded-xl border-zinc-300 px-4 hover:bg-zinc-100"
            >
              Log out
            </Button>
          </div>
        ) : (
          <Link href="/signin">
            <Button className="rounded-xl px-5">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
