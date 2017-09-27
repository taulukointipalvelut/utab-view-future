
export default {
  namespaced: true,
  state: {
    steps: ['speaker', 'score', 'winner', 'check', 'done'],
    roles: ['leader', 'deputy', 'member', 'reply'],
    sequence: ['../speaker', 'gov-leader', 'opp-leader', 'gov-deputy', 'opp-deputy', 'gov-member', 'opp-member', 'opp-reply', 'gov-reply', '../winner'],
    style: {
      roles: {
        gov: {
          leader: { long: 'Prime Minister', abbr: 'PM' },
          deputy: { long: 'Member of Government1', abbr: 'MG1' },
          member: { long: 'Member of Government2', abbr: 'MG2' },
          reply: { long: 'Government Reply', abbr: 'GR' }
        },
        opp: {
          leader: { long: 'Leader of Opposition', abbr: 'LO' },
          deputy: { long: 'Member of Opposition1', abbr: 'MO1' },
          member: { long: 'Member of Opposition2', abbr: 'MO2' },
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
        deputy: {
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
        deputy: {
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
      state.gov.team = payload.score_sheet.gov
      state.opp.team = payload.score_sheet.opp
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
        commit('teams', payload)
    },
    send_ballot ({ commit, rootState }, payload) {
        //pass
    }
  }
}
