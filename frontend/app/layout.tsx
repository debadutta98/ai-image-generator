import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import { cookies } from 'next/headers';
import { User } from '@/types';
import AppProviderContext from '@/context/intext';
import LoginModal from '@/components/Modal/Login';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description:
    'This application allows you to generate images by providing a piece of text as input'
};

export const getUserInfo = async () => {
  const options = {
    method: 'GET',
    headers: {
      Cookie: cookies().toString()
    }
  };
  let user: User = { auth: false };
  try {
    const res = await fetch(process.env.BACKEND_URL + '/api/user', options);
    if (res.ok) {
      user = await res.json();
    }
  } catch (err) {
    console.log('Unauthorized user');
  } finally {
    return user;
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();
  return (
    <html lang="en">
      <body className={`${inter.className} bg-colDark90 relative z-0`}>
        <AppProviderContext value={{ ...user }}>
          <LoginModal />
          <NavBar auth={user.auth} profileURL={user.profile_url} />
          <Header auth={user.auth} profileURL={user.profile_url} />
          {children}
        </AppProviderContext>
      </body>
    </html>
  );
}
