<template>
  <div v-show="filterShowFlag">
    <v-divider />
    <v-container>
      <span class="ma-1">{{ $t('filter') }}</span>
      <template v-if="query.keyword">
        <v-chip
          v-for="(value, index) in query.keyword"
          :key="index"
          style="white-space: normal; word-wrap: break-word;"
          class="ma-1"
          close
          color="primary"
          label
          text-color="white"
          @click:close="removeKey(value, 'keyword')"
        >
          {{ $t('keyword') }}: {{ value }}
        </v-chip>
      </template>

      <template v-for="(agg, label) in query.advanced">
        <template v-for="key in ['+', '-']">
          <v-chip
            v-for="(value, index2) in agg[key]"
            :key="label + '-' + index2"
            style="white-space: normal; word-wrap: break-word;"
            class="ma-1"
            close
            color="primary"
            label
            text-color="white"
            @click:close="removeFc(label, [key === '+' ? value : '-' + value])"
          >
            {{ $t(label.replace('fc-', '').replace('q-', '')) }}:
            {{ key === '+' ? value : '-' + value }}
          </v-chip>
        </template>
      </template>

      <template v-if="query.after">
        <v-chip
          v-for="(value, index) in query.after"
          :key="index"
          style="white-space: normal; word-wrap: break-word;"
          class="ma-1"
          close
          color="primary"
          label
          text-color="white"
          @click:close="removeKey(value, 'after')"
        >
          {{ $t('after') }}: {{ value }}
        </v-chip>
      </template>

      <template v-if="query.before">
        <v-chip
          v-for="(value, index) in query.before"
          :key="index"
          style="white-space: normal; word-wrap: break-word;"
          class="ma-1"
          close
          color="primary"
          label
          text-color="white"
          @click:close="removeKey(value, 'before')"
        >
          {{ $t('before') }}: {{ value }}
        </v-chip>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class searchfilter extends Vue {
  query: any = this.$store.state
  // query: any = this.$route.query

  removeKey(value: string, label: string) {
    const data: any = {
      label,
      value: [value],
    }
    this.$store.commit('removeKey', data)
    this.$router.push(
      this.localePath({
        name: 'search',
        query: this.$utils.getSearchQueryFromQueryStore(this.$store.state),
      }),
      () => {},
      () => {}
    )
  }

  removeFc(label: string, values: string[]) {
    this.$store.commit('removeFc', {
      label,
      values,
    })

    // push 処理
    const query: any = this.$utils.getSearchQueryFromQueryStore(
      this.$store.state
    )

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  get filterShowFlag(): boolean {
    let flag = false
    const query = this.query
    if (
      query.keyword.length > 0 ||
      query.after.length > 0 ||
      query.before.length > 0 ||
      Object.keys(query.advanced).length > 0
    ) {
      flag = true
    }
    return flag
  }
}
</script>
