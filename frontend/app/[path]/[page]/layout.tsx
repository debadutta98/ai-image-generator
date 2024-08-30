export default function Layout({
  settings,
  children
}: {
  settings: Readonly<React.ReactNode>;
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      {children}
      {settings}
    </>
  );
}
