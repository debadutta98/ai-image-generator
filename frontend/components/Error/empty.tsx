'use client';
import Link from 'next/link';
import Error from '.';
import { useAppContext } from '@/context';
export default function Empty(props: { message?: string }) {
  const context = useAppContext();

  return (
    <Error>
      <h2 className="font-semibold">Empty Response - No data received</h2>
      <span>
        Hi {context.name.split(' ')[0]}, {props.message || 'no image has been generated.'}
      </span>
      <Link href="/" className="text-colSky">
        Generate
      </Link>
    </Error>
  );
}
