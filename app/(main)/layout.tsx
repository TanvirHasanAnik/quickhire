import TopBar from "../common-components/TopBar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <TopBar/>
      <div>{children}</div>
    </div>
  )
}