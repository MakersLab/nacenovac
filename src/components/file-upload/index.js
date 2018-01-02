import { h, Component } from 'preact';
import Dropzone from 'react-dropzone';
import style from './style';
import {MAX_FILE_SIZE} from "../../lib/constants";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.dropzoneRef = null;
    this.state = {
      isFileSelected: false,
      file: false,
    };

    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(acceptedFiles, rejectedFiles) {
    if(acceptedFiles[0].size < MAX_FILE_SIZE) {
      this.setState({
        ...this.state,
        isFileSelected: true,
        file: acceptedFiles[0],
      });
      this.props.confirmChooseFile(this.state.file);
    } else {
      alert(`Soubor je moc veliký, musí být menší než ${Math.round(MAX_FILE_SIZE/1000000)}MB`)
    }
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
            accept={".stl"}
            ref={(node) => { this.dropzoneRef = node; }}
          >
            <div class={style['file__text']}>Přidejte model ve formátu STL přetáhnutím souboru nebo kliknutím</div>
          </Dropzone>
        </div>
        {/*<div class={`one column offset-by-two ${style['button']}`}>*/}
        {/*<button class="button-primary disabled" disabled={!state.isFileSelected} onClick={this.handleAnalyzeButtonClick} type="button">Go to details</button>*/}
        {/*</div>*/}
      </div>
    );
  }
}
