<template>
  <div class="login-container">
    <el-row type="flex" class="row-bg" justify="center">

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-row type="flex" justify="center">
          <img src="@/assets/logo/logo.png" alt>
        </el-row>

        <div class="title-container">
          <h3 class="title">欢迎回到生鲜外采系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="请输入账号..."
            name="username"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码..."
            name="password"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
          <!-- .native修饰符 会把事件绑定到el-input的根元素上 -->
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;background-color:#4e73df;border-color: #4e73df;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <!-- .native修饰符 会把事件绑定到el-button的根元素上 -->
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.$store.dispatch('user/login', this.loginForm)
            .then(res => {
              if (res.status === 'success') {
                this.$router.push({ path: this.redirect || '/' })

                this.loading = false
              } else {
                this.$notify({
                  title: '失败',
                  message: res.msg || '服务器登陆验证失败',
                  type: 'error',
                  duration: 1000
                })

                this.loading = false
              }
            })
            .catch(error => {
              this.$notify({
                title: '失败',
                message: error.toString() || '网络错误',
                type: 'error',
                duration: 1000
              })

              this.loading = false
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 全局样式 */
$bg: #4e73df;
$cursor: #fff;
$fontColor: #6e707e;

// 解决光标变色
// https://github.com/PanJiaChen/vue-element-admin/pull/927
// @supports 用来检测浏览器是否支持某个期望的样式功能
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $fontColor;
      height: 47px;
      caret-color: $fontColor;

      &:-webkit-autofill {
        background: #e5e5e5 !important;
        border: 0px !important;
        -webkit-appearance: none !important;
        border-radius: 0px !important;
        padding: 12px 5px 12px 15px !important;
        color: $fontColor !important;
        height: 47px !important;
        caret-color: $fontColor !important;
        -webkit-text-fill-color: $fontColor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: $fontColor;
  }
}
</style>

<style lang="scss" scoped>
// 当 <style> 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素
$bg: #4e73df;
$dark_gray: #889aa4;
$fontColor: #6e707e;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-color: $bg;
  background-image: linear-gradient(180deg, $bg 10%, #224abe 100%);
  background-size: cover;

  .login-form {
    position: relative;
    width: 90%;
    max-width: 430px;
    padding: 40px 60px 48px 60px;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 48px;
    background-color: #fff;
    border-radius: 0.35rem;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: $fontColor;
      margin: 48px auto 24px auto;
      text-align: center;
      font-weight: 400;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
