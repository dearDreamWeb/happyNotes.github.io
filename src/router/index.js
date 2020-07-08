import Vue from "vue";
import VueRouter from "vue-router";
const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/Login.vue");
const NoteBooks = () => import("@/components/NoteBooks");
const Notes = () => import("@/components/Notes");
const RecycleBin = () => import("@/components/RecycleBin");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    children: [
      {
        path: "note",
        name: "note",
        component: Notes
      },
      {
        path: "notebooks",
        name: "notebooks",
        component: NoteBooks
      },
      {
        path: "recyclebin",
        name: "recyclebin",
        component: RecycleBin
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  routes
});

export default router;
