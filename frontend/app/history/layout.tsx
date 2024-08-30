export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="main-layout flex flex-col gap-12 h-full w-full flex-grow relative overflow-y-auto">
      <h2 className="text-colWhite80 font-[500] text-2xl">Generation History</h2>
      {children}
    </main>
  );
}
