import { h, Component } from 'preact';
import _ from 'lodash';

export default class Delivery extends Component {
  render(props, state) {
    return(
    <form>
      <div>
        <label>Druh dodání</label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="standard"
            checked={props.delivery === 'standard'}
            onChange={props.onDeliveryChange}
          />
          standard - do 5 dní
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="express"
            checked={props.delivery === 'express'}
            onChange={props.onDeliveryChange}
          />
          express - do 3 dní (+30% ceny)
        </label>
      </div>
      <div>
        <label>Detaily k objednávce</label>
        <textarea onChange={props.onDetailsChange}>
          {props.details}
        </textarea>
      </div>
    </form>);
  };
}
