import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import NoteBooks from "../components/NoteBooks.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    children: [
      {
        path: "/note",
        component: NoteBooks
      },
      {
        path: "/notebooks",
        component: NoteBooks
      },
      {
        path: "/recyclebin",
        component: NoteBooks
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
