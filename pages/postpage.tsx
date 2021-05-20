import Layout from "../components/layout";
import useUser from "../lib/useUser";
import { ApiRoute, fetchApi } from "../lib/api";
import { useState } from "react";
import ErrorBanner, { showError } from "../components/error-banner";
import type { ApiResult, Json, SocialNetwork } from "../types/global";
import ResultModal, { openModal } from '../components/result-modal'
import LoadingAnim from '../components/loading-anim';

export default function PostPage() {

    const [selectedNetworks, setSelectedNetworks] = useState<Set<SocialNetwork>>(new Set());
    const user = useUser();
    const [redditToggle, setRedditToggle] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        const data: Json = {
            content: e.target.content.value,
            selectedNetworks: Array.from(selectedNetworks),
        }

        if (selectedNetworks.has('Reddit')) {
            data.redditOptions = {
                subreddit: e.target.reddit_subreddit.value,
                title: e.target.reddit_title.value,
                imagePost: redditToggle,
            }
        }

        formData.append('request', JSON.stringify(data));

        for (const i in e.target.media.files) {
            formData.append(i, e.target.media.files[i]);
        }

        setIsLoading(true);
        const result: ApiResult = await (await fetch(ApiRoute.Post, {
            body: formData,
            method: 'POST',
        })).json();
        setIsLoading(false);

        if (result.success) {
            console.log(result);
            openModal(result.posts);
        }
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

    function textOrImage(e) {
        setRedditToggle(e.currentTarget.checked);
    }

    function reset() {       
        for (const input of document.querySelectorAll<HTMLInputElement>('input, textarea')) {
            input.checked = false;
            input.value = '';
        }
        setSelectedNetworks(new Set());
    }

    const networkSelector = user.networks.map(n => <>
        <div className="p-2" key={n}>
            <label htmlFor={n} className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" name={n} onChange={handleNetworkSelect} id={n} className=" form-checkbox sr-only" />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-red-600 w-6 h-6 rounded-full transition"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                    {n}
                </div>
            </label>
        </div>
    </>)

    return (
        <Layout>

            <div className="text-center flex justify-center align-middle md:mx-auto md:my-12 max-w-4xl m-2 shadow-xl md:p-6 p-2 rounded bg-gradient-to-tl from-purple-300 to-red-200 ">
                <form onSubmit={handleSubmit}>

                    <div className="">
                        <h1 className='text-2xl font-bold mb-6'>Publication d'un post</h1>
                        <div className="">
                            <label className=" block text-gray-600 font-bold mb-3 pr-4">
                                Choix des réseaux
                            </label>
                        </div>
                        <div className="">
                            {networkSelector}
                            <p className="py-2 text-sm text-gray-600">Veuillez sélectionner un ou plusieurs réseaux</p>
                        </div>
                    </div>


                    {selectedNetworks.has('Reddit' || 'Tumblr') ? <>

                        <div className=" mb-6">
                            <div className="">
                                <label htmlFor="subreddit" className="block text-gray-600 font-bold mb-3 ">
                                    Titre du post
                                    </label>
                            </div>
                            <div className="">
                                <input className="form-input block w-full focus:bg-white" id="my-textfield" name="reddit_title" required type="text"></input>
                                <p className="py-2 text-sm text-gray-600">Titre du post sur reddit ou tumblr</p>
                            </div>
                        </div>


                    </> : ''}

                    {selectedNetworks.has('Reddit') ? <>
                        <div className=' pb-2'>
                            <label htmlFor='textOrImage' className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input id='textOrImage' type="checkbox" name='textOrImage' onChange={textOrImage} className=" form-checkbox sr-only" />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-red-600 w-6 h-6 rounded-full transition"></div>
                                </div>
                                <div className="ml-3 text-gray-700 font-medium">
                                    Reddit mode : {redditToggle ? "Image" : "Text"}
                                </div>
                            </label>
                        </div>
                        <div className=" mb-6">
                            <div className="">
                                <label htmlFor="subreddit" className="block text-gray-600 font-bold   mb-3 ">
                                    /r/
                                    </label>
                            </div>
                            <div className="">
                                <input className="form-input block w-full  focus:bg-white" name="reddit_subreddit" id="my-textfield" required type="text"></input>
                                <p className="py-2 text-sm text-gray-600">Nom du subreddit</p>
                            </div>
                        </div>


                    </> : ''}

                    <div className=" mb-6">
                        <div className="">
                            <label htmlFor="media" className="block text-gray-600 font-bold   mb-3 ">
                                Ajouter une image ou une vidéo
                                    </label>
                        </div>
                        <div className=" py-2 ">
                            <input type="file" name="media" id="media" accept="image/*,video/*" />
                        </div>
                    </div>
                    <div className=" mb-6">
                        <div className="">
                            <label className="block text-gray-600 font-bold   mb-3 ">
                                Zone de texte
                            </label>
                        </div>
                        <div className="">
                            <textarea className="form-textarea block w-full focus:bg-white bg-green-50" name='content' rows={6} required ></textarea>
                            <p className="py-2 text-sm text-gray-600">Contenu principal du post</p>
                        </div>
                    </div>

                    <button className="shadow inline-flex items-center bg-green-400 hover:bg-green-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" disabled={isLoading} type="submit">
                        <span>Envoyer</span> <LoadingAnim visible={isLoading} />
                    </button>

                    <ErrorBanner />
                </form>

            </div>

            <ResultModal onClose={reset} />

        </Layout>
    )

}