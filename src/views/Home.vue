<template>
  <div class="home"></div>
</template>

<script>
export default {
  name: "Home",
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
