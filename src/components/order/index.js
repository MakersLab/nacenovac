import { h, Component } from 'preact';
import style from './style';


export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: '',
        phone: '+420',
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
    this.props.createOrder(this.state.form.email, this.state.form.phone);
  }

  render(props, state) {
    return(
      <div class={`${style['order']} container`}>
        <div class="row">
          <form onSubmit={this.handleSubmit}>
            <div class={style.email}>
              <label>Email:</label>
              <input
                type="email"
                label="email"
                onChange={(e) => {this.handleInputChange(e, 'email')}}
                value={state.form.email}
                class={`input ${style['email-input']}`}
              />
            </div>
            <div class={style.phone}>
              <label>Telefonní číslo:</label>
              <input
                type="tel"
                label="phone"
                onChange={(e) => {this.handleInputChange(e, 'phone')}}
                value={state.form.phone}
                class={`input ${style['phone-input']}`}
              />
            </div>
            <div>
              <input class="button" type="submit" value="Vytvořit objednávku"/>
            </div>
          </form>
        </div>
      </div>);
  }
}
