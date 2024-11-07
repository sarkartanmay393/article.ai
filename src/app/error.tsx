'use client';

export default function RootError({ error }: any) {
  return (
    <div>{JSON.stringify(error)}</div>
  );
}