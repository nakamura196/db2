import CFullTextSearch from './CFullTextSearch.vue'

export default {
  title: 'CFullTextSearch',
}



export const Normal = () => ({
  components: { CFullTextSearch },
  template:
    '<v-app><CFullTextSearch/></v-app>',
})

export const White = () => ({
  components: { CFullTextSearch },
  template:
    '<v-app><CFullTextSearch backgroundColor="white" /></v-app>',
})

export const Black = () => ({
  components: { CFullTextSearch },
  template:
    '<v-app><CFullTextSearch backgroundColor="black" dark/></v-app>',
})

export const Header = () => ({
  components: { CFullTextSearch },
  template:
    '<v-app><CFullTextSearch :header="true"/></v-app>',
})