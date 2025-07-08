// Dummy imports
// import { getPosts } from '@/lib/posts'
// import { Post } from '@/ui/post'

export default async function Page({ params }) {
    const { id } = params;
    // const posts = await getPosts()
    
    return (
      <div>
        <h1>Details of Book with ID: {id}</h1>
      </div>
    )
  }