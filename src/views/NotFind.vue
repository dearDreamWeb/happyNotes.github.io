<template>
  <div>
    <div class="container" style=" margin-top:8%;">
      <div class="panel margin-big-top">
        <div class="text-center">
          <br />
          <h2 class="padding-top">
            <strong>404错误！抱歉您要找的页面不存在</strong>
          </h2>
          <div class="">
            <div class="float-left">
              <img src="../assets/images/ds-1.gif" />
              <div class="alert">卧槽！页面不见了！</div>
            </div>
            <div class="float-right">
              <img src="../assets/images/ds-2.png" width="260" />
            </div>
          </div>
          <div class="padding-big">
            <a
              href="javascript:;"
              class="button bg-yellow"
              @click="$router.push('/')"
              style="color:#000"
              >返回首页</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.container,
.container-layout {
  margin: 0 auto;
  padding: 0 10px;
}

@media (min-width: 760px) {
  .container {
    width: 750px;
  }
}

@media (min-width: 1000px) {
  .container {
    width: 1000px;
  }
}

@media (min-width: 1200px) {
  .container {
    width: 1200px;
  }
}
.panel {
  border: solid 1px #ddd;
  border-radius: 4px;
}
.margin-big-top {
  margin-top: 20px;
}
.text-center {
  text-align: center;
}
.padding-top {
  padding-top: 10px;
}
.float-left {
  float: left !important;
}
.alert {
  border-radius: 5px;
  padding: 15px;
  border: solid 1px #ddd;
  background-color: #f5f5f5;
}
.float-right {
  float: right !important;
}
.padding-big {
  padding: 20px;
}
.bg-yellow {
  color: #fff;
}
a {
  background: transparent;
}
.button {
  border: solid 1px #ddd;
  background: transparent;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 15px;
  margin: 0;
  display: inline-block;
  line-height: 20px;
  transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1) 0s;
}

.button[disabled] {
  pointer-events: none;
  cursor: not-allowed;
  webkit-box-shadow: none;
  box-shadow: none;
  filter: alpha(opacity=50);
  opacity: 0.5;
}

.button:active {
  background-image: none;
  outline: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) 0s;
}

.button:hover {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) 0s;
}
</style>
