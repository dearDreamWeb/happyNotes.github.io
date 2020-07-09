<template>
  <div class="recycle_bin">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        width="300px"
        class="aside animate__animated animate__slideInLeft"
      >
        <header class="header">
          回收站
        </header>
        <!-- 创建时间和标题 -->
        <el-row class="list_head">
          <el-col :span="12">删除时间</el-col>
          <el-col :span="12">标题</el-col>
        </el-row>
        <!-- 笔记列表 -->
        <!-- 由于userData是props值，props是异步的，所以当页面加载时props值没有加载过来，先不显示，等到mounted是再加载 -->
        <section class="lists_main" v-if="showList">
          <div v-for="(item, index) in recycleBinData" :key="index">
            <el-row
              :class="['lists_item', { checked: selectedNote === index }]"
              @click.stop.native="selectedNoteData(item, index)"
            >
              <!-- 删除时间 -->
              <el-col :span="12">{{ item.deleteTime | changeDate }}</el-col>
              <!-- 文章标题  当长度大于10时，title显示全部的标题，否则不开启title功能 -->
              <el-col
                :span="12"
                :title="item.noteData.title.length > 8 ? item.title : false"
              >
                <!-- 当长度大于10的时候，显示前十个字加上...  否则显示全称 -->
                {{
                  item.noteData.title.length > 8
                    ? item.noteData.title.slice(0, 8) + "..."
                    : item.noteData.title
                }}
              </el-col>
            </el-row>
          </div>
        </section>
      </el-aside>

      <!-- 笔记内容部分 -->
      <el-main class="note_main" v-if="noteData">
        <!-- 头部 -->
        <header class="noteMain_header">
          <el-row>
            <el-col :span="12">
              创建时间：{{
                new Date(noteData.createdTime)
                  .toLocaleString()
                  .replace(/\//g, "-")
              }}
              <span class="divider">|</span>
              删除时间：{{
                recycleBinData[selectedNote].deleteTime | changeDate
              }}
              <span class="divider">|</span>
              所属笔记本：{{ recycleBinData[selectedNote].category }}
            </el-col>
            <!-- 彻底删除和恢复 -->
            <el-col :span="2" :offset="10">
              <!-- 确认框，onConfirm是点击确认选择的回调事件 -->
              <el-popconfirm
                confirmButtonText="确定"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="彻底删除笔记后无法恢复"
                @onConfirm="deleteNote"
              >
                <el-button type="mini" slot="reference" class="delete_btn"
                  >彻底删除</el-button
                >
              </el-popconfirm>
              <el-button type="mini" class="recover_btn" @click="recoverNote"
                >恢复
              </el-button>
            </el-col>
          </el-row>
        </header>
        <!-- 标题和内容区 -->
        <section class="note_title">
          {{ noteTitle }}
        </section>
        <section class="note_content">
          {{ noteCotent }}
        </section>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {
    userData: {
      type: Array,
      required: true,
    },
    recycleBinData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showList: false, //是否显示列表
      noteTitle: "", //文章标题
      noteCotent: "", //文章内容
      noteData: null, // 文章的数据
      selectedNote: 0, //选中的文章在文章数组中的下标值
    };
  },
  methods: {
    /**
     * 初始化noteData
     * 先判断笔记本中的笔记列表是否有笔记，有笔记就选中第一个笔记数据给noteData(selectedNote默认是0)，没有就不赋值
     */
    initNoteData() {
      if (this.recycleBinData.length > 0) {
        this.noteData = this.recycleBinData[this.selectedNote].noteData;
      }
    },

    /**
     * 选中的文章
     */
    selectedNoteData(item, index) {
      this.noteData = item.noteData;
      this.selectedNote = index;
    },

    /**
     * 彻底删除
     * 将回收站列表和用户对应笔记本列表的对应数据删除
     */
    deleteNote() {
      // 更新userData
      let newUserData = this.userData;
      let category = this.recycleBinData[this.selectedNote].category;
      // 第一次forEach找到了上级分类
      newUserData.forEach((item, index) => {
        if (item.noteBookName === category) {
          // 第二次forEach找到了要删除的笔记
          item.lists.forEach((item1, i) => {
            if (item1.createdTime === this.noteData.createdTime) {
              newUserData[index].lists.splice(i, 1);
            }
          });
        }
      });
      this.$emit("updateUserData", newUserData);

      // 更新recycleBinData
      let newRecycleBinData = this.recycleBinData;
      newRecycleBinData.splice(this.selectedNote, 1);
      this.$emit("updateRecycleBinData", newRecycleBinData);

      // 删除该笔记了，把选中的笔记变成第一个,如果删除最后一个的话，第一个参数传null
      if (this.recycleBinData.length > 0) {
        this.selectedNoteData(this.recycleBinData[0], 0);
      } else {
        this.selectedNoteData({ noteData: null }, 0);
      }
      this.$message.success("笔记彻底删除成功");
    },

    /**
     * 恢复笔记
     * 把回收站对应的笔记删除，将用户列表中对应笔记本中对应的笔记里的show改为true
     */
    recoverNote() {
      // 更新userData
      let newUserData = this.userData;
      let category = this.recycleBinData[this.selectedNote].category;
      // 第一次forEach找到了上级分类
      newUserData.forEach((item, index) => {
        if (item.noteBookName === category) {
          // 第二次forEach找到了要删除的笔记
          item.lists.forEach((item1, i) => {
            if (item1.createdTime === this.noteData.createdTime) {
              newUserData[index].lists[i].show = true;
            }
          });
        }
      });
      this.$emit("updateUserData", newUserData);

      // 更新recycleBinData
      let newRecycleBinData = this.recycleBinData;
      newRecycleBinData.splice(this.selectedNote, 1);
      this.$emit("updateRecycleBinData", newRecycleBinData);

      // 删除该笔记了，把选中的笔记变成第一个,如果删除最后一个的话，第一个参数传null
      if (this.recycleBinData.length > 0) {
        this.selectedNoteData(this.recycleBinData[0], 0);
      } else {
        this.selectedNoteData({ noteData: null }, 0);
      }
      this.$message.success("笔记恢复成功");
    },
  },
  watch: {
    // 当noteData更新时，把noteTitle和noteContent也更新
    noteData() {
      this.noteTitle = this.noteData ? this.noteData.title : "";
      this.noteCotent = this.noteData ? this.noteData.content : "";
    },
  },
  mounted() {
    this.showList = true; //列表显示
    this.$nextTick(() => {
      this.initNoteData();
    });
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
    },
  },
};
</script>

