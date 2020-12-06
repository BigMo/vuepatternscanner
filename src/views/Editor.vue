<template>
  <b-container style="padding: 0px">
    <b-row>
      <b-col>
        <FileScanningComp class="card-dist"></FileScanningComp>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4" class="left-column">
        <b-container style="padding: 0px;">
          <b-row>
            <b-col>
            <ProjectComp class="card-dist"></ProjectComp>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
            <GroupsComp></GroupsComp>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
      <b-col cols="8" class="right-column">
        <PatternComp
          :pattern="currentPattern"
          :showName="true"
          :showDelete="true"
          v-if="currentPattern"
          :editable="true"
        ></PatternComp>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ProjectComp from "@/components/ProjectComp.vue";
import GroupsComp from "@/components/GroupsComp.vue";
import GroupListComp from "@/components/GroupListComp.vue";
import FileScanningComp from "@/components/FileScanningComp.vue";
import PatternComp from "@/components/PatternComp.vue";
import store from "@/store/index.js";

export default {
  name: "Editor",
  components: {
    ProjectComp,
    PatternComp,
    FileScanningComp,
    GroupsComp,
  },
  data: function () {
    return {
      store: store,
      count: 10,
    };
  },
  methods: {
    linkClicked: function (event, data) {},
  },
  mounted: function () {
    //store.commit("createInitial");
  },
  computed: {
    currentPattern: function () {
      return store.getters.currentPattern;
    },
    groups: function () {
      if (store && store.getters) return store.getters.groups;
      else return null;
    },
  }
};
</script>

<style>
.addGroupButton {
  float: right;
  clear: none;
}
.left-column {
  padding-left: 0px;
}
.right-column {
  padding: 0px;
}
.card-dist {
  margin-bottom: 1em;
}
</style>
