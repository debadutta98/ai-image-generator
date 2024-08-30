import Link from 'next/link';
import Image from 'next/image';
import { NavProfileButton, SignOutButton } from '../Button';
import NavLink from '../NavLink';
import { AuthComponentProps } from '@/types';

export default function NavBar(props: AuthComponentProps) {
  return (
    <nav className="sm:flex flex-col p-4 border-colDark80 border-r-2 items-center hidden fixed left-0 bottom-0 top-0 z-50">
      <ul>
        <li className="p-2">
          <Link href="/">
            <Image src="/assets/Logo.svg" alt="branding image" width={30} height={30} />
          </Link>
        </li>
      </ul>
      <ul className="mt-32 flex flex-col gap-8">
        <NavLink
          href="/"
          className="p-2 cursor-pointer"
          activeClass="bg-colMedSlateBlue p-2 rounded-md cursor-pointer"
          component={'li'}
        >
          <Image src="/assets/Magic.svg" alt="generate image logo" width={30} height={30} />
        </NavLink>
        <NavLink
          href="/feed/1"
          className="p-2 cursor-pointer"
          activeClass="bg-colMedSlateBlue p-2 rounded-md cursor-pointer"
          component={'li'}
        >
          <Image src="/assets/apps.svg" alt="feed" width={30} height={30} />
        </NavLink>
        <NavLink
          href="/history/1"
          className="p-2 cursor-pointer"
          activeClass="bg-colMedSlateBlue p-2 rounded-md cursor-pointer"
          component={'li'}
        >
          <Image src="/assets/Time_atack_duotone.svg" alt="history" width={30} height={30} />
        </NavLink>
        <NavLink
          href="/collection/1"
          className="p-2 cursor-pointer"
          activeClass="bg-colMedSlateBlue p-2 rounded-md cursor-pointer"
          component={'li'}
        >
          <Image src="/assets/Folder_duotone_fill.svg" alt="history" width={30} height={30} />
        </NavLink>
      </ul>
      <NavProfileButton>
        <Image
          src={props.auth ? (props.profileURL as string) : '/assets/signin.svg'}
          alt={props.auth ? 'profile icon' : 'sign in'}
          className={props.auth ? 'rounded-[50%] object-cover' : 'rounded-lg bg-colDark80 p-2'}
          width={40}
          height={40}
        />
        {props.auth && (
          <SignOutButton
            className="floating-signout-button"
            href="/auth/logout"
            startIcon={<Image src="/assets/signout.svg" alt="signout" width={30} height={30} />}
          >
            <span className="text-colWhite80 font-[500]">Sign out</span>
          </SignOutButton>
        )}
      </NavProfileButton>
    </nav>
  );
}
