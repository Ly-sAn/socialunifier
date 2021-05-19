import Link from "next/link";
import Layout from "../components/layout";
import useUser from "../lib/useUser";
import type { UserLoggedIn } from "../types/global";
import { ApiRoute, fetchApi } from "../lib/api";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBanner, { showError } from "../components/error-banner";
import { Json, SocialNetwork } from "../types/global";

export default function UserPanel() {

    const [selectedNetworks, setSelectedNetworks] = useState<Set<SocialNetwork>>(new Set());
    const router = useRouter();
    const user = useUser();


    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>

    // if (user.networks.length < 1)
    //     return <Authorize />

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

        if (!result.success)
            showError("Une erreur est survenue");
    }

    function handleNetworkSelect(e) {
        const network = e.currentTarget.name;
        console.log(e);

        if (e.currentTarget.checked)
            selectedNetworks.add(network);
        else
            selectedNetworks.delete(network);
        setSelectedNetworks(new Set(selectedNetworks));
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

    //const user = useUser() as UserLoggedIn

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>


    const networks = user.networks.map(n => <li key={n} >{n}</li>);

    return (
        <Layout>

            <div className="text-center flex justify-center align-middle md:m-12 m-2 shadow-xl md:p-6 p-2  rounded bg-gradient-to-tl from-purple-300 to-red-200 ">
                <form onSubmit={handleSubmit}>

                    <div className="">
                        <h1 className='text-2xl font-bold mb-6'>Publication d'un post</h1>
                        <div className="">
                            <label className=" block text-gray-600 font-bold  mb-3  pr-4">
                                Choix des réseaux
                            </label>
                        </div>
                        <div className="">
                            {networkSelector}
                            <p className="py-2 text-sm text-gray-600">Veuillez sélectionner un ou plusieurs réseaux</p>
                        </div>
                    </div>


                    {selectedNetworks.has('Reddit') ? <>

                        <div className=" mb-6">
                            <div className="">
                                <label htmlFor="subreddit" className="block text-gray-600 font-bold mb-3 ">
                                    Titre du post
                                    </label>
                            </div>
                            <div className="">
                                <input className="form-input block w-full focus:bg-white" id="my-textfield" name="reddit_title" required type="text"></input>
                                <p className="py-2 text-sm text-gray-600">Titre du post sur reddit</p>
                            </div>
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
                    <div className=" mb-6 mt-4">
                        <div className="">
                            <label htmlFor="upload" className="block text-gray-600 font-bold   mb-3 ">
                                Ajouter une image ou une vidéo
                                    </label>
                        </div>
                        <div className=" py-2 ">
                            <input type="file" name="upload" id="upload" accept="image/*,video/*" />
                        </div>
                    </div>

                    <div className=" mb-6">
                        <div className="">
                            <label className="block text-gray-600 font-bold   mb-3 ">
                                Zone de texte
                            </label>
                        </div>
                        <div className="">
                            <textarea className="form-textarea block w-full focus:bg-white" name='content' rows={6} required ></textarea>
                            <p className="py-2 text-sm text-gray-600">Contenu principal du post</p>
                        </div>
                    </div>

                    <div className="">
                        <div className=""></div>
                        <div className="">
                            <button className="shadow bg-green-400 hover:bg-green-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Envoyer
                                </button>
                        </div>
                    </div>
                </form>


            </div>

        </Layout>
    )

}