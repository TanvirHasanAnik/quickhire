export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
    <h1>Welcome to QuickHire</h1>
      {children}
    </div>
  )
}