import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBanner, { showError } from "../../components/error-banner";
import Layout from "../../components/layout";
import { ApiRoute, fetchApi } from "../../lib/api";
import useUser from "../../lib/useUser";
import { Json, SocialNetwork } from "../../types/global";
import Authorize from "./authorize";

export default function Post() {
    const [selectedNetworks, setSelectedNetworks] = useState<Set<SocialNetwork>>(new Set());
    const router = useRouter();
    const user = useUser();

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>

    if (user.networks.length < 1)
        return <Authorize />
    
    async function handleSubmit(e) {
        e.preventDefault();

        const data: Json = {
            content: e.target.content.value,
            selectedNetworks: Array.from(selectedNetworks),
        }

        if (selectedNetworks.has('Reddit')) {
            data.redditOptions = {
                subreddit: e.target.reddit_subreddit.value,
                title: e.target.reddit_title.value,
            }
        }
        const result = await fetchApi(ApiRoute.Post, 'POST', data);

        if (result.success)
            router.push('/temp/account');
        else
            showError("Une erreur est survenue");
    }

    function handleNetworkSelect(e) {
        const network = e.currentTarget.name;

        if (e.currentTarget.checked)
            selectedNetworks.add(network);
        else
            selectedNetworks.delete(network);
        setSelectedNetworks(new Set(selectedNetworks));
    }

    const networkSelector = user.networks.map(n => <>
        <label htmlFor={n}><input type="checkbox" name={n} onChange={handleNetworkSelect} /> {n}</label>
    </>)

    return (
        <Layout title="Poster">
            <style>{`
                form > * {
                    display: block;
                    margin-left: 1em;
                }
            `}</style>
            <form onSubmit={handleSubmit}>
                {networkSelector}

                {selectedNetworks.has('Reddit') ? <>
                    <label htmlFor="subreddit">r/<input type="text" name="reddit_subreddit" required/></label>
                    <label htmlFor="subreddit">Titre du post: <input type="text" name="reddit_title" required/></label>
                </> : ''}

                <label htmlFor="content">Contenue:</label>
                <textarea name="content" required autoFocus></textarea>

                <button type="submit">Envoyer</button>
            </form>
            <ErrorBanner/>
        </Layout>
    )
}