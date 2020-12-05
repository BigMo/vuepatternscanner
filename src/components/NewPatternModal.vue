<template>
  <b-modal
    size="lg"
    :id="id"
    title="Create New Pattern"
    @ok="onOk"
    :ok-disabled="pattern == null"
  >
    <b-container>
      <b-row>
        <b-col sm="4">
          <label for="patternName">Name:</label>
        </b-col>
        <b-col sm="8">
          <b-form-input
            id="patternName"
            v-model="patternName"
            :state="!nameError"
          ></b-form-input>
          <b-form-invalid-feedback id="patternName">
            {{ nameError }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="patternInput">Input:</label>
        </b-col>
        <b-col sm="8">
          <b-form-textarea
            id="patternInput"
            v-model="patternInput"
            rows="4"
            :state="!inputError"
          ></b-form-textarea>
          <b-form-invalid-feedback id="patternInput">
            {{ inputError }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="parser">Parser:</label>
        </b-col>
        <b-col sm="8">
          <b-form-select
            id="parser"
            v-model="parser"
            :options="parserOptions"
            :state="!parserError"
          ></b-form-select>
          <b-form-invalid-feedback id="parser">
            {{ parserError }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-if="pattern">
      <PatternComp :pattern="pattern" :editable="false"></PatternComp>
    </b-container>
  </b-modal>
</template>

<script>
import PatternComp from "@/components/PatternComp.vue";
import store from "@/store/index.js";
import { PARSERS } from "@/plugins/PatternParser.js";
import { Pattern, PatternRow, PatternByte } from "@/model/project.js";

export default {
  name: "NewPatternModal",
  components: { PatternComp },
  props: ["id", "group"],
  data: function () {
    return {
      store: store,
      patternName: "",
      patternInput: "",
      nameError: null,
      inputError: null,
      parserError: null,
      parser: null,
    };
  },
  methods: {
    onOk: function (event) {
      this.$emit("patternCreated", this.group, this.pattern);
    },
    checkName: function () {
      if (this.patternName == null || this.patternName.length == 0)
        return (this.nameError = "Enter a name.");
      //if (this.group && this.group.hasPatternOfName(this.patternName))
      //  return (this.nameError = "Pattern with this name already exists.");
      this.nameError = null;
    },
    checkInput: function () {
      if (this.patternInput == null || this.patternInput.length == 0)
        return (this.inputError = "Please provide input.");
      this.inputError = null;
    },
    checkParser: function () {
      if (this.parser == null) return (this.parserError = "Select a parser.");
      this.parserError = null;
    },
  },
  computed: {
    parserOptions: function () {
      return PARSERS.map((p) => {
        return {
          value: p,
          text: p.name,
        };
      });
    },
    pattern: function () {
      if (this.nameError || this.inputError || this.parserError || !this.parser)
        return null;
      var output = this.parser.parse(this.patternInput);
      return new Pattern(
        this.patternName,
        output.rows.map(
          (r) =>
            new PatternRow(
              r.comment,
              r.bytes.map((b) => new PatternByte(b, false))
            )
        )
      );
    },
  },
  watch: {
    patternName: function (newVal, oldVal) {
      this.checkName();
    },
    patternInput: function (newVal, oldVal) {
      this.checkInput();
    },
    parser: function (newVal, oldVal) {
      this.checkParser();
    },
  },
  mounted: function () {
    this.checkName();
    this.checkInput();
    this.checkParser();
  },
};
</script>

<style>
</style>