<template>
  <div class="dashboard-editor-container">
    <div
      style="font-size: 30px; line-height: 46px; margin-bottom: 28px"
      class="dashboard-text"
    >
      <!-- 欢迎来到生鲜外采系统 -->
      <img
        width="50%"
        style="min-width: 310px"
        src="@/assets/title/title.png"
      >
    </div>

    <el-row v-if="userInfo.role === 'manager'" :gutter="30" class="panel-group">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">正在采购人员</div>
            <count-to
              :start-val="0"
              :end-val="buyingManNum || 0"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue" class-name="card-panel-icon" />
          </div>
          <div
            v-if="userInfo.role === 'manager'"
            class="card-panel-description"
          >
            <div class="card-panel-text">待审订单 / 待采购单</div>
            <count-to
              :start-val="0"
              :end-val="todoNum[0] || 0"
              :duration="3000"
              class="card-panel-num"
            />
            /
            <count-to
              :start-val="0"
              :end-val="todoNum[1] || 0"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日总金额</div>
            <count-to
              :start-val="0"
              :end-val="getMoney(total) || 0"
              :duration="2400"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon
              icon-class="shopping-green"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">等待送货分店</div>
            <count-to
              :start-val="0"
              :end-val="waitingShopNum || 0"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'shop'" :gutter="30" class="panel-group">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">分店员工</div>
            <count-to
              :start-val="0"
              :end-val="ClerkNum || 0"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">未完成订购单</div>
            <count-to
              :start-val="0"
              :end-val="todoNum[0] || 0"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日总金额</div>
            <count-to
              :start-val="0"
              :end-val="
                shop_total.length === 0
                  ? 0
                  : getMoney(shop_total[userInfo.shop_id]) || 0
              "
              :duration="2400"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon
              icon-class="shopping-green"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日采购总数</div>
            <count-to
              :start-val="0"
              :end-val="buyTotal || 0"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'buyer'" :gutter="30" class="panel-group">
      <el-col :xs="24" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">未完成采购单</div>
            <count-to
              :start-val="0"
              :end-val="todoNum[0] || 0"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日采购总额</div>
            <count-to
              :start-val="0"
              :end-val="total[0] || 0"
              :duration="2400"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon
              icon-class="shopping-green"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日采购总数</div>
            <count-to
              :start-val="0"
              :end-val="buyTotal || 0"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'admin'" :gutter="30" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">员工总数</div>
            <count-to
              :start-val="0"
              :end-val="allClerk"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row
      v-if="userInfo.role === 'manager' || userInfo.role === 'shop'"
      :gutter="32"
    >
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart v-if="userInfo.role === 'manager'" :total="total" />
          <bar-chart
            v-if="userInfo.role === 'shop'"
            :total="
              shop_total.length === 0 ? [] : shop_total[userInfo.shop_id]
            "
          />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="userInfo.role === 'admin'" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <pie-chart :clerk-data="clerkData" />
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role !== 'admin'">
      <h4>今日订单提交数</h4>
      <el-table :data="order_num_list" style="width: 100%" stripe>
        <el-table-column label="分店" prop="shop_name" align="center">
          <template slot-scope="{ row }">
            <span>{{ `[${row.shop_id}] ${row.shop_name}` }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="冷冻品类订单数"
          prop="lengdongpin"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.order_data["冷冻品类订单数"] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="水果类订单数" prop="shuiguo" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.order_data["水果类订单数"] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="蔬菜类订单数" prop="shucai" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.order_data["蔬菜类订单数"] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="混合类订单数" prop="hunhe" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.order_data["混合类订单数"] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row v-if="userInfo.role !== 'admin'">
      <h4>今日单品订货订购量预汇总</h4>
      <el-table
        :data="goods_num_list"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @row-click="openDetail"
      >
        <el-table-column label="标志位" prop="goods_sort" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.goods_sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="goods_id" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.goods_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品名" prop="goods_name" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.goods_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订购量" prop="order_num" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.order_num + row.order_unit }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-drawer
      :title="detailTitle"
      :visible.sync="detailVisible"
      direction="ltr"
      :with-header="false"
      :size="tableSettingsDrawerSize"
    >
      <div class="tableSettingsDrawer">
        <h4>{{ detailTitle + "的各分店订货情况" }}</h4>
        <span>订购总量:{{ detailSum }}</span>
        <el-table
          :cell-style="TableCellStyle"
          :header-cell-style="TableHeaderStyle"
          :data="detailTemp"
          style="width: 100%"
          stripe
        >
          <el-table-column label="分店" prop="shop_name" align="center" min-width="100">
            <template slot-scope="{ row }">
              <span>{{ `[${row.shop_id}] ${row.shop_name}` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订购量" prop="order_num" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.order_num }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import {
  fetchTotal,
  fetchTodoNum,
  fetchClerkNum,
  fetchBuyTotal,
  fetchBuyingManNum,
  fetchWaitingShopNum,
  fetchOrderNum,
  fetchGoodsNums
} from '@/api/stat'
import { fetchAccount } from '@/api/account'

export default {
  name: 'DashboardAdmin',
  components: {
    PieChart,
    BarChart,
    CountTo
  },
  data() {
    return {
      detailTitle: '',
      detailSum: '',
      detailVisible: false,
      detailTemp: [],
      total: [],
      shop_total: [],
      order_num_list: null,
      goods_num_list: null,
      todoNum: 0,
      day: null,
      allClerk: 0,
      clerkData: null,
      ClerkNum: 0,
      buyTotal: 0,
      buyingManNum: 0,
      waitingShopNum: 0,
      TableCellStyle: { padding: '2px 0' },
      TableHeaderStyle: { padding: '10px 0' }
    }
  },
  computed: {
    userInfo() {
      return {
        name: this.$store.getters.name,
        shop_name: this.$store.getters.shop_name, // 所属分店
        shop_id: this.$store.getters.shop_id,
        role: this.$store.getters.roles[0]
      }
    },
    device() {
      // mobile or desktop
      return this.$store.state.app.device
    },
    tableSettingsDrawerSize() {
      if (this.device === 'mobile') {
        return '70%'
      } else {
        return '30%'
      }
    }
  },
  created() {
    if (this.userInfo.role === 'admin') {
      this.getAllClerk()
      return
    }
    this.getTodoNum()
    this.getBuyTotal()
    this.getOrderNum()
    this.getGoodsNums()
    this.getTotal()
    if (this.userInfo.role === 'buyer') return
    this.day = new Date().getDay()

    if (this.userInfo.role === 'shop') this.getClerkNum()
    if (this.userInfo.role === 'manager') {
      this.getBuyingManNum()
      this.getWaitingShopNum()
    }
  },
  methods: {
    getTotal() {
      fetchTotal().then((res) => {
        this.adjust(res.total)
        this.total = res.total
        if (res.shop_total) {
          // eslint-disable-next-line
          for (const [_, value] of Object.entries(res.shop_total)) {
            this.adjust(value)
          }
          this.shop_total = res.shop_total
        }
      })
    },
    getTodoNum() {
      fetchTodoNum().then((res) => {
        this.todoNum = res.todo_num
      })
    },
    adjust(array) {
      if (array) {
        array.reverse()
        if (this.day !== 0) {
          for (let i = 7; i > this.day; i--) {
            array.push(array.shift())
          }
        }
      }
    },
    getMoney(array) {
      if (this.day === 0) {
        return array[6]
      } else {
        return array[this.day - 1]
      }
    },
    getAllClerk() {
      let admin = 0
      let manager = 0
      let shop = 0
      let buyer = 0
      fetchAccount({ limit: 999999 }).then((res) => {
        this.allClerk = res.total
        res.data.forEach((e) => {
          if (e.role === 'admin') admin++
          else if (e.role === 'manager') manager++
          else if (e.role === 'shop') shop++
          else buyer++
        })
        this.clerkData = [admin, manager, buyer, shop]
      })
    },
    getClerkNum() {
      fetchClerkNum().then((res) => {
        this.ClerkNum = res.shop_man_num
      })
    },
    getBuyTotal() {
      fetchBuyTotal().then((res) => {
        this.buyTotal = res.buy_total
      })
    },
    getBuyingManNum() {
      fetchBuyingManNum().then((res) => {
        this.buyingManNum = res.buying_man_num
      })
    },
    getWaitingShopNum() {
      fetchWaitingShopNum().then((res) => {
        this.waitingShopNum = res.waiting_shop_num
      })
    },
    getOrderNum() {
      fetchOrderNum().then((res) => {
        this.order_num_list = res.data
      })
    },
    getGoodsNums() {
      fetchGoodsNums().then((res) => {
        this.goods_num_list = res.data
        this.goods_num_list.sort((a, b) => {
          if (a.type_name === b.type_name) {
            return b.goods_sort - a.goods_name
          } else {
            if (a.type_name === '水果') {
              return -1
            } else if (b.type_name === '水果') {
              return 1
            } else if (a.type_name === '蔬菜') {
              return -1
            } else if (b.type_name === '蔬菜') {
              return 1
            }
          }
        })
      })
    },
    tableRowClassName({ row, index }) {
      if (row.type_name === '水果') return 'fruit-row'
      if (row.type_name === '蔬菜') return 'veg-row'
      if (row.type_name === '冷冻品') return 'fresh-row'
    },
    openDetail(row) {
      this.detailVisible = true
      this.detailTitle = row.goods_name
      this.detailSum = row.order_num + row.order_unit
      this.detailTemp = row.shop_data
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
