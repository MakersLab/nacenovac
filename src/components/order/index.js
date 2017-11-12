import { h, Component } from 'preact';
import style from './style';


export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: '',
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e, type) {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [type]: e.target.value,
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createOrder(this.state.form.email);
  }

  render(props, state) {
    return(
      <div class={`${style['order']} container`}>
        <div class="row">
          <form onSubmit={this.handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              label="email"
              onChange={(e) => {this.handleInputChange(e, 'email')}}
              value={state.form.email}/>
            <input class="button" type="submit" value="Vytvořit objednávku"/>
          </form>
        </div>
      </div>);
  }
}
