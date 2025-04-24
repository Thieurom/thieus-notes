import Link from 'next/link'
import { getProjects } from 'app/projects/projects'

export function Projects() {
  let projects = getProjects()

  return (
    <div>
      {projects.map((project, index) => (
          <Link
            key={index}
            className="flex flex-col space-y-1 mb-4"
            href={project.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="md:basis-1/5 text-neutral-900 dark:text-neutral-400">
                {project.title}
              </p>
              <p className="md:basis-4/5 text-neutral-900 dark:text-neutral-100 tracking-tight">
                {project.description}
              </p>
            </div>
          </Link>
      ))}
    </div>
  )
}
