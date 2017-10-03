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
      <div>
        {<select>
          <option>ružová</option>
          <option>modrá</option>
          <option>žlutá</option>
        </select>}
        {<select>
          <option>PLA</option>
          <option>ABS</option>
          <option>PET</option>
        </select>}
        {<button>Analyze</button>}
      </div>);
  }
}
