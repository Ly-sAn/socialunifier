import {useRouter} from "next/router";
import UserAccount from "./account";
import AccountUpdate from "./account_update";
import LeftNavBar from "../../components/leftNavbar";


export default function Global() {
    const router = useRouter();
    let component;

    switch (router.pathname) {
        case '/users/account':
            component = <UserAccount />
            break;
        case '/users/update':
            component = <AccountUpdate />
            break;
    }

    return (
        <>
            <LeftNavBar/>
             <div>
               {component}
             </div>
        </>
    )
}