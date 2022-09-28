import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { FormGameReview } from "components/FormGameReview"
import { NodeGameReviewTeaser } from "components/node--game_review--teaser"
import { useState } from "react";


interface IndexPageProps {
  nodes: DrupalNode[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
  /**
 * input field keyword onchage
 */
  const [search, setSearch] = useState("");
  // Does not work
  const filteredNodes = nodes.filter(
    node => {
      if (node.title.toLocaleLowerCase().includes(search)) {
        return node;
      }
    }
  );
  return (
    <Layout>
      <Head>
        <title>Double triple unicorns!</title>
        <meta
          name="This is a site for basic scouting"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div className="flex flex-col md:flex-row lg:flex-row gap-y-3.5">
        <div className="md:basis-1/2 lg:basis-1/2">
          <h1 className="mb-10 text-6xl font-black">Latest Games</h1>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            {filteredNodes?.length ? (
              filteredNodes.map((node) => (
                <div key={node.id}>
                  <NodeGameReviewTeaser node={node} />
                  <hr className="my-20" />
                </div>
              ))
            ) : (
              <p className="py-4">No content found :(</p>
            )}
          </div>
        </div>
        <div className="md:basis-1/2 lg:basis-1/2 ml-9">
          <div>New game!</div>
          <FormGameReview />
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--game_review",
    context,
    {
      params: {
        "filter[status]": 1,
        "fields[node--game_review]": "title,path,uid,created",
        include: "uid",
        sort: "-created",
      },
    }
  )
  return {
    props: {
      nodes,
    },
  }
}
