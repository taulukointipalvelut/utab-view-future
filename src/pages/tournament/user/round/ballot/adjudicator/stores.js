import math from 'assets/js/math.js'

function array_adder (arr1, arr2) {
    let added = []
    for (let e of arr1) {
        let e2 = arr2.find(e3 => e3.order === e.order)
        added.push({
            order: e.order,
            value: e.value + e2.value
        })
    }
    return added
}

function initialize_arr(len, default_values=undefined) {
    let arr = []
    for (let index of math.range(len)) {
        arr.push({ order: index+1, value: default_values === undefined ? null : default_values[index] })
    }
    return arr
}

function object_converter (result, prop, default_value=0) {
    let id_to_orders = {}
    for (let r of result.speakers) {
        let id = r.value
        if (id_to_orders.hasOwnProperty(id)) {
            id_to_orders[id].push(r.order)
        } else {
            id_to_orders[id] = [r.order]
        }
    }
    let converted = {}
    for (let id in id_to_orders) {
        let filtered_result = []
        for (let r of result[prop]) {
            filtered_result.push({
                order: r.order,
                value: id_to_orders[id].includes(r.order) ? r.value : default_value
            })
        }
        converted[id] = filtered_result
    }
    return converted
}

export default {
  namespaced: true,
  state: {
      path_valid: false,
      result: {
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
  getters: {
    value (state) {
        return function (side, label, order) {
            let target = state.result[side][label].find(r => r.order === order)
            return target === undefined ? null : target.value
        }
    }
  },
  mutations: {
    path_confirmed (state) {
        state.path_valid = true
    },
    init_result (state, payload) {
        state.path_valid = false
        state.result.winner = null
        for (let side of ['gov', 'opp']) {
            state.result[side].speakers = initialize_arr(payload.len)
            state.result[side].matters = initialize_arr(payload.len, payload.score_default[side])
            state.result[side].manners = initialize_arr(payload.len, payload.score_default[side])
            state.result[side].poi = initialize_arr(payload.len, payload.sub_prize_default[side])
            state.result[side].best = initialize_arr(payload.len, payload.sub_prize_default[side])
        }
    },
    input_result (state, payload) {
      state.result[payload.side][payload.key].find(r => r.order === payload.role_order).value = payload.value
    },
    winner (state, payload) {
      state.result.winner = payload.winner
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
    async send_result ({ getters, state, commit, dispatch, rootState }, payload) {
        let { raw_team_results, raw_speaker_results } = await dispatch('convert_from_result', payload)
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
    convert_from_result ({ commit, state }, payload) {
        let score_sheet = payload.score_sheet
        let converted_result = {
            gov: {
                id: score_sheet.teams.gov,
                win: state.result.winner === score_sheet.teams.gov,
                speakers: state.result.gov.speakers,
                scores: array_adder(state.result.gov.matters, state.result.gov.manners),
                matters: state.result.gov.matters,
                manners: state.result.gov.manners,
                best: state.result.gov.best,
                poi: state.result.gov.poi
            },
            opp: {
                id: score_sheet.teams.opp,
                win: state.result.winner === score_sheet.teams.opp,
                speakers: state.result.opp.speakers,
                scores: array_adder(state.result.opp.matters, state.result.opp.manners),
                matters: state.result.opp.matters,
                manners: state.result.opp.manners,
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
            for (let id of Array.from(new Set(converted_result[side].speakers.map(r => r.value)))) {
                let raw_speaker_result = {
                    id,
                    r: score_sheet.r,
                    from_id: score_sheet.from_id,
                    weight: 1,
                    scores: scores_converted[id],
                    user_defined_data: {
                        r: score_sheet.r,
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
