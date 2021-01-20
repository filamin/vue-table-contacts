import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/contacts",
      name: "contacts",
      component: () => import("./components/ContactsList"),
    },
    {
      path: "/contacts/:id",
      name: "contact-details",
      component: () => import("./components/Contact"),
    },
  ],
});
