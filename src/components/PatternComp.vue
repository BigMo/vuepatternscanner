<template>
  <b-card no-body :title="showName ? pattern.name : 'Pattern'" style="overflow:overlay;">
    <b-card-header header-bg-variant="dark" header-text-variant="white">
      <ClickToEdit v-if="editable" :value="pattern.name" @input="rename"></ClickToEdit>
      <span v-else>Pattern</span>
      <!--{{showName ? pattern.name : 'Pattern'}}-->
      <div style="float: right" v-if="showDelete">
        <font-awesome-icon
          icon="trash"
          class="deleteButton"
          @click="deletePattern"
        />
      </div>
    </b-card-header>
      <b-card-body>
      <b-card-text>
        <PatternRowComp
          v-for="r in pattern.rows"
          :key="pattern.rows.findIndex((row) => row == r)"
          :patternRow="r"
          :editable="editable"
          :idx="pattern.rows.findIndex((row) => row == r)"
        ></PatternRowComp>
      </b-card-text>
    </b-card-body>
    <!--<b-card-body class="card-segment">
      <b-card-text>
        testlel
      </b-card-text>
    </b-card-body>-->
    <b-card-footer>
      <table class="table table-sm table-borderless">
        <tbody>
          <tr>
            <td>Bytes:</td>
            <td>{{ pattern.hexString }}</td>
          </tr>
          <tr>
            <td>Mask:</td>
            <td>{{ pattern.maskString }}</td>
          </tr>
          <tr>
            <td>Pattern:</td>
            <td>{{ pattern.patternString }}</td>
          </tr>
          <tr>
            <td>Length:</td>
            <td>{{ pattern.maskString.length }} bytes</td>
          </tr>
        </tbody>
      </table>
    </b-card-footer>
  </b-card>
</template>

<script>
import PatternRowComp from "@/components/PatternRowComp.vue";
import ClickToEdit from '@/components/ClickToEdit.vue'
import store from "@/store/index.js";

export default {
  name: "PatternComp",
  props:['pattern', 'showName', 'showDelete', 'editable'],
  components: { PatternRowComp, ClickToEdit },
  methods: {
    deletePattern(event) {
      event.stopPropagation();
      this.$bvModal
        .msgBoxConfirm(
          `Do you really want to delete the pattern "${this.pattern.name}"?`,
          {
            title: "Deleting Pattern",
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
          if (value) store.commit("removePattern", this.pattern);
        })
        .catch((err) => {
          // An error occurred
        });
    },
    rename(name) {
      store.commit('renamePattern', name)
    }
  }
};
</script>

<style>
.card-segment {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
</style>