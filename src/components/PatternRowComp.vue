<template>
  <b-row class="patternrow">
    <b-col>
      <b-button-group>
        <!--<b-button variant="light" size="sm">FF</b-button>
      <b-button size="sm">DD</b-button>
      <b-button size="sm">EE</b-button>-->
        <PatternByteComp
          :class="inactive ? 'inactive' : ''"
          v-for="byte in patternRow.bytes"
          :key="patternRow.bytes.findIndex((b) => b == byte)"
          :patternByte="byte"
          :editable="!inactive && editable"
        >
        </PatternByteComp>
      </b-button-group>
    </b-col>
    <b-col>
      <code :class="inactive ? 'inactive' : ''">
        <ClickToEdit
          :value="patternRow.comment"
          @input="rename"
          v-if="!inactive && editable"
        ></ClickToEdit>
        <span v-else>{{ patternRow.comment }}</span>
      </code>
    </b-col>
    <b-col cols="2" v-if="editable">
      <div style="float: right">
        <font-awesome-icon
          class="contexticon"
          @click="inactive = !inactive"
          :icon="inactive ? 'eye-slash' : 'eye'"
        />
        <font-awesome-icon
          class="contexticon"
          @click="deleteRow"
          icon="trash"
        />
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { PatternByte } from "@/model/project.js";
import PatternByteComp from "@/components/PatternByteComp.vue";
import ClickToEdit from "@/components/ClickToEdit.vue";
import store from "@/store/index.js";

export default {
  name: "PatternRowComp",
  components: { PatternByteComp, ClickToEdit },
  props: ["patternRow", "editable", "idx"],
  data: function () {
    return {
      inactive: false,
      hover: false,
    };
  },
  methods: {
    rename(comment) {
      store.commit("renameRowComment", { idx: this.idx, comment: comment });
    },
    deleteRow: function (event) {
      if (this.dummy) return;
      event.stopPropagation();
      this.$bvModal
        .msgBoxConfirm(
          `Do you really want to delete this row?`,
          {
            title: "Deleting Row",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "Yes",
            cancelTitle: "No",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) store.commit("removeRow", this.idx);
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },
  watch: {
    inactive(newVal, oldVal) {
      if (newVal) {
        for (var byte of this.patternRow.bytes) byte.wildcard = true;
      }
    },
  },
};
</script>

<style>
.patternrow {
  margin-top: 5px;
}
.inactive {
  filter: opacity(0.5);
}
.contexticon {
  margin-left: 0.5em;
  cursor: pointer;
}
</style>