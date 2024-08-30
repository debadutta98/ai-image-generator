import { calculateAspectRatio } from '@/utils';
import { PagesButton } from '@/components/Button';
import TextCollapse from '@/components/TextCollapse';
import { History } from '@/types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page({ params }: { params: { page: string } }) {
  let histories: Array<History> = [],
    pages: number = 0,
    status: number,
    page: number;
  if (Number.isNaN(Number(params.page)) || Number.parseInt(params.page) < 1) {
    return redirect('/history/1', RedirectType.replace);
  } else {
    page = Number.parseInt(params.page);
  }
  try {
    const data = await fetch(
      `${process.env.BACKEND_URL}/api/user/history?page=${page || '1'}&limit=10`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies().toString()
        }
      }
    ).then(async (res) => {
      status = res.status;
      if (res.ok) {
        return await res.json();
      } else {
        return {
          histories: [],
          pages: 0
        };
      }
    });
    if (Array.isArray(data?.histories)) {
      histories = data.histories;
    }
    if (typeof data?.pages === 'number') {
      pages = data.pages;
    }
  } catch (err) {
    status = 500;
    console.error('Getting error while fetching user history', err);
  }
  return (
    <>
      {histories.length > 0 && (
        <div
          className={`grid grid-cols-1 divide-y-[1px] divide-colDark70${pages === 1 ? ' pb-12' : ''}`}
        >
          {histories
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((history) => (
              <div className={`flex flex-col lg:flex-row gap-14 py-12 last:pb-0`} key={history._id}>
                <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start w-[400px] rounded-lg">
                  <Image
                    src={`/api/image/${history.image_Id}`}
                    width={history.width}
                    height={history.height}
                    alt="mena"
                    className="rounded-lg h-auto"
                  />
                </div>
                <dl className="grid grid-cols-auto-fit-320 auto-rows-min gap-8 w-[100%]">
                  <div>
                    <dt className="text-colDark60 font-[500] text-[17px]">Prompt details</dt>
                    {(history.prompt || 'Null').length > 100 ? (
                      <TextCollapse className="text-colWhite80 text-[16px]">
                        {history.prompt}
                      </TextCollapse>
                    ) : (
                      <p className="text-colWhite80 text-[16px]">{history.prompt || 'Null'}</p>
                    )}
                  </div>
                  <div>
                    <dt className="text-colDark60 font-[500] text-[17px]">Negative prompt</dt>
                    {(history.negative_prompt || 'Null').length > 100 ? (
                      <TextCollapse className="text-colWhite80 text-[16px]">
                        {history.negative_prompt || 'Null'}
                      </TextCollapse>
                    ) : (
                      <p className="text-colWhite80 text-[16px]">
                        {history.negative_prompt || 'Null'}
                      </p>
                    )}
                  </div>
                  <div>
                    <dt className="text-colDark60 font-[500] text-[17px]">Created on</dt>
                    <dd className="text-colWhite80 text-[16px]">
                      {new Date(history.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-colDark60 font-[500] text-[17px]">Input Resolution</dt>
                    <dd className="text-colWhite80 text-[16px]">
                      {calculateAspectRatio(history.width, history.height)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-colDark60 font-[500] text-[17px]">Seed</dt>
                    <dd className="text-colWhite80 text-[16px]">{history.seed}</dd>
                  </div>
                </dl>
              </div>
            ))}
        </div>
      )}
      {pages > 1 && (
        <PagesButton
          count={pages}
          page={page}
          variant="outlined"
          className="mx-auto mt-auto sm:mr-0 sm:ml-auto pb-6"
        />
      )}
    </>
  );
}
