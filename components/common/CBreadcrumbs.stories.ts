import CBreadcrumbs from './CBreadcrumbs.vue'

export default {
  title: 'CBreadcrumbs',
}

export const Normal = () => ({
  components: { CBreadcrumbs },
  template:
    '<v-app><c-breadcrumbs :items="[{text: 1},{text: 2}]"/></v-app>',
})