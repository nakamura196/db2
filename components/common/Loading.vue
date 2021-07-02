<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-circular>

    <p>
      初回はインデックスファイルのダウンロードに時間を要します。2回目以降はキャッシュにより待ち時間が改善します。
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  @Prop({ required: false, default: false })
  loading!: boolean
}
</script>
