'use client';
import { useRouter } from 'next/navigation';
import ClientModal from '..';

export default function UseImageSettings(props: {
  className: string;
  children: Readonly<React.ReactNode>;
}) {
  const router = useRouter();
  return (
    <ClientModal onClose={() => router.back()} open={true} className={props.className}>
      {props.children}
    </ClientModal>
  );
}
