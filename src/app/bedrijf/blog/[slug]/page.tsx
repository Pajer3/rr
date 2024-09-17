import { getBlogPost } from './getBlogPost'
import BlogPostContent from './BlogPostContent'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blogPost = await getBlogPost(params.slug)

  if (!blogPost) {
    return <div>Blog post not found</div>
  }

  return <BlogPostContent blogPost={blogPost} />
}
