import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/test1">test</Link>
      <Link href="/test2">test</Link>
      <Link href="https://toss.im/career/job-detail?job_id=6008304003">toss</Link>
    </div>
  );
}
