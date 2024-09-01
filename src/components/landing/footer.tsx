
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src="/logo.png"  alt="MSU AI Club Logo" width={55} height={55} />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MSU AI Club</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link href="https://www.instagram.com/msu_ai_club/?hl=en" className="hover:underline me-4 md:me-6">Instagram</Link>
                        </li>
                        <li>
                            <Link href="https://dsc.gg/msuai" className="hover:underline me-4 md:me-6">Discord</Link>
                        </li>
                        <li>
                            <Link href="https://github.com/MSU-AI" className="hover:underline me-4 md:me-6">Github</Link>
                        </li>
                        <li>
                            <Link href="https://www.linkedin.com/company/75724713/" className="hover:underline me-4 md:me-6">LinkedIn</Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:underline">Terms</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 dark:text-gray-400"><Link href="https://www.linkedin.com/company/imaginemsu/" className="hover:underline">Made in collaboration with Imagine Software</Link> </span>
            </div>
        </footer>
    );
}
