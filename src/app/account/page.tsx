import { createClient } from "~/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }


  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">Hi {data.user.user_metadata.name} 👋</h1>
      <p className="opacity-50">This is the account page, where you can view your account details and manage your subscription.</p>

      <code>
        <pre className="text-start align-start">
          {JSON.stringify(data.user?.user_metadata, null, 2)}
        </pre>
      </code>
    </div>
  );
}