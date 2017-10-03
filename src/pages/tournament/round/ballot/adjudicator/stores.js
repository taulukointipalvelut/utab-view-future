
export default {
  namespaced: true,
  state: {
    complete: false,
    steps: ['speaker', 'score', 'winner', 'check', 'done'],
    roles: ['leader', 'deputy', 'member', 'reply'],
    sequence: ['../speaker', 'gov-leader', 'opp-leader', 'gov-deputy', 'opp-deputy', 'gov-member', 'opp-member', 'opp-reply', 'gov-reply', '../winner'],
    style: {
      roles: {
        og: {
          leader: { long: 'Prime Minister', abbr: 'PM' },
          deputy: { long: 'Member of Government1', abbr: 'MG1' },
          member: { long: 'Member of Government2', abbr: 'MG2' },
          reply: { long: 'Government Reply', abbr: 'GR' }
        },
        oo: {
          leader: { long: 'Leader of Opposition', abbr: 'LO' },
          deputy: { long: 'Member of Opposition1', abbr: 'MO1' },
          member: { long: 'Member of Opposition2', abbr: 'MO2' },
          reply: { long: 'Opposition Reply', abbr: 'OR' }
        }
      }
    },
    winner: null,
    score_sheet: null,
    og: {
      side: 'og',
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
    oo: {
      side: 'oo',
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
            og: {
                id: state.score_sheet.og,
                win: state.winner === state.score_sheet.og,
                speakers: roles.map(role => state.og.result[role].id),
                matters: roles.map(role => state.og.result[role].matter),
                manners: roles.map(role => state.og.result[role].manner),
                scores: roles.map(role => state.og.result[role].matter+state.og.result[role].manner),
                best: roles.map(role => state.og.result[role].best_debater),
                poi: roles.map(role => state.og.result[role].poi_prize)
            },
            oo: {
                id: state.score_sheet.oo,
                win: state.winner === state.score_sheet.oo,
                speakers: roles.map(role => state.oo.result[role].id),
                matters: roles.map(role => state.oo.result[role].matter),
                manners: roles.map(role => state.oo.result[role].manner),
                scores: roles.map(role => state.oo.result[role].matter+state.oo.result[role].manner),
                best: roles.map(role => state.oo.result[role].best_debater),
                poi: roles.map(role => state.oo.result[role].poi_prize)
            }
        }

        let raw_team_results = []
        let raw_speaker_results = []
        let sides = ['og', 'oo']
        for (let i of [0, 1]) {
            let side = sides[i]
            for (let id of Array.from(new Set(converted_result[side].speakers))) {
                let raw_speaker_result = {
                    id,
                    r: state.score_sheet.r,
                    from_id: state.score_sheet.id,
                    weight: 1,
                    scores: [0, 1, 2, 3].map(
                        index => [0, 1, 2, 3].filter(index => converted_result[side].speakers[index] === id).includes(index) ?
                            converted_result[side].scores[index] : 0)
                }
                raw_speaker_results.push(raw_speaker_result)
            }

            let id = converted_result[side].id
            let raw_team_result = {
                id,
                r: state.score_sheet.r,
                from_id: state.score_sheet.id,
                weight: 1,
                win: converted_result[side].win,
                side: side,
                opponents: [state.score_sheet[sides[1-i]]]
            }
            raw_team_results.push(raw_team_result)
        }

        return {raw_team_results, raw_speaker_results}
    }
  },
  mutations: {
    teams (state, payload) {
      state.score_sheet = payload.score_sheet
    },
    og_pos_name (state, payload) {
      state.og.result[payload.pos_name].id = payload.value
    },
    oo_pos_name (state, payload) {
      state.oo.result[payload.pos_name].id = payload.value
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
        let {raw_team_results, raw_speaker_results} = getters.converted
        console.log(raw_team_results)
        console.log(raw_speaker_results)
        console.log("SEND_BALLOT")
    }
  }
}
