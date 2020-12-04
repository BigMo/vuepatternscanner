<template>
  <b-card
    no-body
    class="groupList"
    @mouseover="showDel = true"
    @mouseleave="showDel = false"
  >
    <b-card-header @click="toggleVisible" class="groupListHeader">
      <font-awesome-icon :icon="visible ? 'chevron-up' : 'chevron-down'" />
      {{ group.name }}
      <div style="float: right" v-if="showDel">
        <font-awesome-icon
          icon="trash"
          class="deleteButton"
          @click="deleteGroup"
        />
      </div>
    </b-card-header>
    <b-collapse :visible="visible" :id="group.name">
      <b-list-group>
        <b-list-group-item
          class="patternItem"
          v-for="p in group.patterns"
          :key="group.patterns.findIndex((pa) => pa == p)"
          @click="onPatternClick(p)"
          :active="currentPattern == p"
          >{{ p.name }}
        </b-list-group-item>
        <b-list-group-item class="groupListButton">
          <b-button
            variant="success"
            size="sm"
            v-b-modal="`${group.name}.newPattern`"
            :disabled="this.dummy"
          >
            <font-awesome-icon icon="plus" /> New Pattern
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-collapse>
    <NewPatternModal
      :id="`${group.name}.newPattern`"
      :group="group"
      @patternCreated="onPatternCreated"
    ></NewPatternModal>
  </b-card>
</template>

<script>
import NewPatternModal from "@/components/NewPatternModal.vue";
import store from "@/store/index.js";

export default {
  name: "GroupListComp",
  components: { NewPatternModal },
  props: ["group", "dummy"],
  data: function () {
    return {
      visible: true,
      showDel: false,
    };
  },
  computed: {
    currentPattern: function () {
      return store.getters.currentPattern;
    },
  },
  methods: {
    onPatternCreated: function (group, pattern) {
      store.commit("createPattern", {
        group: group,
        pattern: pattern,
      });
    },
    deleteGroup: function (event) {
      if (this.dummy) return;
      event.stopPropagation();
      this.$bvModal
        .msgBoxConfirm(
          `Do you really want to delete the group "${this.group.name}"?`,
          {
            title: "Deleting Group",
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
          if (value) store.commit("removeGroup", this.group);
        })
        .catch((err) => {
          // An error occurred
        });
    },
    onPatternClick: function (pattern) {
      if (this.dummy) return;
      store.commit("setCurrentPattern", pattern);
    },
    collapsePatterns: function () {
      this.visible = false;
    },
    toggleVisible: function (event) {
      this.visible = !this.visible;
    },
  },
  watch: {
    currentPattern: function (newVal, oldVal) {},
  },
};
</script>

<style>
.patternItem {
  cursor: pointer;
}
.groupList {
  margin-bottom: 1em;
}
.groupListButton {
  padding: 0.4em !important;
  text-align: right;
}
.groupListHeader {
  cursor: pointer;
}

.deleteButton {
  cursor: pointer;
}
</style>