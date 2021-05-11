import { GetServerSideProps } from "next"
import withSession from "../../lib/session"
import { SessionHandlerArgs as SessionHandlerParams } from "../../types"

export default function Account({user}) {
    return <div>Votre email est {user.email}</div>
}

export const getServerSideProps: GetServerSideProps = withSession(async ({req, res}: SessionHandlerParams) => {
    
    const user = req.session.get('user')
    console.log(user);
    

    if (!user) {
        return {
            redirect: {
                destination: '/temp/login',
                permanent: false
            }
        }
    }
    
    return { props: { user } }
})