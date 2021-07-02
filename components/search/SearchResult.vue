<template>
  <div>
    <template v-if="layoutOption === 'stats'">
      <StatsSearchResult />
    </template>
    <template v-else>
      <TableSearchResult />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import StatsSearchResult from '~/components/search/StatsSearchResult.vue'
import TableSearchResult from '~/components/search/TableSearchResult.vue'

@Component({
  components: {
    TableSearchResult,
    StatsSearchResult,
  },
})
export default class SearchResult extends Vue {
  get layoutOption() {
    return this.$store.state.layout
  }
}
</script>
