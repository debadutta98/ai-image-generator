import { calculateAspectRatio } from '@/utils';
import TextCollapse from '@/components/TextCollapse';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';
import { History } from '@/types';
import { DownloadButton, GenerateWithSettingsButton } from '@/components/Button';
import { cookies } from 'next/headers';

export default async function Page({
  params
}: {
  params: {
    path: string;
    page: string;
    imageId: string;
  };
}) {
  if (!ObjectId.isValid(params.imageId)) {
    return redirect(`/${params.path}/${params.page}`, RedirectType.replace);
  }
  let status: number, data: History | undefined;
  try {
    data = await fetch(`${process.env.BACKEND_URL}/api/image/setting/${params.imageId}`, {
      method: 'GET',
      headers: { Cookie: cookies().toString() }
    }).then(async (res) => {
      status = res.status;
      if (res.ok) {
        return await res.json();
      } else {
        console.log(await res.json());
      }
    });
  } catch (err) {
    status = 500;
    console.error('Failed to fetch the image data', err);
  }
  return (
    data && (
      <div className={`flex flex-col tablet:flex-row gap-14 py-10`}>
        <div>
          <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start w-[400px] rounded-lg">
            <Image
              src={`/api/image/${data.image_Id}`}
              width={data.width}
              height={data.height}
              alt="mena"
              className="rounded-lg h-auto"
            />
          </div>
          <DownloadButton
            fileId={data.image_Id}
            className="normal-case text-colWhite80 bg-colDark80 rounded-lg py-2 px-5 text-lg mt-4"
            startIcon={<Image src="/assets/downarrow.svg" width={30} height={30} alt="downarrow" />}
          />
        </div>
        <div className="flex flex-col gap-5 w-full">
          <dl className="grid grid-cols-auto-fit-320 auto-rows-min gap-8 w-[100%]">
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Prompt details</dt>
              {(data.prompt || 'Null').length > 100 ? (
                <TextCollapse className="text-colWhite80 text-[16px]">{data.prompt}</TextCollapse>
              ) : (
                <p className="text-colWhite80 text-[16px]">{data.prompt || 'Null'}</p>
              )}
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Negative prompt</dt>
              {(data.negative_prompt || 'Null').length > 100 ? (
                <TextCollapse className="text-colWhite80 text-[16px]">
                  {data.negative_prompt || 'Null'}
                </TextCollapse>
              ) : (
                <p className="text-colWhite80 text-[16px]">{data.negative_prompt || 'Null'}</p>
              )}
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Created on</dt>
              <dd className="text-colWhite80 text-[16px]">
                {new Date(data.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Input Resolution</dt>
              <dd className="text-colWhite80 text-[16px]">
                {calculateAspectRatio(data.width, data.height)}
              </dd>
            </div>
            <div>
              <dt className="text-colDark60 font-[500] text-[17px]">Seed</dt>
              <dd className="text-colWhite80 text-[16px]">{data.seed}</dd>
            </div>
          </dl>
          <GenerateWithSettingsButton
            setting={data}
            className="rounded-lg py-3 text-lg text-colWhite80"
            startIcon={<Image src="/assets/Magic.svg" width={30} height={30} alt="downarrow" />}
          />
        </div>
      </div>
    )
  );
}
