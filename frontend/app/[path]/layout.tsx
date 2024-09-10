import Search from '@/components/Search';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';

export default function Layout({
  children,
  params,
  settings
}: Readonly<{
  children: Readonly<React.ReactNode>;
  params: { path: string };
  settings: Readonly<React.ReactNode>;
}>) {
  let path: string;
  if (['feed', 'collection'].includes(params.path.toLowerCase())) {
    path = params.path.toLowerCase();
  } else {
    redirect('/', RedirectType.replace);
  }

  return (
    <main className="main-layout flex flex-col gap-12 h-full w-full flex-grow relative overflow-y-auto">
      {path === 'feed' ? (
        <div>
          <div className="flex gap-1 bg-colDark90 rounded-xl border-colDark80 border-2 outline-none w-[80%] sm:w-[60%] lg:w-[40%] xl:w-[30%]">
            <Search />
            <Image
              src="/assets/Search.svg"
              width={30}
              height={30}
              alt="Search Icon"
              className="my-3 mr-3"
            />
          </div>
        </div>
      ) : (
        <h2 className="text-colWhite80 font-[500] text-2xl">My Collection</h2>
      )}
      {children}
      {settings}
    </main>
  );
}
