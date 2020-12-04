<template>
  <b-card no-body>
    <b-card-header header-bg-variant="dark" header-text-variant="white"
      >Scanning
      <b-badge v-if="results.length > 0">{{ results.length }}</b-badge>
    </b-card-header>
    <b-card-body>
      <b-container>
        <b-row>
          <b-col cols="6">
            <!-- Config -->
            <b-container>
              <!-- File -->
              <b-row>
                <b-col class="formcol"> File: </b-col>
                <b-col cols="10">
                  <b-form-file
                    id="input-file"
                    v-model="file"
                    :state="Boolean(file)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                </b-col>
              </b-row>
              <!-- Parser -->
              <b-row>
                <b-col class="formcol">Parser:</b-col>
                <b-col cols="10">
                  <b-form-select
                    id="input-parser"
                    v-model="parser"
                    :options="parsers"
                    :state="Boolean(parser)"
                    placeholder="Choose a file or drop it here..."
                  ></b-form-select>
                </b-col>
              </b-row>
              <!-- Segment -->
              <b-row>
                <b-col class="formcol"> Segment: </b-col>
                <b-col cols="10">
                  <b-form-select
                    id="input-segment"
                    v-model="segment"
                    :options="segmentOptions"
                    :state="Boolean(segment)"
                  ></b-form-select>
                </b-col>
              </b-row>
              <!--Buttons-->
              <b-row>
                <b-col style="padding-top: 0.75em">
                  <b-progress v-if="scanning">
                    <b-progress-bar
                      :value="progress * 100"
                      animated
                      :label="`${(progress * 100).toFixed(2)}%`"
                    ></b-progress-bar>
                  </b-progress>
                </b-col>
                <b-col md="auto" style="text-align: end">
                  <b-button-group>
                    <b-button
                      variant="primary"
                      :disabled="!canScan"
                      @click="runScan"
                    >
                      <font-awesome-icon icon="search" />
                      Scan
                    </b-button>
                    <b-button
                      variant="danger"
                      :disabled="!scanning"
                      @click="resetScan"
                    >
                      <font-awesome-icon icon="window-close" />
                      Stop</b-button
                    >
                  </b-button-group>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col cols="6">
            <b-container>
              <b-row>
                <b-col>
                  <b-table
                    sticky-header
                    responsive="sm"
                    :items="resultItems"
                    :fields="fields"
                    class="table table-sm"
                    style="height: 10em; overflow-y: auto"
                  >
                    <template #cell(offset)="data">
                      <code>{{ data.value }}</code>
                    </template>
                    <template #cell(bytes)="data">
                      <code>{{ data.value }}</code>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import { PARSERS } from "@/plugins/FileParser.js";
import store from "@/store/index.js";
import { formatHex } from "@/model/project.js";

export default {
  name: "FileScanningComp",
  data: function () {
    return {
      file: null,
      scanning: false,
      progress: 0,
      parser: null,
      segments: [],
      segment: null,
      results: [],
      worker: null,
      fields: [
        {
          key: "offset",
          stickyColumn: true,
        },
        {
          key: "bytes",
          stickyColumn: true,
        },
      ],
    };
  },
  mounted: function () {},
  methods: {
    runScan: function (event) {
      event.preventDefault();
      this.scanning = true;
      this.progress = 0;
      this.results = [];
      this.file
        .arrayBuffer()
        .then((buff) => {
          var args = {
            buffer: buff,
            bytes: this.currentPattern.bytesArray,
            mask: this.currentPattern.maskString,
            start: this.segment.start,
            end: this.segment.end,
          };
          this.worker = new Worker("sigscanner.js");
          this.worker.addEventListener("message", (msg) => {
            switch (msg.data.type) {
              case "found":
                this.results.push({
                  offset: msg.data.offset,
                  bytes: msg.data.bytes,
                });
                break;
              case "done":
                this.scanning = false;
                break;
              case "error":
                this.scanning = false;
                break;
              case "progress":
                this.progress = msg.data.progress;
            }
          });
          this.worker.postMessage(args);
        })
        .catch((err) => console.error(err));
    },
    resetScan: function (event) {
      event.preventDefault();
      this.worker.terminate();
      this.scanning = false;
    },
    getSegments: function () {
      if (this.file == null || this.parser == null) return (this.segments = []);
      this.file
        .arrayBuffer()
        .then((buf) => {
          this.segments = this.parser.getSegments(buf);
          if (this.segment == null && this.segments.length > 0)
          this.segment = this.segments[0]
        })
        .catch((e) => console.error(e));
    },
  },
  computed: {
    resultItems: function () {
      return this.results.map((r) => {
        return {
          offset: r.offset.toString(16),
          bytes: Array.from(r.bytes)
            .map((b) => formatHex(b, 2))
            .join(" "),
        };
      });
    },
    currentPattern: function () {
      return store.getters.currentPattern;
    },
    canScan: function () {
      return !this.scanning && Boolean(this.file) && this.parser && this.segment;
    },
    parsers: function () {
      return PARSERS.map((p) => {
        return {
          value: p,
          text: p.name,
        };
      });
    },
    segmentOptions: function () {
      return this.segments.map((s) => {
        return {
          value: s,
          text: `${s.name} (0x${s.start.toString(16)}-0x${s.end.toString(16)})`,
        };
      });
    },
  },
  watch: {
    file: function (newVal, oldVal) {
      this.getSegments();
    },
    parser: function (newVal, oldVal) {
      this.segment = null;
      this.getSegments();
    },
    parsers: function (newVal, oldVal) {
      if (this.parsers && this.parsers.length > 0) this.parser = newVal[0];
    },
  },
};
</script>

<style>
.formcol {
  text-align: end;
  padding: 0.5em;
  padding-right: 0px !important;
}
</style>