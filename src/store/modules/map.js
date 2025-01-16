const state = {
  map: null,
  currentLayer: '',
  currentPage: null,
  currentPart: ''
}
const mutations = {
  SET_LAYER: (state, layer) => {
    state.currentLayer = layer
  },
  SET_PAGE: (state, page) => {
    state.currentPage = page
  },
  SET_PART: (state, part) => {
    state.currentPart = part
  },
  SET_MAP: (state, map) => {
    state.map = map
  }
}
const actions = {
  setPart({
    commit
  }, part) {
    commit('SET_PART', part)
  },
  setLayer({
    commit
  }, layer) {
    commit('SET_LAYER', layer)
  },
  setPage({
    commit
  }, page) {
    commit('SET_PAGE', page)
  },
  setMap({
    commit
  }, map) {
    commit('SET_MAP', map)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
