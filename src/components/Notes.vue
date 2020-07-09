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
          <div
            v-for="(item, index) in userData[selectValue].lists"
            :key="index"
          >
            <el-row
              v-if="item.show"
              :class="['lists_item', { checked: selectedNote === index }]"
              @click.stop.native="selectedNoteData(item, index)"
            >
              <!-- 创建时间 -->
              <el-col :span="12">{{ item.createdTime | changeDate }}</el-col>
              <!-- 文章标题  当长度大于10时，title显示全部的标题，否则不开启title功能 -->
              <el-col
                :span="12"
                :title="item.title.length > 8 ? item.title : false"
              >
                <!-- 当长度大于10的时候，显示前十个字加上...  否则显示全称 -->
                {{
                  item.title.length > 8
                    ? item.title.slice(0, 8) + "..."
                    : item.title
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
              {{ saveStatus }}
            </el-col>
            <!-- 删除 -->
            <el-col :span="1" :offset="11">
              <!-- 确认框，onConfirm是点击确认选择的回调事件 -->
              <el-popconfirm
                confirmButtonText="确定"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="确定删除该笔记吗？"
                @onConfirm="deleteNote"
              >
                <i slot="reference" class="el-icon-delete icon"></i>
              </el-popconfirm>
            </el-col>
          </el-row>
        </header>
        <!-- 标题和内容区 -->
        <section class="note_title">
          <input
            class="input"
            v-model="noteTitle"
            placeholder="请输入文章标题"
            @input="changeNoteData('title', noteTitle)"
          />
        </section>
        <section class="note_content">
          <textarea
            class="textarea"
            v-model="noteCotent"
            placeholder="请输入文章内容"
            @input="changeNoteData('content', noteCotent)"
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
      saveStatus: "已保存", //文章编辑时保存的状态，分为已保存和保存中
      timer: null, //防抖定时器
    };
  },
  methods: {
    // 初始化下拉框的选项
    initOptions() {
      // 如果是从笔记本页面跳转过来的，获取路由传过来的值，不是从页面传过来的就为0
      this.selectValue = this.$route.params.selectValue
        ? this.$route.params.selectValue
        : 0;
      // 不是从笔记本跳转过来的，正常加载
      this.userData.forEach((item, index) => {
        let data = {
          value: index,
          label: item.noteBookName,
        };
        this.options = [...this.options, data];
        // 当checked为true说明上次浏览的就是该笔记本
        if (item.checked === true) this.selectValue = index;
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

    /**
     * 输入框更新标题或文章内容
     * 用了防抖的思想
     * @params type 是判断更新的是标题还是内容, 分为title,content;  text是更新的内容
     */
    changeNoteData(type, text) {
      this.saveStatus = "保存中";
      // 设置文章标题字数最多为20
      if (type === "title" && text.length > 20) {
        this.$message.warning("文章标题不能超过20个字数");
        this.noteTitle = text.slice(0, 20);
        return false;
      } else {
        if (type === "title" && text.length === 0) {
          text = "无标题";
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          console.log(type, text);
          this.userData[this.selectValue].lists[this.selectedNote][type] = text;
          let newUserData = this.userData;
          this.$emit("updateUserData", newUserData);
          this.saveStatus = "已保存";
        }, 1000);
      }
    },

    /**
     * 删除笔记
     * 将 笔记数据中的show改为false，就不会显示该笔记了
     */
    deleteNote() {
      this.userData[this.selectValue].lists[this.selectedNote].show = false;
      let newUserData = this.userData;
      this.$emit("updateUserData", newUserData);
      this.selectedNoteData(this.userData[this.selectValue].lists[0], 0);
      this.$message.success("笔记删除成功");
    },
  },
  watch: {
    // 当noteData更新时，把noteTitle和noteContent也更新
    noteData() {
      this.noteTitle = this.noteData ? this.noteData.title : "";
      this.noteCotent = this.noteData ? this.noteData.content : "";
    },
    // 当selectValue更新时
    selectValue() {
      // noteData更新一下
      let noteLists = this.userData[this.selectValue].lists;
      if (noteLists.length === 0) {
        this.noteData = null;
      }

      // 更新userData中的selectValue
      this.userData.forEach((item, index) => {
        item.checked = this.selectValue === index ? true : false;
      });
      let newUserData = this.userData;
      this.$emit("updateUserData", newUserData);
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
      .icon {
        font-size: 16px;
        &:hover {
          cursor: pointer;
          color: #eb1212;
        }
      }
    }
    .note_title {
      padding: 10px 20px;
      .input {
        width: 100%;
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
