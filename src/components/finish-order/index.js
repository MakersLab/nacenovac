import { Component } from 'preact';
import style from './style';

export default class FinishOrder extends Component {
  constructor(props) {
    super(props);
  }

  render(props, state) {
    return (
    <div class="container">
      <p class="">
        Děkujeme, za Vaši objednávku. Budeme Vás kontaktovat. Detaily objednávky jsme Vám zaslali na email.
      </p>
      {/*<a class="button" href="http://3dtovarna.cz/" class={`button two columns offset-by-four ${style['button']}`}>*/}
        {/*OK*/}
      {/*</a>*/}
    </div>
    );
  }
}
