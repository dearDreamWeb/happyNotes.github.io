<template>
  <div class="login">
    <div class="container">
      <el-row class="form_wrap">
        <!-- 图片 -->
        <el-col class="image_wrap">
          <el-image
            style="width:600px;height:400px"
            :src="require(`../assets/images/bg.jpg`)"
            fit="cover"
          ></el-image>
        </el-col>
        <!-- form表单 -->
        <el-col :span="8" class="form">
          <!-- 标题 -->
          <el-divider content-position="left" class="divider">
            {{ status === 1 ? "登录" : "创建账户" }}
          </el-divider>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-position="top"
            label-width="auto"
            class="demo-ruleForm"
          >
            <!-- 用户名 -->
            <el-form-item
              label="用户名"
              prop="userName"
              :error="error.errorUserName"
            >
              <el-input
                type="text"
                v-model="ruleForm.userName"
                autocomplete="off"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item
              label="密码"
              prop="password"
              :error="error.errorPassword"
            >
              <el-input
                type="password"
                v-model="ruleForm.password"
                autocomplete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>

            <!-- 确认密码 -->
            <el-form-item
              label="确认密码"
              prop="password2"
              v-if="status === 1 ? false : true"
            >
              <el-input
                type="password"
                v-model="ruleForm.password2"
                autocomplete="off"
                placeholder="请再次输入密码"
              ></el-input>
            </el-form-item>

            <!-- 登录 -->
            <el-form-item>
              <el-button
                class="submit_btn"
                type="primary"
                @click="submitForm('ruleForm')"
              >
                {{ status === 1 ? "登录" : "创建账户" }}
              </el-button>
            </el-form-item>

            <!-- 创建账户 -->
            <el-form-item>
              <el-button
                class="submit_btn"
                type="info"
                @click="resetForm('ruleForm')"
              >
                {{ status === 1 ? "创建账户" : "已有账户去登录" }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 用户名
    var validateUserName = (rule, value, callback) => {
      let reg = /\W/; // \W等价于[^a-zA-Z0-9]
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (reg.test(value)) {
        callback(new Error("用户名只能是字母和数字"));
      } else {
        // 如果用户是创建账户并且users有值，遍历看看有没有已经注册过的用户名
        if (this.status === 0 && this.users) {
          let arr = Array.from(this.users).filter(
            item => item.userName === value
          );
          if (arr.length > 0) {
            callback(new Error("该用户名已存在"));
          }
        }
        callback();
      }
    };

    // 密码
    var validatePassword = (rule, value, callback) => {
      let reg = /\W/; // \W等价于[^a-zA-Z0-9]
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (reg.test(value)) {
        callback(new Error("密码只能是字母和数字"));
      } else {
        callback();
      }
    };

    // 确认密码
    var validatePassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userName: "",
        password: "",
        password2: "",
      },
      rules: {
        userName: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        password2: [{ validator: validatePassword2, trigger: "blur" }],
      },
      error: {
        errorUserName: "",
        errorPassword: "",
      },
      status: 1, //1代表登录，0代表创建账号
      users: this.$store.getters.getUsers,
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 当为登录状态时，先判断是否有用户，有就遍历筛选看用户名和密码是否都对
          if (this.status === 1) {
            if (this.users) {
              let arr = this.users.filter(
                item =>
                  item.userName === this.ruleForm.userName &&
                  item.password === this.ruleForm.password
              );
              if (arr.length > 0) {
                this.$message.success("登录成功");
                this.$router.push("/");
                this.$refs[formName].resetFields();
                this.$store.commit("changeIsLogin", true);
                return false;
              }
            }
            this.error.errorUserName = "用户名或密码错误";
            this.error.errorPassword = "用户名或密码错误";
          } else {
            // 创建账号成功
            this.$store.commit("setUser", {
              userId: new Date().getTime(),
              userName: this.ruleForm.userName,
              password: this.ruleForm.password,
            });
            this.$message.success("创建账号成功");
            this.$refs[formName].resetFields();
            this.status = 1;
          }
        } else {
          this.$message.info("请正确填写表单内容");
          return false;
        }
      });
    },
    // 第二个按钮
    resetForm(formName) {
      this.status === 1 ? (this.status = 0) : (this.status = 1);
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" socped>
.login {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .form_wrap {
      display: flex;
      justify-content: center;
      .image_wrap {
        display: flex;
        align-items: center;
        padding: 40px 0;
        width: auto;
        background: #36bc64;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      }
      .form {
        padding: 0 20px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        // 修改element-ui中分割线的文字的样式
        .el-divider__text {
          font-size: 20px;
        }
        // 修改element-ui 修改每个lable与input的距离
        .el-form--label-top .el-form-item__label {
          padding-bottom: 0;
        }
        // 修改element-ui 修改每个form-item的上下间距
        .el-form-item {
          margin-bottom: 16px;
        }
        .submit_btn {
          width: 100%;
        }
      }
    }
  }
}
</style>
