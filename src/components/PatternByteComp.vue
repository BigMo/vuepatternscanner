<template>
  <b-button
  :variant="variant"
  size="sm"
  :pressed.sync="patternByte.wildcard"
  :disable="!editable"
  >{{hexString}}</b-button>
</template>

<script>
export default {
  name: "PatternByteComp",
  props: ["patternByte",'editable'],
  data: function () {
    return {};
  },
  computed: {
    hexString: function () {
      var str = this.patternByte.value.toString(16).toUpperCase();
      return "0".repeat(2 - str.length) + str;
    },
    variant: function() {
        return this.patternByte.wildcard ? 'light' : ''
    }
  },
};
</script>

<style>
</style>