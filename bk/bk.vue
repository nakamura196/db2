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
      <h2>{{ $t('search') }}</h2>

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
        <v-row class="mt-2" dense>
          <v-col cols="12" sm="10">
            <FullTextSearch background-color="grey lighten-3"></FullTextSearch>
          </v-col>

          <v-col
            v-if="advancedOptions.length > 0"
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
              <SearchAdvanced></SearchAdvanced>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
        </div>

        <div v-if="filters.length > 0" class="mt-5">
          <v-chip
            v-for="(filter, key) in filters"
            :key="key"
            class="mr-2 my-2"
            close
            label
            @click:close="faceted(filter.label, filter.value)"
          >
            {{ aggs[filter.label].label }}: {{ filter.value }}
          </v-chip>

          <v-chip
            v-if="filters.length > 0"
            label
            class="mr-2 my-2"
            @click="init()"
          >
            {{ $t('Clear all') }}
          </v-chip>
        </div>

        <v-row class="mt-5" dense>
          <v-col cols="12" md="4">
            <h3 class="my-0">
              <v-btn
                fab
                depressed
                color="primary"
                small
                class="mr-2"
                @click="isFacetOpen = !isFacetOpen"
                ><v-icon>mdi-menu</v-icon></v-btn
              >

              {{ $t('search_result') }}: {{ total.toLocaleString() }}
              {{ $t('hits') }}
            </h3>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="size"
              hide-details
              outlined
              rounded
              :items="[
                { text: '20件', value: 20 },
                { text: '50件', value: 50 },
                { text: '100件', value: 100 },
              ]"
              dense
              @change="changeHitsPerPage()"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="sort"
              hide-details
              class="mb-0"
              outlined
              rounded
              :items="sortItems"
              dense
              @change="changeSort()"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3" class="text-right">
            <v-btn
              v-for="(option, key) in layouts"
              :key="key"
              icon
              @click="changeLayout(option.value)"
              ><v-icon :color="layout_ === option.value ? 'primary' : ''">{{
                option.icon
              }}</v-icon></v-btn
            >
            <!--
            <v-btn icon @click="changeLayout('list')"
              ><v-icon :color="layout_ === 'list' ? 'primary' : ''"
                >mdi-view-list</v-icon
              ></v-btn
            >
            <v-btn icon @click="changeLayout('grid')"
              ><v-icon :color="layout_ === 'grid' ? 'primary' : ''"
                >mdi-view-grid</v-icon
              ></v-btn
            >
            <v-btn icon @click="changeLayout('table')"
              ><v-icon :color="layout_ === 'table' ? 'primary' : ''"
                >mdi-table</v-icon
              ></v-btn
            >
            <v-btn v-if="false" icon @click="changeLayout('image')"
              ><v-icon :color="layout_ === 'image' ? 'primary' : ''"
                >mdi-image</v-icon
              ></v-btn
            >
            -->
          </v-col>
        </v-row>

        <div v-show="isPagination" class="text-center mt-10">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </div>

        <v-row class="mt-5">
          <v-col cols="12" :sm="isFacetOpen ? 9 : 12" order-sm="12">
            <component
              :is="searchLayout"
              :items="items"
              :aggs="aggs"
              :q="q"
            ></component>

            <template v-if="layout_ === 'image'">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.objectID"
                  cols="12"
                  sm="3"
                >
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'item-id',
                        params: { id: item.objectID },
                      })
                    "
                  >
                    <!-- query, -->
                    <v-img
                      contain
                      max-height="150"
                      style="height: 150px;"
                      width="100%"
                      class="grey lighten-2"
                      :src="item.thumbnail"
                    />
                  </nuxt-link>
                </v-col>
              </v-row>
            </template>
          </v-col>

          <v-col v-show="isFacetOpen" cols="12" sm="3" order-sm="1">
            <template v-for="(aggList, aggField) in aggs">
              <v-expansion-panels
                v-if="!aggList.hide"
                :key="aggField"
                :value="0"
                flat
                class="mb-4"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="grey lighten-2">
                    <h3>
                      {{ aggList.label }}
                      <small class="ml-2"
                        >({{ aggList.value.length }} {{ $t('results') }})</small
                      >
                    </h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content outlined class="py-2">
                    <template v-for="(e, key) in aggList.value">
                      <div
                        v-if="key < limit || aggList.more"
                        :key="key"
                        class="mt-1"
                      >
                        <span
                          style="cursor: pointer;"
                          @click="faceted(aggField, e[0])"
                        >
                          <template v-if="checked(aggField, e[0])">
                            <v-icon color="primary">
                              mdi-checkbox-marked
                            </v-icon>
                          </template>
                          <template v-else>
                            <v-icon> mdi-checkbox-blank-outline </v-icon>
                          </template>
                          {{ e[0] }}
                          <v-chip small>
                            {{ e[1] }}
                          </v-chip>
                        </span>

                        <v-btn
                          v-if="!checked(aggField, e[0])"
                          icon
                          @click="faceted(aggField, '-' + e[0])"
                          ><v-icon>mdi-close-circle-outline</v-icon></v-btn
                        >
                      </div>
                    </template>

                    <v-divider
                      v-if="getMinusValues(aggField).length > 0"
                      class="my-2"
                    />

                    <div
                      v-for="(e, key) in getMinusValues(aggField)"
                      :key="'rm_' + key"
                      style="cursor: pointer;"
                      @click="faceted(aggField, e)"
                    >
                      <v-icon color="primary"> mdi-checkbox-blank </v-icon>
                      {{ e.substring(1) }}
                    </div>

                    <!-- 表示 -->

                    <div class="text-right">
                      <!-- v-if="aggList.value.length > limit" -->
                      <v-btn
                        color="primary"
                        small
                        text
                        class="mt-4"
                        @click="showAll(aggList)"
                        >{{ $t('show all') }}
                        <v-icon>mdi-menu-right</v-icon></v-btn
                      >
                    </div>

                    <!--
                    <v-btn
                      v-if="aggList.value.length >= limit"
                      color="primary"
                      small
                      class="mt-4"
                      @click="aggList.more = !aggList.more"
                      >{{ $t(aggList.more ? 'Show less' : 'Show more') }}</v-btn
                    >
                    -->
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-col>
        </v-row>

        <div v-show="isPagination" class="text-center mt-10">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </v-container>

    <v-dialog v-model="isShowAll">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <span class="text-h5">{{ selectedAgg.label }}</span>
        </v-card-title>
        <v-card-text style="height: 600px; overflow-y: auto;" class="py-5">
          <!-- :items-per-page="-1" -->
          <v-data-table
            v-model="selected"
            :headers="[
              { text: this.$t('name'), value: 'label' },
              { text: this.$t('results'), value: 'value' },
            ]"
            :items="selectedAggValues"
            item-key="label"
            :search="facetSearch"
            :items-per-page="20"
            :footer-props="{
              'items-per-page-options': [20, 50, 100, -1],
            }"
            show-select
          >
            <template v-if="false" v-slot:top>
              <v-switch
                v-model="singleSelect"
                label="Single select"
                class="pa-3"
              ></v-switch>
              <v-text-field
                v-model="facetSearch"
                background-color="grey lighten-3"
                filled
                rounded
                dense
                hide-details
                :placeholder="$t('add_a_search_term')"
                append-icon="mdi-magnify"
                clearable
                clear-icon="mdi-close-circle"
                label="Search"
                class="mx-4 my-5"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="isShowAll = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              isShowAll = false
              faceted(selectedAgg.key, getLabels(selected))
            "
          >
            {{ $t('refine') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import FullTextSearch from '~/components/search/FullTextSearch.vue'
import SearchAdvanced from '~/components/search/Advanced.vue'
import SearchLayoutGraph from '~/components/search/layout/Graph.vue'
import CustomSearchLayoutTable from '~/components/custom/search/layout/Table.vue'

const _ = require('lodash')

export default {
  components: {
    FullTextSearch,
    SearchAdvanced,
    SearchLayoutGraph,
    CustomSearchLayoutTable,
  },
  data() {
    return {
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
      selectedAgg: {},
      // selectedField: 'group',
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
          text: this.$t('search'),
        },
      ],

      metadataList: process.env.list,

      sortList: process.env.sort,
    }
  },

  computed: {
    isPagination() {
      return this.layout_ !== 'graph'
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
      return '' // 八日っ九人
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

      let q = query['main[query]'] || ''

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
        // 異体字対応
        const spl = q.split('')
        q = ''
        const itaiji = process.env.itaiji
        for (const e of spl) {
          q += itaiji[e] || e
        }

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
            if (options[facetField].type === 'select') {
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
          // keys.length > 100 && false
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

          // console.log({ values })
          // console.log(typeof values)

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

        const aggList = pairs // pairs.slice(0, 50) // Object.fromEntries(pairs);
        aggs[aggField].value = aggList
      }

      this.aggs = aggs
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

      query['main[page]'] = 1

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
      // this.selectedField = aggList.label
      this.selectedAgg = aggList
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
