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
            <span>88 Czk</span>
          </div>
          <div class="two columns">
            <button class="button-primary">Order</button>
          </div>
        </div>
      </div>);
  }
}
