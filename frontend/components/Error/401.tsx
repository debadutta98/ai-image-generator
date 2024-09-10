'use client';
import Link from 'next/link';
import Error from '.';
import { useAppContext } from '@/context';
import { useEffect } from 'react';
export default function Unauthorized() {
  const context = useAppContext();
  useEffect(() => {
    if (context.auth) {
      context.setAuth(false);
    }
  }, [context.auth]);
  return (
    <Error>
      <h2 className="font-semibold">Error 401 - Unauthorized</h2>
      <span>Sorry, your request could not be processed</span>
      <Link href="/auth/login" className="text-colSky">
        Login
      </Link>
    </Error>
  );
}
