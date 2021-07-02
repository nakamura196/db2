import CAdvanced from './CAdvanced.vue'

export default {
  title: 'CAdvanced',
}

export const Normal = () => ({
  components: { CAdvanced },
  template: `<v-app><CAdvanced/></v-app>`,
})

export const Select = () => ({
  components: { CAdvanced },
  template: `<v-app><CAdvanced :items="[{
    label: '冊',
    type: 'select',
    key: '冊',
    value: '',
    values: ['1', '2', '3', '4', '5', '6', '7', '8'],
  }]"/></v-app>`,
})

export const Text = () => ({
  components: { CAdvanced },
  template: `<v-app><CAdvanced :items="[{
    label: '地名/記述',
    type: 'text',
    key: '地名/記述',
    value: '',
  }]"/></v-app>`,
})

export const ShowCloseBtn = () => ({
  components: { CAdvanced },
  template: `<v-app><CAdvanced :showCloseBtn="true"/></v-app>`,
})
