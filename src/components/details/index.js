import { h, Component } from 'preact';
import _ from 'lodash';
import style from './style';

export default class Delivery extends Component {
  render(props, state) {
    return(
    <form onSubmit={e => { e.preventDefault(); }}>
      <div>
        <div class={style['details__label']}>Druh dodání:</div>
        <div>
          <label class={style['details__option']}>
            <input
              type="radio"
              name="delivery"
              value="standard"
              checked={props.delivery === 'standard'}
              onChange={props.onDeliveryChange}
            />
            standard - do 5 dní
          </label>
        </div>
        <div>
          <label class={style['details__option']}>
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
      </div>
      <div>
        <div class={style['details__label']}>Detaily k objednávce:</div>
        <textarea onChange={props.onDetailsChange} class={style['details__textarea']}>
          {props.details}
        </textarea>
      </div>
    </form>);
  };
}
