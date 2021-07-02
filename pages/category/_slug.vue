<template>
  <div>
    <v-sheet v-if="isBc" color="grey lighten-2">
      <v-container fluid class="py-4">
        <v-breadcrumbs class="py-0" :items="bh">
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>
    </v-sheet>
    <v-container class="my-5">
      <div class="text-center">
        <template v-for="(aggList, aggField) in aggs">
          <v-btn
            v-if="!aggList.hide"
            :key="aggField"
            class="ma-1"
            depressed
            color="primary"
            :to="
              localePath({ name: 'category-slug', params: { slug: aggField } })
            "
            >{{ aggList.label }}</v-btn
          >
        </template>
      </div>

      <h2 class="my-5">{{ $route.params.slug }}</h2>

      <template v-if="loading">
        <div class="text-center">
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

      <template v-else>
        <v-tabs v-model="tabs" right>
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#mobile-tabs-5-1" class="primary--text">
            <v-icon>mdi-table</v-icon>
          </v-tab>

          <v-tab href="#mobile-tabs-5-2" class="primary--text">
            <v-icon>mdi-chart-bar</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs" class="mt-10">
          <v-tab-item :value="'mobile-tabs-5-1'">
            <v-card flat>
              <v-card-title>
                <v-text-field
                  v-model="searchAgg"
                  filled
                  rounded
                  append-icon="mdi-magnify"
                  dense
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :items-per-page="20"
                :footer-props="{
                  'items-per-page-options': [20, 50, 100, -1],
                }"
                :headers="headersAggs"
                :items="itemsAggs"
                :search="searchAgg"
              >
                <template v-slot:item.label="{ item }">
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'search',
                        query: getQuery(item.label),
                      })
                    "
                  >
                    {{ item.label }}
                  </nuxt-link>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>

          <v-tab-item :value="'mobile-tabs-5-2'">
            <BarChart
              class="mt-10"
              :labels="labels"
              :datasets="datasets"
            ></BarChart>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import BarChart from '~/components/BarChart'
