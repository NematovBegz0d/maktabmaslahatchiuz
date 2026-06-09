import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Baby, ClipboardCheck, User, TrendingUp, ChevronRight, Trophy } from "lucide-react";
import { QueryError } from "@/components/query-error";
import { ClubBadge } from "@/components/club-badge";
import type { ClubColor } from "@/types/clubs";

export const Route = createFileRoute("/parent-dashboard")({
  head: () => ({ meta: [{ title: "Farzandlarim — EduLens" }] }),
  component: () => (
    <ProtectedRoute requiredRoles={["parent"]}>
      <ParentDashboard />
    </ProtectedRoute>
  ),
});

interface ChildProfile {
  id: string;
  full_name: string | null;
  class_number: number | null;
  class_letter: string | null;
  schools: { name: string } | null;
}

interface ChildStudentProfile {
  profile_completeness: number | null;
  top_careers: { name_uz?: string; name?: string }[] | null;
}

function ParentDashboard() {
  const { user } = useAuth();

  const { data: children, isLoading: childrenLoading, isError: childrenError, refetch } = useQuery({
    queryKey: ["parent-children", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, class_number, class_letter, schools(name)")
        .eq("parent_id", user!.id)
        .order("full_name", { ascending: true });
      return (data ?? []) as ChildProfile[];
    },
  });

  const childIds = (children ?? []).map((c) => c.id);

  const { data: testResults, isLoading: resultsLoading } = useQuery({
    queryKey: ["parent-children-results", childIds],
    enabled: childIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("test_results")
        .select("student_id, test_id, tests(name_uz), created_at, personality_type, holland_code")
        .in("student_id", childIds)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: studentProfiles } = useQuery({
    queryKey: ["parent-children-profiles", childIds],
    enabled: childIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("student_profiles")
        .select("student_id, profile_completeness, top_careers")
        .in("student_id", childIds);
      const map: Record<string, ChildStudentProfile> = {};
      (data ?? []).forEach((p: any) => {
        map[p.student_id] = p;
      });
      return map;
    },
  });

  // Farzandlarning klub a'zoliklari
  const { data: childClubs } = useQuery({
    queryKey: ["parent-children-clubs", childIds],
    enabled: childIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("club_members")
        .select("student_id, joined_at, clubs(*)")
        .in("student_id", childIds);
      const map: Record<string, any[]> = {};
      (data ?? []).forEach((m: any) => {
        if (!map[m.student_id]) map[m.student_id] = [];
        map[m.student_id]!.push(m);
      });
      return map;
    },
  });

  const loading = childrenLoading || resultsLoading;

  const resultsByChild = (testResults ?? []).reduce<Record<string, typeof testResults>>((acc, r: any) => {
    if (!acc[r.student_id]) acc[r.student_id] = [];
    acc[r.student_id]!.push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Baby className="h-7 w-7 text-primary" /> Farzandlarim
          </h1>
          <p className="mt-1 text-muted-foreground">
            Farzandlaringizning test natijalari va kasb tavsiyalarini kuzating.
          </p>
        </div>

        {childrenError ? (
          <QueryError onRetry={() => refetch()} />
        ) : loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !children || children.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Baby className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Farzand profili topilmadi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Farzandingizning profili siz bilan bog'liq emas yoki hali ro'yxatdan o'tmagan.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {children.map((child) => {
              const sp = studentProfiles?.[child.id];
              const results = resultsByChild[child.id] ?? [];
              const completeness = sp?.profile_completeness ?? 0;
              const topCareer = sp?.top_careers?.[0];
              const clubs = childClubs?.[child.id] ?? [];

              return (
                <Card
                  key={child.id}
                  className="border-border/60"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <CardContent className="p-6">
                    {/* Child header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                          {(child.full_name ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{child.full_name ?? "Noma'lum"}</p>
                          <p className="text-xs text-muted-foreground">
                            {child.class_number
                              ? `${child.class_number}-${child.class_letter ?? ""} sinf`
                              : "Sinf kiritilmagan"}
                            {child.schools?.name ? ` • ${child.schools.name}` : ""}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/students/$id"
                        params={{ id: child.id }}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        To'liq profil <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Profil to'liqligi
                        </span>
                        <span className="font-semibold text-foreground">{completeness}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                    </div>

                    {/* Top career recommendation */}
                    {topCareer && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                        <User className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-foreground">
                          Tavsiya etilgan kasb:{" "}
                          <span className="font-semibold">{topCareer.name_uz ?? topCareer.name}</span>
                        </span>
                      </div>
                    )}

                    {/* Recent test results */}
                    <div className="mt-4">
                      <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <ClipboardCheck className="h-3 w-3" /> So'nggi natijalar
                      </p>
                      {results.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Hali test yechilmagan.</p>
                      ) : (
                        <div className="space-y-2">
                          {results.slice(0, 3).map((r: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
                            >
                              <span className="text-foreground">{r.tests?.name_uz ?? "Test"}</span>
                              <div className="flex items-center gap-2">
                                {r.personality_type && (
                                  <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                                    {r.personality_type}
                                  </Badge>
                                )}
                                {r.holland_code && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                                    {r.holland_code}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          {results.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              + {results.length - 3} ta boshqa natija
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Klublar */}
                    <div className="mt-4">
                      <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Trophy className="h-3 w-3" /> Klublar
                      </p>
                      {clubs.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Hali hech bir klubga a'zo emas.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {clubs.map((m: any) => {
                            const club = m.clubs;
                            if (!club) return null;
                            return (
                              <ClubBadge
                                key={m.student_id + club.id}
                                name={club.name}
                                icon={club.icon}
                                color={club.color as ClubColor}
                                size="sm"
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
