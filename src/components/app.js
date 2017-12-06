import { h, Component } from 'preact';
import FileUpload from './file-upload/';
import File from './file/';
import Results from './results/';
import Order from './order/';
import Details from './details/';
import FinishOrder from './finish-order'
import * as FontAwesome from 'react-icons/lib/fa'
import { uploadFileForPricing, sliceFile, getFilaments, createOrder, getFilePrice } from '../lib/api';
import { convertObjectToArray } from '../lib/utils'

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'file-upload',
      pendingRequest: null,
      results: null,
      filaments: null,
      amount: 1,
      sliceResult: null,
      selectedFilament: null,
      files: [],
      delivery: 'standard',
      details: '',
      order: null,
    };
    this.fileUploadRef = null;

    this.getAvailableFilaments();

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.analyze = this.analyze.bind(this);
    this.confirmChooseFile = this.confirmChooseFile.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.onItemAmountChange = this.onItemAmountChange.bind(this);
    this.genericOnValueChange = this.genericOnValueChange.bind(this);
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
    if(true) {
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
    if(true) {

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
    if(true) {
        this.setState({
        ...this.state,
        pendingRequest: 'analyzing',
      });

      getFilePrice(this.state.files[currentFile].id, filament)
      .then((result) => {
        this.updateFileValue(currentFile, { price: result.price, filament });
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
    createOrder(files, email, this.state.delivery, this.state.details)
      .then((result) => {
        this.setState({
          ...this.state,
          order: result.order,
        });
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

  genericOnValueChange(type, e) {
        this.setState({
      ...this.state,
      [type]: e.target.value,
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
    if(state.delivery === 'express') {
      totalPrice = totalPrice*1.3;
    }
		return (
			<div id="app">
        {!state.order ?
          <div>
            <div>
              <h1>3D Obchod</h1>
            </div>
            <FileUpload confirmChooseFile={this.confirmChooseFile} ref={(node) => { this.fileUploadRef = node }}/>
              {state.files.length ?
                <div>
                  <hr/>
                  {details}
                  <div className="row">
                    <a className="icon file-add-icon one column offset-by-five" onClick={() => { this.fileUploadRef.dropzoneRef.open() }}><FontAwesome.FaPlus/></a>
                  </div>
                  <hr/>
                  <div className="row">
                    <label>Celková cena</label>
                    <span>{Math.round(totalPrice)},-Kč</span>
                  </div>
                  {/*<Results confirmResult={() => { this.changeCurrentPage('order'); }} sliceResult={state.sliceResult} />*/}
                  <hr/>
                  <Details
                    delivery={state.delivery}
                    onDeliveryChange={(e) => {this.genericOnValueChange('delivery', e);}}
                    details={state.details}
                    onDetailsChange={(e) => {this.genericOnValueChange('details', e);}}
                  />
                  <hr />
                  <Order createOrder={this.createOrder} />
                </div>
                : null}

          </div>
        :
          <div>
            <FinishOrder
              state={state}
            />
          </div>
        }

			</div>
		);
	}
}
