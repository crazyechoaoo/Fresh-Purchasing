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
      <el-row class="search" type="flex" justify="center">
        <el-input
          v-model.trim="listQuery.search"
          placeholder="搜索..."
          class="filter-item"
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
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.shop_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showTitle']"
        label="名称"
        min-width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.shop_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showPhone']"
        label="电话"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.shop_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSettings['showAddress']"
        label="地址"
        align="center"
        min-width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.shop_position }}</span>
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
            <el-form-item label="名称" prop="shop_name">
              <el-input v-model.trim="temp.shop_name" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input
                type="number"
                pattern="[0-9]*"
                v-model.trim="temp.shop_phone"
              />
            </el-form-item>
            <el-form-item label="地址" prop="desc">
              <el-input v-model="temp.shop_position" />
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
        label-width="70px"
        hide-required-asterisk
        class="pageForm"
      >
        <el-form-item label="名称" prop="shop_name">
          <el-input v-model.trim="temp.shop_name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            type="number"
            pattern="[0-9]*"
            v-model.trim="temp.shop_phone"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.shop_position" />
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
            style="margin-left: 10px"
          >
            编号
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showTitle']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            店名
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showPhone']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            电话
          </el-checkbox>
          <el-checkbox
            v-model="showSettings['showAddress']"
            border
            class="filter-item"
            style="margin-left: 10px"
          >
            地址
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
  </div>
</template>

<script>
import { fetchStore, createStore, updateStore, delStore } from "@/api/store";
import waves from "@/directive/waves"; // waves directive
import { parseTime, resetPagination } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "StorePage",
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime,
  },
  data() {
    return {
      tableSettingsDrawerVisible: false,
      formDrawerVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      requestLoading: false,
      timer: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined,
        sort: "+shop_id", // 升序排序
      },
      temp: {
        shop_id: undefined,
        shop_name: "", // 分店名称
        shop_phone: "", // 分店电话
        shop_position: "", // 分店地址
      },
      sortOptions: [
        { label: "按编号升序", key: "+shop_id" },
        { label: "按编号降序", key: "-shop_id" },
      ],
      textMap: {
        update: "编辑分店",
        create: "添加分店",
      },
      rules: {
        title: [{ required: true, message: "店名不能为空", trigger: "blur" }],
      },
      showSettings: {
        showId: true,
        showTitle: true,
        showPhone: true,
        showAddress: true,
        showAction: true,
      },
    };
  },
  computed: {
    userInfo() {
      return {
        name: this.$store.getters.name,
        affiliation: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0],
      };
    },
    isPermit() {
      // 是否允许增删改
      if (this.userInfo.role === "admin" || this.userInfo.role === "manager") {
        return true;
      } else {
        return false;
      }
    },
    device() {
      // mobile or desktop
      return this.$store.state.app.device;
    },
    tableSettingsDrawerSize() {
      if (this.device === "mobile") {
        return "60%";
      } else {
        return "25%";
      }
    },
  },
  created() {
    // 钩子函数
    this.getList();
    if (!window.sessionStorage.getItem("store")) {
      this.setShowSettings();
    } else {
      this.showSettings = JSON.parse(
        window.sessionStorage.getItem("store")
      );
    }
  },
  mounted() {
    resetPagination();
  },
  methods: {
    setShowSettings() {
      window.sessionStorage.setItem(
        "store",
        JSON.stringify(this.showSettings)
      );
    },
    getList() {
      this.listLoading = true;
      fetchStore(this.listQuery).then((res) => {
        this.list = res.data;
        this.total = res.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        shop_id: undefined,
        shop_name: "", // 分店名称
        shop_phone: "", // 分店电话
        shop_position: "", // 分店地址
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
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
          createStore(this.temp).then((res) => {
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
              this.getList();
              // this.list.unshift(this.temp)
              this.$notify({
                title: "成功",
                message: "分店创建成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "分店创建失败,原因未知",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
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
          updateStore(tempData).then((res) => {
            if (res.status === "success") {
              const index = this.list.findIndex(
                (v) => v.shop_id === this.temp.shop_id
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
                message: "分店信息修改成功！",
                type: "success",
                duration: 2000,
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "分店信息更新失败,原因未知",
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      const params = { shop_id: row.shop_id };
      delStore(params).then((res) => {
        if (res.status === "success") {
          this.$notify({
            title: "成功",
            message: "分店删除成功",
            type: "success",
            duration: 2000,
          });
          this.list.splice(index, 1);
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "分店删除失败,原因未知",
            type: "error",
            duration: 2000,
          });
        }
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
    openConfirmMsgBox(msg, row, index) {
      let boxMsg = "";
      if (msg === "delete") {
        boxMsg = "此操作将永久删除该记录, 是否继续?";
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
