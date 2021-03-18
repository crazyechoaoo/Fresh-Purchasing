<template>
  <div
    class="dashboard-container"
    style="min-height:calc(94vh)"
  >
    <adminDashboard />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    background-color: rgb(240, 242, 245);
    margin: 0px;
  }
}

.dashboard-container {
  text-align: center;
}
</style>
