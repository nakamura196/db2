import CLoading from './CLoading.vue'

export default {
  title: 'CLoading',
}

export const Normal = () => ({
  components: { CLoading },
  template:
    '<v-app><CLoading :loading="true"/></v-app>',
})