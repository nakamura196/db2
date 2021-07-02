<template>
  <div>
    <table
      border="1"
      style="border-collapse: collapse;"
      width="100%"
      class="my-2"
    >
      <tr>
        <th colspan="7">
          {{ '基本情報' }}
        </th>
        <th colspan="4">
          {{ '勘同目録' }}
        </th>
        <th colspan="4">
          {{ '脚注' }}
        </th>
        <th rowspan="2">詳細情報</th>
      </tr>
      <tr>
        <th>{{ '経典番号' }}</th>
        <th>{{ '枝番' }}</th>
        <th>{{ '経典名' }}</th>
        <th>{{ '収録巻次' }}</th>
        <th>{{ '部門' }}</th>
        <th>{{ '配本' }}</th>
        <th>{{ '出版年月日' }}</th>

        <th>{{ '底本/校本' }}</th>
        <th>{{ '❹' }}</th>
        <th>{{ '❼' }}</th>
        <th>{{ '❼備考' }}</th>

        <th>{{ '底本/校本' }}</th>
        <th>{{ '新添部分' }}</th>
        <th>{{ 'テキスト' }}</th>
        <th>{{ '備考' }}</th>
      </tr>
      <tr v-for="(obj, index) in results" :key="index" class="text-center">
        <td width="5%">
          {{ $utils.formatArrayValue(obj._source['基-経典番号']) }}
        </td>
        <td width="2%">
          {{ $utils.formatArrayValue(obj._source['基-枝番']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          <a
            :href="
              'https://21dzk.l.u-tokyo.ac.jp/SAT2018/' +
              $utils.formatArrayValue(obj._source['sat_id']) +
              '.html'
            "
            target="_blank"
            >{{ $utils.formatArrayValue(obj._source['基-経典名']) }}</a
          >
        </td>
        <td width="2%">
          {{ $utils.formatArrayValue(obj._source['基-収録巻次']) }}
        </td>
        <td width="5%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['基-部門']) }}
        </td>
        <td width="2%">
          {{ $utils.formatArrayValue(obj._source['基-配本']) }}
        </td>
        <td width="5%">
          {{ $utils.formatArrayValue(obj._source['基-年月日']) }}
        </td>
        <td
          width="5%"
          :bgcolor="
            $utils.formatArrayValue(obj._source['勘-底本/校本']) == '底本'
              ? '#BBDEFB'
              : $utils.formatArrayValue(obj._source['勘-底本/校本']) == '校本'
              ? '#FFCDD2'
              : ''
          "
        >
          {{ $utils.formatArrayValue(obj._source['勘-底本/校本']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['勘-❹']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['勘-❼']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['勘-❼備考']) }}
        </td>

        <td
          width="5%"
          :bgcolor="
            $utils.formatArrayValue(obj._source['脚-底本/校本']) == '底本'
              ? '#BBDEFB'
              : $utils.formatArrayValue(obj._source['脚-底本/校本']) == '校本'
              ? '#FFCDD2'
              : ''
          "
        >
          {{ $utils.formatArrayValue(obj._source['脚-底本/校本']) }}
        </td>
        <td width="5%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['脚-新添部分']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          <template
            v-if="obj._source['酉目'] && obj._source['酉目'].length > 0"
          >
            <a :href="getUrl(obj._source['酉目'])" target="_blank">{{
              $utils.formatArrayValue(obj._source['脚-テキスト'])
            }}</a>
          </template>
          <template v-else>
            {{ $utils.formatArrayValue(obj._source['脚-テキスト']) }}
          </template>
          <template v-if="obj._source['酉蓮社本IIIコレクション_from']">
            <v-tooltip
              v-for="(value, index2) in obj._source[
                '酉蓮社本IIIコレクション_from'
              ]"
              :key="index2"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-bind="attrs"
                  :href="
                    'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=https://d1av1vcgsldque.cloudfront.net/iiif/' +
                    obj._source['No.'] +
                    '/manifest.json&pos=' +
                    (index2 == 1 ? 5 : value)
                  "
                  target="_blank"
                  v-on="on"
                >
                  <img
                    width="30px"
                    class="mr-1"
                    src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH.png"
                  />
                </a>
              </template>
              <span>{{
                obj._source['酉蓮社本IIIコレクション_経典名'][index2]
              }}</span>
            </v-tooltip>
          </template>
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(obj._source['脚-備考']) }}
        </td>

        <td width="5%">
          <nuxt-link
            target="_blank"
            :to="
              localePath({
                name: 'item-id',
                params: {
                  id: (
                    '00000' + $utils.formatArrayValue(obj._source['No.'])
                  ).slice(-5),
                },
              })
            "
            >{{ 'more' }}
          </nuxt-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class TableSearchResult extends Vue {
  get results() {
    return this.$store.state.result.hits.hits
  }

  uRenja: any = process.env['u-renja']

  getUrl(ids: number[]) {
    let params: string = ''
    for (let i = 0; i < ids.length; i++) {
      params += '&fc-通番=' + ('0000' + Number(ids[i])).slice(-4)
    }

    const uRenja = this.uRenja

    return uRenja + '/search/?' + params.substring(1)
  }
}
</script>
