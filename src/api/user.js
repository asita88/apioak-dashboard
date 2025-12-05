import request from '@/utils/requestAxios'

const login = '/admin/user/login'
const logout = '/admin/user/logout'

/**
 * 登录
 * @param {*} data
 */
export const $login = data => {
  return request.request({
    url: login,
    method: 'POST',
    data: data
  })
}

/**
 * 退出登录
 * @returns
 */
export const $logout = () => {
  return request.request({
    url: logout,
    method: 'POST'
  })
}
