import ballot from 'pages/tournament/user/round/ballot/adjudicator/stores'
import math from 'assets/js/math.js'

const BASE_URL = location.protocol+'//'+location.hostname
//const BASE_URL = location.protocol+'//pda.herokuapp.com'
const API_BASE_URL = BASE_URL + '/api'

function find_tournament (state, payload) {
    return state.tournaments.find(t => t.id === payload.tournament.id)
}

function treat_reponse (promise, commit) {
    return promise.then(response => response.json())
        .catch(() => {
            commit('errors', { errors: ['Network Error'] })
            throw new Error('Network Error')
        })
        .then(response => {
            if (response.errors.length > 0) {
                if (response.errors[0].name === 'InvalidSession') {
                    commit('auth', { username: '' })
                } else {
                    commit('errors', response)
                }
                throw response.errors
            } else {
                return response.data
            }
        })
}

function fetch_data (commit, method, url, data=null) {
    let request = { method }
    if (data !== null) {
        request.body = JSON.stringify(data)
    }
    request.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Type adsfa:dsaf'
    }
    request.mode = "cors"
    request.credentials = 'include'
    return treat_reponse(fetch(url, request), commit)
}

function select_by_key_factory (label, key="id") {
    function select_by_key (state, getters) {
        return function (key_str) {
            let targets = getters.target_tournament[label]
            return targets.find(t => t[key] === parseInt(key_str, 10))
        }
    }
    return select_by_key
}

function results_factory(label) {
    return function (state, getters) {
        let tournament = getters.target_tournament
        if (tournament === undefined) {
            return []
        }
        return function (r_str) {
            return tournament[label].filter(res => res.r === parseInt(r_str, 10)).sort((r1, r2) => r1.from_id > r2.from_id ? 1 : -1)
        }
    }
}

function replace_factory(label) {
    return function (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[label] = payload[label]
    }
}

function add_one_factory(label, label_singular) {
    return function (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[label].push(payload[label_singular])
    }
}

function add_ones_factory(label) {
    return function (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[label] = tournament[label].concat(payload[label])
    }
}

function delete_factory(label, label_singular, keys=['id']) {
    return function (state, payload) {
        let tournament = find_tournament(state, payload)
        let unfit = tournament[label]
        let fit = []
        for (let key of keys) {
            fit = fit.concat(unfit.filter(e => e[key] !== payload[label_singular][key]))
            unfit = unfit.filter(e => e[key] === payload[label_singular][key])
        }
        tournament[label] = fit
    }
}

function available_entities_factory(label) {
    return function (state, getters) {
        return function (r_str) {
            let tournament = getters.target_tournament
            let entities = tournament[label]
            return entities.filter(e => getters.access_detail(e, r_str).available)
        }
    }
}

