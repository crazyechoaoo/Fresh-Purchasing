<template>
  <div class="app-container">
    <div v-if="device === 'mobile'" class="filter-container">
      <el-row class="search" type="flex" justify="center">
        <el-select
          v-model="listQuery.sort"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-button
          v-if="isPermit"
          :loading="downloadLoading"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出
        </el-button>
      </el-row>
      <el-row type="flex" class="search" justify="center">
        <el-select
          v-model="listQuery.goods_type_id"
          placeholder="分类"
          clearable
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in goodTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
        <el-button
          v-if="isPermit"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          添加
        </el-button>
      </el-row>
      <el-row type="flex" class="search" justify="center">
        <el-input
          v-model.trim="listQuery.search"
          placeholder="搜索..."
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-row>
    </div>
    <div v-else class="filter-container">
      <el-row class="search" type="flex" justify="center">
        <el-select
          v-model="listQuery.sort"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-button
          v-if="isPermit"
          :loading="downloadLoading"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出
        </el-button>
        <el-select
          v-model="listQuery.goods_type_id"
          placeholder="分类"
          clearable
          class="filter-item margin-l-10"
          @change="handleFilter"
        >
          <el-option
            v-for="item in goodTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
        <el-button
          v-if="isPermit"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          添加
        </el-button>
        <el-input
          v-model.trim="listQuery.search"
          placeholder="搜索..."
          class="filter-item margin-l-10"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
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
        min-width="60"
      >
        <template slot-scope="{ row }">
          <span>{{ row.goods_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTitle']"
        label="名称"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span v-if="isPermit" class="link-type" @click="handleUpdate(row)">{{
            row.goods_name
          }}</span>
          <span v-else>{{ row.goods_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showType']"
        label="分类"
        min-width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.goods_type_id | typeCssFilter">
            <span>{{ row.goods_type_id | typeNameFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showOrderUnit']"
        label="订购单位"
        align="center"
        min-width="40"
      >
        <template slot-scope="{ row }">
          <span>{{ row.order_unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showSellUnit']"
        label="销售单位"
        align="center"
        min-width="40"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sale_unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showReceiveUnit']"
        label="收货单位"
        class-name="status-col"
        align="center"
        min-width="40"
      >
        <template slot-scope="{ row }">
          {{ row.rec_unit }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showKey']"
        label="标志位"
        class-name="status-col"
        align="center"
        min-width="60"
      >
        <template slot-scope="{ row }">
          {{ row.goods_sort }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showCanOrder']"
        label="可订/不可订"
        class-name="status-col"
        align="center"
        min-width="60"
      >
        <template slot-scope="{ row }">
          {{ row.can_order ? "可订" : "不可订" }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showDesc']"
        label="备注"
        class-name="status-col"
        align="center"
        min-width="60"
      >
        <template slot-scope="{ row }">
          {{ row.desc || "" }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showAction'] && isPermit"
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :small="device === 'mobile'"
      @pagination="getList"
    />

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
            :rules="rules"
            :model="temp"
            label-width="70px"
            hide-required-asterisk
            class="pageForm"
          >
            <el-form-item label="编号" prop="id">
              <!-- <span> {{ temp.goods_id || '暂无' }} </span> -->
              <el-input
                v-if="dialogStatus === 'create'"
                v-model.trim="temp.goods_id"
                type="number"
                pattern="[0-9]*"
              />
              <span v-else> {{ temp.goods_id || "暂无" }} </span>
            </el-form-item>
            <el-form-item label="分类" prop="type_name">
              <el-select
                v-model="temp.type_name"
                class="filter-item"
                placeholder="请选择分类"
                @change="typeChange"
              >
                <el-option
                  v-for="item in goodTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="品名" prop="goods_name">
              <el-input v-model.trim="temp.goods_name" />
            </el-form-item>
            <el-form-item label="标志位" prop="key">
              <el-input
                v-model.trim="temp.goods_sort"
                type="number"
                pattern="[0-9]*"
              />
            </el-form-item>
            <el-form-item label="订购单位">
              <el-select
                v-model="temp.order_unit"
                class="filter-item"
                placeholder="请选择..."
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收货单位">
              <el-select
                v-model="temp.rec_unit"
                class="filter-item"
                placeholder="请选择..."
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="销售单位">
              <el-select
                v-model="temp.sale_unit"
                class="filter-item"
                placeholder="请选择..."
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否可订">
              <el-select
                v-model="temp.can_order"
                class="filter-item"
                placeholder="请选择..."
              >
                <el-option
                  v-for="item in canOrderOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model.trim="temp.desc" placeholder="备注内容..." />
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

    <el-dialog
      v-else
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="70px"
        hide-required-asterisk
        class="pageForm"
      >
        <el-form-item label="编号" prop="id">
          <!-- <span> {{ temp.goods_id || '暂无' }} </span> -->
          <el-input
            v-if="dialogStatus === 'create'"
            v-model.trim="temp.goods_id"
            type="number"
          />
          <span v-else> {{ temp.goods_id || "暂无" }} </span>
        </el-form-item>
        <el-form-item label="分类" prop="type_name">
          <el-select
            v-model="temp.type_name"
            class="filter-item"
            placeholder="请选择分类"
            @change="typeChange"
          >
            <el-option
              v-for="item in goodTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品名" prop="goods_name">
          <el-input v-model.trim="temp.goods_name" />
        </el-form-item>
        <el-form-item label="标志位" prop="key">
          <el-input
            v-model.trim="temp.goods_sort"
            type="number"
            pattern="[0-9]*"
          />
        </el-form-item>
        <el-form-item label="订购单位">
          <el-select
            v-model="temp.order_unit"
            class="filter-item"
            placeholder="请选择..."
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收货单位">
          <el-select
            v-model="temp.rec_unit"
            class="filter-item"
            placeholder="请选择..."
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售单位">
          <el-select
            v-model="temp.sale_unit"
            class="filter-item"
            placeholder="请选择..."
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可订">
          <el-select
            v-model="temp.can_order"
            class="filter-item"
            placeholder="请选择..."
          >
            <el-option
              v-for="item in canOrderOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="temp.desc" placeholder="备注内容..." />
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
            class="filter-item"
          >
            编号
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTitle']"
            border
            class="filter-item"
          >
            品名
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showType']"
            border
            class="filter-item"
          >
            分类
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showKey']"
            border
            class="filter-item"
          >
            标志位
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showOrderUnit']"
            border
            class="filter-item"
          >
            订购单位
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showSellUnit']"
            border
            class="filter-item"
          >
            销售单位
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showReceiveUnit']"
            border
            class="filter-item"
          >
            收货单位
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showCanOrder']"
            border
            class="filter-item"
          >
            可订/不可订
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showDesc']"
            border
            class="filter-item"
          >
            备注
          </el-checkbox>
          <el-checkbox
            v-if="isPermit"
            v-model="showSettings['showAction']"
            border
            class="filter-item"
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
  fetchCommodity,
  createCommodity,
  updateCommodity,
  delCommodity
} from '@/api/commodity'
import { parseTime, resetPagination } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CommodityPage',
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
      tableSettingsDrawerVisible: false,
      formDrawerVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      requestLoading: false,
      downloadLoading: false,
      timer: null,
      list: null,
      total: 0,
      listLoading: true,
      temp: {},
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined,
        // type: undefined,
        goods_type_id: undefined,
        sort: '-goods_sort' // 升序排序
      },
      goodTypeOptions: [
        { key: '1101', display_name: '水果' },
        { key: '1102', display_name: '蔬菜' },
        { key: '1208', display_name: '冷冻品' }
      ],
      sortOptions: [
        { label: '按编号升序', key: '+goods_id' },
        { label: '按编号降序', key: '-goods_id' },
        { label: '按标志位升序', key: '+goods_sort' },
        { label: '按标志位降序', key: '-goods_sort' }
      ],
      canOrderOptions: [
        { label: '可订', key: true },
        { label: '不可订', key: false }
      ],
      unitOptions: ['斤', '公斤', '件'],
      textMap: {
        update: '编辑货品',
        create: '添加货品'
      },
      rules: {
        type_name: [
          { required: true, message: '需要选择货品分类', trigger: 'change' }
        ],
        goods_name: [
          { required: true, message: '货品名称不能为空', trigger: 'blur' }
        ]
      },
      showSettings: {
        showId: true,
        showType: true,
        showTitle: true,
        showOrderUnit: true,
        showSellUnit: true,
        showReceiveUnit: true,
        showKey: true,
        showAction: true,
        showCanOrder: true,
        showDesc: true
      }
    }
  },
  computed: {
    userInfo() {
      return {
        name: this.$store.getters.name,
        shop_name: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0]
      }
    },
    isPermit() {
      // 是否允许增删改
      if (this.userInfo.role === 'admin' || this.userInfo.role === 'manager') {
        return true
      } else {
        return false
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
        return '25%'
      }
    }
  },
  created() {
    this.resetTemp()
    this.getList()
    if (!window.sessionStorage.getItem('commodity')) {
      this.setShowSettings()
    } else {
      this.showSettings = JSON.parse(
        window.sessionStorage.getItem('commodity')
      )
    }
  },
  mounted() {
    resetPagination()
  },
  methods: {
    setShowSettings() {
      window.sessionStorage.setItem(
        'commodity',
        JSON.stringify(this.showSettings)
      )
    },
    getList() {
      this.listLoading = true
      fetchCommodity(this.listQuery).then((res) => {
        this.list = res.data
        this.total = res.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        goods_id: undefined,
        goods_type_id: '',
        type_name: '',
        goods_name: '',
        order_unit: '',
        sale_unit: '',
        rec_unit: '',
        goods_sort: undefined, // 标志位
        can_order: false,
        desc: ''
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
          createCommodity(this.temp).then((res) => {
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
              this.list.unshift(this.temp)
              this.$notify({
                title: '成功',
                message: '货品添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '货品添加失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          updateCommodity(tempData).then((res) => {
            if (res.status === 'success') {
              const index = this.list.findIndex(
                (v) => v.goods_id === this.temp.goods_id
              )
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
                title: '操作',
                message: '货品信息更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '货品信息更新失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      const params = { goods_id: row.goods_id }
      delCommodity(params).then((res) => {
        if (res.status === 'success') {
          this.$notify({
            title: '成功',
            message: '货品删除成功！',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '货品删除失败,原因未知',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleDownload() {
      if (this.device === 'mobile') {
        this.$notify({
          title: '失败',
          message: '移动端不支持该操作，请在电脑端打印',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '货品编号',
          '货品名称',
          '货品分类',
          '订购单位',
          '销售单位',
          '采购单位',
          '标志位'
        ]
        const filterVal = [
          'goods_id',
          'goods_name',
          'type_name',
          'order_unit',
          'sale_unit',
          'rec_unit',
          'goods_sort'
        ]
        fetchCommodity({
          page: 1,
          limit: 999999,
          sort: '-goods_sort' // 升序排序
        }).then((res) => {
          const data = res.data.map((v) =>
            filterVal.map((j) => {
              if (j === 'timestamp') {
                return parseTime(v[j])
              } else {
                return v[j]
              }
            })
          )
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '货品信息'
          })
          this.downloadLoading = false
        })
      })
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
    typeChange(value) {
      this.temp.goods_type_id = value
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
