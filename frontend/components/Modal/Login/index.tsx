'use client';
import { LoginButton } from '@/components/Button';
import ClientModal from '..';
import Image from 'next/image';
import { useAppContext } from '@/context';

export default function LoginModal() {
  const context = useAppContext();
  return (
    <ClientModal
      className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%]"
      onClose={context.closeLoginScreen}
      open={context.openLoginModal}
    >
      <div className="relative flex flex-col p-10 items-center gap-5">
        <h2 className="text-colWhite80 font-[400] text-2xl">Sign In to Continue</h2>
        <LoginButton
          href="/auth/login"
          className="rounded-lg w-[100%] p-2 text-lg"
          startIcon={<Image src={'/assets/github.svg'} alt="github icon" width={30} height={30} />}
        >
          Sign in with Github
        </LoginButton>
      </div>
    </ClientModal>
  );
}
