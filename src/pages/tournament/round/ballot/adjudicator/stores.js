
function object_adder (obj1, obj2) {
    let added = {}
    for (let key in obj1) {
        added[key] = obj1[key] + obj2[key]
    }
    return added
}

function scores_converter (result) {
    let id_to_roles = {}
    for (let role in result.speakers) {
        let id = result.speakers[role]
        if (id_to_roles.hasOwnProperty(id)) {
            id_to_roles[id].push(role)
        } else {
            id_to_roles[id] = [role]
        }
    }
    let converted = {}
    for (let id in id_to_roles) {
        let filtered_scores = {}
        for (let role in result.scores) {
            filtered_scores[role] = id_to_roles[id].includes(role) ? result.scores[role] : 0
        }
        converted[id] = filtered_scores
    }
    return converted
}

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
    result: {
      winner: null,
      gov: {
          speakers: {
              leader: null,
              deputy: null,
              member: null,
              reply: null
          },
          matters: {
              leader: 5,
              deputy: 2.5,
              member: 2.5,
              reply: 5
          },
          manners: {
              leader: 5,
              deputy: 2.5,
              member: 2.5,
              reply: 5
          },
          best: {
              leader: false,
              deputy: false,
              member: false,
              reply: false
          },
          poi: {
              leader: false,
              deputy: false,
              member: false,
              reply: false
          }
      },
      opp: {
          speakers: {
              leader: null,
              deputy: null,
              member: null,
              reply: null
          },
          matters: {
              leader: 5,
              deputy: 2.5,
              member: 2.5,
              reply: 5
          },
          manners: {
              leader: 5,
              deputy: 2.5,
              member: 2.5,
              reply: 5
          },
          best: {
              leader: false,
              deputy: false,
              member: false,
              reply: false
          },
          poi: {
              leader: false,
              deputy: false,
              member: false,
              reply: false
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
    gov_pos_name (state, payload) {
      state.result.gov.speakers[payload.pos_name] = payload.value
    },
    opp_pos_name (state, payload) {
      state.result.opp.speakers[payload.pos_name] = payload.value
    },
    input_result (state, payload) {
      state.result[payload.side][payload.key][payload.role] = payload.value
    },
    winner (state, payload) {
      state.result.winner = payload.winner
    },
    complete (state) {
      state.complete = true
    },
    reset_state (state) {
      let sides = ['gov', 'opp']
      let roles = ['leader', 'deputy', 'member', 'reply']
      for (let side of sides) {
          for (let role of roles) {
              state.result[side].speakers[role] = null
              state.result[side].best[role] = false
              state.result[side].poi[role] = false
              state.result[side].matters[role] = 5
              state.result[side].manners[role] = 5
              if (role === 'deputy' || role === 'member') {
                  state.result[side].matters[role] /= 2
                  state.result[side].manners[role] /= 2
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
    convert_from_ballot ({ commit, state }, payload) {
        let score_sheet = payload.score_sheet
        if (!state.complete) {
            return null
        }
        let roles = ['leader', 'deputy', 'member', 'reply']
        let converted_result = {
            gov: {
                id: score_sheet.teams.gov,
                win: state.result.winner === score_sheet.teams.gov,
                speakers: state.result.gov.speakers,
                scores: object_adder(state.result.gov.matters, state.result.gov.manners),
                matters: state.result.gov.matters,
                manners: state.result.gov.manners,
                best: state.result.gov.best,
                poi: state.result.gov.poi
            },
            opp: {
                id: score_sheet.teams.opp,
                win: state.result.winner === score_sheet.teams.opp,
                speakers: state.result.opp.speakers,
                scores: object_adder(state.result.opp.matters, state.result.opp.manners),
                matters: state.result.opp.matters,
                manners: state.result.opp.manners,
                best: state.result.opp.best,
                poi: state.result.opp.poi
            }
        }

        let raw_team_results = []
        let raw_speaker_results = []
        let sides = ['gov', 'opp']
        let sides_label = {
            gov: 'gov',
            opp: 'opp',
            cg: 'gov',
            co: 'opp'
        }
        for (let i of [0, 1]) {
            let side = sides[i]
            let scores_converted = scores_converter(converted_result[side])
            for (let id of Array.from(new Set(Object.values(converted_result[side].speakers)))) {
                let raw_speaker_result = {
                    id,
                    r: score_sheet.r,
                    from_id: score_sheet.from_id,
                    weight: 1,
                    scores: scores_converted[id],
                    user_defined_data: {
                        matters: converted_result[side].matters,
                        manners: converted_result[side].manners,
                        best: converted_result[side].best,
                        poi: converted_result[side].poi
                    }
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
