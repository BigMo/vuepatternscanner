<template>
  <b-container style="padding: 0px">
    <b-row>
      <b-col>
        <b-jumbotron
          header="VuePatternScanner"
          lead="Easily generate and test patterns from hexdumps and disassembly."
        >
          <p>
            For more information on pattern scanning, read
            <a
              href="https://www.unknowncheats.me/forum/general-programming-and-reversing/171994-understanding-pattern-scanning-concept.html"
              target="_blank"
              >&quot;[Information] Understanding the pattern scanning
              concept&quot;</a
            >
            and
            <a
              href="https://www.unknowncheats.me/forum/general-programming-and-reversing/133228-implement-pattern-scanning-obtain-offsets-dynamically.html"
              target="_blank"
              >&quot;[Tutorial] How to implement pattern-scanning to obtain
              offsets dynamically&quot;</a
            >.
          </p>
          <b-button variant="primary" href="/workbench">
            <font-awesome-icon icon="rocket" />
            Get Started</b-button
          >
          <b-button
            variant="secondary"
            class="floatbutton"
            href="https://github.com/BigMo/vuepatternscanner"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'github']" /> View on GitHub
          </b-button>
        </b-jumbotron>
      </b-col>
    </b-row>
    <!-- TOC-->
    <b-row>
      <b-col>
        <b-card title="Table of Contents">
          <b-card-text>
            Here's a quick list of topics covered for a short &quot;How
            to&quot;:
          </b-card-text>

          <b-card-text>
            <b-list-group>
              <b-list-group-item href="#project-structure" class="card-link"
                >Project Structure</b-list-group-item
              >
            </b-list-group>
            <b-list-group>
              <b-list-group-item href="#creating-patterns" class="card-link"
                >Creating Patterns</b-list-group-item
              >
            </b-list-group>
            <b-list-group>
              <b-list-group-item href="#scanning-files" class="card-link"
                >Scanning Files</b-list-group-item
              >
            </b-list-group>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <!-- Project Structure-->
    <b-row>
      <b-col>
        <b-card
          id="project-structure"
          title="Project Structure"
          sub-title="How stuff is organized in this app."
          class="space"
        >
          <b-card-text>
            In VuePatternScanner you create multiple <u><i>projects</i></u> but
            you can only work on one at a time. Projects consist of
            <u><i>groups</i></u> that can hold multiple <u><i>patterns</i></u
            >. Patterns are made up of <i>bytes</i> and a <i>mask</i> where the
            mask denotes which bytes to actually scan for and which to skip
            during scanning (wildcards). You can name your projects, groups and
            patterns, <i>of course</i>.
          </b-card-text>
          <b-card-text>
            A project could be organized like this:
            <b-card>
              <ul>
                <li>Name: &quot;Among Us&quot;</li>
                <li>
                  Groups:
                  <ul>
                    <li>
                      0
                      <ul>
                        <li>Name: &quot;Static Pointers&quot;</li>
                        <li>
                          Patterns:
                          <ul>
                            <li>
                              0
                              <ul>
                                <li>Name: &quot;PlayerControls&quot;</li>
                                <li>
                                  Bytes: &quot;E9 17 FF FF FF 8B 46 34 85 C0 0F
                                  84 0A 01 00 00&quot;
                                </li>
                                <li>Mask: &quot;xxxxxxxxxxxxxxxx&quot;</li>
                              </ul>
                            </li>
                            <li>
                              1
                              <ul>
                                <li>Name: &quot;ShipStatus&quot;</li>
                                <li>
                                  Bytes: &quot;6A 00 50 E8 04 23 E4 FF 8B 0D 04
                                  C1 43 11&quot;
                                </li>
                                <li>Mask: &quot;xxxxxxxxxxxxxx&quot;</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </b-card>
            And as you can see, HTML lists are not suited to do the job of
            displaying hierarchical data very well.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <!-- Creating Patterns-->
    <b-row>
      <b-col>
        <b-card id="creating-patterns" title="Creating Patterns" class="space">
          <b-card-text>
            Before you can create patterns, you have to have at least one group
            in your project. To create a group, simply press this button and
            enter a name into the modal that is brought up:
          </b-card-text>
          <b-button variant="success" size="sm">
            <font-awesome-icon icon="plus" /> New Group
          </b-button>
          <b-card-text>
            After you created a group, you will see a group-component like this:
          </b-card-text>
          <GroupListComp :group="dummyGroup" :dummy="true" />
          <b-card-text>
            To add a pattern to a group, simply press the &quot;New
            Pattern&quot; button of that group and fill out the modal that pops
            up. In this modal you can specify a name, some input and a parser.
            Here is an overview of the various parsers and what input format
            they expect:
          </b-card-text>
          <!-- Parser Accordion -->
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1" v-for="info in infos" :key="info.id">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle="info.id" variant="info">{{
                  info.name
                }}</b-button>
              </b-card-header>
              <b-collapse
                :id="info.id"
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-card-text>
                    Input:
                    <b-card>
                      <pre><code>{{info.input}}</code></pre>
                    </b-card>
                    Pattern:
                    <PatternComp
                      :pattern="info.pattern"
                      :editable="false"
                    ></PatternComp>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import GroupListComp from "@/components/GroupListComp.vue";
