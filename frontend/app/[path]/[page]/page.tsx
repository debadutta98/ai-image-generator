import { PagesButton } from '@/components/Button';
import Gallery from '@/components/Gallery';
import { PageProps, UserFeeds, Feed } from '@/types';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page({ params, searchParams }: PageProps) {
  let page: number = 0,
    status: number = 0,
    feeds: Array<Feed> = [],
    pages: number = 0;
  if (Number.isNaN(Number(params.page)) || Number.parseInt(params.page) < 1) {
    return redirect(`/${params.path}/1`, RedirectType.replace);
  } else {
    page = Number.parseInt(params.page);
  }
  try {
    let url = `${process.env.BACKEND_URL}/api/user/${params.path}?page=${params.page || '1'}&limit=20`;
    if (searchParams?.search) {
      url += '&search=' + searchParams.search;
    }
    const data: UserFeeds = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: cookies().toString()
      }
    }).then(async (res) => {
      status = res.status;
      if (res.ok) {
        return await res.json();
      } else {
        return {
          feeds: [],
          pages: 0
        };
      }
    });
    if (Array.isArray(data?.feeds)) {
      feeds = data.feeds;
    }
    if (typeof data?.pages === 'number') {
      pages = data.pages;
    }
  } catch (err) {
    status = 500;
    console.error('Failed to fetch the user feeds', err);
  }
  return (
    <>
      <Gallery
        maxWidth={300}
        className={`${pages === 1 ? 'pb-12' : ''}`}
        feeds={feeds}
        isUserCollection={params.path === 'collection'}
      />
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
