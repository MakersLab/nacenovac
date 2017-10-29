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
          <div class="two columns">
            <label>
              Price:
            </label>
            <span>{props.sliceResult ? `${Math.round(props.sliceResult.price)},-Kč` : 'loading spinner'}</span>
          </div>
          <div class="two columns">
            <label>
              Print time in seconds:
            </label>
            <span>{props.sliceResult ? `${props.sliceResult.printTime}s` : 'loading spinner'}</span>
          </div>
          <div class="two columns">
            <label>
              Filament used:
            </label>
            <span>{props.sliceResult ? `${props.sliceResult.filament}` : 'loading spinner'}</span>
          </div>
        </div>
      </div>);
  }
}
