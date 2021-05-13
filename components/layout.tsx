import Head from "next/head";
import { FunctionComponent } from "react";
import Navbar from "./navbar";

type LayoutProps = {
    title?: string,
}

const Layout: FunctionComponent<LayoutProps> = (props) => {
    return (
        <>
            <Head>
                <title>{props.title ? props.title + " | " : ''}Social Unifier</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Navbar />
            {props.children}
            <footer className="bg-gradient-to-r to-blue-400 from-green-300  py-1">
                <p className="text-center font-mono font-medium text-white">Mai 2021 / Coding Factory 👾</p>
            </footer>
        </>
    )
}
export default Layout;