<style lang="scss" scoped>
.recycle_bin {
  .aside {
    height: 100vh;
    background: #efefef;
    border: 1px solid rgba(0, 0, 0, 0.1);
    .header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 5px;
      background-color: #f8f8f8;
    }
    .list_head,
    .lists_main .lists_item {
      display: flex;
      & :nth-child(n) {
        flex-grow: 1;
        padding: 5px 10px;
        font-size: 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
    .lists_main {
      .lists_item {
        & :nth-child(n) {
          border: none;
        }
        &:hover {
          cursor: pointer;
          background-color: #ffffff;
        }
      }
      .checked {
        background-color: #bbffaa;
      }
    }
  }

  .note_main {
    .noteMain_header {
      padding: 10px 0 10px 10px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .divider {
        padding: 0 5px;
      }
      .delete_btn,
      .recover_btn {
        padding: 2px;
        font-size: 12px;
      }
      .delete_btn {
        margin-right: 5px;
        &:hover {
          cursor: pointer;
          color: #eb1212;
        }
      }
      .recover_btn {
        &:hover {
          cursor: pointer;
          background-color: #bbffaa;
          color: #000;
        }
      }
    }
    .note_title {
      padding: 10px 20px;
      width: 100%;
      height: 30px;
      font-size: 20px;
    }
    .note_content {
      padding: 20px;
      width: 100%;
      height: 100%;
      font-size: 16px;
    }
  }
}
</style>
