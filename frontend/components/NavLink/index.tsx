'use client';
import type { NavLinkProps } from '@/types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function NavLink(props: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => {
    const activeClass = props.activeClass || '';
    const className = props.className || '';
    if (pathname === href) {
      return activeClass;
    } else {
      return className;
    }
  };
  if (props.component) {
    return React.createElement(
      props.component,
      { className: isActive(props.href), onClick: () => router.push(props.href) },
      props.children
    );
  } else {
    <Link href={props.href} className={isActive(props.href)}>
      {props.children}
    </Link>;
  }
}
