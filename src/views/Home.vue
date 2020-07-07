<template>
  <div class="home">
    <el-container class="container">
      <!-- 左侧导航栏 -->
      <el-aside class="nav_aside">
        <!-- 头像 -->
        <el-tooltip
          effect="dark"
          :content="userInfo_login.userName"
          placement="right-end"
        >
          <div class="avatar">
            <!-- 获取用户名的第一个字符，并转换成大写 -->
            {{ userInfo_login.userName.slice(0, 1).toUpperCase() }}
          </div>
        </el-tooltip>

        <!-- 图标 -->
        <div class="icons">
          <el-tooltip
            v-for="(item, index) in navList"
            :key="index"
            effect="dark"
            :content="item.content"
            placement="right-end"
          >
            <i
              :class="[
                item.icon,
                'icon',
                { checked: $route.path === item.path },
              ]"
              @click="$router.push(item.path)"
            ></i>
          </el-tooltip>
        </div>

        <!-- 退出登录 -->
        <el-tooltip effect="dark" content="退出登录" placement="right-end">
          <i class="el-icon-error login_out" @click="loginOut"></i>
        </el-tooltip>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      userInfo_login: this.$store.getters.getUserInfoLogin,
      // 导航列表信息
      navList: [
        {
          path: "/note",
          icon: "el-icon-s-order",
          content: "笔记",
        },
        {
          path: "/notebooks",
          icon: "el-icon-s-management",
          content: "笔记本",
        },
        {
          path: "/recyclebin",
          icon: "el-icon-delete-solid",
          content: "回收站",
        },
      ],
    };
  },
  methods: {
    /**
     * 退出登录
     */
    loginOut() {
      // 通过vuex修改isLogin为false，userInfo_login为null
      this.$store.commit("changeIsLogin", {
        isLogin: false,
        userInfo: null,
      });
      this.$router.push("/login");
      this.$message.success("退出登录成功");
    },
  },
  computed: {
    ...mapGetters(["getUserInfoLogin"]),
  },
  watch: {
    getUserInfoLogin(newVal) {
      this.userInfo_login = newVal;
    },
  },
  mounted() {
    console.log(this.$route);
  },
  // 如果没有用户登录就跳转到登录界面
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.$store.getters.getIsLogin) {
        vm.$router.push("/login");
        return false;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  .container {
    height: 100%;
    .nav_aside {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 60px !important;
      background-color: #f8f8f8;
      border: 1px solid rgba(0, 0, 0, 0.1);
      // 头像
      .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        width: 35px;
        height: 35px;
        background: #65cf97;
        border-radius: 50%;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        text-shadow: 1px 1px 5px #419167;
        &:hover {
          transform: rotateZ(360deg);
          transition: transform 1.5s cubic-bezier(0.6, -0.06, 0.6, 1.56);
        }
      }
      .icons {
        margin-top: 20px;
        .icon {
          display: block;
          margin-top: 10px;
          padding: 5px 0;
          text-align: center;
          width: 60px;
          font-size: 25px;
          color: #909399;
          &:hover {
            cursor: pointer;
            color: #fff;
            background-color: #24e37f;
          }
        }
        .checked {
          color: #fff;
          background-color: #24e37f;
        }
      }
      // 退出登录
      .login_out {
        position: fixed;
        bottom: 20px;
        display: block;
        padding: 5px 0;
        text-align: center;
        width: 60px;
        font-size: 25px;
        color: #909399;
        &:hover {
          cursor: pointer;
          color: #fff;
          background-color: #24e37f;
        }
      }
    }
  }
}
</style>
