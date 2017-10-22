import { h, Component } from 'preact';
import style from './style';


export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(props, state) {
    return(
      <div class={`${style.results} container`}>
        <div class="row">
          <h1>Results</h1>
        </div>
        <div class="row">
          <div class="two columns">
            <label>
              Price:
            </label>
            <span>{props.slicerResult ? `${Math.round(props.slicerResult.price)},-Kč` : 'loading spinner'}</span>
          </div>
          <div class="two columns">
            <label>
              Print time in seconds:
            </label>
            <span>{props.slicerResult ? `${props.slicerResult.printTime}s` : 'loading spinner'}</span>
          </div>
          <div class="two columns">
            <label>
              Filament used:
            </label>
            <span>{props.slicerResult ? `${props.slicerResult.filament}` : 'loading spinner'}</span>
          </div>
          <div class="two columns">
            <button class="button-primary" onClick={props.confirmResult}>Order</button>
          </div>
        </div>
      </div>);
  }
}
