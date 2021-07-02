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
      <tr v-for="item in items" :key="item.id">
        <td width="5%">
          {{ $utils.formatArrayValue(item['基-経典番号']) }}
        </td>
        <td width="2%">
          {{ $utils.formatArrayValue(item['基-枝番']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          <a :href="item.sat_uri" target="_blank">{{
            $utils.formatArrayValue(item['基-経典名'])
          }}</a>
        </td>

        <td width="2%">
          {{ $utils.formatArrayValue(item['基-収録巻次']) }}
        </td>
        <td width="5%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['基-部門']) }}
        </td>
        <td width="2%">
          {{ $utils.formatArrayValue(item['基-配本']) }}
        </td>
        <td width="5%">
          {{ $utils.formatArrayValue(item['基-年月日']) }}
        </td>
        <td
          width="5%"
          :bgcolor="
            $utils.formatArrayValue(item['勘-底本/校本']) == '底本'
              ? '#BBDEFB'
              : $utils.formatArrayValue(item['勘-底本/校本']) == '校本'
              ? '#FFCDD2'
              : ''
          "
        >
          {{ $utils.formatArrayValue(item['勘-底本/校本']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['勘-❹']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['勘-❼']) }}
        </td>
        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['勘-❼備考']) }}
        </td>

        <td
          width="5%"
          :bgcolor="
            $utils.formatArrayValue(item['脚-底本/校本']) == '底本'
              ? '#BBDEFB'
              : $utils.formatArrayValue(item['脚-底本/校本']) == '校本'
              ? '#FFCDD2'
              : ''
          "
        >
          {{ $utils.formatArrayValue(item['脚-底本/校本']) }}
        </td>
        <td width="5%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['脚-新添部分']) }}
        </td>

        <td>
          {{ $utils.formatArrayValue(item['脚-テキスト']) }}

          <template v-if="item['酉目'].length > 0">
            <a
              v-for="(value, key2) in item['酉目']"
              :key="key2"
              :href="value"
              target="_blank"
              class="ma-1"
            >
              <v-icon color="primary">mdi-link-variant</v-icon>
            </a>
          </template>

          <!-- -->

          <template v-if="item['酉蓮社本IIIFコレクション'].length > 0">
            <br />

            <v-tooltip
              v-for="(item2, index2) in item['酉蓮社本IIIFコレクション']"
              :key="index2"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <a v-bind="attrs" :href="item2.url" target="_blank" v-on="on">
                  <img
                    width="24px"
                    class="ma-1"
                    src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH.png"
                  />
                </a>
              </template>
              <span>{{ item2.label }}</span>
            </v-tooltip>
          </template>
        </td>

        <td width="10%" class="pl-1 text-left">
          {{ $utils.formatArrayValue(item['脚-備考']) }}
        </td>

        <td width="5%">
          <nuxt-link
            :to="
              localePath({
                name: 'item-id',
                params: {
                  id: ('00000' + $utils.formatArrayValue(item['No.'])).slice(
                    -5
                  ),
                },
              })
            "
            >{{ $t('detail') }}
          </nuxt-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'nuxt-property-decorator'
import ResultOption from '~/components/display/ResultOption.vue'

@Component({
  components: {
    ResultOption,
  },
})
export default class FullTextSearch extends Vue {
  baseUrl: any = process.env.BASE_URL
  @Prop({})
  items!: any[]
}
</script>
