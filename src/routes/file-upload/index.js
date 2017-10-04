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
    this.props.confirmChooseFile(this.state.file);
  }

  render(props, state) {
    return (
      <form class={`${style['file-upload']} container`}>
        <div class={`row ${style.heading}`}>
          <h1>Upload file</h1>
        </div>
        <div class="row">
          <div class="three columns offset-by-two">
            <Dropzone
            onDrop={this.handleFileDrop}
            multiple={false}
            class={style['file']}
            accept=".stl"
            >
              <div class={style['file__text']}>{ state.isFileSelected ? state.file.name : "drag and drop file in or click to open file dialog"}</div>
            </Dropzone>
          </div>
          <div class={`one column offset-by-two ${style['button']}`}>
            <button class="button-primary disabled" disabled={!state.isFileSelected} onClick={this.handleAnalyzeButtonClick} type="button">Go to details</button>
          </div>
        </div>
      </form>
    );
  }
}
