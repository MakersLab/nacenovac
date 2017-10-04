import { h, Component } from 'preact';
import FileUpload from '../routes/file-upload/'
import Details from '../routes/details/'
import Results from '../routes/results/'
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 'details',
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  changeCurrentPage(page) {
    this.setState({
      ...this.state,
      currentPage: page
    });
  }

	render(props, state) {
		return (
			<div id="app">
        { state.currentPage === 'file-upload' ? <FileUpload goToDetailsPage={() => {this.changeCurrentPage('details')}}/> : null}
        { state.currentPage === 'details' ? <Details /> : null}
        { state.currentPage === 'results' ? <Results /> : null}
			</div>
		);
	}
}
