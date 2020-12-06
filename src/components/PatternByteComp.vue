<template>
  <b-button
  :variant="variant"
  size="sm"
  :pressed.sync="patternByte.wildcard"
  :disabled="!editable"
  @click="save"
  >{{hexString}}</b-button>
</template>

<script>
import store from "@/store/index.js";
export default {
  name: "PatternByteComp",
  props: ["patternByte",'editable'],
  data() {
    return {};
  },
  methods: {
    save(){
      store.commit('saveLocally')
    }
  },
  computed: {
    hexString() {
      var str = this.patternByte.value.toString(16).toUpperCase();
      return "0".repeat(2 - str.length) + str;
    },
    variant() {
        return this.patternByte.wildcard ? 'light' : ''
    }
  },
};
</script>

<style>
</style>