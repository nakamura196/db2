<template>
  <div>
    <v-row v-for="(config, key) in items" :key="key" dense>
      <v-col cols="3">
        <v-subheader>{{ config.label }}</v-subheader>
      </v-col>
      <v-col cols="9">
        <template v-if="config.type === 'select'">
          <v-select
            v-model="config.value"
            :items="config.values"
            filled
            rounded
            dense
            multiple
            hide-details
          ></v-select>
        </template>
        <template v-else>
          <v-text-field
            v-model="config.value"
            hide-details
            filled
            rounded
            dense
            @click:append="search"
            @keydown.enter="trigger"
          ></v-text-field>
        </template>
      </v-col>
    </v-row>

    <div class="text-center mt-2">
      <v-btn
        v-if="showCloseBtn"
        class="ma-1"
        rounded
        depressed
        color="grey lighten-2"
        @click="close()"
      >
        {{ $t('close') }}
      </v-btn>
      <v-btn rounded depressed color="grey lighten-2" @click="reset()">
        {{ $t('reset') }}
      </v-btn>
      <v-btn rounded depressed color="primary" @click="search()">
        {{ $t('search') }}
      </v-btn>
    </div>
  </div>
  <!-- class="mr-2" dark -->
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'nuxt-property-decorator'

@Component({})
export default class FullTextSearch extends Vue {
  @Prop({ default: false })
  showCloseBtn!: boolean

  @Prop({ required: true, default: () => [] })
  items!: any

  // configs: any = process.env.advanced

  @Watch('$route')
  watchRoute() {
    this.reset()
    this.updateQuery()
  }

  // @Emit()
  close() {
    this.$emit('close', false)
  }

  updateQuery() {
    const query = this.$route.query

    const configs = this.items

    const queryMap: any = {}

    for (const queryField in query) {
      if (queryField.includes('[advanced]')) {
        const key = queryField.split('[')[2].split(']')[0]

        if (!queryMap[key]) {
          queryMap[key] = []
        }

        let values = query[queryField]

        if (typeof values === 'string') {
          values = [values]
        }

        for (const v of values) {
          queryMap[key].push(v)
        }
      }
    }

    for (const option of configs) {
      if (queryMap[option.key]) {
        option.value = queryMap[option.key]
      }
    }

    this.items = configs
  }

  created() {
    this.updateQuery()
  }

  trigger(event: any) {
    // 日本語入力中のEnterキー操作は無効にする
    if (event.keyCode !== 13) return
    this.search()
  }

  search() {
    const query = JSON.parse(JSON.stringify(this.$route.query))

    for (const config of this.items) {
      const field = config.key

      for (const queryField in query) {
        if (queryField.includes('[advanced][' + field + ']')) {
          delete query[queryField]
        }
      }

      const value = config.value

      if (value === '') {
        continue
      }

      let values = value

      if (typeof values === 'string') {
        values = [values]
      }

      for (let i = 0; i < values.length; i++) {
        query['main[advanced][' + field + '][' + i + ']'] = values[i]
      }
    }

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      })
    )
  }

  reset() {
    for (const config of this.items) {
      config.value = ''
    }
  }
}
</script>
