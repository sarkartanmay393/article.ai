'use client';

export default function CheckoutError({ error }: any) {
  return (
    <div>{JSON.stringify(error)}</div>
  );
}