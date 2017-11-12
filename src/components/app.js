import { h, Component } from 'preact';
import FileUpload from './file-upload/';
import File from './file/';
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
      files: []
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
        this.setState({
          ...this.state,
          filaments: result.filaments,
          selectedFilament: result.filaments ? Object.keys(result.filaments)[0] : null,
        });
      });

  }

  updateFileValue(currentFile, values) {
    const files = [...this.state.files];
    let file = files[currentFile];
    file = {
      ...file,
      ...values,
    };
    files[currentFile] = file;
    this.setState({
      ...this.state,
      files,
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
      const fileObj = {
        file,
        name: file.name,
        amount: 1,
      };
      this.setState({
        ...this.state,
        fileName: file.name,
        pendingRequest: 'uploading-file',
        sliceResult: null,
        files: _.concat(this.state.files,fileObj),
      });
      const currentFile = this.state.files.length - 1;

      uploadFileForPricing(file)
        .then((result) => {
          this.updateFileValue(currentFile, { id: result.fileId });
          this.setState({
            ...this.state,
            pendingRequest: null,
            fileId: result.fileId,
          });
          // TODO use currently selected filament on file upload, not the first one
          this.slice(this.state.filaments[Object.keys(this.state.filaments)[0]].id, currentFile);
      })
        .catch((err) => {
          throw err;
      });
    }
    this.changeCurrentPage('details')
  }

  slice(filament, currentFile) {
    if(!this.state.pendingRequest) {

      this.updateFileValue(currentFile, { filament });
      this.setState({
        ...this.state,
        pendingRequest: 'slicing',
        sliceResult: null,
      });

      sliceFile(this.state.files[currentFile].id, filament)
      .then((result) => {
        if(result.error === undefined) {
          this.updateFileValue(currentFile, { price: result.price, dimensions: result.dimensions });
          this.setState({
            ...this.state,
            pendingRequest: null,
            sliceResult: {
              ...result
            },
          })
        }
      })
      .catch();
    }
    this.changeCurrentPage('results');
  }

  onItemAmountChange(amount, currentFile) {
    this.updateFileValue(currentFile, { amount });
    this.setState({
      ...this.state,
      amount,
    })
  }

  analyze(filament, currentFile) {
    if(!this.state.pendingRequest) {
        this.setState({
        ...this.state,
        pendingRequest: 'analyzing',
      });

      getFilePrice(this.state.files[currentFile].id, filament)
      .then((result) => {
        this.updateFileValue(currentFile, { price: result.price });
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
    let files = _.map(this.state.files, (file) => {
      return {
        id: file.id,
        filament: file.filament,
        amount: file.amount,
      };
    });
    createOrder(files, email)
      .then((result) => {
        alert(result.message);
      });
  }

  removeFile(currentFile) {
    const files = [...this.state.files];
    files.splice(currentFile,1);
    this.setState({
      ...this.state,
      files,
    })
  }


	render(props, state) {
    let details = _.map(state.files, (value, id) => {
      return(
        <File
          analyze={(filament) => { this.analyze(filament, id) }}
          filename={value.name}
          filaments={state.filaments}
          price={value.price}
          dimensions={value.dimensions}
          onItemAmountChange={(amount) => {this.onItemAmountChange(amount, id)}}
          remove={() => {this.removeFile(id)}}
        />
      )
    });
    let totalPrice = 0;
      _.forEach(state.files, (file) => {
      if (file.price) {
        totalPrice += file.price*file.amount;
      }
    });
    console.log(totalPrice);
		return (
			<div id="app">
        <div>
          <h1>3D Obchod</h1>
        </div>
        <FileUpload confirmChooseFile={this.confirmChooseFile}/>
        {state.files.length ? <hr /> : null}
        {details}
        {/*<Results confirmResult={() => { this.changeCurrentPage('order'); }} sliceResult={state.sliceResult} />*/}
        {state.files.length ? <hr /> : null}
        {state.files.length ? (<div>
          <label>Celková cena</label>
          <span>{Math.round(totalPrice)},-Kč</span>
        </div>) : null}
        {state.files.length ? <hr /> : null}
        {state.files.length ? <Order createOrder={this.createOrder} /> : null}
			</div>
		);
	}
}
