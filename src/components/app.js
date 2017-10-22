import { h, Component } from 'preact';
import FileUpload from './file-upload/';
import Details from './details/';
import Results from './results/';
import Order from './order/';
import { uploadFileForPricing, getPrintPrice, getFilaments, createOrder } from '../lib/api';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'file-upload',
      pendingRequest: null,
      results: null,
      fileId: null,
      fileName: null,
      filaments: null,
      slicerResult: null,
    };

    this.getAvailableFilaments();

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.analyze = this.analyze.bind(this);
    this.confirmChooseFile = this.confirmChooseFile.bind(this);
    this.createOrder = this.createOrder.bind(this);
  }

  getAvailableFilaments() {
    getFilaments()
      .then((result) => {
        this.setState({
          ...this.state,
          filaments: result.filaments,
        });
      });

  }

  changeCurrentPage(page) {
    this.setState({
      ...this.state,
      currentPage: page
    });
  }

  confirmChooseFile(file) {
    if(!this.state.pendingRequest) {
      this.setState({
        ...this.state,
        fileName: file.name,
        pendingRequest: 'uploading-file',
      });

      uploadFileForPricing(file)
        .then((results) => {
          this.setState({
            ...this.state,
            pendingRequest: null,
            fileId: results.fileName,
          })
      })
        .catch((err) => {

      });
    }
    this.changeCurrentPage('details')
  }

  analyze(filament) {
    if(!this.state.pendingRequest) {

      this.setState({
        ...this.state,
        pendingRequest: 'slicing'
      });

      getPrintPrice(this.state.fileId, filament)
      .then((result) => {
        if(result.error === undefined) {
          this.setState({
            ...this.state,
            pendingRequest: null,
            slicerResult: {
              ...result
            }
          })
        }
      })
      .catch();
    }
    this.changeCurrentPage('results');
  }

  createOrder(email) {
    createOrder(this.state.fileId, email)
      .then((result) => {
        alert(result);
      });
  }

	render(props, state) {
		return (
			<div id="app">
        { state.currentPage === 'file-upload' ? <FileUpload confirmChooseFile={this.confirmChooseFile}/> : null}
        { state.currentPage === 'details' ? <Details analyze={this.analyze} filename={state.fileName} filaments={state.filaments}/> : null}
        { state.currentPage === 'results' ? <Results confirmResult={() => { this.changeCurrentPage('order'); }} slicerResult={state.slicerResult} /> : null}
        { state.currentPage === 'order' ? <Order createOrder={this.createOrder} /> : null}
			</div>
		);
	}
}