import PatternComp from "@/components/PatternComp.vue";
import {
  Project,
  Group,
  Pattern,
  PatternRow,
  PatternByte,
} from "@/model/project.js";
export default {
  name: "Home",
  components: { GroupListComp, PatternComp },
  data: () => ({
    dummyGroup: new Group("Dummy Group"),
    infos: [
      {
        name: "Hex Parser",
        id: "hexparser",
        input: `DEADCODE
DEADBEEF`,
        pattern: new Pattern("Hex Pattern", [
          new PatternRow("", [
            new PatternByte(0xde),
            new PatternByte(0xad),
            new PatternByte(0xc0),
            new PatternByte(0xde),
          ]),
          new PatternRow("", [
            new PatternByte(0xde),
            new PatternByte(0xad),
            new PatternByte(0xbe),
            new PatternByte(0xef),
          ]),
        ]),
      },
      {
        name: "Cheat Engine Parser",
        id: "cheatengineparser",
        input: `Discord.v8::internal::DeclarationScope::new_target_var+61285 - 57                    - push edi
Discord.v8::internal::DeclarationScope::new_target_var+61286 - FF 72 10              - push [edx+10]
Discord.v8::internal::DeclarationScope::new_target_var+61289 - 50                    - push eax
Discord.v8::internal::DeclarationScope::new_target_var+6128A - E8 5112FAFF           - call Discord.v8::internal::DeclarationScope::new_target_var+24E0
Discord.v8::internal::DeclarationScope::new_target_var+6128F - 31 C9                 - xor ecx,ecx`,
        pattern: new Pattern("Cheat Engine Pattern", [
          new PatternRow("push edi", [new PatternByte(0x57)]),
          new PatternRow("push [edx+10]", [
            new PatternByte(0xff),
            new PatternByte(0x72),
            new PatternByte(0x10),
          ]),
          new PatternRow("push eax", [new PatternByte(0x50)]),
          new PatternRow(
            "call Discord.v8::internal::DeclarationScope::new_target_var+24E0",
            [
              new PatternByte(0xe8),
              new PatternByte(0x51),
              new PatternByte(0x12),
              new PatternByte(0xfa),
              new PatternByte(0xff),
            ]
          ),
          new PatternRow("xor ecx,ecx", [
            new PatternByte(0x31),
            new PatternByte(0xc9),
          ]),
        ]),
      },
      {
        name: "IDA Parser",
        id: "idaparser",
        input: `.text:000000014027EA57 89 29                                                           mov     [rcx], ebp
.text:000000014027EA59 40 88 69 04                                                     mov     [rcx+4], bpl
.text:000000014027EA5D 48 8D 54 24 50                                                  lea     rdx, [rsp+48h+arg_0]
.text:000000014027EA62 48 8B 0D 67 3C 9A 04                                            mov     rcx, cs:g_pEntityManager
.text:000000014027EA69 E8 42 01 01 00                                                  call    sub_14028EBB0`,
        pattern: new Pattern("Cheat Engine Pattern", [
          new PatternRow("mov [rcx], ebp", [
            new PatternByte(0x89),
            new PatternByte(0x29),
          ]),
          new PatternRow("mov [rcx+4], bpl", [
            new PatternByte(0x40),
            new PatternByte(0x55),
            new PatternByte(0x69),
            new PatternByte(0x04),
          ]),
          new PatternRow("lea rdx, [rsp+48h+arg_0]", [
            new PatternByte(0x48),
            new PatternByte(0x8d),
            new PatternByte(0x54),
            new PatternByte(0x24),
            new PatternByte(0x50),
          ]),
          new PatternRow("mov rcx, cs:g_pEntityManager", [
            new PatternByte(0x48),
            new PatternByte(0x8b),
            new PatternByte(0x0d),
            new PatternByte(0x67),
            new PatternByte(0x3c),
            new PatternByte(0x9a),
            new PatternByte(0x04),
          ]),
          new PatternRow("call sub_14028EBB0", [
            new PatternByte(0xe8),
            new PatternByte(0x42),
            new PatternByte(0x01),
            new PatternByte(0x01),
            new PatternByte(0x00),
          ]),
        ]),
      },
      {
        name: "Ghidra Parser",
        id: "ghidraparser",
        input: `        105c635e 83 C4 08        ADD        ESP,0x8
        105c6361 8B 40 5C        MOV        EAX,dword ptr [EAX + 0x5c]
        105c6364 8B 30           MOV        ESI,dword ptr [EAX]
        105c6366 A1 C0 BF        MOV        EAX,[JENJGDMOEOC__TypeInfo]                      = NaP
                 43 11
`,
        pattern: new Pattern("Cheat Engine Pattern", [
          new PatternRow("ADD ESP,0x8", [
            new PatternByte(0x83),
            new PatternByte(0xc4),
            new PatternByte(0x08),
          ]),
          new PatternRow("MOV EAX,dword ptr [EAX + 0x5c]", [
            new PatternByte(0x8b),
            new PatternByte(0x40),
            new PatternByte(0x5c),
          ]),
          new PatternRow("MOV ESI,dword ptr [EAX]", [
            new PatternByte(0x8b),
            new PatternByte(0x30),
          ]),
          new PatternRow("MOV EAX,[JENJGDMOEOC__TypeInfo] = NaP", [
            new PatternByte(0xa1),
            new PatternByte(0xc0),
            new PatternByte(0xbf),
          ]),
          new PatternRow("", [new PatternByte(0x43), new PatternByte(0x11)]),
        ]),
      },
    ],
  }),
  methods: {
    showToast: function (title, body) {
      this.$bvToast.toast(body, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true,
      });
    },
  },
};
</script>

<style>
.space {
  margin-top: 1em;
}
.floatbutton {
  position: fixed;
  bottom: 1em;
  right: 1em;
}
</style>