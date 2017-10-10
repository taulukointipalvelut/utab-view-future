
function object_adder (obj1, obj2) {
    let added = {}
    for (let key in obj1) {
        added[key] = obj1[key] + obj2[key]
    }
    return added
}

function initialize_obj(keys, default_value=null) {
    let obj = {}
    for (let key of keys) {
        obj[key] = default_value
    }
    return obj
}

function object_converter (result, prop, default_value=0) {
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
        let filtered_property = {}
        for (let role in result[prop]) {
            filtered_property[role] = id_to_roles[id].includes(role) ? result[prop][role] : default_value
        }
        converted[id] = filtered_property
    }
    return converted
}

function object_converter_temp (obj) {
    let obj2 = {}
    for (let key in obj) {
        if (key === 'deputy' || key === 'member') {
            obj2[key] = obj[key]/2
        } else {
            obj2[key] = obj[key]
        }
    }
    return obj2
}

export default {
  namespaced: true,
  state: {
      path_valid: false,
      ballot: {
          winner: null,
          gov: {
              speakers: [],
              matters: [],
              manners: [],
              poi: [],
              best: []
          },
          opp: {
              speakers: [],
              matters: [],
              manners: [],
              poi: [],
              best: []
          }
      }
  },
  mutations: {
    path_confirmed (state) {
        state.path_valid = true
    },
    init_ballot (state, payload) {
        state.path_valid = false
        state.ballot.winner = null
        for (let side of ['gov', 'opp']) {
            state.ballot[side].speakers = initialize_obj(payload.role_names[side])
            state.ballot[side].matters = initialize_obj(payload.role_names[side], 5)
            state.ballot[side].manners = initialize_obj(payload.role_names[side], 5)
            state.ballot[side].poi = initialize_obj(payload.role_names[side], false)
            state.ballot[side].best = initialize_obj(payload.role_names[side], false)
        }
    },
    input_result (state, payload) {
      state.ballot[payload.side][payload.key][payload.role_name] = payload.value
    },
    winner (state, payload) {
      state.ballot.winner = payload.winner
    }
    /*reset_state (state) {
      let sides = ['gov', 'opp']
      let roles = ['leader', 'deputy', 'member', 'reply']
      state.result.winner = null
      state.path_valid = false
      for (let side of sides) {
          for (let role of roles) {
              state.result[side].speakers[role] = null
              state.result[side].best[role] = false
              state.result[side].poi[role] = false
              state.result[side].matters[role] = 5
              state.result[side].manners[role] = 5
          }
      }
    }*/
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
        let roles = ['leader', 'deputy', 'member', 'reply']
        let converted_result = {
            gov: {
                id: score_sheet.teams.gov,
                win: state.result.winner === score_sheet.teams.gov,
                speakers: state.result.gov.speakers,
                scores: object_adder(object_converter_temp(state.result.gov.matters), object_converter_temp(state.result.gov.manners)),
                matters: object_converter_temp(state.result.gov.matters),
                manners: object_converter_temp(state.result.gov.manners),
                best: state.result.gov.best,
                poi: state.result.gov.poi
            },
            opp: {
                id: score_sheet.teams.opp,
                win: state.result.winner === score_sheet.teams.opp,
                speakers: state.result.opp.speakers,
                scores: object_adder(object_converter_temp(state.result.opp.matters), object_converter_temp(state.result.opp.manners)),
                matters: object_converter_temp(state.result.opp.matters),
                manners: object_converter_temp(state.result.opp.manners),
                best: state.result.opp.best,
                poi: state.result.opp.poi
            }
        }

        let raw_team_results = []
        let raw_speaker_results = []
        let sides = ['gov', 'opp']
        for (let i of [0, 1]) {
            let side = sides[i]
            let scores_converted = object_converter(converted_result[side], 'scores')
            let matters_converted = object_converter(converted_result[side], 'matters')
            let manners_converted = object_converter(converted_result[side], 'manners')
            let poi_converted = object_converter(converted_result[side], 'poi', false)
            let best_converted = object_converter(converted_result[side], 'best', false)
            for (let id of Array.from(new Set(Object.values(converted_result[side].speakers)))) {
                let raw_speaker_result = {
                    id,
                    r: score_sheet.r,
                    from_id: score_sheet.from_id,
                    weight: 1,
                    scores: scores_converted[id],
                    user_defined_data: {
                        matters: matters_converted[id],
                        manners: manners_converted[id],
                        best: best_converted[id],
                        poi: poi_converted[id]
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
                side,
                opponents: [score_sheet.teams[sides[1-i]]]
            }
            raw_team_results.push(raw_team_result)
        }

        return { raw_team_results, raw_speaker_results }
    }
  }
}
