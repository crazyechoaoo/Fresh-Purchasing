<template>
  <div class="app-container">
    <div v-if="device === 'mobile'" class="filter-container">
      <el-row class="search" type="flex" justify="end">
        <el-button
          class="filter-item"
          style="width: 100%"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          添加
        </el-button>
        <el-button
          class="filter-item margin-l-10"
          style="width: 100%"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
      </el-row>
    </div>
    <div v-else class="filter-container">
      <el-row class="search" type="flex" justify="end">
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          添加
        </el-button>
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
      </el-row>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-if="showSettings['showId']"
        label="编号"
        prop="id"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTitle']"
        label="方案名"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.plan_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showDesc']"
        label="描述"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showAction']"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            class="margin-l-10 margin-top-6"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            class="margin-l-10 margin-top-6"
            size="mini"
            type="danger"
            @click="openConfirmMsgBox('delete', row, $index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :small="device === 'mobile'"
      @pagination="getList"
    />

    <!-- 分配方案 -->
    <el-drawer
      v-if="device === 'mobile'"
      ref="drawer"
      :title="textMap[dialogStatus]"
      :before-close="dialogStatus === 'create' ? createData : updateData"
      :visible.sync="formDrawerVisible"
      direction="ltr"
      :with-header="false"
      size="100%"
      @open="formDrawerOpen"
    >
      <div class="formDrawer">
        <div class="formDrawer-header">
          <el-page-header
            :content="textMap[dialogStatus]"
            @back="formDrawerVisible = false"
          />
        </div>
        <div class="formDrawer-body">
          <el-form
            ref="dataForm"
            status-icon
            :rules="rules"
            :model="temp"
            :label-position="labelPosition"
            label-width="70px"
            hide-required-asterisk
            class="pageForm"
          >
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="编号"
              prop="id"
            >
              <span> {{ temp.id || "无" }} </span>
            </el-form-item>
            <el-form-item label="方案名称" prop="plan_name">
              <el-input v-model="temp.plan_name" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="temp.description" />
            </el-form-item>
            <el-form-item label="方案详情" prop="buy_plan_buyer">
              <el-table
                :header-cell-style="TableHeaderStyle"
                :cell-style="TableCellStyle"
                :data="temp.buy_plan_buyer"
                border
                fit
                highlight-current-row
              >
                <el-table-column align="center" label="标志位" width="65">
                  <template slot-scope="{ row }">
                    <span>{{ row.goods_sort }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="编号" min-width="70">
                  <template slot-scope="{ row }">
                    <span>{{ row.goods_id }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="品名"
                  :min-width="dialogStatus === 'create' ? 130 : 100"
                >
                  <template slot-scope="{ row, $index }">
                    <el-row type="flex" justify="center">
                      <el-tag
                        v-if="row.goods_id"
                        :type="row.goods_type_id | typeCssFilter"
                      >
                        <span>{{ row.goods_name }}</span>
                      </el-tag>
                      <el-autocomplete
                        v-else
                        v-model="row.goods_name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="输入品名"
                        @select="handleSelect"
                      />
                      <el-button
                        v-if="dialogStatus === 'create'"
                        size="mini"
                        type="danger"
                        style="padding: 2px 4px; margin-left: 4px"
                        icon="el-icon-circle-close"
                        @click="tableItemDel(row, $index)"
                      />
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="采购员" min-width="110">
                  <template slot-scope="{ row }">
                    <el-select
                      v-model="row.buyer_username"
                      placeholder="选择采购员"
                    >
                      <el-option
                        v-for="(item, index) in buyerList"
                        :key="index"
                        :label="item.name"
                        :value="item.username"
                      />
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="end">
                <el-button
                  class="margin-top-6"
                  style="width: 100%"
                  type="primary"
                  @click="tableDetialDrawerVisible = true"
                >
                  显示全部
                </el-button>
                <el-button
                  class="margin-top-6"
                  style="width: 100%"
                  type="primary"
                  @click="tableItemAdd"
                >
                  添加
                </el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <div class="formDrawer-footer">
          <el-row type="flex" justify="center">
            <el-button @click="cancelForm">取 消</el-button>
            <el-button
              :loading="requestLoading"
              type="primary"
              @click="$refs.drawer.closeDrawer()"
            >{{ requestLoading ? "提交中 ..." : "确 定" }}</el-button>
          </el-row>
        </div>
      </div>
    </el-drawer>
    <!-- 分配方案 -->
    <el-dialog
      v-else
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        status-icon
        :rules="rules"
        :model="temp"
        :label-position="labelPosition"
        label-width="70px"
        hide-required-asterisk
        class="pageForm"
      >
        <el-form-item v-if="dialogStatus === 'update'" label="编号" prop="id">
          <span> {{ temp.id || "无" }} </span>
        </el-form-item>
        <el-form-item label="方案名称" prop="plan_name">
          <el-input v-model="temp.plan_name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="方案详情" prop="buy_plan_buyer">
          <el-table
            :header-cell-style="TableHeaderStyle"
            :cell-style="TableCellStyle"
            :data="temp.buy_plan_buyer"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="标志位" width="65">
              <template slot-scope="{ row }">
                <span>{{ row.goods_sort }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="编号" min-width="70">
              <template slot-scope="{ row }">
                <span>{{ row.goods_id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="品名"
              :min-width="dialogStatus === 'create' ? 130 : 100"
            >
              <template slot-scope="{ row, $index }">
                <el-row type="flex" justify="center">
                  <el-tag
                    v-if="row.goods_id"
                    :type="row.goods_type_id | typeCssFilter"
                  >
                    <span>{{ row.goods_name }}</span>
                  </el-tag>
                  <el-autocomplete
                    v-else
                    v-model="row.goods_name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="输入品名"
                    @select="handleSelect"
                  />
                  <el-button
                    v-if="dialogStatus === 'create'"
                    size="mini"
                    type="danger"
                    style="padding: 2px 4px; margin-left: 4px"
                    icon="el-icon-circle-close"
                    @click="tableItemDel(row, $index)"
                  />
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" label="采购员" min-width="110">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row.buyer_username"
                  placeholder="选择采购员"
                >
                  <el-option
                    v-for="(item, index) in buyerList"
                    :key="index"
                    :label="item.name"
                    :value="item.username"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end">
            <el-button
              class="margin-top-6"
              style="width: 100%"
              type="primary"
              @click="tableDetialDrawerVisible = true"
            >
              显示全部
            </el-button>
            <el-button
              class="margin-top-6"
              style="width: 100%"
              type="primary"
              @click="tableItemAdd"
            >
              添加
            </el-button>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm"> 取消 </el-button>
        <el-button
          :loading="requestLoading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ requestLoading ? "提交中 ..." : "确 定" }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 方案详情 -->
    <el-drawer
      title="方案详情"
      :visible.sync="tableDetialDrawerVisible"
      direction="ltr"
      :with-header="false"
      size="100%"
      :before-close="tableDetailDrawerClose"
      @open="tableDetailDrawerOpen"
    >
      <div class="formDrawer">
        <div class="formDrawer-header">
          <el-page-header
            content="分配方案详情"
            @back="tableDetialDrawerVisible = false"
          />
        </div>
        <div class="formDrawer-body">
          <el-table
            :header-cell-style="TableHeaderStyle"
            :loading="tableDetailLoading"
            :cell-style="TableCellStyle"
            :data="commodityList"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="编号">
              <template slot-scope="{ row }">
                <span>{{ row.goods_id }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="品名" min-width="120">
              <template slot-scope="{ row }">
                <el-row type="flex" justify="center">
                  <el-tag :type="row.goods_type_id | typeCssFilter">
                    <span>{{ row.goods_name }}</span>
                  </el-tag>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" label="订购量" min-width="120">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row.buyer_username"
                  placeholder="选择采购员"
                  @change="handleBuyerSelect(row)"
                >
                  <el-option
                    v-for="(item, index) in buyerList"
                    :key="index"
                    :label="item.name"
                    :value="item.username"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="commodityDetailDrawer-footer">
          <el-row type="flex" justify="center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="commodityListTotal"
              :page-size="40"
              @current-change="getCommodityList"
            />
          </el-row>
        </div>
      </div>
    </el-drawer>

    <!-- 表格设置 -->
    <el-drawer
      title="表格设置"
      :visible.sync="tableSettingsDrawerVisible"
      direction="ltr"
      :with-header="false"
      :size="tableSettingsDrawerSize"
      @close="setShowSettings"
    >
      <div class="tableSettingsDrawer">
        <el-page-header
          class="margin-b-20"
          content="表格设置"
          @back="tableSettingsDrawerVisible = false"
        />
        <span>选择表格要显示的数据项：</span>
        <el-row class="tableSetting">
          <el-checkbox
            v-model="showSettings['showId']"
            border
            class="filter-item margin-l-0"
          >
            编号
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTitle']"
            border
            class="filter-item margin-l-0"
          >
            方案名称
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showDesc']"
            border
            class="filter-item margin-l-0"
          >
            描述
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showAction']"
            border
            class="filter-item margin-l-0"
          >
            操作
          </el-checkbox>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  fetchScheme,
  updateScheme,
  delScheme,
  createScheme,
  fetchAllbuyer
} from '@/api/single'
import { fetchCommodity } from '@/api/commodity'
import { parseTime, resetPagination } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'OrderSchemePage',
  components: { Pagination },
  filters: {
    typeNameFilter(type) {
      const typeNameMap = {
        1101: '水果',
        1102: '蔬菜',
        1208: '冷冻品'
      }
      return typeNameMap[type]
    },
    typeCssFilter(type) {
      const typeCssMap = {
        1101: 'danger', // red
        1102: 'success', // green
        1208: '' // blue
      }
      return typeCssMap[type]
    },
    parseTime
  },
  data() {
    return {
      tableDetialDrawerVisible: false,
      tableSettingsDrawerVisible: false,
      formDrawerVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      requestLoading: false,
      tableDetailLoading: false,
      timer: null,
      list: null,
      buyerList: null,
      total: 0,
      commodityList: null,
      commodityListTotal: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        plan_name: '', // 标题
        description: '', // 描述
        buy_plan_buyer: [] // 分配表
      },
      sortOptions: [
        { label: '升序', key: '+id' },
        { label: '降序', key: '-id' }
      ],
      TableCellStyle: { padding: '2px 0' },
      TableHeaderStyle: { padding: '1px 0' },
      textMap: {
        update: '修改方案',
        create: '添加方案'
      },
      rules: {
        plan_name: [
          { required: true, message: '请输入方案名', trigger: 'blur' }
        ],
        buy_plan_buyer: [
          {
            validator: (rule, value, callback) => {
              for (const item of value) {
                if (
                  !item.goods_name ||
                  !item.goods_id ||
                  !item.buyer_username
                ) {
                  callback(new Error('请将方案表填写完整'))
                }
              }
              callback()
            },
            trigger: 'commit'
          }
        ]
      },
      showSettings: {
        showId: true,
        showTitle: true,
        showDesc: true,
        showAction: true
      },
      tableCurrentRow: null
    }
  },
  computed: {
    userInfo() {
      return {
        name: this.$store.getters.name,
        affiliation: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0]
      }
    },
    device() {
      // mobile or desktop
      return this.$store.state.app.device
    },
    tableSettingsDrawerSize() {
      if (this.device === 'mobile') {
        return '60%'
      } else {
        return '20%'
      }
    },
    labelPosition() {
      if (this.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    }
  },
  created() {
    // 钩子函数
    this.getList()
    this.getBuyerList()
    if (!window.sessionStorage.getItem('buyScheme')) {
      this.setShowSettings()
    } else {
      this.showSettings = JSON.parse(
        window.sessionStorage.getItem('buyScheme')
      )
    }
  },
  mounted() {
    resetPagination()
  },
  methods: {
    setShowSettings() {
      window.sessionStorage.setItem(
        'buyScheme',
        JSON.stringify(this.showSettings)
      )
    },
    getList() {
      this.listLoading = true
      fetchScheme(this.listQuery).then((res) => {
        this.list = res.data
        this.total = res.total
        this.listLoading = false
      })
    },
    getBuyerList() {
      if (!this.buyerList) {
        fetchAllbuyer({}).then((res) => {
          if (res.status === 'success') {
            this.buyerList = res.data
          } else {
            this.$notify({
              title: '失败',
              message: res.msg || '获取采购员失败，原因未知',
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        plan_name: '', // 标题
        description: '', // 描述
        buy_plan_buyer: [] // 分配表
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      if (this.device === 'desktop') {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } else {
        this.formDrawerVisible = true
      }
    },
    createData(done) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.requestLoading) {
            return
          }
          this.requestLoading = true
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createScheme(this.temp).then((res) => {
            if (res.status === 'success') {
              if (this.device === 'mobile') {
                done()
              } else {
                this.dialogFormVisible = false
              }
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false
              }, 400)
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '方案创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '方案创建失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      const buy_plan_buyer = []
      row.buy_plan_buyer.forEach((item) => {
        buy_plan_buyer.push(Object.assign({}, item))
      })

      setTimeout(() => {
        this.temp = Object.assign({}, row, { buy_plan_buyer }) // deep copy obj
      }, 400)

      this.dialogStatus = 'update'
      if (this.device === 'desktop') {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } else {
        this.formDrawerVisible = true
      }
    },
    updateData(done) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.requestLoading) {
            return
          }
          this.requestLoading = true
          const tempData = Object.assign({}, this.temp)
          updateScheme(tempData).then((res) => {
            if (res.status === 'success') {
              const index = this.list.findIndex((v) => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              if (this.device === 'mobile') {
                done()
              } else {
                this.dialogFormVisible = false
              }
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false
              }, 400)
              this.$notify({
                title: '成功',
                message: '方案修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '方案修改失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      const params = { id: row.id }
      delScheme(params).then((res) => {
        if (res.status === 'success') {
          this.$notify({
            title: '成功',
            message: '方案删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '方案删除失败,原因未知',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        fetchCommodity({
          limit: 10,
          search: queryString,
          sort: '+goods_id'
        }).then((res) => {
          const commodities = res.data
          const results = queryString
            ? commodities.filter(
              (v) =>
                this.temp.buy_plan_buyer.findIndex(
                  (i) => i.goods_id === v.goods_id
                ) < 0
            )
            : commodities
          for (const item of results) {
            item['value'] = item.goods_name
            item['orderNum'] = 0
          }
          cb(results)
        })
      }
    },
    handleSelect(item) {
      this.temp.buy_plan_buyer.splice(
        this.temp.buy_plan_buyer.length - 1,
        1,
        item
      )
    },
    tableItemAdd() {
      this.temp.buy_plan_buyer.push({
        goods_id: '',
        goods_name: '',
        buyer_username: '',
        name: ''
      })
    },
    tableItemDel(row, index) {
      this.temp.buy_plan_buyer.splice(index, 1)
    },
    cancelForm() {
      this.requestLoading = false
      this.dialogFormVisible = false
      this.formDrawerVisible = false
      clearTimeout(this.timer)
    },
    formDrawerOpen() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    tableDetailDrawerOpen() {
      setTimeout(() => {
        // 动画需要一定的时间
        this.getCommodityList(1)
      }, 400)
    },
    tableDetailDrawerClose() {
      this.commodityList = null
    },
    handleBuyerSelect(row) {
      const idx = this.temp.buy_plan_buyer.findIndex(
        (v) => v.goods_id === row.goods_id
      )
      if (idx >= 0) {
        this.temp.buy_plan_buyer[idx].buyer_username = row.buyer_username
      } else {
        this.temp.buy_plan_buyer.push(row)
      }
    },
    getCommodityList(page) {
      this.tableDetailLoading = true
      fetchCommodity({
        page,
        limit: 40,
        search: undefined,
        goods_type_id: undefined,
        sort: '-goods_sort' // 升序排序
      }).then((res) => {
        this.commodityList = res.data
        this.commodityListTotal = res.total
        this.tableDetailLoading = false
        this.temp.buy_plan_buyer.forEach((v) => {
          this.commodityList.forEach((j) => {
            if (v.goods_id === j.goods_id) {
              this.$set(j, 'buyer_username', v.buyer_username)
            }
          })
        })
      })
    },
    openConfirmMsgBox(msg, row, index) {
      let boxMsg = ''
      if (msg === 'delete') {
        boxMsg = '此操作将永久删除该记录, 是否继续?'
      }
      this.$confirm(boxMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          if (msg === 'delete') {
            this.handleDelete(row, index)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    }
  }
}
</script>

<style scoped>
/* local styles */
</style>
