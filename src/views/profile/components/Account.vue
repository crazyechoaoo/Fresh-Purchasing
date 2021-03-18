<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="性别">
      <el-input v-model.trim="user.gender" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="user.password" />
    </el-form-item>
    <el-form-item label="账号">
      <el-input v-model.trim="user.account" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model.trim="user.address" />
    </el-form-item>
    <el-form-item label="身份证">
      <el-input v-model.trim="user.identity" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submit"
      >更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          role: '',
          avatar: '',
          gender: '',
          password: '',
          account: '',
          phone: '',
          address: '',
          identity: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: '用户信息更新成功',
        type: 'success',
        duration: 3 * 1000
      })
    }
  }
}
</script>
