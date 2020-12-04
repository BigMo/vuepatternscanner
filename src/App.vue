<template>
  <div id="app">
    <b-container
      ><b-navbar
        toggleable="lg"
        type="dark"
        variant="dark"
        style="margin-bottom: 1em"
      >
        <b-navbar-brand href="#"
          ><b-img src="favicon.svg" height="32px" />
          VuePatternScanner</b-navbar-brand
        >
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="./">Home</b-nav-item>
            <b-nav-item href="./workbench">Workbench</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">Import</b-nav-item>
            <b-nav-item href="#">Export</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-container>
    <div class="container d-flex justify-content-center align-items-center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {},
};
</script>

<style>
</style>