import { h, Component } from 'preact';
import Dropzone from 'react-dropzone';
import style from './style';


export default class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFileSelected: false,
      file: false,
    };

    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleAnalyzeButtonClick = this.handleAnalyzeButtonClick.bind(this);
  }

  handleFileDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles, rejectedFiles);
    this.setState({
      ...this.state,
      isFileSelected: true,
      file: acceptedFiles[0],
    });
  }

  handleAnalyzeButtonClick() {
    this.props.goToDetailsPage();
  }

  render(props, state) {
    return (
      <form class={style['file-upload']}>
        <div>
          <Dropzone
          onDrop={this.handleFileDrop}
          multiple={false}
          >drag n drop file in or click to open file dialog</Dropzone>
        </div>

        { state.isFileSelected ? <span>{state.file.name }</span>: null }
        <button disabled={!state.isFileSelected} onClick={this.handleAnalyzeButtonClick} type="button">Go to details</button>
      </form>
    );
  }
}
