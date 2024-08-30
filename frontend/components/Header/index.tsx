'use client';
import { AuthComponentProps } from '@/types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import NavLink from '../NavLink';
import { CloseButton } from '../Button';

export default function Header(props: AuthComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  return (
    <header className="flex sm:hidden border-colDark80 border-b-2 p-1 px-2 items-center">
      <Link href="/" className="mr-auto">
        <Image src="/assets/Logo.svg" alt="branding image" width={30} height={30} />
      </Link>
      <List className="flex">
        {props.auth && (
          <ListItem>
            <Image
              src={props.profileURL as string}
              alt="profile image"
              className="rounded-[50%] object-cover"
              width={40}
              height={40}
            />
          </ListItem>
        )}
        <ListItem>
          <button onClick={() => setShowDrawer(true)}>
            <Image src="/assets/bars.svg" alt="bars" width={40} height={40} />
          </button>
        </ListItem>
      </List>
      <SwipeableDrawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onOpen={() => setShowDrawer(true)}
        disableSwipeToOpen={true}
        className="block sm:hidden"
      >
        <CloseButton onClick={() => setShowDrawer(false)} />
        <List className="mt-[50px] flex flex-col gap-3">
          <NavLink
            href="/"
            activeClass="bg-colMedSlateBlue rounded-md cursor-pointer"
            className="cursor-pointer"
            component={ListItem}
          >
            <ListItemIcon>
              <Image src="/assets/Magic.svg" alt="generate image logo" width={30} height={30} />
            </ListItemIcon>
            <ListItemText>Generate Image</ListItemText>
          </NavLink>
          <NavLink
            href="/feed/1"
            activeClass="bg-colMedSlateBlue rounded-md cursor-pointer"
            className="cursor-pointer"
            component={ListItem}
          >
            <ListItemIcon>
              <Image src="/assets/apps.svg" alt="feed" width={30} height={30} />
            </ListItemIcon>
            <ListItemText>Feed</ListItemText>
          </NavLink>
          <NavLink
            href="/history/1"
            activeClass="bg-colMedSlateBlue rounded-md cursor-pointer"
            className="cursor-pointer"
            component={ListItem}
          >
            <ListItemIcon>
              <Image src="/assets/Time_atack_duotone.svg" alt="history" width={30} height={30} />
            </ListItemIcon>
            <ListItemText>Generation History</ListItemText>
          </NavLink>
          <NavLink
            href="/collection/1"
            activeClass="bg-colMedSlateBlue rounded-md cursor-pointer"
            className="cursor-pointer"
            component={ListItem}
          >
            <ListItemIcon>
              <Image
                src="/assets/Folder_duotone_fill.svg"
                alt="collections"
                width={30}
                height={30}
              />
            </ListItemIcon>
            <ListItemText>My Collection</ListItemText>
          </NavLink>
        </List>

        <List className="mt-auto">
          <NavLink
            href={props.auth ? '/auth/logout' : '/auth/login'}
            component={ListItem}
            className="bg-colDark80 rounded-md cursor-pointer"
          >
            <ListItemIcon>
              <Image
                src={props.auth ? '/assets/signout.svg' : '/assets/signin.svg'}
                alt="auth"
                width={30}
                height={30}
              />
            </ListItemIcon>
            <ListItemText>{props.auth ? 'Sign out' : 'Sing in'}</ListItemText>
          </NavLink>
        </List>
      </SwipeableDrawer>
    </header>
  );
}
