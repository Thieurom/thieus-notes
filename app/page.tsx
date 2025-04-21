import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Thieu's Notes
      </h1>
      <p className="mb-4">
        {`Hi, I'm Doan Thieu — self-taught programmer, avid reader, introvert.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
