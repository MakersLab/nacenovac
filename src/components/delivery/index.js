import { h, Component } from 'preact';
import _ from 'lodash';

export default class Delivery extends Component {
  render() {
    return(
    <form>
      <h2>Druh dodání</h2>
      <label>
        <input
          type="radio"
          name="delivery"
          value="standard"
          checked={this.props.delivery === 'standard'}
          onChange={this.props.onValueChange}
        />
        standard - do 5 dní
      </label>
      <label>
        <input
          type="radio"
          name="delivery"
          value="express"
          checked={this.props.delivery === 'express'}
          onChange={this.props.onValueChange}
        />
        express - do 3 dní (+30% ceny)
      </label>
    </form>);
  };
}
