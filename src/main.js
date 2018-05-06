// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

let MyPlugin = {};
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$auiSet = function (arr, whereFind, howtochange) {
    if (!Array.isArray(arr)) {
      return false;
    }
    let findIndex = arr.findIndex(whereFind);
    if (findIndex < 0) {
      return false;
    }

    this.$set(arr, findIndex, howtochange(findIndex));

    return true;
  }

  Vue.prototype.$auiBefore = function(arr, needBefore, whattoreplace) {
    if (!Array.isArray(arr)) {
      return false;
    }
    let findIndex = arr.findIndex(needBefore);

    let res = whattoreplace();

    console.log(findIndex);
    if (findIndex < 0) {
      arr.unshift(res);
    } else {
      this.$set(arr, findIndex, res);
    }
  }
}

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.use(MyPlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
