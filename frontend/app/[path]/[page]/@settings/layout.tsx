import UseImageSettings from '@/components/Modal/UseImageSettings';

export default function Layout({ children }: { children: Readonly<React.ReactNode> }) {
  return <UseImageSettings className="w-[90%] lg:w-[85%] xl:w-[62%]">{children}</UseImageSettings>;
}
