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
          v-model="listQuery.order_type"
          class="filter-item margin-l-10"
          style="max-width: 220px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-row>
      <el-row class="search" type="flex" justify="center">
        <div class="filter-item" style="min-width: 115px; width: 100%">
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
          v-if="userInfo.role === 'shop'"
          class="filter-item margin-l-10"
          style="min-width: 85px"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          添加
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
          icon="el-icon-tickets"
          :disabled="userInfo.role !== 'manager'"
          @click="makeSingleDialogVisible = true"
        >
          生成单品采购单
        </el-button>
      </el-row>
      <el-row class="search" type="flex" justify="center">
        <el-input
          v-model.trim="listQuery.search"
          placeholder="搜索..."
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          style="min-width: 85px"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          class="filter-item margin-l-10"
          style="min-width: 85px"
          type="primary"
          icon="el-icon-setting"
          @click="tableSettingsDrawerVisible = true"
        >
          设置
        </el-button>
      </el-row>
    </div>
    <div v-else class="filter-container">
      <el-row class="search" type="flex" justify="center">
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
          v-model="listQuery.order_type"
          class="filter-item margin-l-10"
          style="max-width: 220px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <div class="filter-item margin-l-10" style="min-width: 120px">
          <el-date-picker
            v-model="listQuery.timeBegin"
            align="right"
            type="date"
            placeholder="起始日期"
            :disabled="listQuery.history === 'false'"
            @change="handleFilter"
          />
        </div>
        <div class="filter-item margin-l-10" style="min-width: 120px">
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
          v-if="userInfo.role === 'shop'"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
          :disabled="userInfo.role !== 'shop'"
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
        <el-button
          v-if="userInfo.role === 'manager'"
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-tickets"
          :disabled="userInfo.role !== 'manager'"
          @click="makeSingleDialogVisible = true"
        >
          生成单品采购单
        </el-button>
        <el-input
          v-model.trim="listQuery.search"
          placeholder="搜索..."
          class="filter-item margin-l-10"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item margin-l-10"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-row>
    </div>

    <!-- 生成单品采购单 -->
    <el-dialog
      title="生成单品采购单"
      :visible.sync="makeSingleDialogVisible"
      width="250px"
      center
    >
      <span>是否将当前已通过审批的订购单生成单品采购单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="makeSingleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toMakeSingle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
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
        prop="order_id"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTitle']"
        label="分店"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.shop_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showOrderType']"
        label="订单类型"
        prop="order_type"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.order_type || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTime']"
        label="日期"
        align="center"
      >
        <template slot-scope="{ row }">
          <!-- <span>{{ row.start_time | parseTime('{y}-{m}-{d}') }}</span> -->
          <span>{{ row.start_time.split(" ")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showSubmitter']"
        label="上报人"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.principal }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showStatus']"
        label="当前进度"
        align="center"
      >
        <template slot-scope="{ row }">
          <span> {{ row.order_status }} </span>
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
            v-if="
              row.order_status === '等待审批' && userInfo.role === 'manager'
            "
            class="margin-l-10 margin-top-6"
            size="mini"
            type="danger"
            @click="openConfirmMsgBox('approve', row, $index)"
            >批准</el-button
          >
          <el-button
            v-if="userInfo.role === 'shop' && row.order_status === '采购中'"
            class="margin-l-10 margin-top-6"
            size="mini"
            type="danger"
            @click="openConfirmMsgBox('finish', row, $index)"
            >完成</el-button
          >
          <el-button
            class="margin-l-10 margin-top-6"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
            >{{
              row.order_status === "货品送达，订单完成" ? "查看" : "编辑"
            }}</el-button
          >
          <el-button
            class="margin-l-10 margin-top-6"
            type="success"
            size="mini"
            @click="handlePrint(row)"
            >打印</el-button
          >
          <el-button
            v-if="row.order_status === '等待审批'"
            class="margin-l-10 margin-top-6"
            size="mini"
            type="danger"
            @click="openConfirmMsgBox('delete', row, $index)"
            >删除</el-button
          >
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

    <!-- 抽屉 -->
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
              v-if="dialogStatus === 'update'"
              label="单号"
              prop="order_id"
            >
              <span> {{ temp.order_id || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="分店名称"
              prop="shop_name"
            >
              <span> {{ temp.shop_name || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="日期"
              prop="start_time"
            >
              <span> {{ temp.start_time || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="上报人"
              prop="principal"
            >
              <span> {{ temp.principal || "暂无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="当前进度"
              prop="order_status"
            >
              <span> {{ temp.order_status || "暂无" }} </span>
            </el-form-item>
            <el-form-item label="采购详情" prop="goods_order">
              <el-select
                v-if="dialogStatus === 'create'"
                value="方案选择"
                style="width: 100%"
                placeholder="选择一个方案"
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
                :data="temp.goods_order"
                border
                fit
                highlight-current-row
              >
                <el-table-column
                  v-if="!(temp.approved === 0 || temp.approved === 1)"
                  align="center"
                  label="编号"
                  width="70"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.goods_id }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="品名" min-width="115">
                  <template slot-scope="{ row, $index }">
                    <el-row type="flex" justify="center">
                      <span v-if="temp.approved === 0 || temp.approved === 1">
                        {{ "(" + row.goods_id + ")" + row.goods_name }}
                      </span>
                      <el-autocomplete
                        v-else
                        v-model.trim="row.goods_name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入货品"
                        :disabled="
                          row.approved === 0 ||
                          row.approved === 1 ||
                          row.goods_id !== ''
                        "
                        @select="handleSelect"
                      />
                      <el-button
                        v-if="!(temp.approved === 0 || temp.approved === 1)"
                        size="mini"
                        type="danger"
                        @click="tableItemDel(row, $index)"
                        style="padding: 2px 4px; margin-left: 4px"
                        icon="el-icon-circle-close"
                      ></el-button>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="订购量"
                  :min-width="
                    temp.approved === 0 || temp.approved === 1 ? 80 : 115
                  "
                >
                  <template slot-scope="{ row }">
                    <span v-if="temp.approved === 0 || temp.approved === 1">
                      {{ row.order_num + " " + row.order_unit }}
                    </span>
                    <el-input
                      v-else
                      v-model.trim="row.order_num"
                      pattern="[0-9]*"
                      type="number"
                      placeholder="0"
                      onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                      onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                      :disabled="row.approved === 0 || row.approved === 1"
                    >
                      <template slot="append">{{ row.order_unit }}</template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="temp.approved === 0 || temp.approved === 1"
                  align="center"
                  label="采购量"
                  min-width="80"
                >
                  <template slot-scope="{ row }">
                    <!-- <el-input v-model="row.buy_num"
                          type="number"
                          placeholder="0"
                          :disabled="userInfo.role !== 'buyer'">
                  <template slot="append">{{ row.buy_unit }}</template>
                </el-input> -->
                    <span>{{
                      (row.buy_num || "") + " " + (row.buy_unit || "")
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="temp.approved === 0 || temp.approved === 1"
                  align="center"
                  label="单价"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.goods_price + " 元" }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="dialogStatus === 'create'" style="text-align: right">
                <el-button
                  class="margin-top-6"
                  type="primary"
                  @click="tableItemAdd"
                >
                  添加
                </el-button>
              </div>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="经理备注"
              prop="manager_note"
            >
              <el-input
                v-if="userInfo.role === 'manager'"
                v-model="temp.manager_note"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                placeholder="输入备注..."
              />
              <span v-else> {{ temp.manager_note || "无" }} </span>
            </el-form-item>
            <el-form-item
              v-if="dialogStatus === 'update'"
              label="分店备注"
              prop="shop_note"
            >
              <el-input
                v-if="userInfo.role === 'shop'"
                v-model="temp.shop_note"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                placeholder="输入备注..."
              />
              <span v-else> {{ temp.shop_note || "无" }} </span>
            </el-form-item>
          </el-form>
        </div>
        <div class="formDrawer-footer">
          <el-row type="flex" justify="center">
            <el-button @click="cancelForm">{{
              temp.order_status === "货品送达，订单完成" ? "关 闭" : "取 消"
            }}</el-button>
            <el-button
              v-if="temp.order_status !== '货品送达，订单完成'"
              :loading="requestLoading"
              type="primary"
              @click="$refs.drawer.closeDrawer()"
              >{{ requestLoading ? "提交中 ..." : "确 定" }}</el-button
            >
          </el-row>
        </div>
      </div>
    </el-drawer>
    <!-- 模态框 -->
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
          v-if="dialogStatus === 'update'"
          label="单号"
          prop="order_id"
        >
          <span> {{ temp.order_id || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="分店名称"
          prop="shop_name"
        >
          <span> {{ temp.shop_name || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="日期"
          prop="start_time"
        >
          <span> {{ temp.start_time || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="上报人"
          prop="principal"
        >
          <span> {{ temp.principal || "暂无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="当前进度"
          prop="order_status"
        >
          <span> {{ temp.order_status || "暂无" }} </span>
        </el-form-item>
        <el-form-item label="采购详情" prop="goods_order">
          <el-select
            v-if="dialogStatus === 'create'"
            value="方案选择"
            style="width: 100%"
            placeholder="选择一个方案"
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
            :data="temp.goods_order"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              v-if="!(temp.approved === 0 || temp.approved === 1)"
              align="center"
              label="编号"
              width="70"
            >
              <template slot-scope="{ row }">
                <span>{{ row.goods_id }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="品名" min-width="115">
              <template slot-scope="{ row, $index }">
                <el-row type="flex" justify="center">
                  <span v-if="temp.approved === 0 || temp.approved === 1">
                    {{ "(" + row.goods_id + ")" + row.goods_name }}
                  </span>
                  <el-autocomplete
                    v-else
                    v-model.trim="row.goods_name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入货品"
                    :disabled="
                      row.approved === 0 ||
                      row.approved === 1 ||
                      row.goods_id !== ''
                    "
                    @select="handleSelect"
                  />
                  <el-button
                    v-if="!(temp.approved === 0 || temp.approved === 1)"
                    size="mini"
                    type="danger"
                    @click="tableItemDel(row, $index)"
                    style="padding: 2px 4px; margin-left: 4px"
                    icon="el-icon-circle-close"
                  ></el-button>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="订购量"
              :min-width="temp.approved === 0 || temp.approved === 1 ? 80 : 115"
            >
              <template slot-scope="{ row }">
                <span v-if="temp.approved === 0 || temp.approved === 1">
                  {{ row.order_num + " " + row.order_unit }}
                </span>
                <el-input
                  v-else
                  v-model.trim="row.order_num"
                  pattern="[0-9]*"
                  type="number"
                  placeholder="0"
                  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  :disabled="row.approved === 0 || row.approved === 1"
                >
                  <template slot="append">{{ row.order_unit }}</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              v-if="temp.approved === 0 || temp.approved === 1"
              align="center"
              label="采购量"
              min-width="70"
            >
              <template slot-scope="{ row }">
                <!-- <el-input v-model="row.buy_num"
                          type="number"
                          placeholder="0"
                          :disabled="userInfo.role !== 'buyer'">
                  <template slot="append">{{ row.buy_unit }}</template>
                </el-input> -->
                <span>{{
                  (row.buy_num || "") + " " + (row.buy_unit || "")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="temp.approved === 0 || temp.approved === 1"
              align="center"
              label="单价"
            >
              <template slot-scope="{ row }">
                <span>{{ row.goods_price + " 元" }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="dialogStatus === 'create'" style="text-align: right">
            <el-button
              class="margin-top-6"
              type="primary"
              @click="tableItemAdd"
            >
              添加
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="经理备注"
          prop="manager_note"
        >
          <el-input
            v-if="userInfo.role === 'manager'"
            v-model="temp.manager_note"
            :autosize="{ minRows: 3, maxRows: 4 }"
            type="textarea"
            placeholder="输入备注..."
          />
          <span v-else> {{ temp.manager_note || "无" }} </span>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="分店备注"
          prop="shop_note"
        >
          <el-input
            v-if="userInfo.role === 'shop'"
            v-model="temp.shop_note"
            :autosize="{ minRows: 3, maxRows: 4 }"
            type="textarea"
            placeholder="输入备注..."
          />
          <span v-else> {{ temp.shop_note || "无" }} </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">{{
          temp.order_status === "货品送达，订单完成" ? "关 闭" : "取 消"
        }}</el-button>
        <el-button
          v-if="temp.order_status !== '货品送达，订单完成'"
          :loading="requestLoading"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >{{ requestLoading ? "提交中 ..." : "确 定" }}</el-button
        >
      </div>
    </el-dialog>

    <el-drawer
      title="表格设置"
      :visible.sync="tableSettingsDrawerVisible"
      direction="ltr"
      :with-header="false"
      :size="tableSettingsDrawerSize"
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
            @change="tableKey = tableKey + 1"
          >
            单号
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTitle']"
            border
            class="filter-item margin-l-0"
            @change="tableKey = tableKey + 1"
          >
            店名
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTime']"
            border
            class="filter-item margin-l-0"
            @change="tableKey = tableKey + 1"
          >
            日期
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showSubmitter']"
            border
            class="filter-item margin-l-0"
            @change="tableKey = tableKey + 1"
          >
            上报人
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showStatus']"
            border
            class="filter-item margin-l-0"
            @change="tableKey = tableKey + 1"
          >
            当前进度
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showAction']"
            border
            class="filter-item margin-l-0"
            @change="tableKey = tableKey + 1"
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
  fetchBranch,
  printBranch,
  updateBranch,
  createBranch,
  delBranch,
  fetchScheme,
  makeSingle,
  approveBranch,
  finishBranch,
} from "@/api/branch";
import { fetchCommodity } from "@/api/commodity";
import waves from "@/directive/waves"; // waves directive
import { parseTime, resetPagination } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "BranchPage",
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime,
  },
  data() {
    return {
      scheme: null, // 方案列表
      tableSettingsDrawerVisible: false,
      makeSingleDialogVisible: false,
      formDrawerVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      requestLoading: false,
      downloadLoading: false,
      timer: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        history: "false",
        timeBegin: undefined,
        timeEnd: undefined,
        sort: "+id", // 升序排序
        search: "",
        order_type: "",
      },
      temp: {},
      TableCellStyle: { padding: "2px 0" },
      TableHeaderStyle: { padding: "1px 0" },
      sortOptions: [
        { label: "按单号升序", key: "+id" },
        { label: "按单号降序", key: "-id" },
      ],
      typeOptions: [
        { label: "水果类订单", key: "水果类订单" },
        { label: "蔬菜类订单", key: "蔬菜类订单" },
        { label: "冷冻品订单", key: "冷冻品订单" },
        { label: "混合类订单", key: "混合类订单" },
      ],
      historyOptions: [
        { label: "历史订购单", key: "true" },
        { label: "未完成订购单", key: "false" },
      ],
      textMap: {
        update: "管理分店订购单",
        create: "添加分店订购单",
      },
      rules: {
        goods_order: [
          {
            validator: (rule, value, callback) => {
              for (const item of value) {
                if (!item.goods_name || !item.goods_id) {
                  callback(new Error("请将方案表填写完整"));
                }
                if (item.order_num <= 0) {
                  callback(new Error("订购数量需大于0"));
                }
              }
              callback();
            },
            trigger: "commit",
          },
        ],
      }, // 表单验证的规则
    };
  },
  computed: {
    device() {
      // mobile or desktop
      return this.$store.state.app.device;
    },
    userInfo() {
      return {
        name: this.$store.getters.name,
        affiliation: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0],
      };
    },
    showSettings() {
      const i = {
        showId: true,
        showTitle: true,
        showTime: true,
        showSubmitter: true,
        showStatus: true,
        showAction: true,
        showOrderType: true,
      };
      if (this.device === "mobile") {
        i.showId = false;
        i.showSubmitter = false;
        i.showTime = false;
      }
      return i;
    },
    tableSettingsDrawerSize() {
      if (this.device === "mobile") {
        return "60%";
      } else {
        return "25%";
      }
    },
    haveApproved() {
      if (
        this.temp.order_status === "等待审批" ||
        this.temp.order_status === "正在创建订购单"
      ) {
        return false;
      } else {
        return true;
      }
    },
    labelPosition() {
      if (this.device === "mobile") {
        return "top";
      } else {
        return "left";
      }
    },
  },
  created() {
    this.resetTemp();
    this.getList();
    this.getScheme();
  },
  mounted() {
    resetPagination();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchBranch(this.listQuery).then((res) => {
        this.list = res.data;
        this.total = res.total;
        this.listLoading = false;
      });
    },
    getScheme() {
      // get 订购方案
      if (!this.scheme && this.userInfo.role == "shop") {
        fetchScheme({
          limit: 99999,
        }).then((res) => {
          this.scheme = res.data;
        });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        order_id: undefined,
        shop_name: "", // 分店名
        start_time: "", // 时间戳
        principal: "", // 上报人
        manager_note: "", //备注
        shop_note: "", //备注
        order_status: "", // 进度
        goods_order: [], // 分店的采购表
        order_type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.temp.submitter = this.userInfo.name;
      this.temp.title = this.userInfo.affiliation.title;
      this.temp.time = parseTime(new Date());
      this.temp.status = "正在创建订购单";
      if (this.device === "desktop") {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      } else {
        this.formDrawerVisible = true;
      }
    },
    createData(done) {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.requestLoading) {
            return;
          }
          this.requestLoading = true;
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createBranch(this.temp).then((res) => {
            if (res.status === "success") {
              if (this.device === "mobile") {
                done();
              } else {
                this.dialogFormVisible = false;
              }
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false;
              }, 400);
              // this.list.unshift(this.temp)
              this.getList();
              this.$notify({
                title: "成功",
                message: "订购单创建成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "订购单创建失败,原因未知",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      // deep copy obj
      const goods_order = [];
      row.goods_order.forEach((item) => {
        goods_order.push(Object.assign({}, item));
      });
      this.temp = Object.assign({}, row, { goods_order });

      this.dialogStatus = "update";
      if (this.device === "desktop") {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      } else {
        this.formDrawerVisible = true;
      }
    },
    updateData(done) {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.requestLoading) {
            return;
          }
          this.requestLoading = true;
          const tempData = Object.assign({}, this.temp);
          // tempData.time = +new Date(tempData.time)
          // tempData.goods_order = Object.assign({}, this.temp.goods_order)
          updateBranch(tempData).then((res) => {
            if (res.status === "success") {
              // this.getList()
              const index = this.list.findIndex(
                (v) => v.order_id === this.temp.order_id
              );
              this.list.splice(index, 1, this.temp);
              if (this.device === "mobile") {
                done();
              } else {
                this.dialogFormVisible = false;
              }
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false;
              }, 400);
              this.$notify({
                title: "成功",
                message: "订购单修改成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "订购单修改失败,原因未知",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      const params = { order_id: row.order_id }; // 删除单号为id的分店订购单
      delBranch(params).then((res) => {
        if (res.status === "success") {
          this.$notify({
            title: "成功",
            message: "订购单删除成功",
            type: "success",
            duration: 2000,
          });
          this.list.splice(index, 1);
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "订购单删除失败,原因未知",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    handleApprove(row, index) {
      const params = [{ order_id: row.order_id, approved: 0 }]; // 批准单号为order_id的分店订购单
      approveBranch(params).then((res) => {
        if (res.status === "success") {
          this.$notify({
            title: "成功",
            message: "订购单批准成功",
            type: "success",
            duration: 2000,
          });
          this.getList(); // bug
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "订购单批准失败,原因未知",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    handleFinish(row, index) {
      const params = { order_id: row.order_id };
      finishBranch(params).then((res) => {
        if (res.status === "success") {
          this.getList();
          this.$notify({
            title: "成功",
            message: "订购单确认完成",
            type: "success",
            duration: 2000,
          });
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "订购单确认完成失败,原因未知",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    handlePrint(row, index) {
      if (this.device === "mobile") {
        this.$notify({
          title: "失败",
          message: "移动端不支持该操作，请在电脑端打印",
          type: "error",
          duration: 2000,
        });
        return;
      }
      const params = { order_id: row.order_id };
      printBranch(params).then((res) => {
        const { data, headers } = res;
        const fileName = headers["content-disposition"].replace(
          /\w+;filename=(.*)/,
          "$1"
        );
        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
        //const blob = new Blob([JSON.stringify(data)], ...)
        const blob = new Blob([data], { type: headers["content-type"] });
        let dom = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        dom.href = url;
        dom.download = decodeURI(fileName);
        dom.style.display = "none";
        document.body.appendChild(dom);
        dom.click();
        dom.parentNode.removeChild(dom);
        window.URL.revokeObjectURL(url);
      });
    },
    handleSchemeSelect: function (item) {
      this.temp.goods_order = [];
      item.order_goods.forEach((i) => {
        this.temp.goods_order.push(Object.assign({}, i));
      });
    },
    cancelForm() {
      this.requestLoading = false;
      this.dialogFormVisible = false;
      this.formDrawerVisible = false;
      clearTimeout(this.timer);
    },
    formDrawerOpen() {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        fetchCommodity({
          limit: 9999999,
          search: queryString,
          sort: "+goods_id",
        }).then((res) => {
          const commodities = res.data;
          // 物品已经有了订购 就不显示出来
          const results = queryString
            ? commodities.filter(
                (v) =>
                  this.temp.goods_order.findIndex(
                    (i) => i.goods_id === v.goods_id
                  ) < 0
              )
            : commodities;
          for (const item of results) {
            item["value"] = item.goods_name;
            item["order_num"] = 0;
          }
          cb(results);
        });
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.title.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.temp.goods_order.splice(this.temp.goods_order.length - 1, 1, item);
    },
    tableItemDel(row, index) {
      this.temp.goods_order.splice(index, 1);
    },
    tableItemAdd() {
      this.temp.goods_order.push({
        goods_id: "",
        goods_name: "",
        order_num: "",
        order_unit: "",
      });
    },
    toMakeSingle() {
      makeSingle({}).then((res) => {
        if (res.status === "success") {
          this.makeSingleDialogVisible = false;
          this.getList();
          this.$notify({
            title: "成功",
            message: "单品采购单已生成",
            type: "success",
            duration: 2000,
          });
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "单品采购单生成失败,原因未知",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    openConfirmMsgBox(msg, row, index) {
      let boxMsg = "";
      if (msg === "delete") {
        boxMsg = "此操作将永久删除该记录, 是否继续?";
      } else if (msg === "approve") {
        boxMsg = "此操作将批准该订购单, 批准后订单无法修改和删除，是否继续?";
      } else if (msg === "finish") {
        boxMsg =
          "请确保分店已经收到货品，此操作将确认该订购单已经完成, 是否继续?";
      }
      this.$confirm(boxMsg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          if (msg === "delete") {
            this.handleDelete(row, index);
          } else if (msg === "approve") {
            this.handleApprove(row, index);
          } else if (msg === "finish") {
            this.handleFinish(row, index);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>

<style scoped>
/* local styles */
</style>
