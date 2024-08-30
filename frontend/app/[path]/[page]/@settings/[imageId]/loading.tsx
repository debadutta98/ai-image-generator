import { DownloadButton, GenerateWithSettingsButton } from '@/components/Button';
import { History } from '@/types';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className={`flex flex-col tablet:flex-row gap-14 py-10`}>
      <div>
        <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start w-[400px] rounded-lg aspect-square bg-colDark70 animate-pulse" />
        <DownloadButton
          fileId={''}
          className="normal-case text-colWhite80 bg-colDark80 rounded-lg py-2 px-5 text-lg mt-4"
          startIcon={<Image src="/assets/downarrow.svg" width={30} height={30} alt="downarrow" />}
          disabled
        />
      </div>
      <div className="flex flex-col gap-5 w-full">
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
        <GenerateWithSettingsButton
          setting={{} as History}
          className="rounded-lg py-3 text-lg text-colWhite80"
          startIcon={<Image src="/assets/Magic.svg" width={30} height={30} alt="downarrow" />}
          disabled
        />
      </div>
    </div>
  );
}
