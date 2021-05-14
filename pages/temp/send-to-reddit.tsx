import { useRouter } from "next/router";
import ErrorBanner, { showError } from "../../components/error-banner";
import Layout from "../../components/layout";
import { ApiRoute, fetchApi, PostError } from "../../lib/api";
import useUser from "../../lib/useUser";

export default function SendToReddit() {
    useUser();
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault()
        const result = await fetchApi(ApiRoute.PostReddit, "POST", {
            subreddit: e.target.subreddit.value,
            content: e.target.content.value,
            title: e.target.title.value,
        })

        if (result.success)
            router.push('/')
        else {
            let message: string;
            switch (result.reason) {
                case PostError.NoCredentials:
                    message = "Vous n'êtes pas connectez à ce réseau"; break;
                default:
                    message = "Une erreur est survenue"; break;
            }
            showError(message)
        }
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titre: </label>
                <input type="text" name="title" required/>
                <label htmlFor="content">Texte du post: </label>
                <input type="text" name="content" required />
                <label htmlFor="subreddit">r/</label>
                <input type="text" name="subreddit" required />
                <button>Poster</button>
            </form>
            <ErrorBanner />
        </Layout>
    )
}