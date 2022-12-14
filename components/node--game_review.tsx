import Image from "next/image"
import { DrupalNode } from "next-drupal"
import Link from "next/link"

import { formatDate } from "lib/utils"

interface NodeGameReviewProps {
  node: DrupalNode
}

export function NodeGameReview({ node, ...props }: NodeGameReviewProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.field_game_date && (
        <figure>
          <span>Game date - {formatDate(node.field_game_date)}</span>
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
      {node.field_m && (
        <figure>
          <Link href={`${node.field_m.uri}`}>
            <a className="text-2xl font-semibold no-underline">
              See on MVP
            </a>
          </Link>
        </figure>
      )}
    </article>
  )
}
