import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useLocation } from "wouter";

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Mon profil";
  const initials = getInitials(user.name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Ouvrir le profil de ${displayName}`}
          className="flex min-h-10 max-w-[13rem] items-center gap-2 rounded-full border border-[#241846]/10 bg-white/70 px-1.5 py-1.5 text-left shadow-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8d6adf] focus-visible:ring-offset-2"
        >
          <Avatar className="h-8 w-8 border border-[#d8b65c]/60">
            <AvatarFallback className="bg-[#241846] text-xs font-semibold text-[#d8b65c]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-semibold text-[#241846] sm:block">
            {displayName}
          </span>
          <span className="sr-only">Menu du profil</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl border-[#241846]/10 p-2">
        <DropdownMenuLabel className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-[#241846]">{displayName}</p>
          <p className="mt-1 truncate text-xs font-normal text-muted-foreground">{user.email || "Compte Prime Visual"}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setLocation("/dashboard")} className="min-h-10 cursor-pointer rounded-xl px-3">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Mon studio</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLocation("/profile")} className="min-h-10 cursor-pointer rounded-xl px-3">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLocation("/subscription")} className="min-h-10 cursor-pointer rounded-xl px-3">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Mon abonnement</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => void logout()}
          className="min-h-10 cursor-pointer rounded-xl px-3 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
