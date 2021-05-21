import React from "react";
import ee from "event-emitter";
import { PostResults } from '../types/global';

const emitter = ee();

export function openModal(values: PostResults) {
  emitter.emit('open', values);
}

export default class ResultModal extends React.Component<{ onClose: Function }, { opened: boolean, values: PostResults }> {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      values: [],
    };

    emitter.on('open', values => {
      this.setState({
        opened: true,
        values,
      })
    })

  }

  closeModal() {   
    this.setState({
      opened: false,
      values: []
    });
    this.props.onClose();
  }

  render() {

    const results = this.state.values.map(r => <>
      <div key={r.network} className="mt-4">
        <h4>{r.network}</h4>
        {r.success === true
          ? <a href={r.url} target="_blank">{r.url}</a>
          : <p>Impossible de créer votre post:<br />{r.message}</p>}
      </div>
    </>)

    return (
      <>
        {this.state.opened ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Liens des posts créés
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => this.closeModal()}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                    </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    {results}
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => this.closeModal()}
                    >
                      Fermer
                  </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  }

}