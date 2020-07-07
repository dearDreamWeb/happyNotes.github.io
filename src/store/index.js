import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 获取所有用户
    users: window.localStorage.getItem("users") ? JSON.parse(window.localStorage.getItem("users")) : null,
    // 是否已有用户登录
    isLogin: window.localStorage.getItem("isLogin") ? JSON.parse(window.localStorage.getItem("isLogin")) : null,
    // 已登录的用户信息
    userInfo_login: window.localStorage.getItem("userInfo_login") ? JSON.parse(window.localStorage.getItem("userInfo_login")) : null,
    // 获取所有用户的笔记、笔记本等数据
    usersNotes: window.localStorage.getItem("usersNotes") ? JSON.parse(window.localStorage.getItem("usersNotes")) : null,
  },
  getters: {
    // 获取所有用户
    getUsers(state) {
      return state.users;
    },
    // 是否已有用户登录
    getIsLogin(state) {
      return state.isLogin;
    },
    //  获取已登录的用户信息
    getUserInfoLogin(state) {
      return state.userInfo_login;
    },
    // 获取所有用户的笔记、笔记本等数据
    getUsersNotes(state) {
      return state.usersNotes;
    }
  },
  mutations: {
    // 创建用户成功
    setUser(state, data) {
      let newUsers;
      // 判断是否有用户数据，没有就初始化一下数据，把数据放进数组里；有的话就push进数据数组里
      if (state.users) {
        newUsers = [...state.users, data];
      } else {
        newUsers = [data];
      }
      state.users = newUsers;
      window.localStorage.setItem("users", JSON.stringify(newUsers));
    },

    // 改变是否登录，登录的话修改登录的用户的信息
    changeIsLogin(state, data) {
      // 设置isLogin为true
      state.isLogin = data.isLogin;
      window.localStorage.setItem("isLogin", JSON.stringify(data.isLogin));
      console.log(data)
      // 修改登录用户的信息
      state.userInfo_login = data.userInfo;
      window.localStorage.setItem("userInfo_login", JSON.stringify(data.userInfo));
    },

    // 更新用户的笔记数据
    upadteUsersNotes(state, data) {
      state.usersNotes = data;
      window.localStorage.setItem("usersNotes", JSON.stringify(data));
    }
  },
  actions: {}
});
