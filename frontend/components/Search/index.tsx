'use client';

import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  let search: string | undefined;
  if (typeof searchParams.get('search') === 'string') {
    search = searchParams.get('search') as string;
  }
  return (
    <form method="GET" className="w-[100%]" action="/feed/1">
      <input
        type="text"
        name="search"
        size={3}
        required
        defaultValue={search}
        placeholder="Search images by keywords"
        className="p-4 bg-colDark90 text-lg text-colWhite80 outline-none border-none placeholder-colDark60 w-[100%] rounded-xl"
      />
    </form>
  );
}
