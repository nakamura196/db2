// /plugins/logger.ts
export class Utils {
  createQuery(routeQuery: any, config: any): any {
    const fcs = Object.keys(config.facetLabels) // JSON.parse(process.env.FACETS_LABELS)

    // const qs = Object.keys(config.termLabels)

    // 検索対象メタデータ
    const fields = ['_full_text', '_title'] // JSON.parse(process.env.SEARCH_LABELS)

    const FC_SIZE = 50

    const from = routeQuery.from ? Number(routeQuery.from) : 0
    let size = routeQuery.size ? Number(routeQuery.size) : config.size

    const ops: any = {
      keyword: routeQuery.keywordOr === 'true',
      q: routeQuery.advancedOr === 'true',
      fc: routeQuery.facetOr === 'true',
    }

    // const advancedOr: boolean = routeQuery.advancedOr === 'true'

    if (size > 500) {
      size = 500
    }

    // -------------------------

    // Aggregation

    const aggs: any = {}

    const fcsMap: any = {}
    for (let i = 0; i < fcs.length; i++) {
      const field = fcs[i]
      const fcsField = 'fc-' + field
      if (routeQuery[fcsField]) {
        const value = routeQuery[fcsField]
        let values = []
        if (!Array.isArray(value)) {
          values = [value]
        } else {
          values = value
        }
        fcsMap[fcsField] = values
      }

      // aggs
      aggs[field] = {
        terms: {
          field: field + '.keyword',
          size: FC_SIZE,
          order: {
            _count: 'desc',
          },
        },
      }
    }

    // クエリ本体

    const query: any = {
      bool: {
        must: [],
        should: [],
        filter: [],
        must_not: [],
      },
    }

    // キーワード
    const keyword = routeQuery.keyword ? routeQuery.keyword : []
    let keywords = []
    if (!Array.isArray(keyword)) {
      keywords = [keyword]
    } else {
      keywords = keyword
    }

    // const kerwordPhase = []
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i]

