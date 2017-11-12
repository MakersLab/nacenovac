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
  }

  handleFileDrop(acceptedFiles, rejectedFiles) {
    this.setState({
      ...this.state,
      isFileSelected: true,
      file: acceptedFiles[0],
    });
    this.props.confirmChooseFile(this.state.file);
  }

  render(props, state) {
    return (
      <div class={`${style['file-upload']} container`}>
        <div class="offset-by-three one column">
          <Dropzone
            onDrop={this.handleFileDrop}
            multiple={false}
            class={style['file']}
            className={style['file']}
            accept=".stl"
          >
            <div class={style['file__text']}>přetáhněte sem soubor nebo klikněte pro otevření systémového dialogu</div>
          </Dropzone>
        </div>
        {/*<div class={`one column offset-by-two ${style['button']}`}>*/}
        {/*<button class="button-primary disabled" disabled={!state.isFileSelected} onClick={this.handleAnalyzeButtonClick} type="button">Go to details</button>*/}
        {/*</div>*/}
      </div>
    );
  }
}
