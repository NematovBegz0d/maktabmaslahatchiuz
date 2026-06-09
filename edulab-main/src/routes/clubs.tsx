import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { AppHeader } from "@/components/app-header";
import { ClubCard } from "@/components/club-card";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { CLUBS_STATIC } from "@/types/clubs";
import { Users, Trophy, Star, BookOpen } from "lucide-react";

export const Route = createFileRoute("/clubs")({
  head: () => ({ meta: [{ title: "Klublar — EduLens" }] }),
  component: () => (
    <ProtectedRoute>
      <ClubsPage />
    </ProtectedRoute>
  ),
});

function ClubsPage() {
  const { user, role } = useAuth();
  const isStaff = role === "counselor" || role === "admin";

  // DB dan klublar (id lar bilan)
  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Har bir klubdagi a'zolar soni
  const { data: memberCounts, isLoading: countsLoading } = useQuery({
    queryKey: ["club-member-counts"],
    enabled: !!clubs && clubs.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("club_members")
        .select("club_id");
      const counts: Record<string, number> = {};
      (data ?? []).forEach((row: any) => {
        counts[row.club_id] = (counts[row.club_id] ?? 0) + 1;
      });
      return counts;
    },
  });

  // O'quvchi uchun — o'zining klublari
  const { data: myMemberships } = useQuery({
    queryKey: ["my-club-memberships", user?.id],
    enabled: !!user && !isStaff,
    queryFn: async () => {
      const { data } = await supabase
        .from("club_members")
        .select("club_id")
        .eq("student_id", user!.id);
      return new Set((data ?? []).map((r: any) => r.club_id));
    },
  });

  const isLoading = clubsLoading || countsLoading;

  // Statistika
  const totalMembers = memberCounts
    ? Object.values(memberCounts).reduce((a, b) => a + b, 0)
    : 0;
  const topClub = clubs?.reduce<{ name: string; count: number } | null>((top, c) => {
    const count = memberCounts?.[c.id] ?? 0;
    if (!top || count > top.count) return { name: c.name, count };
    return top;
  }, null);
  const myClubCount = myMemberships?.size ?? 0;

  // DB bo'sh bo'lsa static ma'lumotlarni ko'rsatish (placeholder)
  const displayClubs = clubs && clubs.length > 0 ? clubs : CLUBS_STATIC.map((c, i) => ({
    ...c,
    id: `static-${i}`,
    created_at: new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">

        {/* ── Sarlavha ── */}
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Trophy className="h-7 w-7 text-primary" /> Maktab Klublari
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            {isStaff
              ? "Maktab klublarini boshqaring va o'quvchilarni ro'yxatga oling."
              : "Qiziqishlaringizga mos klubga qo'shiling va iqtidoringizni rivojlantiring."}
          </p>
        </div>

        {/* ── Statistika (faqat maslahatchi/admin) ── */}
        {isStaff && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Jami klublar"
              value={displayClubs.length}
              icon={Trophy}
              accent="primary"
            />
            <StatCard
              label="Jami a'zolar"
              value={totalMembers}
              icon={Users}
              accent="success"
            />
            <StatCard
              label="Eng faol klub"
              value={topClub?.name ?? "—"}
              icon={Star}
              accent="warning"
            />
          </div>
        )}

        {/* ── O'quvchi uchun stat ── */}
        {!isStaff && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Jami klublar"
              value={displayClubs.length}
              icon={BookOpen}
              accent="primary"
            />
            <StatCard
              label="A'zo bo'lgan klublarim"
              value={myClubCount}
              icon={Star}
              accent="success"
            />
          </div>
        )}

        {/* ── Klublar grid ── */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="border-border/60">
                <div className="h-1.5 w-full bg-muted" />
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayClubs.map((club: any) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  memberCount={memberCounts?.[club.id] ?? 0}
                  isMember={myMemberships?.has(club.id)}
                  role={role}
                />
              ))}
            </div>

            {/* DB bo'sh bo'lsa ogohlantirish */}
            {clubs && clubs.length === 0 && isStaff && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                ⚠️ Klublar hali databazaga qo'shilmagan. Yuqoridagi klublar namuna ko'rinishida
                ko'rsatilmoqda. Ularni Supabase orqali seed qiling.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
