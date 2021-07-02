<template>
  <div>
    <v-container class="my-5">
      <h2 class="my-5">{{ $t('dataset') }}</h2>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('name') }}
              </th>
              <th class="text-left">
                URL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in items" :key="key">
              <td>{{ item.label }}</td>
              <td>
                <a :href="item.value">{{ item.value }}</a>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  head() {
    return {}
  }

  items: any[] = [
    {
      label: '酉蓮社本（IIIFコレクション）',
      value:
        'https://www.kanzaki.com/works/2016/pub/image-annotator?u=https://taishozo.github.io/u-renja/iiif2/collection/top.json',
    },
    {
      label: '『大正新脩大蔵経勘同目録』（IIIFマニフェスト）',
      value:
        'https://www.kanzaki.com/works/2016/pub/image-annotator?u=https://taishozo.github.io/db/iiif/kandomokuroku/manifest.json',
    },
    /*
    {
      label: 'メタデータ一覧（Excel）',
      value:
        'https://view.officeapps.live.com/op/view.aspx?src=https://taishozo.github.io/db/metadata/data.xlsx',
    },
    {
      label: 'メタデータ一覧（JSON-LD）',
      value: 'https://taishozo.github.io/db/data.json',
    },
    */
  ]
}
</script>
