import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatKST(isoString) {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export default function Page() {
  return <BoardPage />;
}

async function BoardPage() {
  const supabase = createSupabaseServerClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      {/* Top bar */}
      <div className="border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">게시판</p>
            <h1 className="text-xl font-semibold tracking-tight">Daily Swing</h1>
          </div>

          <a
            className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Supabase
          </a>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        {/* Status */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            DB 에러: {error.message}
          </div>
        )}

        {/* Empty */}
        {!error && (posts ?? []).length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center dark:border-white/10 dark:bg-zinc-950">
            <p className="text-lg font-semibold">아직 글이 없어요</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Supabase의 posts 테이블에 데이터를 추가해보세요.
            </p>
          </div>
        )}

        {/* List */}
        <ul className="space-y-4">
          {(posts ?? []).map((p) => (
            <li
              key={p.id}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold tracking-tight">
                    {p.title ?? "(제목 없음)"}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {p.content ?? ""}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                    {p.created_at ? formatKST(p.created_at) : "-"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">ID: {p.id}</span>
                <span className="text-xs font-medium text-zinc-500 transition group-hover:text-zinc-800 dark:group-hover:text-zinc-100">
                  자세히 보기 →
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
