import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-between p-8 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="flex flex-grow flex-col items-center justify-center">
        <div>
          Hi. I&apos;m{" "}
          <a
            href="https://twitter.com/mansoorbarri"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Theo
          </a>
          . I built these tools because current one suck.
        </div>
        <div className="mt-4"></div>
        <Link href="/combine" className="text-blue-500 hover:underline">
          Combine PDF
        </Link>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <a
          href="https://github.com/mansoorbarri/pdfthing"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}