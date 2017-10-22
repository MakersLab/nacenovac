import { h, Component } from 'preact';
import style from './style';
import _ from 'lodash';

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filaments: [],
      selectedMaterial: props.filaments[0].material,
      selectedFilament: props.filaments[0]['color-name'],
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  getAvailableMaterialOptions() {
    return _(this.props.filaments)
      .uniqBy('material')
      .map((filament) => {
        return (<option value={filament.material}>{filament.material.toUpperCase()}</option>);
      }).value();
  }

  getAvailableColorOptions() {
    if(this.state.selectedMaterial) {
      return _(this.props.filaments)
        .filter(['material', this.state.selectedMaterial])
        .map((filament) => {
          return (<option value={filament.id}>{filament['color-name']}</option>)
        })
        .value();
    }
    return [];
  }

  handleSelectChange(e, type) {
    this.setState({
      ...this.state,
      [type]: e.target.value,
    });
  }

  handleConfirm() {
    this.props.analyze(this.state.selectedFilament);
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
        </div>
        <button onClick={this.handleConfirm}>Analyze</button>
      </div>);
  }
}
