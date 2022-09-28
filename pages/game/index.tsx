import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeGameReviewTeaser } from "components/node--game_review--teaser"

interface IndexPageProps {
    nodes: DrupalNode[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
    return (
        <Layout>
            <Head>
                <title>Double triple unicorns!</title>
                <meta
                    name="This is a site for basic scouting"
                    content="A Next.js site powered by a Drupal backend."
                />
            </Head>
            <div>
                <h1 className="mb-10 text-6xl font-black">Latest Game Reviews.</h1>
                {nodes?.length ? (
                    nodes.map((node) => (
                        <div key={node.id}>
                            <NodeGameReviewTeaser node={node} />
                            <hr className="my-20" />
                        </div>
                    ))
                ) : (
                    <p className="py-4">No content found :(</p>
                )}
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
