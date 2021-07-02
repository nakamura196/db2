<template>
  <div>
    <v-sheet color="grey">
      <v-carousel cycle height="400" show-arrows-on-hover>
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="i"
          :src="slide"
          contain
        >
        </v-carousel-item>
      </v-carousel>
    </v-sheet>

    <v-container class="my-10">
      <div class="mb-5 pb-5 text-center">
        <h2>{{ $t(siteName) }}</h2>
        <p class="py-5" v-html="siteDesc"></p>

        <p>以下からお試しください。</p>

        <v-btn
          class="ma-1"
          dark
          color="primary"
          :to="
            localePath({
              name: 'search',
            })
          "
        >
          <v-icon class="mr-1">mdi-magnify</v-icon> {{ $t('search') }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  head() {
    return {
      titleTemplate: null,
    }
  }

  siteName: any = '『大正新脩大蔵経』底本・校本データベース'
  siteDesc: any = '『大正新脩大蔵経』底本・校本データベースへようこそ'

  slides: string[] = [
    process.env.BASE_URL + '/img/kandomokuroku DB_img 005.jpg',
    process.env.BASE_URL + '/img/kandomokuroku DB_img 001.jpg',
  ]
}
</script>
