<template>
  <div>
    <v-container>
      <h2 class="text-center my-5">{{ $t('advanced_search') }}</h2>

      <v-alert type="warning">
        まだ動きません。
      </v-alert>

      <h3>経典番号</h3>

      <v-row>
        <v-col>
          <v-combobox
            v-model="from"
            :loading="loading_from"
            :search-input.sync="term_from"
            filled
            rounded
            :items="items"
            :label="$t('From')"
            clearable
            clear-icon="mdi-close-circle"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-combobox
            v-model="to"
            :loading="loading_to"
            :search-input.sync="term_to"
            filled
            rounded
            :items="items"
            :label="$t('To')"
            clearable
            clear-icon="mdi-close-circle"
          ></v-combobox>
        </v-col>
      </v-row>

      <h3>検索文字列</h3>

      <v-row>
        <v-col cols="12" :sm="7">
          <v-text-field
            v-model="from"
            :loading="loading_from"
            :search-input.sync="term_from"
            filled
            rounded
            :label="$t('検索文字列を入力してください。')"
            clearable
            clear-icon="mdi-close-circle"
          ></v-text-field>
        </v-col>
        <v-col cols="12" :sm="5">
          <v-radio-group v-model="radios" row>
            <v-radio label="and" value="and"></v-radio>
            <v-radio label="or" value="or"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <h3>検索対象</h3>

      <v-row>
        <v-col cols="12" :sm="2">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="selected2"
                label="すべて"
                value="すべて"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" :sm="10">
          <v-row>
            <v-col
              ><v-checkbox
                v-model="selected3"
                label="勘同目録・脚注"
                value="勘同目録・脚注"
              ></v-checkbox
            ></v-col>
            <v-col>
              <v-checkbox
                v-model="selected3"
                label="テキスト"
                value="テキスト"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="selected3"
                label="所蔵者"
                value="所蔵者"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-checkbox
                v-model="selected3"
                label="底本"
                value="底本"
              ></v-checkbox
            ></v-col>
            <v-col>
              <v-checkbox
                v-model="selected3"
                label="校本"
                value="校本"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="selected3"
                label="校本なし"
                value="校本なし"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <h3>ソート</h3>

      <v-radio-group v-model="sort" row>
        <span class="mr-5">経典番号順</span>
        <v-radio label="昇順" value="aaa:asc"></v-radio>
        <v-radio label="降順" value="aaa:desc"></v-radio>

        <span class="ml-10 mr-5">配本順</span>
        <v-radio label="昇順" value="bbb:asc"></v-radio>
        <v-radio label="降順" value="bbb:desc"></v-radio>
      </v-radio-group>

      <div class="text-center mt-5">
        <v-btn color="primary">検索</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'nuxt-property-decorator'
// import axios from 'axios'
@Component
export default class Volumes extends Vue {
  baseUrl: any = process.env.BASE_URL
  head() {
    return {
      titleTemplate: null,
      title: this.$t('subject_search'),
    }
  }

  sort: string = 'aaa:asc'

  items: any[] = ['T0001', 'T0002', 'T0003']

  radios: string = 'and'

  dialogFlag: boolean = false

  selected2: string = 'すべて'
  selected3: string[] = []

  @Watch('selected3')
  onTextChanged() {
    if (this.selected3.length > 0) {
      this.selected2 = ''
    } else {
      this.selected2 = 'すべて'
    }
  }

  uri: string = ''

  data: any = {}

  search: string = ''
  caseSensitive: boolean = false

  getComp(item: any) {
    if (item.lv === 1) {
      return 'v-sheet'
    } else if (item.lv === 2) {
      return 'b'
    } else {
      return 'span'
    }
  }

  created() {
    /*
    const self = this
    axios.get(this.baseUrl + '/json/subject.json').then((response) => {
      self.items = response.data
    })
    */
  }

  getValue(item: any) {
    if (item.term) {
      return item.term
    } else {
      return item.name
    }
  }

  getName(item: any) {
    if (this.$i18n.locale === 'ja' && item.name_ja) {
      return item.name + ' (' + item.name_ja + ')'
    } else {
      return item.name
    }
  }

  get filter() {
    return this.caseSensitive
      ? (item: any, search: string, textKey: string) =>
          item[textKey].includes(search)
      : undefined
  }
}
</script>
