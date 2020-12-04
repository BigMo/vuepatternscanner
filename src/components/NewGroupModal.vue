<template>
  <b-modal
    :id="id"
    title="Create New Group"
    @ok="onOk"
    :ok-disabled="error != null"
  >
    <b-container>
      <b-row>
        <b-col sm="4">
          <label for="groupName">Name:</label>
        </b-col>
        <b-col sm="8">
          <b-form-input
            id="groupName"
            v-model="groupName"
            :state="!error"
          ></b-form-input>
          <b-form-invalid-feedback id="groupName">
            {{error}}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import store from "@/store/index.js";
export default {
  name: "NewGroupModal",
  props: ["id"],
  data: function () {
    return {
      store: store,
      groupName: "",
      error: null,
    };
  },
  methods: {
    onOk: function (event) {
      this.$emit("groupCreated", this.groupName);
    },
    checkName: function () {
      if (this.groupName == null || this.groupName.length == 0)
        return (this.error = "Please enter a name.");
      if (this.store && this.store.getters.groups) {
        if (
          this.store.getters.groups.filter((g) => g.name == this.groupName)
            .length > 0
        )
          return (this.error = "Group with this name already exists.");
      }
      this.error = null;
    },
  },
  watch: {
    groupName: function (newVal, oldVal) {
      this.checkName();
    },
  },
  mounted: function () {
    this.checkName();
  },
};
</script>

<style>
</style>