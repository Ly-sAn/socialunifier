export default function ErrorBanner(props) {
    return (
        <div className="bg-red-100 px-4 py-3 text-red-800 border border-red-400 rounded">
            {props.children}
        </div>
    )
}