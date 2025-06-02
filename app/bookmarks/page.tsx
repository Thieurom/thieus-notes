import { Bookmarks } from "app/components/bookmarks"

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Bookmarks
      </h1>
      <div className="my-8">
        <Bookmarks />
      </div>
    </section>
  )
}
