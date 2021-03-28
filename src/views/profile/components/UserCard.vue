<template>
  <el-card style="margin-bottom:20px;">
    <div
      slot="header"
      class="clearfix"
    >
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          image="@/assets/logo/logo.png"
          :height="'100px'"
          :width="'100px'"
        >
          <div>你好</div>
          {{ user.role | roleFilter }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">
          {{ user.name }}
        </div>
        <div class="user-role text-center text-muted">
          {{ user.role | roleFilter }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>

export default {
  filters: {
    roleFilter(role) {
      const roleMap = {
        'manager': '采购经理',
        'buyer': '采购员',
        'shop': '分店店员',
        'admin': '管理员'
      }
      return roleMap[role]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
