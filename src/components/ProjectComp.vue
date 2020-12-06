<template>
  <b-card no-body>
    <b-card-header header-bg-variant="dark" header-text-variant="white"
      >Project
      <ClickToEdit
        :value="projectName"
        @input="rename"
        :enquote="true"
      ></ClickToEdit>
    </b-card-header>
    <b-card-body>
      <b-container>
        <b-row>
          <b-col>
            <input type="file" ref="file" accept=".vps.json" style="display: none" @change="fileChange">
            <b-button-group>
              <b-button variant="primary" @click="$refs.file.click()">
                <font-awesome-icon icon="upload" />
                Import</b-button
              >
              <b-button @click="download" variant="primary"
                ><font-awesome-icon icon="download" /> Export</b-button
              >
            </b-button-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import store from "@/store/index.js";
import ClickToEdit from "@/components/ClickToEdit.vue";
export default {
  name: "ProjectComp",
  components: { ClickToEdit },
  data(){
    return {
      file: null
    }
  },
  methods: {
    fileChange(event) {
      console.log(event.target.files)
      if (event.target.files && event.target.files.length > 0) {
        this.file = event.target.files[0]
      }
    },
    download(event) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(JSON.stringify(store.getters.project))
      );
      element.setAttribute("download", `${store.getters.project.name}.vps.json`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    rename(name) {
      store.commit("renameProject", name);
    },
  },
  computed: {
    projectName() {
      return store != null && store.getters.project != null
        ? store.getters.project.name
        : null;
    },
    project() {
      return store != null ? store.getters.project : null;
    },
  },
  watch: {
    file(newVal, oldVal) {
      if (newVal) {
        var reader = new FileReader();
        reader.addEventListener('load', (ev) => {
          store.commit('importProject', event.target.result)
        });
        reader.readAsText(this.file, 'utf-8')
      }
    }
  }
};
</script>

<style>
</style>