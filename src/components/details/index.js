import { h, Component } from 'preact';
import _ from 'lodash';

import { convertObjectToArray } from '../../lib/utils'
import style from './style';

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMaterial: props.filaments ? props.filaments[0].material : null,
      selectedFilament: props.filaments ? props.filaments[0]['color-name'] : null,
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
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

  handleSelectChange(e, type) {
    if (type === 'selectedMaterial') {
      let material = e.target.value;
      this.setState({
        ...this.state,
        selectedMaterial: material,
        selectedFilament: this.filterByMaterial(material)[0].id,
      });
    }
    else {
      this.setState({
        ...this.state,
        [type]: e.target.value
      });
    }

    this.props.analyze(this.state.selectedFilament);
  }

  handleConfirm() {
    this.props.analyze(this.state.selectedFilament);
  }

  render(props, state) {
    if(props.filename) {
      return(
        <div class={`${style['details']} container`}>
          <div class="row">
            <div class="four columns">
              {props.filename}
            </div>
            <div class="two columns">
              <label class={style['title']}>Material:</label>
              <select class={style['select']} onChange={(e) => { this.handleSelectChange(e, 'selectedMaterial'); }}>
                {this.getAvailableMaterialOptions()}
              </select>
            </div>
            <div class="two columns">
              <label class={style['title']}>Color:</label>
              <select class={style['select']} onChange={(e) => { this.handleSelectChange(e, 'selectedFilament'); }}>
                {this.getAvailableColorOptions()}
              </select>
            </div>
            <div class="two columns">
              <label>Price:</label>
              <span>{props.sliceResult ? `${Math.round(props.sliceResult.price)},- Kč`: 'calculating'}</span>
            </div>
          </div>
        </div>);
    }
    return null;
  }
}
