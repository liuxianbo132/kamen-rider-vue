<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Home from './components/home.vue'
import Book from './components/book.vue'
import Xinwen from './components/xinwen.vue'
import Login from './components/login.vue'
import xilie from './components/xilie.vue'
export default {
  name: 'App',
  components:{
  Home,
  Book,
  Xinwen,
  Login,
  xilie
  }
}
</script>
<style>
</style>