      // キーワード NOT
      if (keyword.startsWith('-')) {
        // const mustNotPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword.slice(1)

          query.bool.must_not.push({
            match_phrase: matchPhrase,
          })
        }
      } else if (ops.keyword) {
        // or 検索
        // console.log('keywordOr')
      } else {
        const shouldPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword
          shouldPhase.push({
            match_phrase: matchPhrase,
          })
        }

        query.bool.must.push({
          bool: {
            should: shouldPhase,
          },
        })
      }

      /*
        const shouldPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword
          shouldPhase.push({
            match_phrase: matchPhrase,
          })
        }

        query.bool[ops.keyword ? 'should' : 'must'].push({
          bool: {
            should: shouldPhase,
          },
        })
        */
    }

    // ---------------------

    for (const field in routeQuery) {
      if (field.startsWith('q-') || field.startsWith('fc-')) {
        const qsField = field

        const type: string = qsField.split('-')[0]

        const prefix: string = qsField.split('-')[0]

        const mustOfFilter: string = prefix === 'q' ? 'must' : 'filter' // fc-の場合はfilter

        const boolQuery = ops[prefix] ? 'should' : mustOfFilter // OR条件

        const value = routeQuery[qsField]
        let values = []
        if (!Array.isArray(value)) {
          values = [value]
        } else {
          values = value
        }

        const pluses: string[] = []
        const minuses: string[] = []

        for (let j = 0; j < values.length; j++) {
          const value = values[j]
          if (value.startsWith('-')) {
            minuses.push(value.slice(1))
          } else {
            pluses.push(value)
          }
        }

        // minuses
        for (let j = 0; j < minuses.length; j++) {
          const value = minuses[j]
          if (type === 'fc') {
            const termPhase: any = {}
            termPhase[field.slice(3) + '.keyword'] = value // "fc-"の除外

            query.bool.must_not.push({
              term: termPhase,
            })
          } else {
            const termPhase: any = {}
            termPhase[field.slice(2)] = value // "-"の除外 // "q-"の除外

            query.bool.must_not.push({
              term: termPhase,
            })
          }
        }

        if (pluses.length === 0) {
          continue
        }
        // ファセット か 否か
        if (type === 'fc') {
          const shoulds: any[] = []
          for (let j = 0; j < pluses.length; j++) {
            const value = values[j]
            const termPhase: any = {}
            termPhase[field.slice(3) + '.keyword'] = value // "q-"の除外

            shoulds.push({
              term: termPhase,
            })
          }
          query.bool[boolQuery].push({
            bool: {
              should: shoulds,
            },
          })
        } else {
          // plus
          for (let j = 0; j < pluses.length; j++) {
            const value = values[j]
            const termPhase: any = {}
            termPhase[field.slice(2)] = value // "q-"の除外

            query.bool[boolQuery].push({
              term: termPhase,
            })
          }
        }

        /*
        for (let j = 0; j < values.length; j++) {
          const value = values[j]

          // ファセット
          if (type === 'fc') {
            if (value.startsWith('-')) {
              // 除外
              const termPhase: any = {}
              termPhase[field.slice(3) + '.keyword'] = value.slice(1) // "fc-"の除外

              query.bool.must_not.push({
                term: termPhase,
              })
            } else {
              const termPhase: any = {}
              termPhase[field.slice(3) + '.keyword'] = value // "fc-"の除外

              query.bool[boolQuery].push({
                term: termPhase,
              })
            }
          }
          // 詳細検索
          else if (type === 'q') {
            // 除外
            if (value.startsWith('-')) {
              const termPhase: any = {}
              termPhase[field.slice(2)] = value.slice(1) // "-"の除外 // "q-"の除外

              query.bool.must_not.push({
                term: termPhase,
              })
            } else {
              const termPhase: any = {}
              termPhase[field.slice(2)] = value // "q-"の除外

              query.bool[boolQuery].push({
                term: termPhase,
              })
            }
          }
        }
        */
      }
    }

    const sort = routeQuery.sort ? routeQuery.sort : null
    const sorts = []
    if (sort != null && !sort.includes('_score')) {
      const tmp = sort.split(':')
      const field = tmp[0] // tmp[0].includes('_') ? tmp[0] + '.keyword' : tmp[0]
      const order = tmp[1]
      const obj: any = {}
      obj[field] = {
        order,
      }
      sorts.push(obj)
      sorts.push('_score')
    }

    const body = {
      query,
      aggs,
      size,
      from,
      sort: sorts,
    }

    return body
  }

  getTitle(metadata: any, lang: string): any {
    if (metadata.title_mt && metadata.title_mt.length > 0 && lang === 'ja') {
      return (
        this.formatArrayValue(metadata.title_mt) +
        " <i class='mdi mdi-google-translate'></i>"
        /*
        `<v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <i class='mdi mdi-google-translate' v-on="on"></i>
          </template>
          <span>Google翻訳を使用したタイトルです。</span>
        </v-tooltip>` */
      )
    } else {
      return this.formatArrayValue(metadata._title)
    }
  }

  getOriginalTitle(metadata: any, lang: string): any {
    if (metadata.title_mt.length > 0 && lang === 'ja') {
      return '翻訳前タイトル: ' + this.formatArrayValue(metadata._title)
    } else {
      return null
    }
  }

  formatArrayValue(arr: string[], delimiter: string = ', '): any {
    if (typeof arr !== 'object') {
      arr = [arr]
    }
    if (arr == null) {
      return ''
    }
    if (arr.length === 1) {
      return arr[0]
    } else {
      const value: string = arr.join(delimiter)
      return value
    }
  }

  indexedQuery(query: any, index: number): any {
    const obj: any = {}
    for (const key in query) {
      obj[key] = query[key]
    }
    const from = query.from ? query.from : 0
    obj.index = index + Number(from)
    return obj
  }

  item2CardItem(
    item: any,
    query: any = null,
    // eslint-disable-next-line
    index: number = -1,
    type: string = '',
    lang: string = 'ja'
  ) {
    const _source = item._source

    const id = item._id

    const path: any = {
      name: 'item-id',
      params: {
        id,
      },
    }

    if (query !== null) {
      // console.log({ index })
      // path.query = this.indexedQuery(query, index)
    }

    const cardItem: any = {
      path,
      label: this.getTitle(_source, lang),
      id,
      url: this.formatArrayValue(_source._url),
    }

    if (_source._image) {
      cardItem.image = this.formatArrayValue(_source._image).split(', ')[0]
    }

    if (_source._manifest) {
      cardItem.manifest = this.formatArrayValue(_source._manifest)
    }

    if (_source.access) {
      cardItem.access = this.formatArrayValue(_source.access)
    }

    if (_source.source) {
      cardItem.source = this.formatArrayValue(_source.source)
    }

    if (type) {
      cardItem.type = type
    }

    ///

    if (_source.agential) {
      cardItem.agential = this.formatArrayValue(_source.agential)
    }

    if (_source.temporal) {
      cardItem.temporal = this.formatArrayValue(_source.temporal)
    }

    if (_source.description) {
      cardItem.description = this.formatArrayValue(_source.description)
    }

    ///

    if (_source._url) {
      cardItem._url = this.formatArrayValue(_source._url)
    }

    return cardItem
  }

  getProjectFooter(lang: string) {
    const value =
      lang === 'ja' ? process.env.projectFooterJa : process.env.projectFooterEn
    return value
  }

  getProjectName(lang: string) {
    const value =
      lang === 'ja' ? process.env.projectNameJa : process.env.projectNameEn
    return value
  }

  getProjectDescription(lang: string) {
    const value =
      lang === 'ja'
        ? process.env.projectDescriptionJa
        : process.env.projectDescriptionEn
    return value
  }

  splitKeyword(keyword: string): string[] {
    // 全角を半角に変換
    // 空の配列を削除
    // eslint-disable-next-line
    return keyword.replace(/　/g, ' ').split(' ').filter(item => item !== "")
  }

  createFacetQuery(arr: any[]): { [key: string]: string } {
    const result: { [key: string]: string } = {}
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i]
      result[obj.field] = obj.value
    }
    return result
  }

  truncate(str: string, length: number): string {
    return str.length <= length ? str : str.substr(0, length) + '...'
  }

  convert2arr(value: any) {
    let values: string[] = []
    if (!Array.isArray(value)) {
      value = value.trim()
      if (value !== '') {
        values = [value]
      }
    } else {
      values = value
    }
    return values
  }

  getSearchQueryFromQueryStore(query: any): any {
    const params: any = {
      sort: query.sort,
      size: query.size,
      from: (query.currentPage - 1) * query.size,
    }

    if (query.before !== '') {
      params.before = query.before
    }

    if (query.after !== '') {
      params.after = query.after
    }

    if (query.keyword.length > 0) {
      params.keyword = query.keyword
    }

    if (query.id.length > 0) {
      params.id = query.id
    }

    if (query.image.length > 0) {
      params.image = query.image
    }

    const advanced = query.advanced
    for (const key in advanced) {
      const values = []
      const obj = advanced[key]
      for (const type in obj) {
        const arr = obj[type]
        for (let i = 0; i < arr.length; i++) {
          const value = arr[i]
          values.push(type === '+' ? value : '-' + value)
        }
      }
      params[key] = values
    }

    return params
  }

  getManifestIcon(manifest: string): string {
    const url = manifest.includes('api.cultural.jp')
      ? '/img/icons/iiif-gray-logo.svg'
      : '/img/icons/iiif-logo.svg'
    return url
  }

  getTopMessage(size: number, top: number, lang: string) {
    let prefix: string = ''
    const suffix: string = lang === 'ja' ? '件' : ''
    if (size === top) {
      prefix = lang === 'ja' ? '上位' : 'Top '
    }
    return prefix + size.toLocaleString() + suffix
  }
}

export default (_: any, inject: any) => {
  inject('utils', new Utils())
}
