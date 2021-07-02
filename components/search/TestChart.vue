<!-- Template Tag can not be merged... -->

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
// import Chart from 'chart.js'
import VueChart from 'vue-chartjs'
// 棒グラフの場合は、Barを使う
// eslint-disable-next-line
const Bar = VueChart.Bar

@Component
// mixinsもBarに変更
export default class ChartLine extends mixins(Bar) {
  @Prop({ default: [] }) buckets!: any[]
  @Prop({ default: '' }) label!: string

  @Watch('buckets', { deep: true })
  watchTmp() {
    this.main()
  }

  mounted() {
    this.main()
  }

  main() {
    const buckets: any[] = this.buckets

    const labels: string[] = []
    const dataset: number[] = []

    for (let i = 0; i < buckets.length; i++) {
      const obj: any = buckets[i]
      labels.push(obj.key)
      dataset.push(obj.doc_count)
    }

    const chartData: any = {
      labels,
      datasets: [{ data: dataset, label: '' }],
    }

    const self = this

    const chartOption: any = {
      // アスペクト比を固定しないように変更
      maintainAspectRatio: false,
      onClick(evt: any, item: any[]) {
        const query = self.$utils.getSearchQueryFromQueryStore(
          self.$store.state
        )

        console.log({ evt })

        const label = 'fc-' + self.label
        const value = item[0]._model.label

        if (!query[label]) {
          query[label] = []
        }

        const arr = query[label]
        if (!arr.includes(value)) {
          arr.push(value)
        }

        self.$router.push(
          self.localePath({
            name: 'search',
            query,
          }),
          () => {},
          () => {}
        )
      },
    }

    this.renderChart(chartData, chartOption)
  }
}
</script>
