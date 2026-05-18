"use client";

import { useClerk } from "@clerk/nextjs";

export default function SignOutBtn({ variant = "dark" }) {
    const { signOut } = useClerk();
    const isLight = variant === "light";

    return (
        <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className={
                isLight
                    ? "group/link inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] px-4 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-[0_16px_30px_rgba(15,23,42,0.10)]"
                    : "group/link flex w-full items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-red-400"
            }
        >
            <svg
                className={
                    isLight
                        ? "h-4 w-4 text-slate-400 transition-colors duration-200 group-hover/link:text-sky-700"
                        : "h-3.5 w-3.5 text-white/20 transition-colors duration-200 group-hover/link:text-red-400"
                }
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
            </svg>
            {isLight ? "Salir" : "Cerrar sesion"}
        </button>
    );
}
