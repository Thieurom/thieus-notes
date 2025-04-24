import { Projects } from 'app/components/projects'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Projects
      </h1>
      <div className="my-8">
        <Projects />
      </div>
    </section>
  )
}
