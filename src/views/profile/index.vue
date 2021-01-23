<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <!-- <el-col :span="6"
                :xs="24">
          <user-card :user="user" />
        </el-col> -->
        <el-col :span="12" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账号信息" name="account">
                <!-- <account :user="user" /> -->
                <el-form
                  ref="userForm"
                  :rules="rules"
                  :model="user"
                  class="pageForm"
                  label-width="70px"
                  hide-required-asterisk
                >
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model.trim="user.name" />
                  </el-form-item>
                  <el-form-item label="角色" prop="role">
                    <span>{{ user.role | roleFilter }}</span>
                  </el-form-item>
                  <el-form-item label="性别" prop="gender">
                    <el-select
                      v-model="user.gender"
                      style="width:100%"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in genderTypeOptions"
                        :key="item.key"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="userInfo.role === 'shop'"
                    label="所属分店"
                    prop="shop_name"
                  >
                    <span>{{user.shop_name}}</span>
                  </el-form-item>
                  <el-form-item label="账号" prop="account">
                    <!-- <el-input v-model.trim="user.account"
                              :disabled="true" /> -->
                    <span>{{ user.account }}</span>
                  </el-form-item>
                  <el-form-item
                    label="密码"
                    prop="password"
                  >
                    <el-input v-model.trim="user.password" show-password />
                  </el-form-item>
                  <el-form-item label="电话" prop="phone">
                    <el-input type="number" pattern="[0-9]*" v-model.trim="user.phone" />
                  </el-form-item>
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="user.address" />
                  </el-form-item>
                  <el-form-item label="身份证" prop="identity">
                    <el-input type="number" pattern="[0-9]*" v-model.trim="user.identity" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="width:100%" @click="submit">更新</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import { updateUser } from "@/api/user";

export default {
  name: "Profile",
  components: { UserCard },
  filters: {
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
      user: {},
      activeTab: "account",
      genderTypeOptions: [
        { key: "man", value: "男" },
        { key: "lady", value: "女" }
      ],
      rules: {
        name: [{ required: true, message: "请输入姓名.", trigger: "blur" }],
        account: [
          { required: true, message: "请输入账号.", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度需在 3 到 11 个字符.",
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!/^[0-9a-zA-Z]*$/g.test(value)) {
                callback(new Error("密码只能由数字和字母组成"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        identity: [
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
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      "name",
      "avatar",
      "roles",
      "gender",
      "phone",
      "address",
      "identity",
      "account",
      "shop_id",
      "shop_name"
    ]),
    userInfo() {
      return {
        name: this.$store.getters.name,
        shop_name: this.$store.getters.shop_name, // 所属分店
        role: this.$store.getters.roles[0]
      };
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles[0],
        account: this.account,
        avatar: this.avatar,
        gender: this.gender,
        phone: this.phone,
        address: this.address,
        identity: this.identity,
        shop_id: this.shop_id,
        shop_name: this.shop_name,
        password: ""
      };
    },
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("user/update", this.user)
            .then(res => {
              if (res.status === "success") {
                this.$message({
                  message: "用户信息更新成功",
                  type: "success",
                  duration: 2 * 1000
                });
              } else {
                this.$message({
                  message: "用户信息更新失败",
                  type: "error",
                  duration: 2 * 1000
                });
              }
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    }
  }
};
</script>
