import GallerySkeleton from '@/components/Gallery/skeleton';
import { randomUUID } from 'crypto';
import { Suspense } from 'react';

export default function Layout({
  settings,
  children
}: {
  settings: Readonly<React.ReactNode>;
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <Suspense
        fallback={
          <GallerySkeleton maxWidth={300} className="pb-12">
            {Array.from({ length: 10 }).map(() => (
              <div className="flex flex-col gap-2" key={randomUUID()}>
                <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start rounded-lg aspect-square bg-colDark70 animate-pulse w-full" />
                <div className="text-colWhite80 flex">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[50%] w-[35px] h-[35px] bg-colDark70 animate-pulse" />
                    <span className="capitalize font-[400] bg-colDark70 animate-pulse w-20 h-4" />
                  </div>
                  <div className="p-2 rounded-lg ml-auto w-[35px] h-[35px] bg-colDark70 animate-pulse " />
                  <div />
                </div>
              </div>
            ))}
          </GallerySkeleton>
        }>
        {children}
      </Suspense>
      {settings}
    </>
  );
}
