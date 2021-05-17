import React from "react";
import ee from "event-emitter";

const emitter = ee();

export function showError(message: string) {
    emitter.emit('show', message)
}

export default class ErrorBanner extends React.Component<{}, { opacity: number, message: string }> {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            message: null,
        };
        emitter.on('show', message => {
            this.setState({
                opacity: 1,
                message
            })
        });

    }

    render() {
        return (
            <div className="bg-red-100 px-4 py-3 text-red-800 border border-red-400 rounded transition-opacity flex" style={{ opacity: this.state.opacity }}>
                <p className="flex-grow pr-3">{this.state.message}</p>
                <span className="cursor-pointer" onClick={() => this.setState({ opacity: 0 })}>&#10006;</span>
            </div>
        )
    }

}