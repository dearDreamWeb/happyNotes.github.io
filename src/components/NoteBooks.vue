<template>
  <div class="noteBooks">
    <el-button type="success" size="mini" class="created_btn" @click="open">
      <i class="el-icon-plus" /> 新建笔记本
    </el-button>
    <el-divider />
    <section class="main">
      <el-row>
        <el-col v-if="userData.length === 0" :span="16" :offset="4">
          <h1 class="noneNoteBook">暂无笔记本</h1>
        </el-col>
        <el-col v-else :span="16" :offset="4">
          <h1 class="title">笔记本列表({{ userData.length }})</h1>

          <div
            class="noteBooks_item"
            v-for="(item, index) in userData"
            :key="index"
            @click.stop="
              /**
               * 点击笔记本跳转到笔记页面
               * 形参的index代表在userData数组的下标值，说明是要跳转到该项中笔记本
               */
              $router.push({ name: 'note', params: { selectValue: index } })
            "
          >
            <div class="noteBooks_item_left">
              <i class="el-icon-s-management icon"></i>
              <span class="noteBookName">{{ item.noteBookName }}</span>
              <span class="notesCount">{{ item.lists.length }}</span>
            </div>
            <div class="noteBooks_item_right">
              <span class="time">{{ item.createdTime | changeDate }}</span>
              <span
                class="delete"
                @click.stop="deleteNoteBook(item.lists.length, index)"
                >删除</span
              >
              <span class="edit" @click.stop="editNoteBook(item.noteBookName)"
                >编辑</span
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
/**
 * userData:[{noteBookName:"笔记本名",createdTime:1121231,lists:[]}]
 */
export default {
  props: {
    userData: {
      required: true,
      type: Array
    }
  },
  methods: {
    // 新建笔记本
    open() {
      this.$prompt("笔记本名称", "新建笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^\s]{1,20}$/, // 正则判断为false才会出现提醒消息，正则判断不为空，且最大长度为20
        inputErrorMessage: "内容不能为空或有空格，最大长度为20",
        inputPlaceholder: "请输入笔记本名称"
      })
        .then(({ value }) => {
          //  判断userData是否为空，不为空就判断是否存在该笔记本，存在就提示不能创建，不存在就存入userData里
          if (this.userData.length > 0) {
            let flag = false;
            // 如果该笔记本的名称存在就把flag变为true
            this.userData.forEach(item => {
              if (item.noteBookName === value) flag = true;
            });
            if (flag) {
              this.$message.error("该笔记本已存在，不能重复创建");
            } else {
              this.updateNewNoteBook(value);
            }
          } else {
            this.updateNewNoteBook(value);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },

    /**
     * 将新建笔记本存入用户数据userData
     */
    updateNewNoteBook(value) {
      let obj = {
        noteBookName: value,
        createdTime: new Date().getTime(),
        checked: false,
        lists: []
      };
      let newUserData = [obj, ...this.userData];
      this.$emit("updateUserData", newUserData);
      this.$message.success(`你的新建的笔记本名称是:${value}`);
    },

    /**
     * 编辑笔记本名称
     */
    editNoteBook(noteBookName) {
      this.$prompt("笔记本名称", "编辑笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: noteBookName,
        inputPattern: /^[^\s]{1,20}$/, // 正则判断为false才会出现提醒消息，正则判断不为空，且最大长度为20
        inputErrorMessage: "内容不能为空或有空格，最大长度为20"
      })
        .then(({ value }) => {
          let newArr = this.userData.map(item => {
            if (item.noteBookName === noteBookName) item.noteBookName = value;
            return item;
          });
          this.$emit("updateUserData", newArr);
          this.$message.success("编辑笔记本成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },

    /**
     * 删除笔记本
     */
    deleteNoteBook(num, index) {
      if (num > 0) {
        this.$message.info("请先把该笔记本中的所有笔记彻底删除");
      } else {
        let newUserData = this.userData;
        newUserData.splice(index, 1);
        this.$emit("updateUserData", newUserData);
        this.$message.success("笔记本删除成功");
      }
    }
  },
  filters: {
    //   格式化时间格式
    changeDate(value) {
      let nowDate = new Date().getTime();
      let timeValue = nowDate - value; // 时间差的毫秒数
      // 接下来分别把时间差的毫秒数转换成年、月、天、小时、分钟、秒
      let years = Math.floor(timeValue / (24 * 3600 * 1000 * 365));
      let months = Math.floor(timeValue / (24 * 3600 * 1000 * 30));
      let days = Math.floor(timeValue / (24 * 3600 * 1000));
      let hours = Math.floor(timeValue / (3600 * 1000));
      let minutes = Math.floor(timeValue / (60 * 1000));
      let seconds = Math.floor(timeValue / 1000);
      let arr = [years, months, days, hours, minutes, seconds, ""];
      let arr1 = ["年前", "月前", "天前", "小时前", "分钟前", "秒前", "刚刚"];
      let index = 6;
      let over = true;
      // 遍历arr，判断哪一项不为0就用over=false进行停止index的赋值操作
      // 最后return返回正确的时间差的值
      arr.forEach((item, i) => {
        if (item && over) {
          index = i;
          over = false;
        }
      });
      return `${arr[index]}${arr1[index]}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.noteBooks {
  .created_btn {
    margin: 10px 0 0 10px;
  }

  // 修改element-ui中分割线el-divider的margin值
  .el-divider--horizontal {
    margin: 12px 0;
  }
  .main {
    padding-top: 20px;
    .noneNoteBook {
      font-size: 70px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
    }
    .title {
      font-size: 14px;
      padding-bottom: 15px;
    }
    .noteBooks_item {
      display: flex;
      padding: 15px;
      background: #eee;
      border-radius: 5px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      &:hover {
        cursor: pointer;
        background-color: aliceblue;
      }
      .noteBooks_item_left {
        .icon {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.5);
        }
        .noteBookName {
          padding-left: 10px;
          font-size: 20px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.7);
        }
        .notesCount {
          padding-left: 5px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.6);
        }
      }
      .noteBooks_item_right {
        flex-grow: 1;
        text-align: right;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.6);
        .delete,
        .edit {
          padding-left: 10px;
          &:hover {
            color: #0b56f4;
            text-shadow: 1px 1px 3px #d94f38;
          }
        }
      }
    }
  }
}
</style>
