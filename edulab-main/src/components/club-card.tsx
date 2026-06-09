import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CLUB_COLOR_MAP, type Club, type ClubColor } from "@/types/clubs";

interface ClubCardProps {
  club: Club;
  memberCount?: number;
  isMember?: boolean;
  role?: "counselor" | "admin" | "student" | "parent" | null;
  /** Namuna (fallback) rejimida — detal sahifaga o'tib bo'lmaydi */
  disabled?: boolean;
}

export function ClubCard({
  club,
  memberCount,
  isMember,
  role,
  disabled,
}: ClubCardProps) {
  const { t } = useI18n();
  const colors = CLUB_COLOR_MAP[club.color as ClubColor] ?? CLUB_COLOR_MAP.blue;
  const isStaff = role === "counselor" || role === "admin";

  const ctaLabel = isStaff
    ? t("clubs_manage")
    : isMember
      ? t("clubs_details")
      : t("clubs_view");

  return (
    <Card
      className={`group relative overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-lg ${colors.border}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Yuqori rang chizig'i */}
      <div className={`h-1.5 w-full ${colors.bg}`} />

      <CardContent className="flex h-full flex-col gap-4 p-5">
        {/* Icon + Nom + Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${colors.soft}`}
            >
              {club.icon}
            </span>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">{club.name}</h3>
              {isMember && (
                <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" /> {t("clubs_member")}
                </span>
              )}
            </div>
          </div>

          {/* A'zolar soni (maslahatchi uchun) */}
          {isStaff && memberCount !== undefined && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${colors.badge}`}
            >
              <Users className="h-3 w-3" />
              {memberCount}
            </span>
          )}
        </div>

        {/* Tavsif */}
        <p className="line-clamp-2 text-sm text-muted-foreground flex-1">{club.description}</p>

        {/* Fokus yo'nalishlari */}
        <div className="flex flex-wrap gap-1.5">
          {club.focus_area
            .split(", ")
            .filter(Boolean)
            .map((tag) => (
              <Badge key={tag} variant="secondary" className={`text-xs ${colors.badge}`}>
                {tag}
              </Badge>
            ))}
        </div>

        {/* Tugma — fallback rejimida o'chirilgan */}
        {disabled ? (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            {ctaLabel}
          </Button>
        ) : (
          <Button
            asChild
            variant={isMember ? "outline" : "default"}
            size="sm"
            className="w-full"
          >
            <Link to="/clubs/$id" params={{ id: club.id }}>
              {ctaLabel}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
