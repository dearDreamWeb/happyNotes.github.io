<template>
  <div class="notes">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        width="300px"
        class="aside animate__animated animate__slideInLeft"
      >
        <header class="header">
          <el-select v-model="selectValue" placeholder="">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- 添加笔记按钮 -->
          <el-button size="mini" @click.stop="addNote">添加笔记</el-button>
        </header>
        <!-- 创建时间和标题 -->
        <el-row class="list_head">
          <el-col :span="12">创建时间</el-col>
          <el-col :span="12">标题</el-col>
        </el-row>
        <!-- 笔记列表 -->
        <!-- 由于userData是props值，props是异步的，所以当页面加载时props值没有加载过来，先不显示，等到mounted是再加载 -->
        <section class="lists_main" v-if="showList">
          <el-row
            v-for="(item, index) in userData[selectValue].lists"
            :key="index"
            :class="['lists_item', { checked: selectedNote === index }]"
            @click.stop.native="selectedNoteData(item, index)"
          >
            <el-col :span="12">{{ item.createdTime | changeDate }}</el-col>
            <el-col :span="12">{{ item.title }}</el-col>
          </el-row>
        </section>
      </el-aside>

      <!-- 笔记内容部分 -->
      <el-main class="note_main" v-if="noteData">
        <header class="noteMain_header">
          <el-row>
            <el-col :span="12">
              创建时间：{{
                new Date(noteData.createdTime)
                  .toLocaleString()
                  .replace(/\//g, "-")
              }}
              已保存
            </el-col>
            <el-col :span="1" :offset="11">
              <i class="el-icon-delete icon"></i>
            </el-col>
          </el-row>
        </header>
        <section class="note_title">
          <input
            class="input"
            v-model="noteTitle"
            placeholder="请输入文章标题"
          />
        </section>
        <section class="note_content">
          <textarea
            class="textarea"
            v-model="noteCotent"
            placeholder="请输入文章内容"
          />
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
  },
  data() {
    return {
      options: [],
      selectValue: 0, // 下拉框选中的值
      showList: false, //是否显示列表
      noteTitle: "", //文章标题
      noteCotent: "", //文章内容
      noteData: null, // 文章的数据
      selectedNote: 0, //选中的文章在文章数组中的下标值
    };
  },
  methods: {
    // 初始化下拉框的选项
    initOptions() {
      // 如果是从笔记本页面跳转过来的，获取路由传过来的值，不是从页面传过来的就为0
      this.selectValue = this.$route.params.selectValue
        ? this.$route.params.selectValue
        : 0;
      this.userData.forEach((item, index) => {
        let data = {
          value: index,
          label: item.noteBookName,
        };
        this.options = [...this.options, data];
      });
    },

    /**
     * 初始化noteData
     * 先判断笔记本中的笔记列表是否有笔记，有笔记就选中第一个笔记数据给noteData(selectedNote默认是0)，没有就不赋值
     */
    initNoteData() {
      let noteList = this.userData[this.selectValue].lists;
      if (noteList.length > 0) {
        this.noteData = noteList[this.selectedNote];
      }
    },

    /**
     * 添加笔记
     */
    addNote() {
      let newNote = {
        createdTime: new Date().getTime(),
        title: "无标题",
        content: "",
        show: true,
      };
      this.userData[this.selectValue].lists = [
        newNote,
        ...this.userData[this.selectValue].lists,
      ];
      let newUserData = this.userData;
      this.$emit("updateUserData", newUserData);
    },

    /**
     * 选中的文章
     */
    selectedNoteData(item, index) {
      this.noteData = item;
      this.selectedNote = index;
    },
  },
  watch: {
    // 当noteData更新时，把noteTitle和noteContent也更新
    noteData() {
      this.noteTitle = this.noteData.title;
      this.noteCotent = this.noteData.content;
    },
  },
  mounted() {
    this.showList = true; //列表显示
    this.$nextTick(() => {
      this.initOptions();
      this.initNoteData();
    });
  },
  // 如果该用户没有笔记本，跳转到笔记本页面
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.userData.length <= 0) {
        vm.$message.info("亲，你还没有任何笔记本，请先创建笔记本");
        vm.$router.push("/notebooks");
        return false;
      }
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
.notes {
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
      // 修改elment-ui中的按钮
      .el-button {
        position: absolute;
        right: 5px;
        padding: 2px 5px;
        height: 18px;
      }
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
          background-color: #bbffaa;
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
      .icon {
        font-size: 16px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .note_title {
      padding: 10px 20px;
      .input {
        height: 30px;
        font-size: 20px;
        &:focus {
          outline: none;
        }
      }
    }
    .note_content {
      padding: 20px;
      height: 100%;
      .textarea {
        width: 100%;
        height: 100%;
        border: none;
        font-size: 16px;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
