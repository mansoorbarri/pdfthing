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
            Mansoor
          </a>
          . I built these tools because current one suck.
        </div>
        <div className="mt-4"></div>
        <Link href="/tools/compress" className="text-blue-500 hover:underline">
          Compress PDF
        </Link>
        <Link href="/tools/convert" className="text-blue-500 hover:underline">
          Convert PDF
        </Link>
        <Link href="/tools/split" className="text-blue-500 hover:underline">
          Split PDF
        </Link>
      </main>
      <footer className="flex flex-col mt-8 text-center text-sm text-gray-500">
        <a
          href="https://github.com/mansoorbarri/pdfthing"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View on GitHub
        </a>
          <a href="https://quickpic.t3.gg/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"> 
          Inspired by QuickPic
          </a>
      </footer>
    </div>
  );
}
