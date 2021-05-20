type PropsType = {
    visible: boolean
}

export default function LoadingAnim({ visible }: PropsType) {
    if (visible)
        return <img src="/loading.svg" alt="Chargement" className="h-10 inline" />
    else
        return null;
}