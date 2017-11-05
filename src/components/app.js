import { h, Component } from 'preact';
import FileUpload from './file-upload/';
import Details from './details/';
import Results from './results/';
import Order from './order/';
import { uploadFileForPricing, sliceFile, getFilaments, createOrder, getFilePrice } from '../lib/api';
import { convertObjectToArray } from '../lib/utils'

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
      amount: 1,
      sliceResult: null,
      selectedFilament: null,
    };

    this.getAvailableFilaments();

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.analyze = this.analyze.bind(this);
    this.confirmChooseFile = this.confirmChooseFile.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.onItemAmountChange = this.onItemAmountChange.bind(this);
  }

  getAvailableFilaments() {
    getFilaments()
      .then((result) => {
        console.log(result.filaments);
        this.setState({
          ...this.state,
          filaments: result.filaments,
          selectedFilament: result.filaments ? Object.keys(result.filaments)[0] : null,
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
        sliceResult: null,
      });

      uploadFileForPricing(file)
        .then((results) => {
          this.setState({
            ...this.state,
            pendingRequest: null,
            fileId: results.fileId,
          });
          // TODO use currently selected filament on file upload, not the first one
          this.slice(this.state.filaments[Object.keys(this.state.filaments)[0]].id);
      })
        .catch((err) => {
          throw err;
      });
    }
    this.changeCurrentPage('details')
  }

  slice(filament) {
    if(!this.state.pendingRequest) {

      this.setState({
        ...this.state,
        pendingRequest: 'slicing',
        sliceResult: null,
      });

      sliceFile(this.state.fileId, filament)
      .then((result) => {
        if(result.error === undefined) {
          this.setState({
            ...this.state,
            pendingRequest: null,
            sliceResult: {
              ...result
            }
          })
        }
      })
      .catch();
    }
    this.changeCurrentPage('results');
  }

  onItemAmountChange(amount) {
    this.setState({
      ...this.state,
      amount,
    })
  }

  analyze(filament) {
    if(!this.state.pendingRequest) {
        this.setState({
        ...this.state,
        pendingRequest: 'analyzing',
      });

      getFilePrice(this.state.sliceResult, filament)
      .then((result) => {
        this.setState({
          ...this.state,
          selectedFilament: filament,
          pendingRequest: null,
          sliceResult: {
            ...this.state.sliceResult,
            price: result.price,
          }
        })
      })
      .catch((err) => {
        throw err
      })
    }

  }

  createOrder(email) {
    createOrder(this.state.fileName, this.state.fileId, email, this.state.selectedFilament, this.state.amount)
      .then((result) => {
        alert(result.message);
      });
  }

	render(props, state) {
		return (
			<div id="app">
        <div>
          <h1>3D Print shop</h1>
        </div>
        <FileUpload confirmChooseFile={this.confirmChooseFile}/>
        {state.fileName ? <hr /> : null}
        <Details analyze={this.analyze} filename={state.fileName} filaments={state.filaments} sliceResult={state.sliceResult} onItemAmountChange={this.onItemAmountChange}/>
        {/*<Results confirmResult={() => { this.changeCurrentPage('order'); }} sliceResult={state.sliceResult} />*/}
        {state.fileName ? <hr /> : null}
        {state.fileName ? <Order createOrder={this.createOrder} /> : null}
			</div>
		);
	}
}
