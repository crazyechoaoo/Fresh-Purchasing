<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    clerkData: Array
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    clerkData () {
      if (this.clerkData.length > 0) {
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['管理员', '采购经理', '采购员', '分店店员']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '40%'],
            data: [
              { value: this.clerkData[0], name: '管理员' },
              { value: this.clerkData[1], name: '采购经理' },
              { value: this.clerkData[2], name: '采购员' },
              { value: this.clerkData[3], name: '分店店员' },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
