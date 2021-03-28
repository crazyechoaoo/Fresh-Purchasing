<template>
  <div class="app-container">
    <div
      v-if="device === 'mobile'"
      class="filter-container"
    >
      <el-row
        class="search"
        type="flex"
        justify="center"
      >
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
        <el-select
          v-model="listQuery.history"
          class="filter-item margin-l-10"
          @change="handleFilter"
        >
          <el-option
            v-for="item in historyOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.supplier"
          class="filter-item margin-l-10"
          placeholder="全部供应商"
          :disabled="listQuery.history === 'false'"
          clearable
          @change="handleFilter"
        >
          <el-option
            v-for="(item, index) in providerList"
            :key="index"
            :label="item.supplier_name"
            :value="item.supplier_name"
          />
        </el-select>
      </el-row>
      <el-row
        class="search"
        type="flex"
        justify="center"
      >
        <div
          class="filter-item"
          style="min-width: 115px; width: 100%"
        >
          <el-date-picker
            v-model="listQuery.timeBegin"
            align="right"
            type="date"
            placeholder="起始日期"
            :disabled="listQuery.history === 'false'"
            @change="handleFilter"
          />
        </div>
        <div
          class="filter-item margin-l-10"
          style="min-width: 115px; width: 100%"
        >
          <el-date-picker
            v-model="listQuery.timeEnd"
            align="right"
            type="date"
            placeholder="结束日期"
            :disabled="listQuery.history === 'false'"
            @change="handleFilter"
          />
        </div>
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
      </el-row>
      <el-row
        v-if="userInfo.role === 'manager'"
        class="search"
        type="flex"
        justify="center"
      >
        <el-button
          class="filter-item"
          style="width: 100%"
          type="primary"
          icon="el-icon-help"
          @click="openAssignmentDialog"
        >
          采购单任务分配
        </el-button>
      </el-row>
      <el-row
        class="search"
        type="flex"
        justify="center"
      >
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
    <div
      v-else
      class="filter-container"
    >
      <el-row
        class="search"
        type="flex"
        justify="center"
      >
        <el-select
          v-model="listQuery.sort"
          class="filter-item"
          style="max-width: 220px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.history"
          class="filter-item margin-l-10"
          style="max-width: 220px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in historyOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.supplier"
          class="filter-item margin-l-10"
          style="max-width: 220px"
          :disabled="listQuery.history === 'false'"
          clearable
          placeholder="全部供应商"
          @change="handleFilter"
        >
          <el-option
            v-for="(item, index) in providerList"
            :key="index"
            :label="item.supplier_name"
            :value="item.supplier_name"
          />
        </el-select>
        <div
          class="filter-item margin-l-10"
          style="min-width: 115px"
        >
          <el-date-picker
            v-model="listQuery.timeBegin"
            align="right"
            type="date"
            placeholder="起始日期"
            :disabled="listQuery.history === 'false'"
            @change="handleFilter"
          />
        </div>
        <div
          class="filter-item margin-l-10"
          style="min-width: 115px"
        >
          <el-date-picker
            v-model="listQuery.timeEnd"
            align="right"
            type="date"
            placeholder="结束日期"
            :disabled="listQuery.history === 'false'"
            @change="handleFilter"
          />
        </div>
        <el-button
          v-if="userInfo.role === 'manager'"
          class="filter-item margin-l-10"
          style="max-width: 220px"
          type="primary"
          icon="el-icon-help"
          @click="openAssignmentDialog"
        >
          采购单任务分配
        </el-button>
        <el-button
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
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

    <!-- 采购单任务分配 -->
    <el-dialog
      title="采购单任务分配"
      :visible.sync="assignmentDialogVisible"
      :width="assignmentDialogWidth"
      center
    >
      <el-form
        ref="assignForm"
        status-icon
        :rules="rules"
        :model="temp"
        label-position="top"
        hide-required-asterisk
      >
        <el-form-item
          label=""
          prop="buy_plan_buyer"
        >
          <el-select
            value="方案选择"
            style="width: 100%"
            placeholder="选择方案"
            @change="handleSchemeSelect"
          >
            <el-option
              v-for="(item, index) in scheme"
              :key="index"
              :label="item.plan_name"
              :value="item"
            />
          </el-select>
          <el-table
            :header-cell-style="TableHeaderStyle"
            :cell-style="TableCellStyle"
            :data="assignmentList"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              align="center"
              label="单号"
            >
              <template slot-scope="{ row }">
                <span>{{ row.single_order_id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="采购货品"
            >
              <template slot-scope="{ row }">
                <span>{{ row.goods_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="采购员"
            >
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
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignmentDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!assignmentList || assignmentList.length === 0"
          @click="handleAssign"
        >确 定</el-button>
      </span>
    </el-dialog>

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
        label="单号"
        prop="id"
        align="center"
        width="140"
      >
        <template slot-scope="{ row }">
          <span>{{ row.single_order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTitle']"
        label="采购货品"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{
            row.goods_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTime']"
        label="日期"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.start_time.split(" ")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showManager']"
        label="下发人"
        min-width="90"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showBuyer']"
        label="采购员"
        min-width="90"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showProvider']"
        label="采购商"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showStatus']"
        label="当前进度"
        min-width="110"
        align="center"
      >
        <template slot-scope="{ row }">
          <span> {{ row.buy_status }} </span>
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
            type="primary"
            class="margin-l-10 margin-top-6"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{
              row.buy_status === "采购完成" || row.buy_status === "已作废"
                ? "查看"
                : "编辑"
            }}
          </el-button>
          <el-button
            v-if="
              userInfo.role === 'manager' &&
                row.buy_status === '已发配，等待采购'
            "
            type="danger"
            class="margin-l-10 margin-top-6"
            size="mini"
            @click="openConfirmMsgBox('invalid', row, $index)"
          >
            作废
          </el-button>
          <el-button
            v-if="
              userInfo.role === 'buyer' && row.buy_status === '已发配，等待采购'
            "
            class="margin-l-10 margin-top-6"
            size="mini"
            type="danger"
            @click="openConfirmMsgBox('finish', row, $index)"
          >
            完成
          </el-button>
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

    <!-- 单品采购单 -->
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
            :label-position="labelPosition"
            label-width="70px"
            hide-required-asterisk
            class="pageForm"
          >
            <el-form-item
              label="采购单号"
              prop="single_order_id"
            >
              <span> {{ temp.single_order_id || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              label="采购日期"
              prop="start_time"
            >
              <span> {{ temp.start_time }} </span>
            </el-form-item>
            <el-form-item
              label="采购货品"
              prop="goods_name"
            >
              <span>{{ temp.goods_name }}</span>
            </el-form-item>
            <el-form-item
              label="订购总数"
              prop="order_goods_num"
            >
              <span>{{
                temp.order_goods_num +
                  " " +
                  (temp.goods_order ? temp.goods_order[0].order_unit : "")
              }}</span>
            </el-form-item>
            <el-form-item
              label="当前进度"
              prop="buy_status"
            >
              <span> {{ temp.buy_status || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              label="采购商"
              prop="provider"
            >
              <el-select
                v-if="
                  userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                "
                v-model="temp.supplier_id"
                placeholder="选择采购商"
                @change="providerSelected"
              >
                <el-option
                  v-for="(item, index) in providerList"
                  :key="index"
                  :label="item.supplier_name"
                  :value="item.id"
                />
              </el-select>
              <span v-else> {{ temp.supplier_name || "暂无" }} </span>
            </el-form-item>
            <el-row
              :gutter="12"
              type="flex"
              justify="space-between"
            >
              <el-col :span="12">
                <el-form-item
                  label="采购总数"
                  prop="buy_goods_num"
                >
                  <el-input
                    v-if="
                      userInfo.role === 'buyer' &&
                        temp.buy_status !== '采购完成'
                    "
                    v-model="temp.buy_goods_num"
                    pattern="[0-9]*"
                    type="number"
                    @change="computePrice"
                  />
                  <span v-else> {{ temp.buy_goods_num }} </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="采购单位"
                  prop="rec_unit"
                >
                  <el-select
                    v-if="
                      userInfo.role === 'buyer' &&
                        temp.buy_status !== '采购完成'
                    "
                    v-model="temp.buy_goods_unit"
                    placeholder="请选择"
                    @change="buy_goods_unitChange"
                  >
                    <el-option
                      v-for="item in unit_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                  <span v-else> {{ temp.buy_goods_unit || "无" }} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              :gutter="12"
              type="flex"
              justify="space-between"
            >
              <el-col :span="12">
                <el-form-item
                  label="总金额"
                  prop="total_money"
                >
                  <el-input
                    v-if="
                      userInfo.role === 'buyer' &&
                        temp.buy_status !== '采购完成'
                    "
                    v-model="temp.total_money"
                    pattern="[0-9]*"
                    type="number"
                    @change="computePrice"
                  >
                    <template slot="append">
                      {{ "元" }}
                    </template>
                  </el-input>
                  <span v-else> {{ temp.total_money + " 元" }} </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="成交单价"
                  prop="buy_goods_price"
                >
                  <span>
                    {{
                      temp.buy_goods_price
                        ? Number(temp.buy_goods_price).toFixed(2) + " 元"
                        : ""
                    }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="采购详情"
              prop="goods_order"
            >
              <el-table
                id="single-table"
                :header-cell-style="TableHeaderStyle"
                :cell-style="TableCellStyle"
                :data="temp.goods_order"
                border
                fit
                highlight-current-row
              >
                <el-table-column
                  align="center"
                  label="分店"
                  min-width="120"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.shop_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="订购量"
                  min-width="80"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.order_num + " " + row.order_unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="采购量"
                  min-width="120"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-if="
                        userInfo.role === 'buyer' &&
                          temp.buy_status !== '采购完成'
                      "
                      v-model="row.buy_num"
                      pattern="[0-9]*"
                      type="number"
                      placeholder="0"
                      :disabled="temp.buy_goods_num <= 0"
                    >
                      <template slot="append">
                        {{ row.buy_unit }}
                      </template>
                    </el-input>
                    <span v-else>{{
                      row.buy_num + " " + (row.buy_unit || "")
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right">
                <el-button
                  class="margin-top-6"
                  size="mini"
                  type="success"
                  @click="handlePrint()"
                >
                  打印
                </el-button>
              </div>
            </el-form-item>
            <el-form-item
              label="工作人员"
              prop="buyer"
            >
              <span>{{
                temp.manager +
                  "（下发人）、" +
                  (temp.name ? temp.name + "（采购员）" : "未分配采购员")
              }}</span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="经理备注"
              prop="manager_note"
            >
              <el-input
                v-if="
                  userInfo.role === 'manager' && temp.buy_status !== '采购完成'
                "
                v-model="temp.manager_note"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                placeholder="输入备注..."
              />
              <span v-else> {{ temp.manager_note || "无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="采购备注"
              prop="shop_note"
            >
              <el-input
                v-if="
                  userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                "
                v-model="temp.buyer_note"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                placeholder="输入备注..."
              />
              <span v-else> {{ temp.buyer_note || "无" }} </span>
            </el-form-item>
          </el-form>
        </div>
        <div class="formDrawer-footer">
          <el-row
            type="flex"
            justify="center"
          >
            <el-button @click="cancelForm">
              {{ temp.buy_status === "采购完成" ? "关 闭" : "取 消" }}
            </el-button>
            <el-button
              v-if="temp.buy_status !== '采购完成'"
              :loading="requestLoading"
              type="primary"
              @click="$refs.drawer.closeDrawer()"
            >
              {{ requestLoading ? "提交中 ..." : "确 定" }}
            </el-button>
          </el-row>
        </div>
      </div>
    </el-drawer>

    <!-- 单品采购单 -->
    <el-dialog
      v-else
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :label-position="labelPosition"
        label-width="70px"
        hide-required-asterisk
        class="pageForm"
      >
        <el-form-item
          label="采购单号"
          prop="single_order_id"
        >
          <span> {{ temp.single_order_id || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          label="采购日期"
          prop="start_time"
        >
          <span> {{ temp.start_time }} </span>
        </el-form-item>
        <el-form-item
          label="采购货品"
          prop="goods_name"
        >
          <span>{{ temp.goods_name }}</span>
        </el-form-item>
        <el-form-item
          label="订购总数"
          prop="order_goods_num"
        >
          <span>{{
            temp.order_goods_num +
              " " +
              (temp.goods_order ? temp.goods_order[0].order_unit : "")
          }}</span>
        </el-form-item>
        <el-form-item
          label="当前进度"
          prop="buy_status"
        >
          <span> {{ temp.buy_status || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          label="采购商"
          prop="provider"
        >
          <el-select
            v-if="userInfo.role === 'buyer' && temp.buy_status !== '采购完成'"
            v-model="temp.supplier_id"
            placeholder="选择采购商"
            @change="providerSelected"
          >
            <el-option
              v-for="(item, index) in providerList"
              :key="index"
              :label="item.supplier_name"
              :value="item.id"
            />
          </el-select>
          <span v-else> {{ temp.supplier_name || "暂无" }} </span>
        </el-form-item>
        <el-row
          :gutter="12"
          type="flex"
          justify="space-between"
        >
          <el-col :span="12">
            <el-form-item
              label="采购总数"
              prop="buy_goods_num"
            >
              <el-input
                v-if="
                  userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                "
                v-model.trim="temp.buy_goods_num"
                pattern="[0-9]*"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                type="number"
                @change="computePrice"
              />
              <span v-else> {{ temp.buy_goods_num }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="采购单位"
              prop="rec_unit"
            >
              <el-select
                v-if="
                  userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                "
                v-model="temp.buy_goods_unit"
                placeholder="请选择"
                @change="buy_goods_unitChange"
              >
                <el-option
                  v-for="item in unit_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
              <span v-else> {{ temp.buy_goods_unit || "无" }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="12"
          type="flex"
          justify="space-between"
        >
          <el-col :span="12">
            <el-form-item
              label="总金额"
              prop="total_money"
            >
              <el-input
                v-if="
                  userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                "
                v-model.trim="temp.total_money"
                pattern="[0-9]*"
                type="number"
                @change="computePrice"
              >
                <template slot="append">
                  {{ "元" }}
                </template>
              </el-input>
              <span v-else> {{ temp.total_money + " 元" }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="成交单价"
              prop="buy_goods_price"
            >
              <span>
                {{
                  temp.buy_goods_price
                    ? Number(temp.buy_goods_price).toFixed(2) + " 元"
                    : ""
                }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="采购详情"
          prop="goods_order"
        >
          <el-table
            :header-cell-style="TableHeaderStyle"
            :cell-style="TableCellStyle"
            :data="temp.goods_order"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              align="center"
              label="分店"
            >
              <template slot-scope="{ row }">
                <span>{{ row.shop_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="订购量"
            >
              <template slot-scope="{ row }">
                <span>{{ row.order_num + " " + row.order_unit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="采购量"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-if="
                    userInfo.role === 'buyer' && temp.buy_status !== '采购完成'
                  "
                  v-model="row.buy_num"
                  pattern="[0-9]*"
                  type="number"
                  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  placeholder="0"
                  :disabled="temp.buy_goods_num <= 0"
                >
                  <template slot="append">
                    {{ row.buy_unit }}
                  </template>
                </el-input>
                <span v-else>{{
                  row.buy_num + " " + (row.buy_unit || "")
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right">
            <el-button
              class="margin-top-6"
              size="mini"
              type="success"
              @click="handlePrint()"
            >
              打印
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="工作人员"
          prop="buyer"
        >
          <span>{{
            temp.manager +
              "（下发人）、" +
              (temp.name ? temp.name + "（采购员）" : "未分配采购员")
          }}</span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="经理备注"
          prop="manager_note"
        >
          <el-input
            v-if="userInfo.role === 'manager' && temp.buy_status !== '采购完成'"
            v-model="temp.manager_note"
            :autosize="{ minRows: 3, maxRows: 4 }"
            type="textarea"
            placeholder="输入备注..."
          />
          <span v-else> {{ temp.manager_note || "无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="采购备注"
          prop="shop_note"
        >
          <el-input
            v-if="userInfo.role === 'buyer' && temp.buy_status !== '采购完成'"
            v-model="temp.buyer_note"
            :autosize="{ minRows: 3, maxRows: 4 }"
            type="textarea"
            placeholder="输入备注..."
          />
          <span v-else> {{ temp.buyer_note || "无" }} </span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelForm">
          {{ temp.buy_status === "采购完成" ? "关 闭" : "取 消" }}
        </el-button>
        <el-button
          v-if="temp.buy_status !== '采购完成'"
          :loading="requestLoading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ requestLoading ? "提交中 ..." : "确 定" }}
        </el-button>
      </div>
    </el-dialog>

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
            class="filter-item"
            style="margin-left: 10px"
          >
            单号
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTime']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            日期
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTitle']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            采购货品
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showManager']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            下发人
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showBuyer']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            采购员
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showProvider']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            采购商
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showStatus']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            当前进度
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showAction']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            操作
          </el-checkbox>
        </el-row>
      </div>
    </el-drawer>

    <!-- 打印窗口 -->
    <el-dialog
      :top="device === 'mobile' ? '0vh' : '15vh'"
      :width="device === 'mobile' ? '100%' : '50%'"
      :visible.sync="imageWrapperDialogVisible"
      custom-class="printDialog"
    >
      <div
        ref="imageWrapper"
        style="
          width: 100%;
          padding: 2px;
          min-width: 375px;
          max-width: 425px;
          margin: 0 auto;
        "
      >
        <el-row
          type="flex"
          justify="center"
        >
          <h3 style="padding: 10px 0; margin: 0">
            新鲜蔬菜采购单
          </h3>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-table
              :header-cell-style="TableHeaderStyle"
              :cell-style="TableCellStyle"
              :data="
                storeList
                  ? storeList.slice(0, Math.ceil(storeList.length / 2))
                  : []
              "
              border
              fit
              highlight-current-row
            >
              <el-table-column
                align="center"
                label="分店"
              >
                <template slot-scope="{ row }">
                  <span>{{ row.shop_id + " " + row.shop_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="订购量"
                min-width="50"
              >
                <template slot-scope="{ row }">
                  <span>{{
                    (row.order_num || "") + " " + (row.order_unit || "")
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-table
              :header-cell-style="TableHeaderStyle"
              :cell-style="TableCellStyle"
              :data="
                storeList
                  ? storeList.slice(Math.ceil(storeList.length / 2))
                  : []
              "
              border
              fit
              highlight-current-row
            >
              <el-table-column
                align="center"
                label="分店"
              >
                <template slot-scope="{ row }">
                  <span>{{ row.shop_id + " " + row.shop_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="订购量"
                min-width="50"
              >
                <template slot-scope="{ row }">
                  <span>{{
                    (row.order_num || "") + " " + (row.order_unit || "")
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="padding: 8px 20px"
        >
          <el-col :span="12">
            <span>{{ "货 品：" + temp.goods_name }}</span>
          </el-col>
          <el-col :span="12">
            <span>{{ "单 价：" + temp.buy_goods_price || "" }}</span>
          </el-col>
          <el-col :span="12">
            <span>{{ "总数量：" + temp.order_goods_num }}</span>
          </el-col>
          <el-col :span="12">
            <span>{{ "总金额：" + temp.total_money || "" }}</span>
          </el-col>
          <el-col :span="24">
            {{ temp.start_time }}
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchSingle,
  createSingle,
  updateSingle,
  delSingle,
  assignSingle,
  fetchAllbuyer,
  fetchScheme,
  finishSingle,
  setInvalidSingle
} from '@/api/single'
import { parseTime, resetPagination } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchProvider } from '@/api/provider'
import { fetchStore } from '@/api/store'
import html2canvas from 'html2canvas'

export default {
  name: 'SinglePage',
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      scheme: null, // 方案列表
      assignmentDialogVisible: false,
      imageWrapperDialogVisible: false,
      assignmentList: null,
      assignmentListLoading: false,
      commentTextArea: '',
      tableSettingsDrawerVisible: false,
      formDrawerVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      requestLoading: false,
      downloadLoading: false,
      timer: null,
      tableKey: 0,
      providerList: null,
      storeList: null,
      list: null,
      total: 0,
      listLoading: true,
      del_dialog_visible: false,
      tableSettingDialog: false,
      value: null,
      listQuery: {
        page: 1,
        limit: 20,
        history: 'false',
        search: undefined,
        timeBegin: undefined,
        timeEnd: undefined,
        supplier: undefined,
        sort: '+id' // 升序排序
      },
      temp: {
        single_order_id: undefined,
        start_time: null, // 日期
        goods_id: undefined,
        goods_type: '',
        goods_name: '', // 货品名称
        manager: '', // 采购经理
        buyer_username: '', // 采购员
        name: '', // 采购员
        supplier_id: '', // 采购商
        supplier_name: '', // 采购商
        buy_goods_num: '', // 采购数量
        order_goods_num: '', // 订购数量
        buy_goods_price: '', // 成交单价
        total_money: '', // 总额
        buy_status: '', // 进度
        buyer_note: '', // 备注
        manager_note: '', // 备注
        rec_unit: '', // 订购单位
        sellUnit: '', // 销售单位
        buy_goods_unit: '', // 采购单位
        goods_order: '' // 分配表
      },
      sortOptions: [
        { label: '按单号升序', key: '+id' },
        { label: '按单号降序', key: '-id' }
      ],
      historyOptions: [
        { label: '历史采购单', key: 'true' },
        { label: '未完成采购单', key: 'false' }
      ],
      TableCellStyle: { padding: '2px 0' },
      TableHeaderStyle: { padding: '1px 0' },
      unit_options: [
        {
          value: 'half_kilo',
          label: '斤'
        },
        {
          value: 'kilo',
          label: '公斤'
        },
        {
          value: 'piece',
          label: '件'
        }
      ],
      textMap: {
        update: '管理单品采购单',
        create: '添加单品采购单'
      },
      rules: {
        total_money: [
          {
            validator: (rule, value, callback) => {
              if (value < 0) callback(new Error('总金额不能为负'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        buy_goods_num: [
          {
            validator: (rule, value, callback) => {
              if (value < 0) callback(new Error('总采购数量不能为负'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        goods_order: [
          {
            validator: (rule, value, callback) => {
              // var total = 0;
              for (const item of value) {
                if (item.buy_num < 0) {
                  callback(new Error('采购数量不能为负'))
                }
                // total += Number(item.buy_num);
              }
              // if (Number(this.temp.buy_goods_num) !== total)
              //   callback(new Error("总采购量与分店采购量之和不符"));
              callback()
            },
            trigger: 'commit'
          }
        ]
      },
      showSettings: {
        showId: true,
        showTime: true,
        showTitle: true,
        showManager: true,
        showBuyer: true,
        showProvider: true,
        showStatus: true,
        showAction: true
      }
    }
  },
  computed: {
    device() {
      // mobile or desktop
      return this.$store.state.app.device
    },
    userInfo() {
      return {
        name: this.$store.getters.name,
        affiliation: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0]
      }
    },
    tableSettingsDrawerSize() {
      if (this.device === 'mobile') {
        return '60%'
      } else {
        return '25%'
      }
    },
    haveAssign() {
      if (this.temp.status === '订单已生成，等待发布') {
        return false
      } else {
        return true
      }
    },
    labelPosition() {
      if (this.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    assignmentDialogWidth() {
      if (this.device === 'mobile') {
        return '90%'
      } else {
        return '40%'
      }
    }
  },
  created() {
    // 钩子函数
    this.getList()
    this.getBuyList()
    this.getProviderList()
    this.getScheme()
    this.getShopList()
    if (!window.sessionStorage.getItem('single')) {
      this.setShowSettings()
    } else {
      this.showSettings = JSON.parse(
        window.sessionStorage.getItem('single')
      )
    }
  },
  mounted() {
    resetPagination()
  },
  methods: {
    setShowSettings() {
      window.sessionStorage.setItem(
        'single',
        JSON.stringify(this.showSettings)
      )
    },
    getList() {
      this.listLoading = true
      fetchSingle(this.listQuery).then((res) => {
        this.list = res.data
        this.total = res.total
        this.listLoading = false
      })
    },
    getBuyList() {
      if (!this.buyerList && this.userInfo.role === 'manager') {
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
    getProviderList() {
      if (!this.providerList) {
        fetchProvider({
          limit: 99999
        }).then((res) => {
          this.providerList = res.data
        })
      }
    },
    getShopList() {
      if (!this.storeList) {
        fetchStore({
          limit: 99999
        }).then((res) => {
          this.storeList = res.data
        })
      }
    },
    getScheme() {
      // get 分配方案
      if (!this.scheme && this.userInfo.role === 'manager') {
        fetchScheme({
          limit: 99999
        }).then((res) => {
          this.scheme = res.data
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        single_order_id: undefined,
        start_time: null, // 日期
        goods_id: undefined,
        goods_type: '',
        goods_name: '', // 货品名称
        manager: '', // 采购经理
        buyer_username: '', // 采购员
        name: '', // 采购员
        supplier_id: '', // 采购商
        supplier_name: '', // 采购商
        buy_goods_num: '', // 采购数量
        order_goods_num: '', // 订购数量
        buy_goods_price: '', // 成交单价
        total_money: '', // 总额
        buy_status: '', // 进度
        buyer_note: '', // 备注
        manager_note: '', // 备注
        rec_unit: '', // 订购单位
        sellUnit: '', // 销售单位
        buy_goods_unit: '', // 采购单位
        goods_order: '' // 表
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
          createSingle(this.temp).then((res) => {
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
              this.$notify({
                title: '成功',
                message: '采购单创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '采购单创建失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      // deep copy obj
      const goods_order = []
      row.goods_order.forEach((item) => {
        goods_order.push(Object.assign({}, item))
      })
      this.temp = Object.assign({}, row, { goods_order })
      //
      if (this.temp.buy_goods_num <= 0) {
        this.temp.buy_goods_num = this.temp.order_goods_num
        this.temp.goods_order.forEach((v) => {
          v.buy_num = v.order_num
        })
      }
      //
      this.storeList.forEach((i) => {
        i.order_num = ''
        i.order_unit = ''
      })
      this.temp.goods_order.forEach((v) => {
        this.storeList.forEach((j) => {
          if (j.shop_id === v.shop_id) {
            if (typeof j.order_num === 'number') j.order_num += v.order_num
            else j.order_num = v.order_num
            j.order_unit = v.order_unit
          }
        })
      })
      //
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
          tempData.buy_goods_num = Number(tempData.buy_goods_num)
          tempData.total_money = Number(tempData.total_money)
          updateSingle(tempData).then((res) => {
            if (res.status === 'success') {
              // 修改id
              const index = this.list.findIndex(
                (v) => v.single_order_id === this.temp.single_order_id
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
                title: '成功',
                message: '采购单修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.requestLoading = false
              this.$notify({
                title: '失败',
                message: res.msg || '采购单修改失败,原因未知',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      // 这里要修改id名
      const params = { single_order_id: row.single_order_id } // 删除单号为id的订购单
      delSingle(params).then((res) => {
        if (res.status === 'success') {
          this.$notify({
            title: '成功',
            message: '采购单删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '采购单删除失败,原因未知',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleFinish(row, index) {
      const params = { single_order_id: row.single_order_id }
      finishSingle(params).then((res) => {
        if (res.status === 'success') {
          this.getList()
          this.$notify({
            title: '成功',
            message: '采购单确认完成',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '采购单确认完成失败,原因未知',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleSetInvalid(row, index) {
      const params = { single_order_id: row.single_order_id }
      setInvalidSingle(params).then((res) => {
        if (res.status === 'success') {
          this.getList()
          this.$notify({
            title: '成功',
            message: '采购单已被作废',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '采购单未能作废',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handlePrint() {
      window.pageYoffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.imageWrapperDialogVisible = true
      setTimeout((v) => {
        html2canvas(this.$refs.imageWrapper).then((canvas) => {
          var a = document.createElement('a')
          a.href = canvas.toDataURL('image/png')
          a.download = '单品采购单'
          a.click()
          this.imageWrapperDialogVisible = false
        })
      }, 600)
    },
    handleSchemeSelect: function(item) {
      this.assignmentList.forEach((j) => (j.buyer_username = ''))
      item.buy_plan_buyer.forEach((i) => {
        this.assignmentList.forEach((j) => {
          // delete j.buyer_username
          if (j.goods_id === i.goods_id) {
            j.buyer_username = i.buyer_username
          }
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
    tableItemDel(row, index) {
      this.temp.table.splice(index, 1)
    },
    computePrice(value) {
      if (this.temp.buy_goods_num && this.temp.total_money) {
        this.temp.buy_goods_price =
          this.temp.total_money / this.temp.buy_goods_num
      } else {
        this.temp.buy_goods_price = null
      }
    },
    handleAssign() {
      assignSingle(this.assignmentList).then((res) => {
        if (res.status === 'success') {
          this.assignmentDialogVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '分配成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.msg || '分配失败,原因未知',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    openAssignmentDialog() {
      this.assignmentDialogVisible = true
      this.assignmentListLoading = true
      fetchSingle({
        limit: 999999
      }).then((res) => {
        this.assignmentList = []
        res.data.forEach((item) => {
          if (!item.buyer_username) {
            this.assignmentList.push({
              goods_id: item.goods_id,
              goods_name: item.goods_name,
              single_order_id: item.single_order_id,
              buyer_username: item.buyer_username
            })
          }
        })
        this.assignmentListLoading = false
      })
    },
    providerSelected(value) {
      this.temp.supplier_name = this.providerList.find(
        (v) => v.id === value
      ).supplier_name
    },
    buy_goods_unitChange(value) {
      this.temp.goods_order.forEach((v) => {
        v.buy_unit = value
      })
    },
    openConfirmMsgBox(msg, row, index) {
      let boxMsg = ''
      if (msg === 'delete') {
        boxMsg = '此操作将永久删除该记录, 是否继续?'
      } else if (msg === 'finish') {
        boxMsg = '此操作将确认该采购单已经完成, 是否继续?'
      } else if (msg === 'invalid') {
        boxMsg = '此操作将作废该采购单, 是否继续?'
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
          } else if (msg === 'finish') {
            this.handleFinish(row, index)
          } else if (msg === 'invalid') {
            this.handleSetInvalid(row, index)
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
