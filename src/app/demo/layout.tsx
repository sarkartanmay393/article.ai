import TopBar from '~/components/top_bar';

export default async function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <TopBar />
      {/* <div className='flex'> */}
      {/* <AppSidebar /> */}
      <div className="w-full h-full">
        {children}
      </div>
      {/* </div> */}
    </div>
  )
}