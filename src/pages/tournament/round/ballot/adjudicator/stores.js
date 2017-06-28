
export default {
  namespaced: true,
  state: {
    steps: ['speaker', 'score', 'winner', 'check', 'done'],
    roles: ['leader', 'dupty', 'member', 'reply'],
    sequence: ['../speaker', 'gov-leader', 'opp-leader', 'gov-dupty', 'opp-dupty', 'gov-member', 'opp-member', 'opp-reply', 'gov-reply', '../winner'],
    style: {
      roles: {
        gov: {
          leader: { long: 'Prime Minister', abbr: 'PM' },
          dupty: { long: 'Dupty Prime Minister', abbr: 'DPM' },
          member: { long: 'Member of Government', abbr: 'MG' },
          reply: { long: 'Government Reply', abbr: 'GR' }
        },
        opp: {
          leader: { long: 'Leader of Opposition', abbr: 'LO' },
          dupty: { long: 'Dupty Leader of Opposition', abbr: 'DLO' },
          member: { long: 'Member of Opposition', abbr: 'MO' },
          reply: { long: 'Opposition Reply', abbr: 'OR' }
        }
      }
    },
    winner: null,
    gov: {
      side: 'gov',
      team: null,
      result: {
        leader: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        dupty: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        member: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        reply: {
          speaker_id: null,
          matter: 2.5,
          manner: 2.5,
          best_debater: false,
          poi_prize: false
        }
      }
    },
    opp: {
      side: 'opp',
      team: null,
      result: {
        leader: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        dupty: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        member: {
          speaker_id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        reply: {
          speaker_id: null,
          matter: 2.5,
          manner: 2.5,
          best_debater: false,
          poi_prize: false
        }
      }
    }
  },
  getters: {
    current_step (state, getters, rootState, rootGetters) {
      return state.steps.findIndex(step => step === rootState.route.name)
    }
  },
  mutations: {
    teams (state, payload) {
      state.gov.team = payload.teams[0]
      state.opp.team = payload.teams[1]
    },
    gov_pos_name (state, payload) {
      state.gov.result[payload.pos_name].speaker_id = payload.value
    },
    opp_pos_name (state, payload) {
      state.opp.result[payload.pos_name].speaker_id = payload.value
    },
    input_result (state, payload) {
      state[payload.side].result[payload.role][payload.key] = payload.value
    },
    winner (state, payload) {
      state.winner = payload.winner
    }
  },
  actions: {
    init_ballot ({ commit, rootState }, payload) {
      commit('teams', { teams: payload.teams })
    }
  }
}
