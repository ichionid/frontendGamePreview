import Head from "next/head";
import { Layout } from "components/layout";
import React, { createRef } from 'react'

type Props = {
    addTodo: (gameFeedback: string) => void;
};

export default function create() {
    const textInput: React.RefObject<HTMLInputElement> =
        createRef<HTMLInputElement>()
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
                <h1 className="mb-10 text-6xl font-black">Create game.</h1>
                <form action="/send-data-here" method="post">

                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </Layout >
    )
}
