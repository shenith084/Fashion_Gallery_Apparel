import { NextResponse } from 'next/server';

// This route is deprecated — authentication is handled by Firebase Auth on the client side.
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use Firebase Authentication.' },
    { status: 410 }
  );
}
