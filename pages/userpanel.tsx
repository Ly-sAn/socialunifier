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

        if (e.currentTarget.checked)
            selectedNetworks.add(network);
        else
            selectedNetworks.delete(network);
        setSelectedNetworks(new Set(selectedNetworks));
    }

const networkSelector = user.networks.map(n => <>
    <div>
    <label htmlFor={n} className="inline-flex items-center">
        <input type="checkbox" name={n} onChange={handleNetworkSelect} className="form-checkbox text-indigo-600" />
        <span className="ml-2">{n}</span>
    </label>
    </div>
</>)

    //const user = useUser() as UserLoggedIn

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>


    const networks = user.networks.map(n => <li key={n} >{n}</li>);

    return (
        <Layout>
        <div className="bg-gray-200">
            <div>
            <div className='py-4'><h1 className='text-xl font-black text-center'>Bienvenue {user.userName}, veuillez-vous connecter à un service
            </h1></div>
            
            <div className="py-1 flex flex-wrap justify-around">
            <span><button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"><a href={ApiRoute.AuthorizeReddit}>reddit</a></button></span>
            <span><button className="shadow bg-yellow-600 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"><a href={ApiRoute.AuthorizeMastodon}>Mastodon</a></button></span>
            <span><button className="shadow bg-yellow-600 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">tumblr</button></span>
            <span><button className="shadow bg-yellow-600 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">diaspora*</button></span>
            </div>
            </div>

            <p><br />Vous êtes connectez au réseaux suivants:</p>
            {networks.length > 0 ?
                <ul>{networks}</ul> :
                <p>Aucun</p>}

            <div id='section2' className="p-8 mt-6 lg:mt-0">

                <form onSubmit={handleSubmit}>

                <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4">
                                Choix des réseaux
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            {networkSelector}
                            <p className="py-2 text-sm text-gray-600">Veuillez sélectionner un ou plusieurs réseaux</p>
                        </div>
                    </div>

                    
                {selectedNetworks.has('Reddit') ? <>
                
                <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label htmlFor="subreddit" className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4">
                                Titre du post
            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full focus:bg-white" id="my-textfield" name="reddit_title" required type="text"></input>
                            <p className="py-2 text-sm text-gray-600">Titre du post sur reddit</p>
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label htmlFor="subreddit" className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4">
                                r/
            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full  focus:bg-white" name="reddit_subreddit" id="my-textfield" required type="text"></input>
                            <p className="py-2 text-sm text-gray-600">Nom du subreddit</p>
                        </div>
                    </div>
                 
                    </> : ''}

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4">
                                Text Area
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <textarea className="form-textarea block w-full focus:bg-white" name='content' rows={6} required ></textarea>
                            <p className="py-2 text-sm text-gray-600">Contenu principal du post</p>
                        </div>
                    </div>

                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button className="shadow bg-blue-300 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Envoyer
                            </button>
                        </div>
                    </div>
                </form>

            </div>

            </div>

        </Layout>
    )

}