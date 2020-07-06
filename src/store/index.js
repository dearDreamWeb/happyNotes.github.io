import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 获取所有用户
    users: window.localStorage.getItem("users") ? JSON.parse(window.localStorage.getItem("users")) : null,
    // 是否已有用户登录
    isLogin: window.localStorage.getItem("isLogin") ? JSON.parse(window.localStorage.getItem("isLogin")) : null
  },
  getters: {
    // 获取所有用户
    getUsers(state) {
      return state.users;
    },
    // 是否已有用户登录
    getIsLogin(state) {
      return state.isLogin;
    }
  },
  mutations: {
    // 创建用户成功
    setUser(state, data) {
      let newUsers;
      // 判断是否有用户数据，没有就初始化一下数据，把数据放进数组里；有的话就push进数据数组里
      if (state.users) {
        newUsers = state.users.push(data);
      } else {
        newUsers = [data];
      }
      state.users = newUsers;
      window.localStorage.setItem("users", JSON.stringify(newUsers));
    },

    // 改变是否登录
    changeIsLogin(state, data) {
      state.isLogin = data;
      window.localStorage.setItem("isLogin", JSON.stringify(data));
    }
  },
  actions: {}
});
