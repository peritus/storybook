import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withNotes } from '@storybook/addon-notes';
import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
} from '@storybook/addon-knobs';
import Centered from '@storybook/addon-centered';

import MyButton from './Button.vue';
import Welcome from './Welcome.vue';
import App from '../App.vue';

storiesOf('Welcome', module).add('Welcome', () => ({
  render: h => h(Welcome),
}));

storiesOf('App', module).add('App', () => ({
  render: h => h(App),
}));

storiesOf('Button', module)
  .addDecorator(Centered)
  // Works if Vue.component is called in the config.js in .storybook
  .add('rounded', () => ({
    template: '<my-button :rounded="true">A Button with rounded edges</my-button>',
  }))
  .add('square', () => ({
    template: '<my-button :rounded="false">A Button with square edges</my-button>',
  }));

storiesOf('Method for rendering Vue', module)
  .add('render', () => ({
    render: h => h('div', ['renders a div with some text in it..']),
  }))
  .add('render + component', () => ({
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
    },
  }))
  .add('template', () => ({
    template: `
      <div>
        <h1>A template</h1>
        <p>rendered in vue in storybook</p>
      </div>`,
  }))
  .add('template + component', () => ({
    components: { MyButton },
    template: '<my-button>MyButton rendered in a template</my-button>',
  }))
  .add('template + methods', () => ({
    components: { MyButton },
    template: `
      <p>
        <em>Clicking the button will navigate to another story using the 'addon-links'</em><br/>
        <my-button :rounded="true" :handle-click="action">MyButton rendered in a template + props & methods</my-button>
      </p>`,
    methods: {
      action: linkTo('Button'),
    },
  }))
  .add('vuex + actions', () => ({
    components: { MyButton },
    template: '<my-button :handle-click="log">with vuex: {{ $store.state.count }}</my-button>',
    store: new Vuex.Store({
      state: { count: 0 },
      mutations: {
        increment(state) {
          state.count += 1; // eslint-disable-line
          action('vuex state')(state);
        },
      },
    }),
    methods: {
      log() {
        this.$store.commit('increment');
      },
    },
  }))
  .add('whatever you want', () => ({
    components: { MyButton },
    template:
      '<my-button :handle-click="log">with awesomeness: {{ $store.state.count }}</my-button>',
    store: new Vuex.Store({
      state: { count: 0 },
      mutations: {
        increment(state) {
          state.count += 1; // eslint-disable-line
          action('vuex state')(state);
        },
      },
    }),
    methods: {
      log() {
        this.$store.commit('increment');
      },
    },
  }))
  .add('pre-registered component', () => ({
    /* By pre-registering component in config.js,
     * the need to register all components with each story is removed.
     * You'll only need the template */
    template: `
      <p>
        <em>This component was pre-registered in .storybook/config.js</em><br/>
        <my-button>MyButton rendered in a template</my-button>
      </p>`,
  }));

storiesOf('Decorator for Vue', module)
  .addDecorator(story => {
    // Decorated with story function
    const WrapButton = story();
    return {
      components: { WrapButton },
      template: '<div :style="{ border: borderStyle }"><wrap-button/></div>',
      data() {
        return { borderStyle: 'medium solid red' };
      },
    };
  })
  .addDecorator(() => ({
    // Decorated with `story` component
    template: '<div :style="{ border: borderStyle }"><story/></div>',
    data() {
      return {
        borderStyle: 'medium solid blue',
      };
    },
  }))
  .add('template', () => ({
    template: '<my-button>MyButton with template</my-button>',
  }))
  .add('render', () => ({
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
    },
  }));

storiesOf('Addon Actions', module)
  .add('Action only', () => ({
    template: '<my-button :handle-click="log">Click me to log the action</my-button>',
    methods: {
      log: action('log1'),
    },
  }))
  .add('Action and method', () => ({
    template: '<my-button :handle-click="log">Click me to log the action</my-button>',
    methods: {
      log: e => {
        e.preventDefault();
        action('log2')(e.target);
      },
    },
  }));

storiesOf('Addon Notes', module)
  .add(
    'Simple note',
    withNotes({ text: 'My notes on some bold text' })(() => ({
      template:
        '<p><strong>Etiam vulputate elit eu venenatis eleifend. Duis nec lectus augue. Morbi egestas diam sed vulputate mollis. Fusce egestas pretium vehicula. Integer sed neque diam. Donec consectetur velit vitae enim varius, ut placerat arcu imperdiet. Praesent sed faucibus arcu. Nullam sit amet nibh a enim eleifend rhoncus. Donec pretium elementum leo at fermentum. Nulla sollicitudin, mauris quis semper tempus, sem metus tristique diam, efficitur pulvinar mi urna id urna.</strong></p>',
    }))
  )
  .add(
    'Note with HTML',
    withNotes({
      text: `
      <h2>My notes on emojies</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    })(() => ({
      template: '<p>🤔😳😯😮<br/>😄😩😓😱<br/>🤓😑😶😊</p>',
    }))
  );

storiesOf('Addon Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);
    const content = `I am ${name} and I'm ${age} years old.`;

    return {
      template: `<div>${content}</div>`,
    };
  })
  .add('All knobs', () => {
    const name = text('Name', 'Jane');
    const stock = number('Stock', 20, {
      range: true,
      min: 0,
      max: 30,
      step: 5,
    });
    const fruits = {
      apples: 'Apple',
      bananas: 'Banana',
      cherries: 'Cherry',
    };
    const fruit = select('Fruit', fruits, 'apple');
    const price = number('Price', 2.25);

    const colour = color('Border', 'deeppink');
    const today = date('Today', new Date('Jan 20 2017'));
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const nice = boolean('Nice', true);

    const stockMessage = stock
      ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
      : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;
    const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';

    return {
      template: `
          <div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
            <h1>My name is ${name},</h1>
            <h3>today is ${new Date(today).toLocaleDateString()}</h3>
            <p>${stockMessage}</p>
            <p>Also, I have:</p>
            <ul>
              ${items.map(item => `<li key=${item}>${item}</li>`).join('')}
            </ul>
            <p>${salutation}</p>
          </div>
        `,
    };
  });
