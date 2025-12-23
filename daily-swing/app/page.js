import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const upcoming = [
    { title: "초보 환영 소셜", date: "매주 금 8:00 PM", place: "홍대 ○○ 스튜디오" },
    { title: "입문 클래스", date: "매주 토 2:00 PM", place: "성수 △△ 홀" },
    { title: "연습 모임", date: "매주 일 6:00 PM", place: "합정 □□ 공간" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 로고 이미지가 없으면 이 Image 블록을 지우고 텍스트만 남겨도 OK */}
            <Image
              src="/logo.svg"
              alt="Swing Community"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="text-lg font-semibold tracking-tight">Swing Community</span>
          </div>

          <nav className="hidden gap-6 text-sm text-zinc-600 dark:text-zinc-400 sm:flex">
            <Link href="/events" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              모임
            </Link>
            <Link href="/classes" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              클래스
            </Link>
            <Link href="/board" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              게시판
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-16 rounded-3xl bg-white p-10 shadow-sm dark:bg-zinc-950">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              스윙댄스를 함께 배우고, 함께 추는 커뮤니티
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              초보도 환영! 소셜, 입문 클래스, 연습 모임까지 한 곳에서 일정 확인하고 사람들과
              연결될 수 있어요.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                다가오는 모임 보기
              </Link>
              <Link
                href="/join"
                className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                가입하기
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">다가오는 모임</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {upcoming.map((e) => (
              <div
                key={e.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{e.date}</div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{e.place}</div>
                <div className="mt-4">
                  <Link
                    href="/events"
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    자세히 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
