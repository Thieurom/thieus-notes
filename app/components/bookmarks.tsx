import Link from 'next/link'
import { getBookmarks } from 'app/bookmarks/bookmarks'

export function Bookmarks() {
  let bookmarks = getBookmarks()

  return (
    <ul className="list-disc list-inside">
      {bookmarks.map((bookmark, index) => (
        <li key={index}>
          <Link
            href={bookmark.url}
            rel="noopener noreferrer"
            target="_blank"
          >
              <p className="text-neutral-900 dark:text-neutral-400">
                {bookmark.title}
              </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
