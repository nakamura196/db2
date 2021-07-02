<template>
  <div>
    <v-navigation-drawer v-model="drawer" :temporary="true" app>
      <v-list>
        <v-list-item
          v-for="(item, key) in menu"
          :key="key"
          :to="item.to"
          :href="item.href"
          link
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <span>{{ $t(item.label) }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="drawer = !drawer" />

      <v-toolbar-title>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          style="color: inherit; text-decoration: inherit;"
        >
          {{ $t('piranesi_db') }}
        </nuxt-link>
      </v-toolbar-title>

      <FullTextSearch background-color="white" :header="true"></FullTextSearch>

      <v-spacer></v-spacer>

      <template v-if="!isMobile">
        <v-btn
          v-for="(item, key) in menu"
          :key="key"
          class="ma-1"
          text
          depressed
          :to="item.to"
          :href="item.href"
        >
          <v-icon v-if="item.icon" class="mr-1">{{ item.icon }}</v-icon>
          {{ $t(item.label) }}
        </v-btn>
      </template>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn depressed btn v-on="on">
            <v-icon class="mr-2">mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :to="switchLocalePath('ja')">
            <v-list-item-title>日本語</v-list-item-title>
          </v-list-item>
          <v-list-item :to="switchLocalePath('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import FullTextSearch from '~/components/common/search/FullTextSearch.vue'

@Component({
  components: {
    FullTextSearch,
  },
})
export default class Header extends Vue {
  baseUrl: string = process.env.BASE_URL || ''

  drawer: boolean = false

  menu: any[] = [
    {
      label: 'search',
      to: this.localePath({ name: 'search' }),
      icon: 'mdi-magnify',
    },
    {
      label: 'category',
      to: this.localePath({ name: 'category' }),
      icon: 'mdi-view-list',
    },
    {
      label: 'legend',
      href: this.baseUrl + '/底本・校本DB凡例.pdf',
      icon: 'mdi-information',
    },
    {
      label: 'dataset',
      to: this.localePath({ name: 'dataset' }),
      icon: 'mdi-database',
    },
    {
      label: 'inquiry',
      href:
        'https://docs.google.com/forms/d/e/1FAIpQLSd1gYA3qgLN2qQKn4o5vuzbma3Dgtoj_u555SVNuIgM4CSc-g/viewform?usp=sf_link',
      icon: 'mdi-contacts',
    },
  ]

  get isMobile() {
    if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
      return true
    } else {
      return false
    }
  }
}
</script>
