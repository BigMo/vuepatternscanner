<template>
  <b-card no-body>
    <b-card-header header-bg-variant="dark" header-text-variant="white"
      >Groups
      <b-button variant="success" size="sm" class="addGroupButton" v-b-modal.addGroup>
                  <font-awesome-icon icon="plus" /> New Group
              </b-button>
      </b-card-header
    >
      <GroupListComp
        v-for="group in groups"
        :key="groups.findIndex((g) => g == group)"
        :group="group"
      >
      </GroupListComp>
    <NewGroupModal id="addGroup" @groupCreated="addNewGroup"></NewGroupModal>
  </b-card>
</template>

<script>
import store from "@/store/index.js";
import GroupListComp from "@/components/GroupListComp.vue";
import NewGroupModal from "@/components/NewGroupModal.vue";
export default {
  name: "GroupsComp",
  components: { GroupListComp, NewGroupModal },
  computed: {
    groups() {
      if (store && store.getters) return store.getters.groups;
      else return null;
    },
  },
  methods: {
    addNewGroup: function (name) {
      store.commit("createGroup", name);
    },
  },
};
</script>

<style>
</style>