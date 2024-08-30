import { randomUUID } from 'crypto';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 divide-y-[1px] divide-colDark70">
      {Array.from({ length: 10 }).map(() => (
        <div className="flex flex-col lg:flex-row gap-14 py-12" key={randomUUID()}>
          <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start w-[400px] rounded-lg aspect-square bg-colDark70 animate-pulse" />
          <dl className="grid grid-cols-auto-fit-320 auto-rows-min gap-8 w-[100%]">
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Prompt details</dt>
              <div className="flex gap-2 flex-col">
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
              </div>
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Negative prompt</dt>
              <div className="flex gap-2 flex-col">
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
                <p className="w-[100%] h-4 bg-colDark70 animate-pulse" />
              </div>
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Created on</dt>
              <dd className="w-32 h-4 bg-colDark70 animate-pulse" />
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Input Resolution</dt>
              <dd className="w-32 h-4 bg-colDark70 animate-pulse" />
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Seed</dt>
              <dd className="w-32 h-4 bg-colDark70 animate-pulse" />
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
