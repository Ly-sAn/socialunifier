import Link from "next/link";
import { useState } from "react";
import useUser from "../lib/useUser";
import {useRouter} from "next/router";
import { ApiRoute, fetchApi } from "../lib/api";
import { mutate } from "swr";

const Navbar = () => {
  const router = useRouter();
    const user  =  useUser(false);
    const [active, setActive] = useState(false);
    let navBtnLinks: JSX.Element;
    
    async function handleLogout(e) {
      await fetchApi(ApiRoute.Logout, 'POST', {});
      mutate(ApiRoute.User);
      router.push('/');
    }

     if (user?.isLoggedIn === false) {
      navBtnLinks = <>
        <Link href='/forms/login'>
          <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:text-blue-100'>
            Connexion
          </a>
        </Link>
        <Link href='/forms/register'>
          <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded shadow">
            Inscription
          </button>
        </Link>
      </>
    } else if (user?.isLoggedIn) {
       navBtnLinks = <>
         <Link href='/postpage'>
           <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:text-blue-100'>
             Publier un post
           </a>
         </Link>
         <Link href='/users/services_connexion'>
           <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:text-blue-100'>
             Me connecter aux services
           </a>
         </Link>
         <Link href='/users/account'>
           <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:text-blue-100'>
             Mon compte
           </a>
         </Link>
        <a className='cursor-pointer lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:text-blue-100' onClick={handleLogout}>
          Déconnexion
        </a>

    </>
  }

    const handleClick = () => {
      setActive(!active);
    };

    return (
        <>
        <nav className='flex items-center flex-wrap p-3 bg-gradient-to-r from-blue-300 to-green-400'>
          <Link href='/'>
            <a className='inline-flex items-center p-2 mr-4 '>
              <span className='text-3xl text-white font-bold uppercase tracking-wide'>
                Social Unifier
              </span>
            </a>
          </Link>
          <button
            className=' inline-flex p-3 hover:bg-green-600 rounded lg:hidden text-white ml-auto hover:text-white outline-none'
            onClick={handleClick}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
          <div
            className={`${
              active ? '' : 'hidden'
            }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
          >
            <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>
              { navBtnLinks }
            </div>
          </div>
        </nav>
      </>
    )
}

export default Navbar;