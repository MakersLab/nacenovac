import { h, Component } from 'preact';
import _ from 'lodash';
import * as FontAwesome from 'react-icons/lib/fa';
import {convertObjectToArray} from '../../lib/utils';
import {PROGRESS_DONE, PROGRESS_SLICING, PROGRESS_UPLOADING} from '../../lib/constants'
import { Spinner } from '../../assets/spinner/index';

import style from './style';

const progressText = {
  [PROGRESS_UPLOADING]: 'nahrávám soubur',
  [PROGRESS_SLICING]: 'zpracovávám soubor',
  [PROGRESS_DONE]: 'hotovo',
};

export default class File extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMaterial: props.filaments ? props.filaments[Object.keys(props.filaments)[0]].material : null,
      selectedFilament: props.filaments ? props.filaments[Object.keys(props.filaments)[0]]['color-name'] : null,
      amount: 1,
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  filterByMaterial(material) {
    return _(convertObjectToArray(this.props.filaments, 'id'))
        .filter(['material', material])
        .value();
  }

  getAvailableMaterialOptions() {
    let availableMaterials =  _(convertObjectToArray(this.props.filaments, 'id'))
      .uniqBy('material')
      .map((filament) => {
        return (<option value={filament.material}>{filament.material.toUpperCase()}</option>);
      }).value();

    if (this.props.filaments && (this.state.selectedMaterial === null || this.state.selectedFilament === null)) {
      this.setState({
        ...this.state,
        selectedMaterial: convertObjectToArray(this.props.filaments, 'id')[0].material,
        selectedFilament: convertObjectToArray(this.props.filaments, 'id')[0].id,
      })
    }
    return availableMaterials;
  }

  getAvailableColorOptions() {
    if(this.state.selectedMaterial) {
      return _(convertObjectToArray(this.props.filaments, 'id'))
        .filter(['material', this.state.selectedMaterial])
        .map((filament) => {
          return (<option value={filament.id}>{filament['color-name']}</option>);
        })
        .value();
    }
    return [];
  }

  handleValueChange(e, type) {
    if (type === 'selectedMaterial') {
      let material = e.target.value;
      this.setState({
        ...this.state,
        selectedMaterial: material,
        selectedFilament: this.filterByMaterial(material)[0].id,
      });
      this.props.analyze(this.state.selectedFilament);
    }
    else if (type === 'selectedFilament') {
      this.setState({
        ...this.state,
        [type]: e.target.value
      });
      this.props.analyze(this.state.selectedFilament);
    }

    else if (type === 'amount') {
      this.setState({
        ...this.state,
        [type]: Number(e.target.value),
      });
      this.props.onItemAmountChange(Number(e.target.value));
    }
  }

  handleConfirm() {
    this.props.analyze(this.state.selectedFilament);
  }

  render(props, state) {
      const dimensions = props.dimensions || { x:0, y:0, z:0 };
      return(
        <form
          class={`${style['details']}`}
          onSubmit={e => { e.preventDefault(); }}
        >
          <div class="row">
            <div class={`three columns ${style['details__detail-item']}`}>
              <div class={style['detail-item__filename']}>
                {props.filename}
              </div>
              {props.state !== PROGRESS_DONE ?
                <div>
                  {Spinner}
                  {progressText[props.state]}
                </div>
                :
                <div>
                  {`${dimensions.x.toFixed(1)} x ${dimensions.y.toFixed(1)} x ${dimensions.z.toFixed(1)}mm`}
                </div>
              }
            </div>

            <div class={`two columns ${style['details__detail-item']}`}>
              <label class={style['title']}>Material:</label>
              <select class={style['select']} onChange={(e) => { this.handleValueChange(e, 'selectedMaterial'); }}>
                {this.getAvailableMaterialOptions()}
              </select>
            </div>
            <div class={`two columns ${style['details__detail-item']}`}>
              <label class={style['title']}>Barva:</label>
              <select class={style['select']} onChange={(e) => { this.handleValueChange(e, 'selectedFilament'); }}>
                {this.getAvailableColorOptions()}
              </select>
            </div>
            <div class={`two columns ${style['details__detail-item']}`}>
              <label>Počet:</label>
              <input
                class={style['detail-item__amount']}
                type="number"
                min="1"
                max="20"
                value={state.amount}
                onChange={(e) => { this.handleValueChange(e, 'amount'); }}
                onClick={(e) => { this.handleValueChange(e, 'amount'); }}
              />
            </div>
            <div class={`two columns ${style['details__detail-item']}`}>
              <label>Cena:</label>
              <span>{props.price ? `${Math.round(props.price)*state.amount},- Kč`: '-'}</span>
            </div>
            <div class={`one column ${style['details__detail-item']}`}>
              <a class={`icon ${style['remove-icon']}`} onClick={this.props.remove}><FontAwesome.FaClose/></a>
            </div>
          </div>
        </form>);
  }
}
