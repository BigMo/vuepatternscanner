<template>
  <b-row class="patternrow">
    <b-col>
    <b-button-group>
      <!--<b-button variant="light" size="sm">FF</b-button>
      <b-button size="sm">DD</b-button>
      <b-button size="sm">EE</b-button>-->
      <PatternByteComp
      v-for="byte in patternRow.bytes"
      :key="patternRow.bytes.findIndex(b=>b == byte)"
      :patternByte="byte"
      :editable="editable"
      > </PatternByteComp>
    </b-button-group>
    </b-col>
    <b-col>
      <code>
        {{patternRow.comment}}
      </code>
    </b-col>
  </b-row>
</template>

<script>
import {PatternByte} from '@/model/project.js'
import PatternByteComp from '@/components/PatternByteComp.vue'

export default {
  name: "PatternRowComp",
  components: {PatternByteComp},
  props: ['patternRow', 'editable'],
  data: function() {
    return {
    }
  }
};
</script>

<style>
.patternrow {
  margin-top: 5px;
}
</style>