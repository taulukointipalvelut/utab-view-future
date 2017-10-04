let initial_state = {
  complete: false,
  steps: ['speaker', 'score', 'winner', 'check', 'done'],
  roles: ['leader', 'deputy', 'member', 'reply'],
  sequence: ['../speaker', 'og-leader', 'oo-leader', 'og-deputy', 'oo-deputy', 'og-member', 'oo-member', 'oo-reply', 'og-reply', '../winner'],
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
        matter: 2.5,
        manner: 2.5,
        best_debater: false,
        poi_prize: false
      },
      member: {
        id: null,
        matter: 2.5,
        manner: 2.5,
        best_debater: false,
        poi_prize: false
      },
      reply: {
        id: null,
        matter: 5,
        manner: 5,
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
        matter: 2.5,
        manner: 2.5,
        best_debater: false,
        poi_prize: false
      },
      member: {
        id: null,
        matter: 2.5,
        manner: 2.5,
        best_debater: false,
        poi_prize: false
      },
      reply: {
        id: null,
        matter: 5,
        manner: 5,
        best_debater: false,
        poi_prize: false
      }
    }
  }
}

export default {
  namespaced: true,
  state: JSON.parse(JSON.stringify(initial_state)),
  getters: {
    current_step (state, getters, rootState, rootGetters) {
      return state.steps.findIndex(step => step === rootState.route.name)
    }
  },
  mutations: {
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
    },
    reset_state (state) {
      let sides = ['og', 'oo']
      let roles = ['leader', 'deputy', 'member', 'reply']
      for (let side of sides) {
          for (let role of roles) {
              state[side].result[role].id = null
              state[side].result[role].best_debater = false
              state[side].result[role].poi_prize = false
              state[side].result[role].matter = 5
              state[side].result[role].manner = 5
              if (role === 'deputy' || role === 'member') {
                  state[side].result[role].matter /= 2
                  state[side].result[role].manner /= 2
              }
          }
      }
    }
  },
  actions: {
    async send_ballot ({ getters, state, commit, dispatch, rootState }, payload) {
        let { raw_team_results, raw_speaker_results } = await dispatch('convert_from_ballot', payload)
        let payload1 = {
            raw_results: raw_team_results,
            tournament: payload.tournament,
            label: 'teams',
            label_singular: 'team'
        }
        let payload2 = {
            raw_results: raw_speaker_results,
            tournament: payload.tournament,
            label: 'speakers',
            label_singular: 'speaker'
        }
        return Promise.all([dispatch('send_raw_results', payload1, { root: true }), dispatch('send_raw_results', payload2, { root: true })])
    },
    convert_from_ballot ({ commit, state}, payload) {
        let score_sheet = payload.score_sheet
        if (!state.complete) {
            return null
        }
        let roles = ['leader', 'deputy', 'member', 'reply']
        let converted_result = {
            og: {
                id: score_sheet.teams.og,
                win: state.winner === score_sheet.teams.og,
                speakers: roles.map(role => state.og.result[role].id),
                matters: roles.map(role => state.og.result[role].matter),
                manners: roles.map(role => state.og.result[role].manner),
                scores: roles.map(role => state.og.result[role].matter+state.og.result[role].manner),
                best: roles.map(role => state.og.result[role].best_debater),
                poi: roles.map(role => state.og.result[role].poi_prize)
            },
            oo: {
                id: score_sheet.teams.oo,
                win: state.winner === score_sheet.teams.oo,
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
        let sides_label = {
            og: 'gov',
            oo: 'opp',
            cg: 'gov',
            co: 'opp'
        }
        for (let i of [0, 1]) {
            let side = sides[i]
            for (let id of Array.from(new Set(converted_result[side].speakers))) {
                let raw_speaker_result = {
                    id,
                    r: score_sheet.r,
                    from_id: score_sheet.from_id,
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
                r: score_sheet.r,
                from_id: score_sheet.from_id,
                weight: 1,
                win: converted_result[side].win,
                side: sides_label[side],
                opponents: [score_sheet.teams[sides[1-i]]]
            }
            raw_team_results.push(raw_team_result)
        }

        return { raw_team_results, raw_speaker_results }
    }
  }
}
