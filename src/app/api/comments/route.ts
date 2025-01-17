import { NextResponse } from 'next/server';

export async function GET() {
  const comments = [
    {
      id: 1,
      author: 'John Doe',
      content: 'This is a great post!',
      timestamp: '2 hours ago',
      likes: 5,
      dislikes: 1,
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Really interesting perspective!',
      timestamp: '1 hour ago',
      likes: 3,
      dislikes: 0,
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'I completely agree with this.',
      timestamp: '30 minutes ago',
      likes: 2,
      dislikes: 1,
    },
  ];

  return NextResponse.json(comments);
}
