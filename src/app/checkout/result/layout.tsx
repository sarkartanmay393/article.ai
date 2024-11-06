import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Session Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="w-full flex items-center flex-col p-4 mx-auto bg-gradient-to-b from-blue-100 to-blue-200">
       <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Checkout Session</h1>
          <p className="text-center text-gray-600 mb-6">Know you current checkout session status</p>
        </div>
      {children}
    </div>
  );
}
