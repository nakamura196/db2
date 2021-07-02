<template>
  <div>
    <BMenu :items="bh"></BMenu>

    <v-container class="my-5">
      <h2>{{ config.label }}</h2>

      <Loading :loading="loading"></Loading>

      <template v-if="!loading">
        <v-row class="mt-2" dense justify="center" align-content="center">
          <v-col cols="12" sm="10">
            <FullTextSearch
              background-color="grey lighten-3"
              :to="config.to"
            ></FullTextSearch>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import BMenu from '~/components/common/BMenu.vue'
import Loading from '~/components/common/Loading.vue'
import FullTextSearch from '~/components/common/search/FullTextSearch.vue'

@Component({
  components: {
    BMenu,
    Loading,
    FullTextSearch,
  },
})
export default class Page extends Vue {
  @Prop({ required: false, default: () => [] })
  bh!: any

  @Prop({ required: false, default: 'default' })
  configId!: string

  loading: boolean = false

  /*
  get config() {
    
    return config
  }
  */

  config: any = {}

  created() {
    const env: any = process.env.config
    const config = env[this.configId]
    // console.log(this.config)
    this.config = config
    // this.title =
  }

  // isBc: any = process.env.bc
}
</script>
