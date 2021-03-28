<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 5000

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
    total: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    total() {
      this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '总金额',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: this.total,
            animationDuration
          }
        ],
        //   // {
        //   //   name: 'pageB',
        //   //   type: 'bar',
        //   //   stack: 'vistors',
        //   //   barWidth: '60%',
        //   //   data: [80, 52, 200, 334, 390, 330, 220],
        //   //   animationDuration
        //   // }
        // ],
        title: {
          show: true, // 显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '总金额', // 主标题文本，'\n'指定换行
          x: 'center', // 水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'bottom', // 垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          backgroundColor: 'rgba(0,0,0,0)', // 标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#ccc', // 标题边框颜色,默认'#ccc'
          borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
          padding: 5, // padding: [5,5,5,5],标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          zlevel: 0, // 一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
          z: 6 // 二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
        }
      })
    }
  }
}
</script>
