import { h, Component } from 'preact';
import style from './style';


export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'blue',
      material: 'PLA'
    };
  }

  handleAnalyzeButtonClick() {
    //  TODO call code from props which uploads the file and gets the analyze
  }

  render(props, state) {
    return(
      <div class={`${style['details']} container`}>
        <div>
          <h1>Details</h1>
        </div>
        <div class="row">
          <div class="four columns">
            {props.filename}
          </div>
          <div class="two columns">
            <label class={style['title']}>Color:</label>
            <select class={style['select']}>
              <option>ružová</option>
              <option>modrá</option>
              <option>žlutá</option>
            </select>
          </div>
          <div class="two columns">
            <label class={style['title']}>Material:</label>
            <select class={style['select']}>
              <option>PLA</option>
              <option>ABS</option>
              <option>PET</option>
            </select>
          </div>
        </div>
        <button onClick={props.onConfirm}>Analyze</button>
      </div>);
  }
}
