// Dummy imports
// import { getPosts } from '@/lib/posts'
// import { Post } from '@/ui/post'

import Link from "next/link";

export default async function Authors() {
  // const posts = await getPosts()
  
  return (
    <div>
      <h1>Books List</h1>
      <ul>
        <li>
          <Link href="/books/1">Book 1</Link>
        </li>
      </ul>
    </div>
  )
}