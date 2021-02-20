<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row class="search"
              type="flex"
              justify="center">
        <el-select v-model="listQuery.sort"
                   class="filter-item typefilter"
                   @change="handleFilter">
          <el-option v-for="item in sortOptions"
                     :key="item.key"
                     :label="item.label"
                     :value="item.key"/>
        </el-select>
        <el-button class="filter-item margin-l-10"
                   type="primary"
                   icon="el-icon-plus"
                   @click="handleCreate">
          添加
        </el-button>
        <el-input v-model.trim="listQuery.name"
                  placeholder="搜索..."
                  class="filter-item margin-l-10"
                  @keyup.enter.native="handleFilter"/>
        <el-button v-waves
                   class="filter-item margin-l-10"
                   type="primary"
                   icon="el-icon-search"
                   @click="handleFilter">
          搜索
        </el-button>
      </el-row>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;">
      <!-- <el-table-column label="编号"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="80"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="姓名"
                       min-width="120"
                       align="center">
        <template slot-scope="{ row }">
          <span class="link-type"
                @click="handleUpdate(row)">
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="性别"
                       min-width="70"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务"
                       min-width="100"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.role | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分店"
                       min-width="130"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.shop_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号"
                       align="center"
                       min-width="100">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机"
                       align="center"
                       min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址"
                       align="center"
                       min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号"
                       align="center"
                       min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.id_card }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button class="margin-l-10 margin-top-6"
                     type="primary"
                     size="mini"
                     @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.username !== 'admin'"
                     class="margin-l-10 margin-top-6"
                     size="mini"
                     type="danger"
                     @click="openConfirmMsgBox('delete', row, $index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <!-- 模态框 -->
    <el-dialog :top="device === 'mobile' ? '0vh' : '15vh'"
               :width="device === 'mobile' ? '100%' : '50%'"
               :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"
               status-icon
               :rules="rules"
               :model="temp"
               label-position="left"
               label-width="70px"
               hide-required-asterisk
               class="pageForm">
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model.trim="temp.name"/>
        </el-form-item>
        <el-form-item label="性别"
                      prop="gender">
          <el-select v-model="temp.gender"
                     class="filter-item"
                     placeholder="请选择">
            <el-option v-for="item in genderTypeOptions"
                       :key="item.key"
                       :label="item.display_name"
                       :value="item.display_name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职务"
                      prop="role">
          <el-select v-model="temp.role"
                     class="filter-item"
                     placeholder="请选择">
            <el-option v-for="item in roleTypeOptions"
                       :key="item.key"
                       :label="item.display_name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.role === 'shop'"
                      label="所属分店"
                      prop="shop_id">
          <!-- <el-input v-model="temp.shop_name" /> -->
          <el-select v-model="temp.shop_id"
                     class="filter-item"
                     placeholder="选择分店"
                     @change="shopSelect">
            <el-option v-for="(item, index) in shopList"
                       :key="index"
                       :label="item.shop_name"
                       :value="item.shop_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="账号"
                      prop="username">
          <el-input v-if="dialogStatus === 'create'"
                    v-model.trim="temp.username"
                    :disabled="dialogStatus == 'update'"/>
          <span v-else>{{ temp.username }}</span>
        </el-form-item>
        <el-form-item :label="dialogStatus === 'create' ? '密码' : '修改密码'"
                      prop="password">
          <el-input v-model.trim="temp.password"
                    show-password/>
        </el-form-item>
        <el-form-item label="手机"
                      prop="phone">
          <el-input type="number"
                    pattern="[0-9]*"
                    v-model.trim="temp.phone"/>
        </el-form-item>
        <el-form-item label="地址"
                      prop="addr">
          <el-input v-model="temp.addr"/>
        </el-form-item>
        <el-form-item label="身份证号"
                      prop="id_card">
          <el-input type="number"
                    pattern="[0-9]*"
                    v-model.trim="temp.id_card"/>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-row type="flex"
                justify="end">
          <el-button :style="device === 'mobile'?'width:100%':''"
                     @click="cancelForm">
            取消
          </el-button>
          <el-button :loading="requestLoading"
                     :style="device === 'mobile'?'width:100%':''"
                     type="primary"
                     @click="dialogStatus === 'create' ? createData() : updateData()">
            {{ requestLoading ? "提交中 ..." : "确 定" }}
          </el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchAccount,
  createAccount,
  updateAccount,
  delAccount
} from "@/api/account";
import {fetchStore} from "@/api/store";
import waves from "@/directive/waves"; // waves directive
import {parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "AccountPage",
  components: {Pagination},
  directives: {waves},
  filters: {
    parseTime,
    roleFilter(role) {
      const roleMap = {
        manager: "采购经理",
        buyer: "采购员",
        shop: "分店店员",
        admin: "管理员"
      };
      return roleMap[role];
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      shopList: null,
      dialogStatus: "",
      requestLoading: false,
      timer: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined, // 姓名
        sort: "+name" // 升序排序
      },
      temp: {
        id: undefined,
        name: "",
        gender: "",
        role: "", // 职位
        password: "",
        username: "", // 账号
        phone: "",
        addr: "", // 地址
        id_card: "", // 身份证
        shop_name: "", // 所属分店
        shop_id: ""
      },
      genderTypeOptions: [
        {key: "man", display_name: "男"},
        {key: "lady", display_name: "女"}
      ],
      roleTypeOptions: [
        {key: "admin", display_name: "管理员"},
        {key: "manager", display_name: "采购经理"},
        {key: "buyer", display_name: "采购员"},
        {key: "shop", display_name: "分店店员"}
      ],
      sortOptions: [
        {label: "按姓名升序", key: "+name"},
        {label: "按姓名降序", key: "-name"}
      ],
      textMap: {
        update: "修改账号",
        create: "添加账号"
      },
      rules: {
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        username: [
          {required: true, message: "请输入账号", trigger: "blur"},
          {
            min: 3,
            max: 11,
            message: "长度需在 3 到 11 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (this.dialogStatus === "create" && !value) {
                callback(new Error("密码不能为空"));
              } else if (!/^[0-9a-zA-Z]*$/g.test(value)) {
                callback(new Error("密码只能由数字和字母组成"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        id_card: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value.length !== 18 || !/^[0-9]*$/g.test(value)) {
                  callback(new Error("身份证号由18位数字组成"));
                }
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        shop_id: [
          {
            validator: (rule, value, callback) => {
              if (!value && this.temp.role === "shop") {
                callback(new Error("选择店员的所属分店"));
              }
              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    userInfo() {
      return {
        name: this.$store.getters.name,
        shop_name: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0]
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
        return "20%";
      }
    }
  },
  created() {
    // 钩子函数
    this.getList();
    this.getShopList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchAccount(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.listLoading = false;
      });
    },
    getShopList() {
      if (!this.shopList) {
        fetchStore({
          limit: 99999
        }).then(res => {
          this.shopList = res.data;
        });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        gender: "",
        role: "", // 职位
        password: "",
        username: "", // 账号
        phone: "",
        addr: "", // 地址
        id_card: "", // 身份证
        shop_name: "", // 所属分店
        shop_id: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.requestLoading) {
            return;
          }
          this.requestLoading = true;
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createAccount(this.temp).then(res => {
            if (res.status === "success") {
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false;
              }, 400);
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "账号创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "账号创建失败,原因未知",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.requestLoading) {
            return;
          }
          this.requestLoading = true;
          const tempData = Object.assign({}, this.temp);
          updateAccount(tempData).then(res => {
            if (res.status === "success") {
              const index = this.list.findIndex(
                v => v.username === this.temp.username
              );
              this.list.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              setTimeout(() => {
                // 动画关闭需要一定的时间
                this.requestLoading = false;
              }, 400);
              this.$notify({
                title: "成功",
                message: "账号信息修改成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.requestLoading = false;
              this.$notify({
                title: "失败",
                message: res.msg || "账号信息更新失败,原因未知",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      const params = {username: row.username};
      delAccount(params).then(res => {
        if (res.status === "success") {
          this.$notify({
            title: "成功",
            message: "账号删除成功",
            type: "success",
            duration: 2000
          });
          this.list.splice(index, 1);
        } else {
          this.$notify({
            title: "失败",
            message: res.msg || "账号删除除失败,原因未知",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    cancelForm() {
      this.requestLoading = false;
      this.dialogFormVisible = false;
      clearTimeout(this.timer);
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
        center: true
      })
        .then(() => {
          if (msg === "delete") {
            this.handleDelete(row, index);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    shopSelect(shop_id) {
      this.temp.shop_name = this.shopList.find(v => v.shop_id === shop_id).shop_name;
    }
  }
};
</script>

<style scoped></style>
