<template>
  <b-container style="padding: 0px;">
    <b-row>
      <b-col>
        <FileScanningComp class="card-dist"></FileScanningComp>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4" class="left-column">
        <b-container style="padding: 0px;">
          <b-row v-if="groups">
            <b-col>
              <GroupListComp v-for="group in groups" :key="groups.findIndex(g=>g == group)" :group="group"> </GroupListComp>
            </b-col>
            </b-row>
          <b-row>
            <b-col>
              <b-button variant="success" size="sm" class="addGroupButton" v-b-modal.addGroup>
                  <font-awesome-icon icon="plus" /> New Group
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
      <b-col cols="8" class="right-column">
        <PatternComp :pattern="currentPattern" :showName="true" :showDelete="true" v-if="currentPattern" :editable="true"></PatternComp>
      </b-col>
    </b-row>
    <NewGroupModal id="addGroup" @groupCreated="addNewGroup"></NewGroupModal>
  </b-container>
</template>

<script>
import GroupListComp from "@/components/GroupListComp.vue";
import FileScanningComp from "@/components/FileScanningComp.vue";
import NewGroupModal from "@/components/NewGroupModal.vue";
import PatternComp from "@/components/PatternComp.vue";
import store from "@/store/index.js";

export default {
  name: "Workbench",
  components: { GroupListComp, PatternComp, NewGroupModal,FileScanningComp },
  data: function () {
    return {
      store: store,
      count: 10,
    };
  },
  methods: {
    linkClicked: function (event, data) {
    },
  },
  mounted: function () {
    store.commit("createInitial");
  },
  computed: {
    currentPattern: function () {
      return store.getters.currentPattern;
    },
    groups: function() {
      if (store && store.getters)
        return store.getters.groups
      else
        return null
    }
  },
  methods:{
    addNewGroup:function(name) {
      store.commit('createGroup', name)
    }
  }
};
</script>

<style>
.addGroupButton{
  float:right;
  clear: none;
}
.left-column{
  padding-left:0px;
}
.right-column{
  padding:0px;
}
.card-dist {
  margin-bottom: 1em;
}
</style>
