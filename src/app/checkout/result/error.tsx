'use client';

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function RootError({ }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-center">
        📛
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="mb-4">Failed to process payment</div>
        <Button asChild>
          <Link href='/subscription'>
            Try Again
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}