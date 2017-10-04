import { h, Component } from 'preact';
import FileUpload from '../routes/file-upload/'
import Details from '../routes/details/'
import Results from '../routes/results/'
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'file-upload',
      isFetchingResults: false,
      results: null,
      file: {
        name: '-'
      },
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.confirmChooseFile = this.confirmChooseFile.bind(this);
  }

  changeCurrentPage(page) {
    this.setState({
      ...this.state,
      currentPage: page
    });
  }

  confirmChooseFile(file) {
    this.setState({
      ...this.state,
      file,
    });
    this.changeCurrentPage('details')
  }

  makeRequest() {
    //  TODO add code for uploading the file and getting the results when backend will be available
    this.changeCurrentPage('results');
  }

	render(props, state) {
		return (
			<div id="app">
        { state.currentPage === 'file-upload' ? <FileUpload confirmChooseFile={this.confirmChooseFile}/> : null}
        { state.currentPage === 'details' ? <Details onConfirm={this.makeRequest} filename={state.file.name}/> : null}
        { state.currentPage === 'results' ? <Results /> : null}
			</div>
		);
	}
}
