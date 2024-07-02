'use client';

import Header from '@/components/Header';

export default function Page() {

  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <div className="border-x border-gray-400 mt-12 p-4 w-full max-w-xl h-full bg-white dark:bg-gray-700">
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-xl font-bold">Join a video session</h1>
        </div>
      </div>
    </main>
  );
}