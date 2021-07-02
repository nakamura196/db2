<template>
  <div>
    <v-container v-if="apiResult">
      <h2 class="text-center my-5">
        {{ $t('詳細情報') }}
      </h2>
      <table
        border="1"
        style="border-collapse: collapse;"
        width="100%"
        class="my-2"
      >
        <tr>
          <th colspan="7">
            <h2>{{ '基本情報' }}</h2>
          </th>
        </tr>
        <tr>
          <th>{{ '経典番号' }}</th>
          <th>{{ '枝番' }}</th>
          <th>{{ '経典名' }}</th>
          <th>{{ '収録巻次' }}</th>
          <th>{{ '部門' }}</th>
          <th>{{ '配本' }}</th>
          <th>{{ '出版年月日' }}</th>
        </tr>
        <tr class="text-center">
          <td>
            {{ apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:経典番号'] }}
          </td>
          <td>{{ apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:枝番'] }}</td>
          <td class="pl-1 text-left">
            <a :href="apiResult['ex:sat'][0]['ex:url']" target="_blank">{{
              apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:経典名']
            }}</a>
          </td>
          <td>
            {{ apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:収録巻次'] }}
          </td>
          <td class="pl-1 text-left">
            {{ apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:部門'] }}
          </td>
          <td>
            {{
              apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:配本'].join(', ')
            }}
          </td>
          <td>
            {{
              apiResult['ex:基本情報'][0]['ex:経典'][0]['ex:出版年月日'].join(
                ', '
              )
            }}
          </td>
        </tr>
      </table>

      <v-row class="text-center">
        <v-col sm="12">
          <table
            border="1"
            style="border-collapse: collapse;"
            width="100%"
            class="my-2"
          >
            <tr>
              <th colspan="4">
                <h2>{{ '勘同目録' }}</h2>
              </th>
              <th bgcolor="#CFD8DC" rowspan="60" width="2%"></th>
              <th colspan="4">
                <h2>{{ '脚注' }}</h2>
              </th>
            </tr>
            <tr>
              <th width="10%">{{ '底本/校本' }}</th>
              <th width="10%">{{ '❹' }}</th>
              <th width="12%">{{ '❼' }}</th>
              <th width="12%">{{ '❼備考' }}</th>
              <th width="10%">{{ '底本/校本' }}</th>
              <th width="10%">{{ '新添部分' }}</th>
              <th width="12%">{{ 'テキスト' }}</th>
              <th width="12%">{{ '備考' }}</th>
            </tr>
            <tr class="text-center">
              <td>{{ apiResult['ex:勘同目録'][0]['ex:底本/校本'] }}</td>
              <td class="pl-1 text-left">
                {{ apiResult['ex:勘同目録'][0]['ex:❹'] }}
              </td>
              <td class="pl-1 text-left">
                {{ apiResult['ex:勘同目録'][0]['ex:❼'] }}
              </td>
              <td class="pl-1 text-left">
                {{ apiResult['ex:勘同目録'][0]['ex:❼備考'] }}
              </td>
              <td>{{ apiResult['ex:脚注'][0]['ex:底本/校本'] }}</td>
              <td class="pl-1 text-left">
                {{ apiResult['ex:脚注'][0]['ex:新添'] }}
              </td>
              <td class="pl-1 text-left">
                <template
                  v-if="apiResult['ex:酉目'] && apiResult['ex:酉目'].length > 0"
                >
                  <a :href="getUrl(apiResult['ex:酉目'])" target="_blank">{{
                    apiResult['ex:脚注'][0]['ex:テキスト']
                  }}</a>
                </template>
                <template v-else>
                  {{ apiResult['ex:脚注'][0]['ex:テキスト'] }}
                </template>

                <template v-if="apiResult['ex:酉蓮社本IIIコレクション']">
                  <v-tooltip
                    v-for="(obj, index2) in apiResult[
                      'ex:酉蓮社本IIIコレクション'
                    ]"
                    :key="index2"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <a
                        v-bind="attrs"
                        :href="
                          'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=https://d1av1vcgsldque.cloudfront.net/iiif/' +
                          Number(id) +
                          '/manifest.json&pos=' +
                          (index2 == 1 ? 5 : obj['ex:from'])
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
                    <span>{{ obj['ex:経典名'] }}</span>
                  </v-tooltip>
                </template>
                <!--
                <template>
                  <a
                    :href="
                      'http://www.kanzaki.com/works/2016/pub/image-annotator?u=https://d1av1vcgsldque.cloudfront.net/iiif/' +
                      id.slice(1) +
                      '/manifest.json'
                    "
                    target="_blank"
                    >{{ apiResult['ex:脚注'][0]['ex:テキスト'] }}</a
                  >
                </template>
                -->
              </td>
              <td class="pl-1 text-left">
                {{ apiResult['ex:脚注'][0]['ex:備考'] }}
              </td>
            </tr>
            <tr>
              <th colspan="4">
                <h3>{{ '勘同目録詳細情報' }}</h3>
              </th>
              <th colspan="4">
                <h3>{{ '脚注詳細情報' }}</h3>
              </th>
            </tr>
            <template v-for="n of 5">
              <template v-if="n == 1">
                <!-- 
                <tr v-for="n2 of 3" :key="'l1_' + n + n2">
                  <td v-if="n2 == 1" :rowspan="kFields.length + 3">
                    {{ 'テキスト' + n }}<br />{{ '（勘同目録）' }}
                  </td>
                  <td>-</td>
                  <td colspan="2">-</td>
                </tr>
                -->
                <tr :key="'r1_' + n">
                  <td :rowspan="kFields.length + 3">
                    {{ 'テキスト' + n }}<br />{{ '（勘同目録）' }}
                  </td>
                  <template
                    v-if="apiResult['ex:勘同目録IIIFコレクション'].length > 0"
                  >
                    <td>勘同目録所在</td>
                    <td colspan="2">
                      <a
                        :href="
                          'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=' +
                          kando +
                          '&pos=' +
                          (apiResult['ex:勘同目録IIIFコレクション'][0][
                            'ex:ページ'
                          ] -
                            152)
                        "
                        target="勘同目録IIIFコレクション"
                      >
                        {{
                          apiResult['ex:勘同目録IIIFコレクション'][0][
                            'ex:ページ'
                          ] +
                          apiResult['ex:勘同目録IIIFコレクション'][0]['ex:段'] +
                          '~' +
                          apiResult['ex:勘同目録IIIFコレクション'][0][
                            'ex:toページ'
                          ] +
                          apiResult['ex:勘同目録IIIFコレクション'][0]['ex:to段']
                        }}
                      </a>
                    </td>
                  </template>
                  <template v-else>
                    <td bgcolor="#B0BEC5"></td>
                    <td bgcolor="#B0BEC5" colspan="2"></td>
                  </template>
                  <td :rowspan="kFields.length + 3">
                    {{ 'テキスト' + n }}<br />{{ '（脚注）' }}
                  </td>
                  <td>底本推定</td>
                  <td class="pl-1 text-left" colspan="2">
                    {{ apiResult['ex:脚注'][0]['ex:底本推定'] }}
                  </td>
                </tr>
                <tr :key="'r10_' + n">
                  <td bgcolor="#B0BEC5"></td>
                  <td bgcolor="#B0BEC5" colspan="2"></td>
                  <td>略号使用</td>
                  <td class="pl-1 text-left" colspan="2">
                    {{ apiResult['ex:脚注'][0]['ex:略号の使用'] }}
                  </td>
                </tr>
                <tr :key="'r11_' + n">
                  <td bgcolor="#B0BEC5"></td>
                  <td bgcolor="#B0BEC5" colspan="2"></td>
                  <td>略号解説</td>
                  <td class="pl-1 text-left" colspan="2">
                    {{ apiResult['ex:脚注'][0]['ex:略号解説'] }}
                  </td>
                </tr>
              </template>
              <tr
                v-for="(field, index) in kFields"
                :key="'l2_' + n + index"
                class="text-center"
              >
                <td v-if="index == 0 && n != 1" :rowspan="kFields.length">
                  {{ 'テキスト' + n }}<br />{{ '（勘同目録）' }}
                </td>
                <td>{{ field }}</td>
                <td class="pl-1 text-left" colspan="2">
                  {{
                    apiResult['ex:勘同目録'][0]['ex:texts'][n - 1]
                      ? apiResult['ex:勘同目録'][0]['ex:texts'][n - 1][
                          'ex:' + field
                        ]
                      : ''
                  }}
                  {{
                    field == '年' &&
                    apiResult['ex:勘同目録'][0]['ex:texts'][n - 1] &&
                    apiResult['ex:勘同目録'][0]['ex:texts'][n - 1]['ex:～年']
                      ? ' - ' +
                        apiResult['ex:勘同目録'][0]['ex:texts'][n - 1][
                          'ex:～年'
                        ]
                      : ''
                  }}
                </td>

                <td
                  v-if="index == 0 && n != 1"
                  :rowspan="kFields.length"
                  :bgcolor="n < 4 ? '' : '#B0BEC5'"
                >
                  <template v-if="n < 4">
                    {{ 'テキスト' + n }}<br />{{ '（脚注）' }}
                  </template>
                </td>
                <td :bgcolor="n < 4 ? '' : '#B0BEC5'">
                  {{ n > 3 ? '' : field }}
                </td>
                <td
                  class="pl-1 text-left"
                  colspan="2"
                  :bgcolor="n < 4 ? '' : '#B0BEC5'"
                >
                  {{
                    apiResult['ex:脚注'][0]['ex:texts'][n - 1]
                      ? apiResult['ex:脚注'][0]['ex:texts'][n - 1][
                          'ex:' + field
                        ]
                      : ''
                  }}
                </td>
              </tr>
            </template>

            <template v-for="n of 2">
              <tr
                v-for="(field, index) in hFields"
                :key="'l3_' + n + index"
                class="text-center"
              >
                <td v-if="index == 0" :rowspan="hFields.length">
                  {{ '所蔵者' + n }}<br />{{ '（勘同目録）' }}
                </td>
                <td>{{ field }}</td>
                <td class="pl-1 text-left" colspan="2">
                  {{
                    apiResult['ex:勘同目録'][0]['ex:所蔵者'][n - 1]
                      ? apiResult['ex:勘同目録'][0]['ex:所蔵者'][n - 1][
                          'ex:' + field
                        ]
                      : ''
                  }}
                </td>

                <td v-if="index == 0" :rowspan="hFields.length">
                  {{ '所蔵者' + n }}<br />{{ '（脚注）' }}
                </td>
                <td>{{ field }}</td>
                <td class="pl-1 text-left" colspan="2">
                  {{
                    apiResult['ex:脚注'][0]['ex:所蔵者'][n - 1]
                      ? apiResult['ex:脚注'][0]['ex:所蔵者'][n - 1][
                          'ex:' + field
                        ]
                      : ''
                  }}
                </td>
              </tr>
            </template>
          </table>
        </v-col>
      </v-row>
      <v-sheet class="py-10 px-3 text-center">
        <v-btn depressed icon :href="uri" target="_blank">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <img
                height="24px"
                src="https://json-ld.org/images/json-ld-logo.png"
                v-on="on"
              />
            </template>
            <span>{{ $t('JSON-LD') }}</span>
          </v-tooltip>
        </v-btn>

        <!--
        <v-menu open-on-hover top offset-y>
          <template v-slot:activator="{ on }">
            <v-btn depressed icon v-on="on">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </template>

          <ShareButtons :url="url" :title="title" />
        </v-menu>
        -->

        <CShareButtons
          class="ma-1"
          :item="{
            label: title,
            url: url,
          }"
        />
      </v-sheet>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
// import ShareButtons from '~/components/common/ShareButtons.vue'
import CShareButtons from '~/components/common/CShareButtons.vue'

@Component({
  components: {
    CShareButtons,
    // ShareButtons,
  },
})
export default class Search extends Vue {
  kFields: string[] = [
    '標準名称',
    '巻',
    '国',
    '時代',
    '年',
    '刊写者',
    '刊写形態',
    '関与者',
    '関与形態',
  ]

  kando: any = process.env.BASE_URL + '/iiif/kandomokuroku/manifest.json'

  hFields: string[] = ['国', '所蔵者']

  apiResult: any = null

  uri: string = ''
  url: string = ''
  title: string = ''
  id: string = ''

  async asyncData(context: any) {
    const itemId = `${context.params.id}`
    const url = process.env.BASE_URL + '/item/' + itemId
    const uri = process.env.BASE_URL + '/data/' + itemId + '.json'
    const apiResult = await context.$axios
      .get(uri)
      .then((response: any) => {
        const apiResult = response.data
        return apiResult
      })
      .catch((error: any) => {
        // eslint-disable-next-line
        console.error(error)
      })

    console.log({ apiResult })

    return {
      id: itemId,
      apiResult,
      uri,
      url,
      title: itemId,
    }
  }

  /*
  get satUrl(): string {
    const data = this.data
    return (
      'https://21dzk.l.u-tokyo.ac.jp/SAT2018/' +
      data['基本情報-経典番号'] +
      '_.' +
      ('00' + data['SAT頭出し用']['開始巻']).slice(-2) +
      '.' +
      ('0000' + data['SAT頭出し用']['ページ']).slice(-4) +
      data['SAT頭出し用']['段'] +
      ('00' + data['SAT頭出し用']['行']).slice(-2) +
      '.html'
    )
  }
  */

  get twitterUrl() {
    return (
      'https://twitter.com/intent/tweet?url=' + this.url + '&text=' + this.title
    )
  }

  get facebookUrl() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + this.url
  }

  get pocketUrl() {
    return 'http://getpocket.com/edit?url=' + this.url
  }

  uRenja: any = process.env['u-renja']

  getUrl(arr: any[]) {
    let params: string = ''
    for (let i = 0; i < arr.length; i++) {
      params += '&fc-通番=' + arr[i]['ex:通番']
    }
    const uRenja = this.uRenja

    return uRenja + '/search/?' + params.substring(1)
  }
}
</script>
