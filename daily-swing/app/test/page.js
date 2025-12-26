import { createSupabaseServerClient } from "@/lib/supabase/server";
//Supabase와 서버에서 직접 통신하기 위한 함수
// @/ 는 프로젝트 루트 기준 경로 별칭
// 이 페이지는 서버 컴포넌트이므로 보안상 안전하게 DB 접근 가능


function formatKST(isoString) {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}
//Supabase에서 오는 created_at 값은 UTC 기준 ISO 문자열
//이를 한국 시간(Asia/Seoul) 으로 변환


export default function Page() {
  return <BoardPage />;
}
//Next.js App Router 규칙
//page.js의 기본 export
//실제 로직은 BoardPage에 위임

async function BoardPage() {
// 실제 게시판 로직
// async → 서버에서 DB 조회 가능
// 브라우저로 이 코드는 내려가지 않음

const supabase = createSupabaseServerClient();
//Supabase 연결
//환경변수 기반으로 Supabase 클라이언트 생성
//서버에서만 실행됨
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
//posts 테이블에서
//가져오는 컬럼: id, title, content, created_at
//최신 글이 위로 오도록 정렬
//최대 20개만 가져옴

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
    {/* Tailwind CSS 사용 */}
    {/*✅ 라이트 / 다크 모드 대응 */}
    {/*최소 화면 높이를 전체 화면으로 설정 */}
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
{/* 좌측:
게시판 (서브 타이틀)
Daily Swing (메인 타이틀)

우측:
Supabase 대시보드로 이동하는 버튼
개발 중 DB 바로 확인용 링크 */}


      {/* Content */}
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        {/* Status */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            DB 에러: {error.message}
          </div>
        )}
{/* DB 조회 실패 시
사용자에게 에러 메시지 표시
실무에서 매우 중요한 UX 처리 */}


        {/* Empty */}
        {!error && (posts ?? []).length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center dark:border-white/10 dark:bg-zinc-950">
            <p className="text-lg font-semibold">아직 글이 없어요</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Supabase의 posts 테이블에 데이터를 추가해보세요.
            </p>
          </div>
        )}
{/* 의미
에러는 없는데
게시글이 0개면
화면
아직 글이 없어요
Supabase의 posts 테이블에 데이터를 추가해보세요.

→ 초기에 아주 좋은 안내 메시지 👍*/}


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
                  {/* 제목이 없으면 (제목 없음) 표시 */}


                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {p.content ?? ""}
                  </p>
                  {/* 최대 2줄까지만 보여줌 - 게시판 목록에 딱 좋은 UX */}
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                    {p.created_at ? formatKST(p.created_at) : "-"}
                    {/* 한국 시간으로 변환해서표시 날짜 없으면 - */}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">ID: {p.id}</span>
                <span className="text-xs font-medium text-zinc-500 transition group-hover:text-zinc-800 dark:group-hover:text-zinc-100">
                  자세히 보기 →
                  {/* 게시글 고유 ID 표시 - 나중에 상세 페이지(/posts/[id])로 확장하기 좋음 */}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
