import Vue from 'vue'
import Vuex from 'vuex'

import { Project, Group, Pattern, PatternRow, PatternByte } from '@/model/project.js'

Vue.use(Vuex)

const POPULATE_JSON = function (project, obj) {
  project.name = obj.name
  for (var g in obj.groups) {
    var group = obj.groups[g]
    var _group = new PatternGroup(group.name)
    for (var p in group.patterns) {
      var pattern = group.patterns[p]
      var _pattern = new Pattern(pattern.name)
      for (var r in pattern.rows) {
        var row = pattern.rows[r]
        var _row = new PatternRow(row.comment)
        for (var b in row.bytes) {
          var byte = row.bytes[b]
          _row.bytes.push(new PatternByte(byte.value, byte.wildcard))
        }
        _pattern.rows.push(_row)
      }
      _group.patterns.push(_pattern)
    }
    project.groups.push(_group)
  }
}

const store = new Vuex.Store({
  state: {
    projects: null,
    currentPattern: null,
    currentProject: null
  },
  mutations: {
    saveLocally(state) {
      localStorage.setItem('VPSProjects', JSON.stringify(state.currentProjects))
    },
    loadLocally(state) {
      state.projects = []
      json = localStorage.getItem('VPSProjects')
      if (json) {
        var arr = JSON.parse(json)
        state.projects = arr.map(obj => POPULATE_JSON(new Project(), obj))
      }
      state.currentProject = state.projects.length > 0 ? state.projects[0] : null;
      state.currentPattern = state.currentProject ? state.currentProject.firstPattern : null;
    },
    createInitial(state) {
      state.currentProject = Project.newProject()
      state.currentPattern = state.currentProject.groups[0].patterns[0]
    },
    setCurrentProject(state, project) {
      state.currentProject = project;
      state.currentPattern = state.currentProject ? state.currentProject.firstPattern : null;
    },
    setCurrentPattern(state, pattern) {
      state.currentPattern = pattern;
    },
    removeGroup(state, group) {
      state.currentProject.groups = state.currentProject.groups.filter(g => g != group)
      if (state.currentProject.groups.length > 0 && state.currentProject.groups[0].patterns.length > 0)
        state.currentPattern = state.currentProject.groups[0].patterns[0]
      else
        state.currentPattern = null
    },
    removePattern(state, pattern) {
      var groups = state.currentProject.groups.filter(g => g.patterns.findIndex(p => p == pattern) != -1);
      if (groups.length == 0) return;
      var group = groups[0];
      group.patterns = group.patterns.filter(p => p != pattern);
      if (state.currentPattern == pattern)
        state.currentPattern = group.firstPattern ?? state.currentProject.firstPattern;
    },
    removeProject(state, project) {
      state.projects = state.projects.filter(p => p != project)
      state.currentProject = state.projects.length > 0 ? state.projects[0] : null;
      state.currentPattern = state.currentProject ? state.currentProject.firstPattern : null;
    },
    createGroup(state, name) {
      state.currentProject.groups.push(new Group(name))
    },
    createPattern(state, data) {
      var groups = state.currentProject.groups.filter(g => g.name == data.group.name)
      if (groups)
        groups[0].patterns.push(data.pattern)
    },
    createProject(state, name) {
      var proj = new Project(name);
      state.projects.push(proj);
      state.currentProject = proj;
    }
  },
  getters: {
    projects: state => state.projects,
    groups: state => {
      return state && state.currentProject ? state.currentProject.groups : null;
    },
    currentPattern: state => state.currentPattern,
    currentProject: state => state.currentProject,
    projectNameTaken: (state) => (name) => {
      return state.projects.filter(p => p.name == name).length > 0;
    },
    groupNameTaken: (state) => (name) => {
      return state.currentProject && state.currentProject.hasGroupOfName(name);
    }
  }
})

export default store