export default {
  state: {
    loading: true,
    auth: {
      username: '',
      usertype: '',
      tournaments: [],
      href: {
        login: { to: '/login' }
      }
    },
    styles: [],
    tournaments: [],
    errors: [],
    view_config: {
        base_url: BASE_URL,
        max_rounds: 25,
        round_url: '/:tournament_id/rounds/:r',
        tournament_url: '/:tournament_id'
    }
  },
  getters: {
    is_auth: state => state.auth.username !== '',
    is_organizer (state, getters) {
        return tournament => {
            return state.auth.usertype === 'superuser' || state.auth.tournaments.includes(tournament.id)
        }
    },
    round_href (state, getters) {
        return round => {
            let r = round.r
            let tournament_id = getters.target_tournament.id
            let round_url = state.view_config.round_url
            let href = {
                path: round_url.replace(':tournament_id', tournament_id).replace(':r', r)
            }
            return href
        }
    },
    tournament_href (state, getters) {
        return tournament => {
            if (tournament === undefined) {
                return { path: '/' }
            } else {
                return { path: state.view_config.tournament_url.replace(':tournament_id', tournament.id) }
            }
        }
    },
    target_tournament (state) {
      return state.tournaments.find(t => t.id === parseInt(state.route.params.tournament_id, 10))
    },
    target_draw (state, getters) {
        return getters.draw_by_r(state.route.params.r_str)
    },
    target_round (state, getters) {
        return getters.target_tournament.rounds.find(d => d.r === parseInt(state.route.params.r_str, 10))
    },
    target_score_sheets (state, getters) {
        return function (r_str) {
            let tournament = getters.target_tournament
            let style = getters.style
            let draw = tournament.draws.find(d => d.r === parseInt(r_str, 10))
            if (draw === undefined) {
                return []
            }
            let allocation = draw.allocation
            let r = draw.r
            let score_sheets = []
            let raw_team_results = getters.raw_team_results_by_r(r)
            let adjudicators_submitted = Array.from(new Set(raw_team_results.map(res => res.from_id)))
            for (let square of allocation) {
                for (let from_id of [].concat(square.chairs).concat(square.panels)) {
                    let sent_result = raw_team_results.find(r => r.from_id === from_id)
                    let score_sheet = {
                        r,
                        done: adjudicators_submitted.includes(from_id),
                        created: sent_result !== undefined ? new Date(sent_result.created) : null,
                        teams: square.teams,
                        from_id,
                        venue: square.venue,
                        is_chair: square.chairs.includes(from_id) ? true : false,
                        href: { to: String(from_id) }
                    }
                    score_sheets.push(score_sheet)
                }
            }
            return score_sheets.slice().sort((a1, a2) => getters.entity_name_by_id(a1.venue).localeCompare(getters.entity_name_by_id(a2.venue)))
        }
    },
    target_evaluation_sheets (state, getters) {
        return function (r_str) {
            let tournament = getters.target_tournament
            let draw = tournament.draws.find(d => d.r === parseInt(r_str, 10))
            let round = tournament.rounds.find(d => d.r === parseInt(r_str, 10))
            if (draw === undefined) {
                return []
            }
            let allocation = draw.allocation
            let r = draw.r
            let evaluation_sheets = []
            let raw_adjudicator_results = getters.raw_adjudicator_results_by_r(r)
            let submitted = Array.from(new Set(raw_adjudicator_results.map(res => res.from_id)))
            for (let square of allocation) {
                let team_evaluators = []
                if (round.user_defined_data.evaluate_from_team) {
                    if (round.user_defined_data.evaluator_in_team === 'team') {
                        team_evaluators = Object.values(square.teams)
                    } else if (round.user_defined_data.evaluator_in_team === 'speaker') {
                        team_evaluators = [].concat(...Object.values(square.teams).map(getters.entity_by_id).map(t => getters.access_detail(t, r).speakers))
                    }
                }
                let adj_evaluators = round.user_defined_data.evaluate_from_adjudicators ? square.chairs.concat(square.panels).concat(square.trainees) : []
                for (let ind of [0, 1]) {
                    let evaluators = [team_evaluators, adj_evaluators][ind]
                    for (let from_id of evaluators) {
                        let sent_result = raw_adjudicator_results.find(r => r.from_id === from_id)
                        let adjudicators = []
                        if (ind === 0) {
                            adjudicators = round.user_defined_data.chairs_always_evaluated ? square.chairs : square.chairs.concat(square.panels)
                        } else {
                            adjudicators = square.chairs.concat(square.panels).concat(square.trainees).filter(id => id !== from_id)
                        }
                        if (adjudicators.length === 0) { continue }
                        let evaluation_sheet = {
                            r,
                            done: submitted.includes(from_id),
                            created: sent_result !== undefined ? new Date(sent_result.created) : null,
                            adjudicators,
                            chairs: square.chairs,
                            teams: square.teams,
                            from_id,
                            is_adjudicator: ind === 1,
                            venue: square.venue,
                            href: { to: String(from_id) }
                        }
                        evaluation_sheets.push(evaluation_sheet)
                    }
                }
            }
            evaluation_sheets.sort((e1, e2) => getters.entity_name_by_id(e1.venue).localeCompare(getters.entity_name_by_id(e2.venue)))
            return evaluation_sheets
        }
    },
    adjudicators_ss_unsubmitted (state, getters) {
        return function (r_str) {
            let ss_watching = Array.from(new Set(getters.target_score_sheets(r_str).map(ss => ss.from_id)))
            let ss_submitted = Array.from(new Set(getters.raw_team_results_by_r(r_str).map(tr => tr.from_id)))
            return ss_watching.filter(id => !ss_submitted.includes(id))
        }
    },
    entities_es_unsubmitted (state, getters) {
        return function (r_str) {
            let es_watching = Array.from(new Set(getters.target_evaluation_sheets(r_str).map(es => es.from_id)))
            let es_submitted = Array.from(new Set(getters.raw_adjudicator_results_by_r(r_str).map(ar => ar.from_id)))
            return es_watching.filter(id => !es_submitted.includes(id))
        }
    },
    score_sheet_by_id (state, getters) {
        return function (from_id) {
            let r_str = state.route.params.r_str
            return getters.target_score_sheets(r_str).find(ss => ss.from_id === parseInt(from_id, 10))
        }
    },
    evaluation_sheet_by_id (state, getters) {
        return function (from_id) {
            let r_str = state.route.params.r_str
            return getters.target_evaluation_sheets(r_str).find(es => es.from_id === parseInt(from_id, 10))
        }
    },
    draw_time (state, getters) {
      let draw = getters.target_draw
      if (draw === undefined) { return { updated: false, text: '' } }
      let date = new Date(draw.updated)
      if (draw.version === 0) {
          return {
              updated: false,
              text: ''
          }
      } else {
          return {
              updated: true,
              text: 'Updated at '+date.toLocaleTimeString('en-US', { hour12: false })
          }
      }
    },
    draw_by_r (state, getters) {
        return function (r_str) {
            let tournament = getters.target_tournament
            if (tournament !== undefined) {
                return tournament.draws.find(d => d.r === parseInt(r_str, 10))
            } else {
                return undefined
            }
        }
    },
    teams_by_speaker_id (state, getters) {
        return function (id) {
            let teams = getters.target_tournament.teams
            return teams.filter(team => getters.access_detail(team).speakers.includes(parseInt(id, 10)))
        }
    },
    entity_by_id (state, getters) {
        let labels = ['teams', 'adjudicators', 'speakers', 'institutions', 'venues']
        return function (id) {
            let tournament = getters.target_tournament
            for (let label of labels) {
                let entity = tournament[label].find(e => e.id === parseInt(id, 10))
                if (entity !== undefined) {
                    return entity
                }
            }
            return undefined
        }
    },
    entity_name_by_id (state, getters) {
        return function (id) {
            let entity = getters.entity_by_id(parseInt(id, 10))
            if (entity === undefined) {
                return 'Undefined'
            } else {
                return entity.name
            }
        }
    },
    unallocated_speakers (state, getters) {
        return function (except_team=null, r=null) {
            let tournament = getters.target_tournament
            let allocated_speakers = []
            for (let team of tournament.teams) {
                allocated_speakers = allocated_speakers.concat(getters.access_detail(team, r).speakers)
            }
            if (except_team !== null) {
                let team = getters.entity_by_id(except_team)
                allocated_speakers = allocated_speakers.filter(id => !getters.access_detail(team, r).speakers.includes(id))
            }
            return tournament.speakers.filter(speaker => !allocated_speakers.includes(speaker.id))
        }
    },
    round_name_by_r (state, getters) {
        return function (r) {
            let round = getters.round_by_r(parseInt(r, 10))
            if (round === undefined) {
                return 'Undefined'
            } else {
                return round.name
            }
        }
    },
    round_by_r: select_by_key_factory('rounds', 'r'),
    compiled_team_result_by_id: select_by_key_factory('compiled_team_results'),
    compiled_speaker_result_by_id: select_by_key_factory('compiled_speaker_results'),
    compiled_adjudicator_result_by_id: select_by_key_factory('compiled_adjudicator_results'),
    raw_team_results_by_r: results_factory('raw_team_results'),
    raw_speaker_results_by_r: results_factory('raw_speaker_results'),
    raw_adjudicator_results_by_r: results_factory('raw_adjudicator_results'),
    //available_speakers: available_entities_factory('speakers'),
    available_teams: available_entities_factory('teams'),
    //available_venues: available_entities_factory('venues'),
    access_detail (state, getters) {
        return function (entity, r_str=null) {
            if (r_str === null) {
                let new_detail = {}
                for (let key in entity.details[0]) {
                    if (Array.isArray(entity.details[0][key])) {
                        new_detail[key] = []
                    }
                }
                for (let key in new_detail) {
                    for (let detail of entity.details) {
                        new_detail[key] = new_detail[key].concat(detail[key])
                    }
                }
                for (let key in new_detail) {
                    new_detail[key] = Array.from(new Set(new_detail[key]))
                }
                return new_detail
            } else {
                return entity.details.find(d => d.r === parseInt(r_str, 10))
            }
        }
    },
    style (state, getters) {
        let tournament = getters.target_tournament
        return tournament.style
    },
    compiled_sub_prize_results (state, getters) {
        return function (sub_prize) {
            let compiled_speaker_results = getters.target_tournament.compiled_speaker_results
            if (compiled_speaker_results.length === 0) {
                return []
            } else {
                let compiled_sub_prize_results = compiled_speaker_results.map(result => Object.assign({}, result))
                for (let result of compiled_sub_prize_results) {
                    let nums = []
                    for (let detail of result.details) {
                        let nums_sub = []
                        for (let user_defined_data of detail.user_defined_data_collection) {
                            nums_sub.push(user_defined_data[sub_prize].map(s => s.value).filter(tf => tf).length)
                        }
                        nums.push(math.average(nums_sub))
                    }
                    result[sub_prize] = math.sum(nums)
                }
                compiled_sub_prize_results.sort((r1, r2) => r1[sub_prize] < r2[sub_prize] ? 1 : -1)
                let ranking = 0
                let stay = 0
                let current_sub_prize = null
                for (let result of compiled_sub_prize_results) {
                    if (result[sub_prize] !== current_sub_prize) {
                        ranking += stay + 1
                        stay = 0
                        current_sub_prize = result[sub_prize]
                    } else {
                        stay += 1
                    }
                    result.ranking = ranking
                }
                return compiled_sub_prize_results
            }
        }
      }
  },
  mutations: {
    /* auth.value */
    auth (state, payload) {
        for (let key in payload) {
            if (state.auth.hasOwnProperty(key)) {
                state.auth[key] = payload[key]
            }
        }
    },
    add_auth_tournaments (state, payload) {
        state.auth.tournaments.push(payload.tournament.id)
    },
    /* errors */
    errors (state, payload) {
      state.errors = payload.errors
    },
    /* styles */
    styles (state, payload) {
      state.styles = payload.styles
    },
    clear_tournaments (state, payload) {
      state.tournaments = []
    },
    add_tournament (state, payload) {
        let tournament = {
          id: payload.tournament.id,
          name: payload.tournament.name,
          style: payload.tournament.style,
          rounds: [],
          teams: [],
          adjudicators: [],
          speakers: [],
          venues: [],
          institutions: [],
          draws: [],
          raw_team_results: [],
          raw_speaker_results: [],
          raw_adjudicator_results: [],
          compiled_team_results: [],
          compiled_speaker_results: [],
          compiled_adjudicator_results: [],
          auth: payload.tournament.auth,
          user_defined_data: payload.tournament.user_defined_data
        }
        state.tournaments.push(tournament)
    },
    delete_tournament (state, payload) {
      state.tournaments = state.tournaments.filter(t => t.id !== payload.tournament.id)
    },
    update_tournament (state, payload) {
      let tournament = find_tournament(state, payload)
      for (let key in payload.tournament) {
          if (tournament.hasOwnProperty(key)) {
              tournament[key] = payload.tournament[key]
          }
      }
    },
    /* tournaments */
    draws: replace_factory('draws'),
    rounds: replace_factory('rounds'),
    raw_results (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['raw_'+payload.label_singular+'_results'] = payload.raw_results
    },
    compiled_results (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['compiled_'+payload.label_singular+'_results'] = payload.compiled_results
    },
    add_raw_results (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['raw_'+payload.label_singular+'_results'] = tournament['raw_'+payload.label_singular+'_results'].concat(payload.raw_results)
    },
    add_raw_result (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['raw_'+payload.label_singular+'_results'].push(payload.raw_result)
    },
    delete_raw_result (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['raw_'+payload.label_singular+'_results'] = tournament['raw_'+payload.label_singular+'_results']
            .filter(res => res.id !== payload.raw_result.id || res.r !== payload.raw_result.r || res.from_id !== payload.raw_result.from_id)
    },
    delete_raw_results (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament['raw_'+payload.label_singular+'_results'] = tournament['raw_'+payload.label_singular+'_results']
            .filter(res => res.r !== payload.round.r)
    },
    entities (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[payload.label] = payload[payload.label]
    },
    add_entities (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[payload.label] = tournament[payload.label].concat(payload[payload.label])
    },
    delete_entity (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[payload.label] = tournament[payload.label].filter(e => e.id !== payload[payload.label_singular].id)
    },
    add_round: add_one_factory('rounds', 'round'),
    delete_round: delete_factory('rounds', 'round', ['r']),
    add_draw: add_one_factory('draws', 'draw', ['r']),
    delete_draw: delete_factory('draws', 'draw', ['r']),
    finish_loading (state) {
        state.loading = false
    },
    start_loading (state) {
        state.loading = true
    }
  },
  actions: {
      send_create_tournament ({state, commit, dispatch}, payload) {
         return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments', payload.tournament)
            .then(tournament => {
                commit('add_auth_tournaments', { tournament })
                commit('add_tournament', { tournament })
                return tournament
            })
      },
      send_delete_tournament ({state, commit, dispatch}, payload) {
         return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id)
            .then(tournament => commit('delete_tournament', { tournament }))
      },
      send_update_tournament ({state, commit, dispatch}, payload) {
         return fetch_data(commit, 'PUT', API_BASE_URL+'/tournaments/'+payload.tournament.id, payload.tournament)
            .then(tournament => commit('update_tournament', { tournament }))
      },
      send_create_round ({state, commit, dispatch}, payload) {
          return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds', payload.round)
             .then(() => commit('add_round', payload))
      },
      send_update_round ({state, commit, dispatch}, payload) {
          return fetch_data(commit, 'PUT', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.round.r, payload.round)
             .then(round => {
                 payload.round = round
                 commit('delete_round', payload)
                 commit('add_round', payload)
             })
      },
      send_delete_round ({state, commit, dispatch}, payload) {
          return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.round.r)
              .then(() => commit('delete_round', payload))
      },
      send_delete_draw ({state, commit, dispatch}, payload) {
          return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.draw.r+'/draws')
              .then(() => commit('delete_draw', payload))
      },
      send_create_entities ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label+'?force='+payload.force, payload[payload.label])
            .then(function (data) {
                payload[payload.label] = data
                commit('add_entities', payload)
                return data
            })
      },
      send_update_entity ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'PUT', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label+'/'+payload[payload.label_singular].id, payload[payload.label_singular])
            .then(entity => {
                payload[payload.label_singular] = entity
                payload[payload.label] = [entity]
                commit('delete_entity', payload)
                commit('add_entities', payload)
            })
      },
      send_delete_entity ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label+'/'+payload[payload.label_singular].id)
            .then(() => commit('delete_entity', payload))
      },
      send_update_result ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'PUT', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.raw_result.r+'/results/raw/'+payload.label+'/'+payload.raw_result.id+'/'+payload.raw_result.from_id,  payload.raw_result)
            .then(raw_result => {
                payload.raw_result = raw_result
                commit('delete_raw_result', payload)
                commit('add_raw_result', payload)
            })
      },
      send_delete_result ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.raw_result.r+'/results/raw/'+payload.label+'/'+payload.raw_result.id+'/'+payload.raw_result.from_id,  payload.raw_result)
            .then(() => commit('delete_raw_result', payload))
      },
      send_delete_results ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/results/raw/'+payload.label, payload.round)
            .then(() => commit('delete_raw_results', payload))
      },
      send_raw_results ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/results/raw/'+payload.label, payload.raw_results)
            .then((raw_results) => commit('add_raw_results', { tournament: payload.tournament, raw_results, label_singular: payload.label_singular }))
      },
      send_create_user ({ state, commit, dispatch }, payload) {
        return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/users', payload)
              .then(function(data) {
                  return true
              }).catch(function(err) {
                  return false
              })
      },
      request_compiled_results ({state, commit, dispatch}, payload) {
        return fetch_data(commit, 'PATCH', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/results/'+payload.label, payload.request)
            .then((compiled_results) => commit('compiled_results', { tournament: payload.tournament, compiled_results, label_singular: payload.label_singular }))
      },
      load_tournaments ({ commit }) {
        return fetch_data(commit, 'GET', API_BASE_URL+'/tournaments')
            .then(function (tournaments) {
                commit('clear_tournaments')
                tournaments.map(t => commit('add_tournament', { tournament: t }))
            })
    },
    load_styles ({ state, commit, dispatch }, payload) {
        return fetch_data(commit, 'GET', API_BASE_URL+'/styles')
                .then(styles => {
                    commit('styles', { styles })
                })
    },
    load_draws ({ state, commit, dispatch }, payload) {
        let t = find_tournament(state, payload)
        return fetch_data(commit, 'GET', API_BASE_URL+'/tournaments/'+t.id+'/draws')
                .then(data => {
                    const draws = []
                    for (let draw_fetched of data) {
                        draws.push(draw_fetched)
                    }
                    commit('draws', { tournament: t, draws })
                })
    },
    load_config ({ state, commit, dispatch }, payload) {
        let t = find_tournament(state, payload)
        return fetch_data(commit, 'GET', API_BASE_URL+'/tournaments/'+t.id)
                .then(config => {
                    commit('update_tournament', { tournament: config })
                })
    },
    load_rounds ({ state, commit, dispatch }, payload) {
        let t = find_tournament(state, payload)
        return fetch_data(commit, 'GET', API_BASE_URL+'/tournaments/'+t.id+'/rounds')
                .then(rounds => {
                    commit('rounds', { tournament: t, rounds })
                })
    },
    load_raw_results ({ state, commit, dispatch }, payload) {
        let t = find_tournament(state, payload)
        let labels = ['teams', 'speakers', 'adjudicators']
        let labels_singular = ['team', 'speaker', 'adjudicator']
        let ps = []
        for (let index of math.range(labels.length)) {
            let label = labels[index]
            let label_singular = labels_singular[index]
            ps.push(fetch_data(commit, 'GET', API_BASE_URL+'/tournaments/'+t.id+'/results/raw/'+label)
                .then(data => {
                    let raw_results = data
                    commit('raw_results', { tournament: t, raw_results, label_singular })
                }))
        }
        return Promise.all(ps)
    },
    load_entities ({ state, commit, dispatch }, payload) {
        let t = find_tournament(state, payload)
        let labels = ['teams', 'adjudicators', 'speakers', 'venues', 'institutions']
        let ps = []
        for (let index of math.range(5)) {
            let label = labels[index]
            ps.push(fetch_data(commit, 'GET', API_BASE_URL+'/tournaments/'+t.id+'/'+labels[index])
                .then(data => {
                    let entities = data
                    let new_payload = { tournament: t }
                    new_payload[label] = entities
                    new_payload.label = label
                    commit('entities', new_payload)
                }))
        }
        return Promise.all(ps)
    },
    load_login_status ({ state, commit, dispatch }, payload) {
      return fetch_data(commit, 'GET', API_BASE_URL+'/login', payload)
            .then(function(data) {
                commit('auth', data)
            })
    },
    init_tournaments ({ state, commit, dispatch }, payload) {
        console.log("init_tournaments called @"+state.route.path)
        return new Promise(async (resolve, reject) => {
            await Promise.all([
                dispatch('load_login_status'),
                dispatch('load_tournaments'),
                dispatch('load_styles')
            ])
            resolve(true)
        })
    },
    init_one ({ state, commit, dispatch }, payload) {
        if (payload.tournament === undefined) { return new Promise(resolve => resolve()) }
        console.log("init_one called @"+state.route.path)
        let tournament = find_tournament(state, payload)
        let usertype = state.auth.usertype
        return new Promise(async (resolve, reject) => {
            await Promise.all([
                dispatch('load_login_status'),
                dispatch('load_config', { tournament })
            ])
            await Promise.all([
                dispatch('load_rounds', { tournament }),
                dispatch('load_draws', { tournament }),
                dispatch('load_raw_results', { tournament }),
                dispatch('load_entities', { tournament })
            ])
            resolve(true)
        })
    },
    request_draw ({ state, commit, dispatch }, payload) {
        let tournament = find_tournament(state, payload)
        let suffix = ''
        if (payload.allocation_type === 'teams') {
            suffix = '/teams'
        } else if (payload.allocation_type === 'adjudicators') {
            suffix = '/adjudicators'
        } else if (payload.allocation_type === 'venues') {
            suffix = '/venues'
        }
        return fetch_data(commit, 'PATCH', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.r_str+'/draws'+suffix, { draw: payload.draw, options: payload.options })
    },
    submit_draw ({ state, commit, dispatch }, payload) {
        let tournament = find_tournament(state, payload)
        return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.draw.r+'/draws', payload.draw)
            .then(data => {
                payload.draw = data
                commit('delete_draw', payload)
                commit('add_draw', payload)
            })
    },
    update_draw ({ state, commit, dispatch }, payload) {
        let tournament = find_tournament(state, payload)
        return fetch_data(commit, 'PUT', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/rounds/'+payload.draw.r+'/draws', payload.draw)
            .then(data => {
                payload.draw = data
                commit('delete_draw', payload)
                commit('add_draw', payload)
            })
    },
    login ({ state, commit, dispatch }, payload) {
      return fetch_data(commit, 'POST', API_BASE_URL+'/login', payload)
            .then(function(data) {
                commit('auth', data)
                return true
            }).catch(function(err) {
                return false
            })
    },
    participant_login ({ state, commit, dispatch }, payload) {
      return fetch_data(commit, 'POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/login', payload)
            .then(function(data) {
                commit('auth', data)
                return true
            }).catch(function(err) {
                return false
            })
    },
    logout ({ state, commit, dispatch }, payload) {
        return fetch_data(commit, 'DELETE', API_BASE_URL+'/login')
              .then(function(data) {
                  commit('auth', { username: '', usertype: '', tournaments: [] })
              })
    },
    signup ({ state, commit, dispatch }, payload) {
      return fetch_data(commit, 'POST', API_BASE_URL+'/signup', payload)
            .then(function(data) {
                return true
            }).catch(function(err) {
                return false
            })
    }
  },
  modules: {
    ballot
  }
}
