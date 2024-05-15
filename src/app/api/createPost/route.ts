// This is not done yet it might not work properly do not use

import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '../../../server/actions/post'; 

export async function POST(request: NextRequest) {
  // Parse the JSON body from the request
  const { name, content } = await request.json();

  const postId = await createPost(name, content);

  if (postId === null) {
    // Create a new response with a 400 status code
    return new NextResponse(JSON.stringify({ error: 'Failed to create the post or SupaId is undefined' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create a new response with a 201 status code
  return new NextResponse(JSON.stringify({ postId }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

