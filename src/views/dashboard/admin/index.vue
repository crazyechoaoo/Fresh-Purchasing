<template>
  <div class="dashboard-editor-container">
    <div style="font-size: 30px;line-height: 46px;margin-bottom:28px"
         class="dashboard-text">
      <!-- 欢迎来到生鲜外采系统 -->
      <img width="50%"
           style="min-width: 310px;"
           src="@/assets/title/title.png">
    </div>

    <el-row v-if="userInfo.role === 'manager'"
            :gutter="30"
            class="panel-group">
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              正在采购人员
            </div>
            <count-to :start-val="0"
                      :end-val="buyingManNum||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue"
                      class-name="card-panel-icon" />
          </div>
          <div v-if="userInfo.role === 'manager'"
               class="card-panel-description">
            <div class="card-panel-text">
              待审订单 / 待采购单
            </div>
            <count-to :start-val="0"
                      :end-val="todoNum[0] || 0"
                      :duration="3000"
                      class="card-panel-num" />
            /
            <count-to :start-val="0"
                      :end-val="todoNum[1] || 0"
                      :duration="3000"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日总金额
            </div>
            <count-to :start-val="0"
                      :end-val="getMoney(total) || 0"
                      :duration="2400"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="shopping-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              等待送货分店
            </div>
            <count-to :start-val="0"
                      :end-val="waitingShopNum||0"
                      :duration="3600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'shop'"
            :gutter="30"
            class="panel-group">
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              分店员工
            </div>
            <count-to :start-val="0"
                      :end-val="ClerkNum || 0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              未完成订购单
            </div>
            <count-to :start-val="0"
                      :end-val="todoNum[0] || 0"
                      :duration="3000"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日总金额
            </div>
            <count-to :start-val="0"
                      :end-val="
                shop_total.length === 0
                  ? 0
                  : getMoney(shop_total[userInfo.shop_id]) || 0
              "
                      :duration="2400"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="12"
              :lg="6"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="shopping-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日采购总数
            </div>
            <count-to :start-val="0"
                      :end-val="buyTotal||0"
                      :duration="3600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'buyer'"
            :gutter="30"
            class="panel-group">
      <el-col :xs="24"
              :sm="8"
              :lg="8"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="order_blue"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              未完成订购单
            </div>
            <count-to :start-val="0"
                      :end-val="todoNum[0] || 0"
                      :duration="3000"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="8"
              :lg="8"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="money_red"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日采购总额
            </div>
            <count-to :start-val="0"
                      :end-val="total[0]||0"
                      :duration="2400"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="8"
              :lg="8"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="shopping-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日采购总数
            </div>
            <count-to :start-val="0"
                      :end-val="buyTotal||0"
                      :duration="3600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'admin'"
            :gutter="30"
            class="panel-group">
      <el-col :xs="24"
              :sm="24"
              :lg="24"
              class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples-green"
                      class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              员工总数
            </div>
            <count-to :start-val="0"
                      :end-val="allClerk"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="userInfo.role === 'manager' || userInfo.role === 'shop'"
            :gutter="32">
      <el-col :xs="24"
              :sm="24"
              :lg="24">
        <div class="chart-wrapper">
          <bar-chart v-if="userInfo.role === 'manager'"
                     v-bind:total="total" />
          <bar-chart v-if="userInfo.role === 'shop'"
                     v-bind:total="
              shop_total.length === 0 ? [] : shop_total[userInfo.shop_id]
            " />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="userInfo.role === 'admin'"
            :gutter="32">
      <el-col :xs="24"
              :sm="24"
              :lg="24">
        <div class="chart-wrapper">
          <pie-chart v-bind:clerkData="clerkData" />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CountTo from "vue-count-to";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";
import { fetchTotal, fetchTodoNum, fetchClerkNum, fetchBuyTotal, fetchBuyingManNum, fetchWaitingShopNum } from "@/api/stat";
import { fetchAccount } from "@/api/account";

export default {
  name: "DashboardAdmin",
  components: {
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    CountTo
  },
  data () {
    return {
      total: [],
      shop_total: [],
      todoNum: 0,
      day: null,
      allClerk: 0,
      clerkData: null,
      ClerkNum: 0,
      buyTotal: 0,
      buyingManNum: 0,
      waitingShopNum: 0
    };
  },
  created () {
    if (this.userInfo.role === "admin") {
      this.getAllClerk()
      return;
    }
    this.getTodoNum();
    this.getBuyTotal();
    this.getTotal();
    if (this.userInfo.role === "buyer") return;
    this.day = new Date().getDay();

    if (this.userInfo.role === 'shop') this.getClerkNum()
    if (this.userInfo.role === 'manager') {
      this.getBuyingManNum()
      this.getWaitingShopNum()
    }
  },
  computed: {
    userInfo () {
      return {
        name: this.$store.getters.name,
        shop_name: this.$store.getters.shop_name, // 所属分店
        shop_id: this.$store.getters.shop_id,
        role: this.$store.getters.roles[0]
      };
    }
  },
  methods: {
    getTotal () {
      fetchTotal().then(res => {
        this.adjust(res.total);
        this.total = res.total;
        if (res.shop_total) {
          for (const [key, value] of Object.entries(res.shop_total)) {
            this.adjust(value);
          }
          this.shop_total = res.shop_total;
        }
      });
    },
    getTodoNum () {
      fetchTodoNum().then(res => {
        this.todoNum = res.todo_num;
      });
    },
    adjust (array) {
      if (array) {
        array.reverse();
        if (this.day !== 0) {
          for (let i = 7; i > this.day; i--) {
            array.push(array.shift());
          }
        }
      }
    },
    getMoney (array) {
      if (this.day === 0) {
        return array[6];
      } else {
        return array[this.day - 1];
      }
    },
    getAllClerk () {
      let admin = 0
      let manager = 0
      let shop = 0
      let buyer = 0
      fetchAccount({ limit: 999999 }).then(res => {
        this.allClerk = res.total
        res.data.forEach(e => {
          if (e.role === 'admin') admin++
          else if (e.role === 'manager') manager++
          else if (e.role === 'shop') shop++
          else buyer++
        });
        this.clerkData = [admin, manager, buyer, shop]
      });
    }, getClerkNum () {
      fetchClerkNum().then(res => {
        this.ClerkNum = res.shop_man_num
      })
    },
    getBuyTotal () {
      fetchBuyTotal().then(res => {
        this.buyTotal = res.buy_total
      })
    }, getBuyingManNum () {
      fetchBuyingManNum().then(res => {
        this.buyingManNum = res.buying_man_num
      })
    },
    getWaitingShopNum () {
      fetchWaitingShopNum().then(res => {
        this.waitingShopNum = res.waiting_shop_num
      })
    }
  }
};
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
