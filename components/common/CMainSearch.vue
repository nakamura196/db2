<template>
  <div>
    <c-breadcrumbs :items="bh"/>

    <v-container class="my-5">
      <h2>{{ config.label }}</h2>

      <CLoading :loading="loading"></CLoading>

      <template v-if="!loading">
        <v-row class="mt-2" dense justify="center" align-content="center">
          <v-col cols="12" sm="10">
            <CFullTextSearch
              background-color="grey lighten-3"
              :to="config.to"
            ></CFullTextSearch>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import CLoading from '~/components/common/CLoading.vue'
import CBreadcrumbs from '~/components/common/CLoading.vue'
import CFullTextSearch from '~/components/common/search/CFullTextSearch.vue'

@Component({
  components: {
    CBreadcrumbs,
    CLoading,
    CFullTextSearch,
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
