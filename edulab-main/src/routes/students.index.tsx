import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ChevronRight, Search, ChevronLeft, UserPlus } from "lucide-react";
import { QueryError } from "@/components/query-error";
import { useI18n } from "@/lib/i18n";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/students/")({
  head: () => ({ meta: [{ title: "O'quvchilar — EduLens" }] }),
  component: () => (<ProtectedRoute requiredRoles={["admin"]}><StudentsList /></ProtectedRoute>),
});

function StudentsList() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useI18n();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      // student_directory — faqat 'student' rolli profillar; school_name view ichida JOIN qilingan
      const { data } = await supabase
        .from("student_directory")
        .select("id, full_name, class_number, class_letter, school_id, school_name")
        .order("full_name", { ascending: true });
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((s: any) =>
    !q || (s.full_name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(value: string) {
    setQ(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <Users className="h-7 w-7 text-primary" /> O'quvchilar
            </h1>
            <p className="mt-1 text-muted-foreground">Maslahatchi paneli — o'quvchilar ro'yxati va profillari.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("students_search")}
                value={q}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link to="/students-manage">
              <Button size="sm" className="shrink-0">
                <UserPlus className="mr-1.5 h-4 w-4" /> Qo'shish
              </Button>
            </Link>
          </div>
        </div>

        {isError ? (
          <QueryError onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="p-10 text-center text-muted-foreground">{t("students_empty")}</CardContent></Card>
        ) : (
          <>
            <div className="mb-2 text-sm text-muted-foreground">
              Jami: <span className="font-medium text-foreground">{filtered.length}</span> ta o'quvchi
            </div>
            <div className="grid gap-3">
              {paginated.map((s: any) => (
                <Link
                  key={s.id}
                  to="/students/$id"
                  params={{ id: s.id }}
                  className="block"
                >
                  <Card className="border-border/60 transition hover:border-primary/40 hover:shadow-md" style={{ boxShadow: "var(--shadow-card)" }}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {(s.full_name ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{s.full_name ?? "Noma'lum"}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.class_number ? `${s.class_number}-${s.class_letter ?? ""} sinf` : "Sinf kiritilmagan"}
                            {s.school_name ? ` • ${s.school_name}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Profil</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {t("page")} <span className="font-semibold text-foreground">{safePage}</span> / <span className="font-semibold text-foreground">{totalPages}</span>
                  {" "}·{" "}
                  {t("students_total")}: <span className="font-semibold text-foreground">{filtered.length}</span> ta o'quvchi
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    aria-label={t("previous")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">…</span>
                      ) : (
                        <Button
                          key={p}
                          variant={p === safePage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p as number)}
                          className="min-w-9"
                          aria-label={`${t("page")} ${p}`}
                          aria-current={p === safePage ? "page" : undefined}
                        >
                          {p}
                        </Button>
                      )
                    )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    aria-label={t("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}