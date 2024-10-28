import { AppSidebar } from '~/components/side_bar';

export default async function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen h-screen">
      <AppSidebar />
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
}