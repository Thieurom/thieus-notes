import Link from 'next/link'
import { getBookmarks } from '../bookmarks/bookmarks'

export function Bookmarks() {
  let bookmarks = getBookmarks()

  return (
    <ul className="list-disc list-inside">
      {bookmarks.map((bookmark, index) => (
        <li key={index}>
          <Link
            className="text-neutral-900 dark:text-neutral-400"
            href={bookmark.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {bookmark.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
