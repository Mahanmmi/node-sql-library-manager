<template>
  <div id="app">
    <notifications group="main" />
    <div v-if="$store.getters.getToken" id="nav">
      <router-link to="/panel">Panel</router-link> |
      <router-link to="/book">Book</router-link> |
      <router-link to="/borrow">‌Borrow</router-link> |
      <router-link to="/manage">Manage</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
