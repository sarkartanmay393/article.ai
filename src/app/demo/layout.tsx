import { auth } from '~/lib/server/auth';
import { AppSidebar } from '~/components/side_bar';
import { redirect } from 'next/navigation';

export default async function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  // const session = await auth();
  // if (!session) return redirect('/auth');

  return (
    <div className="flex w-screen h-screen">
      <AppSidebar />
      {/* {!session ?
        <div className="w-full h-full flex justify-center items-center pt-0.5">
          <Card className="w-md h-md">
            <CardHeader>
              Welcome to article.ai
              <span className='text-sm text-muted-foreground'>
                Please authenticate yourself to use this demo
              </span>
            </CardHeader>
            <CardFooter>
              <form action={handleGithubLogin}>
                <Button type='submit'>
                  <GitHubLogoIcon className="h-5 w-5" />
                  Authenticate
                </Button>
              </form>
            </CardFooter>
          </Card>
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
            )}
          />
        </div> : */}
      <div className="w-full h-full">
        {children}
      </div>
      {/* } */}
    </div>
  )
}