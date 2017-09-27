
export default {
  namespaced: true,
  state: {
    complete: false,
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
    score_sheet: null,
    gov: {
      side: 'gov',
      result: {
        leader: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        deputy: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        member: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        reply: {
          id: null,
          matter: 2.5,
          manner: 2.5,
          best_debater: false,
          poi_prize: false
        }
      }
    },
    opp: {
      side: 'opp',
      result: {
        leader: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        deputy: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        member: {
          id: null,
          matter: 5,
          manner: 5,
          best_debater: false,
          poi_prize: false
        },
        reply: {
          id: null,
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
    },
    converted (state) {
        if (!state.complete) {
            return null
        }
        let roles = ['leader', 'deputy', 'member', 'reply']
        let converted_result = {
            gov: {
                id: state.gov.team.id,
                name: state.gov.team.name,
                win: state.winner === 'gov',
                speakers: roles.map(role => state.gov.result[role].id),
                matters: roles.map(role => state.gov.result[role].matter),
                manners: roles.map(role => state.gov.result[role].manner),
                scores: roles.map(role => state.gov.result[role].matter+state.gov.result[role].manner),
                best: roles.map(role => state.gov.result[role].best_debater),
                poi: roles.map(role => state.gov.result[role].poi_prize)
            },
            opp: {
                id: state.opp.team.id,
                name: state.opp.team.name,
                win: state.winner !== 'gov',
                speakers: roles.map(role => state.opp.result[role].id),
                matters: roles.map(role => state.opp.result[role].matter),
                manners: roles.map(role => state.opp.result[role].manner),
                scores: roles.map(role => state.opp.result[role].matter+state.opp.result[role].manner),
                best: roles.map(role => state.opp.result[role].best_debater),
                poi: roles.map(role => state.opp.result[role].poi_prize)
            }
        }
        return converted_result
    }
  },
  mutations: {
    teams (state, payload) {
      state.score_sheet = payload.score_sheet
    },
    gov_pos_name (state, payload) {
      state.gov.result[payload.pos_name].id = payload.value
    },
    opp_pos_name (state, payload) {
      state.opp.result[payload.pos_name].id = payload.value
    },
    input_result (state, payload) {
      state[payload.side].result[payload.role][payload.key] = payload.value
    },
    winner (state, payload) {
      state.winner = payload.winner
    },
    complete (state) {
      state.complete = true
    }
  },
  actions: {
    init_ballot ({ commit, rootState }, payload) {
        commit('teams', payload)
    },
    send_ballot ({ getters, state, commit, rootState }, payload) {
        let converted = getters.converted
        let raw_debater_results = []
        for (let id of converted.gov.speakers) {
            let raw_debater_result = {
                id,
                r: state.score_sheet.r,
                from_id: state.score_sheet.adjudicator.id,
                weight: 1,
                scores
            }
        }
    }
  }
}
