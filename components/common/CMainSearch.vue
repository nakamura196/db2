<template>
  <div>
    <c-breadcrumbs v-if="false" :items="bh" />

    <v-container class="my-5">
      <h2>{{ config.label }}</h2>

      <CLoading :loading="loading"></CLoading>

      <template v-if="!loading">
        <v-row class="mt-2" dense justify="center" align-content="center">
          <v-col cols="12" sm="10">
            <CFullTextSearch
              background-color="grey lighten-3"
              :config-id="configId"
            ></CFullTextSearch>
          </v-col>

          <v-col
            v-if="config.advanced.length > 0"
            cols="12"
            sm="2"
            class="text-right"
          >
            <v-btn
              rounded
              depressed
              color="grey lighten-2"
              @click="isAdvanced = !isAdvanced"
            >
              <v-icon class="mr-1">mdi-menu</v-icon> {{ $t('detail') }}
            </v-btn>
          </v-col>
        </v-row>

        <div v-show="isAdvanced" class="py-10">
          <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
              <CAdvanced
                class="grey lighten-5 pa-5"
                :items="config.advanced"
              ></CAdvanced>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
        </div>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import CLoading from '~/components/common/CLoading.vue'
import CBreadcrumbs from '~/components/common/CBreadcrumbs.vue'
import CFullTextSearch from '~/components/common/search/CFullTextSearch.vue'
import CAdvanced from '~/components/common/search/CAdvanced.vue'

@Component({
  components: {
    CBreadcrumbs,
    CLoading,
    CFullTextSearch,
    CAdvanced,
  },
})
export default class Page extends Vue {
  @Prop({ required: false, default: () => [] })
  bh!: any

  @Prop({ required: false, default: 'default' })
  configId!: string

  isAdvanced: boolean = false

  loading: boolean = false

  config: any = {}

  created() {
    const env: any = process.env.config
    const config = env[this.configId]
    // console.log(this.config)
    this.config = config
    // this.title =

    console.log({ config })
  }

  // isBc: any = process.env.bc
}
</script>
