<template>
  <div class="editlabel">
    <b-form-input class="inline"
      type="text"
      size="sm"
      v-if="edit"
      :value="valueLocal"
      @blur.native="editDone"
      @keyup.enter.native="editDone"
      v-focus=""
    />
    <span
      v-else
      @click="edit = true"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      style="min-width:100px;"
    >
      {{ enquote ? `"${valueLocal}"` : valueLocal }}
      <font-awesome-icon icon="pen" v-if="hover" />
    </span>
  </div>
</template>

<script>
export default {
  props: ["value", "enquote"],

  data() {
    return {
      edit: false,
      hover: false,
      valueLocal: this.value,
    };
  },
  watch: {
    value() {
      if (this.valueLocal != this.value) this.valueLocal = this.value;
    },
  },
  methods: {
      editDone(event){
        this.valueLocal = event.target.value;
        this.edit = false;
        this.hover = false;
        this.$emit('input', this.valueLocal);
      }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
};
</script>

<style scoped>
.editlabel {
  display: inline !important;
  cursor: pointer;
}
.inline {
  display: inline !important;
  width: auto;
}
</style>