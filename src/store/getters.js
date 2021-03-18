const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  account: state => state.user.account,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  gender: state => state.user.gender,
  password: state => state.user.password,
  phone: state => state.user.phone,
  address: state => state.user.address,
  identity: state => state.user.identity,
  shop_id: state => state.user.shop_id,
  shop_name: state => state.user.shop_name
}
export default getters