const _ = require('lodash')

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      tabs: null,
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

      headersAggs: [
        {
          text: this.$t('name'),
          value: 'label',
        },
        {
          text: this.$t('results'),
          value: 'value',
        },
      ],

      searchAgg: '',
      // itemsAgg: [],

      page: 1,
      sort: process.env.defaultSort,
      layout_: process.env.defaultLayout,
      size: 20,
      total: 0,
      items: [],
      ids: [],
      q: '',
      limit: 5,
      aggs: {},
      facets: {},

      loading: true,

      isShowAll: false,

      selectedAggValues: [],

      selectedField: 'group',
      selected: [],
      facetSearch: '',

      layouts: process.env.layout,

      isFacetOpen: true,
      isAdvanced: false,

      advancedOptions: process.env.advanced,

      isBc: process.env.bc,

      bh: [
        {
          text: this.$t('top'),
          disabled: false,
          to: this.localePath({ name: 'index' }),
          exact: true,
        },
        {
          text: this.$t('category'),
          disabled: false,
          to: this.localePath({ name: 'category' }),
          exact: true,
        },
        {
          text: this.$route.params.slug,
        },
      ],

      metadataList: process.env.list,

      sortList: process.env.sort,
    }
  },

  computed: {
    itemsAggs() {
      const items = []
      for (const obj of this.aggs[this.$route.params.slug].value) {
        items.push({
          label: obj[0],
          value: obj[1],
        })
      }

      items.sort(function (a, b) {
        if (a.value < b.value) return 1
        if (a.value > b.value) return -1
        return 0
      })

      return items
    },

    labels() {
      const items = this.itemsAggs
      const labels = []
      for (const obj of items) {
        labels.push(obj.label)
      }
      return labels
    },

    datasets() {
      const items = this.itemsAggs
      const data = []
      for (const obj of items) {
        data.push(obj.value)
      }
      return [{ data, label: this.$t('item') }]
    },

    length() {
      return Math.ceil(this.total / this.size)
    },
    filters() {
      const query = this.$route.query
      const filters = []
      for (const key in query) {
        if (key.includes('[refinementList]')) {
          filters.push({
            label: key.split('[')[2].split(']')[0],
            value: query[key],
          })
        }
      }
      return filters
    },
    sortItems() {
      const keys = ['asc', 'desc']
      const items = []
      for (const obj of this.sortList) {
        for (const key of keys) {
          items.push({
            text: obj.label + ' ' + this.$t(key),
            value: obj.value + ':' + key,
          })
        }
      }
      return items // [{ text: '適合度', value: '_score:desc' }]
    },
    searchLayout() {
      for (const option of this.layouts) {
        if (option.value === this.layout_) {
          return option.component
        }
      }
      return ''
    },
  },

  watch: {
    page(val) {
      // this.list(val)
      const query = JSON.parse(JSON.stringify(this.$route.query))

      if (val === 1) {
        delete query['main[page]']
      } else {
        query['main[page]'] = val
      }

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
    },

    $route() {
      // ヘッダーからの検索対応
      const query = this.$route.query
      if (query['main[query]']) {
        this.q = query['main[query]']
      }

      // フィルタの実行条件は要検討
      this.filter()

      this.list()
    },
  },

  async mounted() {
    // 初期読み込み
    const start = performance.now()
    console.log('start download')
    let index = await axios.get(process.env.BASE_URL + '/' + process.env.index)
    index = index.data

    console.log('end download', performance.now() - start)

    const docs = {}

    const indexMap = {}

    const aggs = process.env.aggs

    const facets = {}

    // 翻訳
    for (const aggField in aggs) {
      facets[aggField] = {}
    }

    // 今後改善予定
    for (const option of this.advancedOptions) {
      facets[option.key] = {}
    }

    for (const item of index) {
      const id = item.objectID
      docs[id] = item

      const title = item.fulltext
      if (!indexMap[title]) {
        indexMap[title] = []
      }
      indexMap[title].push(id)

      const fields = Object.keys(facets)

      for (const field of fields) {
        const map = facets[field]
        let value = item[field]

        if (typeof value !== 'object') {
          value = [value]
        }

        for (const v of value) {
          if (!map[v]) {
            map[v] = []
          }
          map[v].push(id)
        }
      }
    }

    this.facets = facets

    this.docs = docs
    this.index = indexMap

    // クエリの処理
    const query = this.$route.query

    // ページの初期化
    const page = Number(query['main[page]']) || this.page
    this.page = page

    // hitsPerPage
    const size = Number(query.size) || this.size
    this.size = size

    // sort
    const sort = query.sort || this.sort
    this.sort = sort

    // レイアウト
    let layout = ''
    if (query.layout) {
      layout = query.layout
    } else if (localStorage.getItem('layout')) {
      layout = localStorage.getItem('layout')
    } else {
      layout = this.layout_
    }
    // const layout = query['layout'] || this.layout_
    this.layout_ = layout

    // 検索キーワード
    const q = query['main[query]'] || this.q
    this.q = q

    console.log('filter start')
    this.filter()
    console.log('end filter', performance.now() - start)

    // 初期検索の場合
    this.list()

    this.loading = false

    console.log('end loading', performance.now() - start)
  },

  methods: {
    getQuery(value) {
      const obj = {}
      obj['main[refinementList][' + this.$route.params.slug + '][0]'] = value
      return obj
    },
    init() {
      // this.page = 1 //なぜかうまくいかない

      const query = JSON.parse(JSON.stringify(this.$route.query))
      for (const key in query) {
        if (key.includes('[refinementList]')) {
          delete query[key]
        }
      }

      // ページは先頭へ
      delete query['main[page]']

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
    },
    filter() {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      const q = query['main[query]'] || ''

      const docs = this.docs
      const index = this.index

      let ids = []
      const freq = {}

      const sort = this.sort // '_score:desc'

      const spl = sort.split(':')
      const sortValue = spl[0]
      const sortOrder = spl[1]

      // 全文
      if (q === '') {
        ids = Object.keys(docs)
      } else {
        const terms = q.split('　').join(' ').split(' ')

        for (const key in index) {
          let flg = true
          let count = 0
          for (const term of terms) {
            const c = (key.match(new RegExp(term, 'g')) || []).length
            if (c === 0) {
              flg = false
              break
            } else {
              count += c
            }
          }

          if (flg) {
            const ids_ = index[key]

            if (sortValue === '_score') {
              for (const id of ids_) {
                if (!freq[id]) {
                  freq[id] = 0
                }
                freq[id] += count
              }
            }

            ids = ids.concat(ids_)
          }
        }
      }

      // ファセット
      const facets = this.facets

      // advanced
      // クエリ毎に整理
      const advancedMap = {}
      for (const queryField in query) {
        if (queryField.includes('[advanced]')) {
          const facetField = queryField.split('[')[2].split(']')[0]

          if (!advancedMap[facetField]) {
            advancedMap[facetField] = {
              '+': [],
              '-': [],
            }
          }

          let values = query[queryField]
          if (typeof values === 'string') {
            values = [values]
          }

          for (const v of values) {
            let key = '+'
            let value = v
            if (v.startsWith('-')) {
              key = '-'
              value = v.substring(1)
            }
            if (!advancedMap[facetField][key].includes(value)) {
              advancedMap[facetField][key].push(value)
            }
          }
        }
      }

      // advanced options
      const options = {}
      for (const option of this.advancedOptions) {
        options[option.key] = option
      }

      for (const facetField in advancedMap) {
        const obj = advancedMap[facetField]
        const plusValues = obj['+']
        const minusValues = obj['-']

        const matchFacets = facets[facetField]

        // プラス分
        if (plusValues.length > 0) {
          let plusMatchedIds = []
          for (const pValue of plusValues) {
            if (options[facetField].select) {
              plusMatchedIds = plusMatchedIds.concat(matchFacets[pValue])
            } else {
              // 部分一致
              for (const key in matchFacets) {
                if (key.includes(pValue)) {
                  plusMatchedIds = plusMatchedIds.concat(matchFacets[key])
                }
              }
            }
          }
          ids = _.intersection(ids, plusMatchedIds)
        }

        // マイナス分
        if (minusValues.length > 0) {
          // 各値
          for (const mValue of minusValues) {
            let eachMinusMatchedIds = []
            for (const facetValue in matchFacets) {
              if (facetValue !== mValue) {
                eachMinusMatchedIds = eachMinusMatchedIds.concat(
                  matchFacets[facetValue]
                )
              }
            }
            ids = _.intersection(ids, eachMinusMatchedIds)
          }
        }
      }

      // ファセット

      // クエリ毎に整理
      const queryMap = {}
      for (const queryField in query) {
        if (queryField.includes('[refinementList]')) {
          const facetField = queryField.split('[')[2].split(']')[0]

          if (!queryMap[facetField]) {
            queryMap[facetField] = {
              '+': [],
              '-': [],
            }
          }

          let values = query[queryField]
          if (typeof values === 'string') {
            values = [values]
          }

          for (const v of values) {
            let key = '+'
            let value = v
            if (v.startsWith('-')) {
              key = '-'
              value = v.substring(1)
            }
            if (!queryMap[facetField][key].includes(value)) {
              queryMap[facetField][key].push(value)
            }
          }

          /*
          const matchFacets = facets[facetField]

          for (const value of values) {
            let matchIds = []
            if (value.startsWith('-')) {
              const value_ = value.substring(1)
              for (const facetValue in matchFacets) {
                if (facetValue !== value_) {
                  matchIds = matchIds.concat(matchFacets[facetValue])
                }
              }
            } else {
              matchIds = matchFacets[value]
            }
            ids = _.intersection(ids, matchIds)
          }
          */
        }
      }

      for (const facetField in queryMap) {
        const obj = queryMap[facetField]
        const plusValues = obj['+']
        const minusValues = obj['-']

        const matchFacets = facets[facetField]

        // プラス分
        if (plusValues.length > 0) {
          let plusMatchedIds = []
          for (const pValue of plusValues) {
            plusMatchedIds = plusMatchedIds.concat(matchFacets[pValue])
          }
          ids = _.intersection(ids, plusMatchedIds)
        }

        // マイナス分
        if (minusValues.length > 0) {
          // 各値
          for (const mValue of minusValues) {
            let eachMinusMatchedIds = []
            for (const facetValue in matchFacets) {
              if (facetValue !== mValue) {
                eachMinusMatchedIds = eachMinusMatchedIds.concat(
                  matchFacets[facetValue]
                )
              }
            }
            ids = _.intersection(ids, eachMinusMatchedIds)
          }
        }
      }

      /*
      const tmp = {
        1: "s",
        11: "t",
        9: "m"
      }

      console.log(tmp)
      */

      // ソート

      // ヒット数でソート
      if (sortValue === '_score' && q !== '' && Object.keys(freq).length > 0) {
        const arr = Object.keys(freq).map((e) => ({ key: e, value: freq[e] }))

        let x = 1
        let y = -1

        if (sortOrder === 'asc') {
          x = -1
          y = 1
        }

        arr.sort(function (a, b) {
          if (a.value < b.value) return x
          if (a.value > b.value) return y
          return 0
        })

        const ids_ = []
        for (const obj of arr) {
          if (ids.includes(obj.key)) {
            ids_.push(obj.key)
          }
        }

        ids = ids_ // ids.sort()
      } else if (facets[sortValue]) {
        // 項目でソート
        const sortObj = facets[sortValue]

        const keys = Object.keys(sortObj)

        // 速度の問題で、キーの数が多すぎる場合には、idsでソートする
        if (keys.length === 0) {
          ids = ids.sort()
        } else {
          if (sortOrder === 'desc') {
            keys.reverse()
          } else {
            keys.sort()
          }

          let sortIds = []
          for (const key of keys) {
            const ids_ = sortObj[key]
            // ids_ = _.intersection(ids, ids_)
            sortIds = sortIds.concat(ids_)
          }

          ids = _.intersection(sortIds, ids)
        }

        // console.log("end")
      } else {
        ids = ids.sort()
      }
      this.ids = ids

      // その他
      this.total = ids.length
      this.getAggs()
    },
    getAggs() {
      const aggs = process.env.aggs

      // 翻訳
      for (const aggField in aggs) {
        aggs[aggField].label = this.$t(aggs[aggField].label)
      }

      const docs = this.docs

      const ids = this.ids
      for (const id of ids) {
        const item = docs[id]

        for (const aggField in aggs) {
          const aggMap = aggs[aggField].value

          let values = item[aggField]

          if (typeof values === 'string') {
            values = [values]
          } else if (typeof values === 'number') {
            values = [values]
          }

          if (!values) {
            continue
          }

          for (const value of values) {
            if (!aggMap[value]) {
              aggMap[value] = 0
            }
            aggMap[value] += 1
          }
        }
      }

      for (const aggField in aggs) {
        const aggMap = aggs[aggField]

        const pairs = Object.entries(aggMap.value)

        if (aggMap.sort !== 'name:asc') {
          pairs.sort(function (p1, p2) {
            const p1Val = p1[1]
            const p2Val = p2[1]
            return -(p1Val - p2Val)
          })
        }

        const aggList = pairs // .slice(0, 50) // Object.fromEntries(pairs);
        aggs[aggField].value = aggList
      }

      this.aggs = aggs
    },
    search() {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      let q = this.q || ''
      q = q.trim()

      if (q === '') {
        delete query['main[query]']
      } else {
        query['main[query]'] = q
      }

      // ページは先頭へ
      delete query['main[page]']
      this.page = 1

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
      // if (event.keyCode !== 13) return
    },
    list() {
      const query = this.$route.query

      const page = query['main[page]'] || 1

      const hitsPerPage = query.size || 20 // 要検討

      const ids = this.ids

      const ids_ = ids.slice((page - 1) * hitsPerPage, page * hitsPerPage)
      const items = []
      for (const id of ids_) {
        items.push(this.docs[id])
      }
      this.items = items
    },

    faceted(field, selectedValues) {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      let values = []
      for (const queryField in query) {
        if (queryField.includes('[refinementList][' + field + ']')) {
          values.push(query[queryField])
          delete query[queryField]
        }
      }

      if (typeof selectedValues === 'string') {
        selectedValues = [selectedValues]
      }

      for (const value of selectedValues) {
        if (values.includes(value)) {
          values = values.filter((n) => n !== value)
        } else {
          values.push(value)
        }
      }

      for (let i = 0; i < values.length; i++) {
        query['main[refinementList][' + field + '][' + i + ']'] = values[i]
      }

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
    },

    checked(field, value) {
      const query = this.$route.query

      const values = []
      for (const queryField in query) {
        if (queryField.includes('[refinementList][' + field + ']')) {
          values.push(query[queryField])
        }
      }

      if (values.includes(value)) {
        return true
      } else {
        return false
      }
    },

    changeHitsPerPage() {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      const size = this.size

      if (size === 20) {
        delete query.size
      } else {
        query.size = size
      }

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
    },

    changeSort() {
      // console.log(this.sort)
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.sort = this.sort

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )
    },

    changeLayout(value) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      const layout = value
      this.layout_ = layout

      if (layout === 'grid') {
        delete query.layout
      } else {
        query.layout = layout
      }

      this.$router.push(
        this.localePath({
          name: 'search',
          query,
        })
      )

      localStorage.setItem('layout', value)
    },

    getMinusValues(field) {
      const query = JSON.parse(JSON.stringify(this.$route.query))

      const values = []
      for (const queryField in query) {
        if (queryField.includes('[' + field + ']')) {
          const value = query[queryField]
          if (value.startsWith('-')) {
            values.push(value)
          }
        }
      }
      return values
    },

    showAll(aggList) {
      this.selectedField = aggList.label
      this.selected = []
      this.isShowAll = true

      const items = []
      for (const item of aggList.value) {
        items.push({
          label: item[0],
          value: item[1],
        })
      }
      this.selectedAggValues = items
    },

    getLabels(values) {
      const labels = []
      for (const item of values) {
        labels.push(item.label)
      }
      return labels
    },
  },

  head() {
    return {
      title: this.$t('search'),
    }
  },
}
</script>
<style>
mark {
  background-color: #ffc168;
}
</style>
