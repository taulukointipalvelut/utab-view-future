import ballot from 'pages/tournament/round/ballot/adjudicator/stores'
import result from 'pages/admin/result/stores'

let API_BASE_URL = 'http://localhost:7024'

function find_tournament (state, payload) {
    return state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
}

function treat_reponse (promise) {
    return promise.then(response => response.json()).then(response => {
        if (response.errors.length > 0) {
            throw response.errors
        } else {
            return response.data
        }
    })
}

function fetch_data (method, url, data=null) {
    return treat_reponse(fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    }))
}

function select_by_key_factory (label, key="id") {
    function select_by_key (state, getters) {
        return key_str => {
            let targets = getters.target_tournament[label]
            return targets.find(t => t[key] === parseInt(key_str))
        }
    }
    return select_by_key
}

export default {
  state: {
    auth: {
      session: null,
      href: {
        login: { to: '/login' },
        logout: { to: '/logout' }
      }
    },
    tournaments: []
  },
  getters: {
    isAuth: state => true,//{ return (state.auth && state.auth.session) ? true: false; },
    target_tournament: state => {
      return state.tournaments.find(t => t.tournament_name === state.route.params.tournament_name)
    },
    target_draw: (state, getters) => {
        return getters.target_tournament.draws.find(d => d.r === parseInt(state.route.params.r_str))
    },
    target_score_sheets: (state, getters) => {
        let allocation = getters.target_draw.allocation
        let r = getters.target_draw.r
        let score_sheets = []
        for (let square of allocation) {
            for (let id of [].concat(square.chairs).concat(square.panels)) {
                let score_sheet = {
                    r,
                    done: false,
                    gov: square.teams[0],
                    opp: square.teams[1],
                    id,
                    venue: square.venue,
                    chair: square.chairs.includes(id) ? true : false,
                    href: { to: String(id) }
                }
                score_sheets.push(score_sheet)
            }
        }
        return score_sheets
    },
    score_sheet_by_id: (state, getters) => {
        return id => {
            return getters.target_score_sheets.find(ss => ss.id === parseInt(id))
        }
    },
    round_by_r: select_by_key_factory('rounds', 'r'),
    draw_by_r: select_by_key_factory('draws', 'r'),
    team_by_id: select_by_key_factory('teams'),
    adjudicator_by_id: select_by_key_factory('adjudicators'),
    speaker_by_id: select_by_key_factory('speakers'),
    venue_by_id: select_by_key_factory('venues'),
    institution_by_id: select_by_key_factory('institutions'),
    unallocated_speakers (state, getters) {
        let tournament = getters.target_tournament
        let allocated_speakers = []
        for (let team of tournament.teams) {
            allocated_speakers = allocated_speakers.concat(team.speakers)
        }
        return tournament.speakers.filter(speaker => !allocated_speakers.includes(speaker.id))
    }
  },
  mutations: {
    /* auth.session */
    session (state, payload) {
      state.auth.session = payload.session
    },
    /* tournaments */
    tournaments (state, payload) {
      state.tournaments = payload.tournaments
    },
    /*add_tournaments (state, payload) {
      state.tournaments += payload.tournaments
    },*/
    add_tournament (state, payload) {
        let tournament = {
          id: payload.tournament.id,
          tournament_name: payload.tournament.tournament_name,
          href: { path: '/'+payload.tournament.tournament_name },
          current_round_num: 1,
          total_round_num: payload.tournament.total_round_num,
          rounds: [],
          teams: [],
          adjudicators: [],
          speakers: [],
          draws: [],
          style: {
            score_weights: [
              1,
              0.5,
              0.5,
              1
            ],
            positions_short: [
              "Gov",
              "Opp"
            ],
            positions: [
              "Government",
              "Opposition"
            ],
            team_num: 2,
            name: "PDA3",
            id: "PDA3"
          }
        }
        state.tournaments.push(tournament)
    },
    delete_tournament (state, payload) {
      state.tournaments = state.tournaments.filter(t => t.tournament_name !== payload.tournament_name)
    },
    /* tournaments */
    rounds (state, payload) {
        console.log("this method should be deleted in production")
        let tournament = find_tournament(state, payload)
        tournament.rounds = payload.rounds
    },
    adjudicators (state, payload) {
        console.log("this method should be deleted in production")
        let tournament = find_tournament(state, payload)
        tournament.adjudicators = payload.adjudicators
    },
    teams (state, payload) {
        console.log("this method should be deleted in production")
        let tournament = find_tournament(state, payload)
        tournament.teams = payload.teams
    },
    //add_rounds: add_factory('rounds'),
    //delete_round: delete_factory('rounds', 'round', 'r'),
    add_entities (state, payload) {
        payload.tournament[payload.label] = payload.tournament[payload.label].concat(payload[payload.label])
    },
    delete_entity (state, payload) {
        payload.tournament[payload.label] = payload.tournament[payload.label].filter(e => e.id === payload[payload.label].id)
    },
    add_rounds (state, payload) {
        payload.tournament.rounds = payload.tournament.rounds.concat(payload.rounds)
    },
    deleteround (state, payload) {
        payload.tournament.rounds = payload.tournament.rounds.filter(e => e.r === payload.round.r)
    }
  },
  actions: {
      send_rounds ({state, commit, dispatch}, payload) {
          console.log('preparing')
          commit('add_rounds', payload)
      },
      send_delete_round ({state, commit, dispatch}, payload) {
          console.log('preparing')
          commit('delete_round', payload)
      },
      send_tournament ({state, commit, dispatch}, payload) {
         return fetch_data('POST', API_BASE_URL+'/tournaments', payload.tournament)
            .then(() => commit('add_tournament', payload))
      },
      send_entities ({state, commit, dispatch}, payload) {
        return fetch_data('POST', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label, payload[payload.label])
            .then(() => commit('add_entities', payload))
      },
      send_update_entity ({state, commit, dispatch}, payload) {
        return fetch('PATCH', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label+'/'+payload[payload.label_singular].id, payload[payload.label])
            .then(() => commit('add_entities', payload))
      },
      send_delete_entity ({state, commit, dispatch}, payload) {
        return fetch_delete('DELETE', API_BASE_URL+'/tournaments/'+payload.tournament.id+'/'+payload.label+'/'+payload[payload.label_singular].id)
            .then(() => commit('delete_entity', payload))
      },
      init_tournaments ({ commit }) {
        /*return fetch(API_BASE_URL+'/tournaments')
            .then(response => response.json())
            .then(function (response) {
                const tournaments_fetched = response.data
                let tournaments = []
                for (let t_fetched of tournaments_fetched) {
                    tournaments.push({
                        id: t_fetched.id,
                        tournament_name: t_fetched.name,
                        href: { path: '/'+t_fetched.name },
                        current_round_num: t_fetched.current_round_num,
                        total_round_num: t_fetched.total_round_num,
                        rounds: [],
                        teams: [],
                        adjudicators: [],
                        draws: [],
                        style: t_fetched.style
                    })
                }
                commit('tournaments', { tournaments })
            })*/
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const tournaments = [{
            id: 284,
            tournament_name: 'PDA Tournament 2018',
            href: { path: '/PDA Tournament 2018' },
            current_round_num: 1,
            total_round_num: 4,
            rounds: [],
            teams: [],
            adjudicators: [],
            speakers: [{
                id: 1,
                name: "s1"
            }, {
                id: 2,
                name: "s2"
            }, {
                id: 3,
                name: "s3"
            }, {
                id: 4,
                name: "s4"
            }, {
                id: 5,
                name: "s5"
            }, {
                id: 6,
                name: "s6"
            }, {
                id: 7,
                name: "s7"
            }, {
                id: 8,
                name: "s8"
            }, {
                id: 9,
                name: "s9"
            }, {
                id: 10,
                name: "s10"
            }, {
                id: 11,
                name: "s11"
            }],
            institutions: [{
                id: 1,
                name: "i1"
            }, {
                id: 2,
                name: "i2"
            }],
            venues: [{
                id: 1,
                name: "v1"
            }, {
                id: 2,
                name: "v2"
            }, {
                id: 3,
                name: "v3"
            }],
            draws: [{
                r: 1,
                allocation: [{
                    venue: 1,
                    teams: {
                        0: 1,
                        1: 2
                    },
                    chairs: [-1],
                    panels: [-2, -3],
                    trainees: []
                }, {
                    venue: 2,
                    teams: {
                        0: 3,
                        1: 4
                    },
                    chairs: [-4],
                    panels: [-5, -6],
                    trainees: []
                }]
            },{
                r: 2,
                allocation: [{
                    venue: 1,
                    teams: {
                        0: 1,
                        1: 2
                    },
                    chairs: [-1],
                    panels: [-2, -3],
                    trainees: []
                }, {
                    venue: 2,
                    teams: {
                        0: 3,
                        1: 4
                    },
                    chairs: [-4],
                    panels: [-5, -6],
                    trainees: []
                }]
            }],
            style: {
              score_weights: [
                1,
                0.5,
                0.5,
                1
              ],
              positions_short: [
                "Gov",
                "Opp"
              ],
              positions: [
                "Government",
                "Opposition"
              ],
              team_num: 2,
              name: "PDA3",
              id: "PDA3"
            }
          }]

          commit('tournaments', { tournaments })
          resolve()
        }, 1000)
    })
    },
    init_rounds ({ state, commit, dispatch }, payload) {
        /*let p = state.tournaments.length === 0 ? dispatch('init_tournaments') : new Promise((resolve, reject) => resolve())

        return p
            .then(function() {
                for (let t of state.tournaments) {
                    fetch(API_BASE_URL+'/tournaments/'+t.id+'/rounds')
                        .then(response => response.json())
                        .then(function (response) {
                            const rounds = []
                            for (let round_fetched of response.data) {
                                let round = {
                                    href: { path: '/'+t.tournament_name+'/rounds/'+round_fetched.r },
                                    r: round_fetched.r,
                                    round_name: "Round "+round_fetched.r,
                                    team_allocation_opened: true,
                                    adjudicator_allocation_opened: true
                                }
                                rounds.push(round)
                            }
                            commit('rounds', { tournament: {tournament_name: t.tournament_name}, rounds })
                        })
                }
            })*/
      return new Promise(async (resolve, reject) => {
        if (state.tournaments.length === 0) {
          await dispatch('init_tournaments')
        }
        setTimeout(() => {
          const rounds = [{
            href: { path: '/PDA Tournament 2018/rounds/1' },
            r: 1,
            round_name: "Round 1",
            team_allocation_opened: true,
            adjudicator_allocation_opened: true,
          },
          {
            href: { path: '/PDA Tournament 2018/rounds/2' },
            r: 2,
            round_name: "Round 2",
            team_allocation_opened: true,
            adjudicator_allocation_opened: true,
          }]
          commit('rounds', { tournament: {tournament_name: 'PDA Tournament 2018'}, rounds })
          resolve()
        }, 1000)
      })
    },
    init_adjudicators ({ state, commit, dispatch }, payload) {
        /*let p = state.tournaments.length === 0 ? dispatch('init_tournaments') : new Promise((resolve, reject) => resolve())
        return p
            .then(function() {
                for (let t of state.tournaments) {
                    fetch(API_BASE_URL+'/tournaments/'+t.id+'/adjudicators')
                        .then(response => response.json())
                        .then(function (response) {
                            let adjudicators = []
                            for (let a_fetched of response.data) {
                                let adjudicator = {
                                    id: a_fetched.id,
                                    done: false,
                                    name: a_fetched.name,
                                    href: { to: a_fetched.name }
                                }
                                adjudicators.push(adjudicator)
                            }
                            commit('adjudicators', { tournament: {tournament_name: t.tournament_name}, adjudicators })
                        })
                }
            })
        */
      return new Promise(async (resolve, reject) => {
        if (state.tournaments.length === 0) {
          await dispatch('init_tournaments')
        }
        setTimeout(() => {
          const adjudicators = [{
            id: -1,
            name: 'Adjudicator 1',
            //href: { to: `Adjudicator%201` },
            institutions: [1],
            available: true
          }, {
            id: -2,
            name: 'Adjudicator 2',
            //href: { to: `Adjudicator%202` },
            institutions: [1],
            available: true
          }, {
            id: -5,
            name: 'Adjudicator 5',
            //href: { to: `Adjudicator%205` },
            institutions: [1],
            available: true
          }, {
            id: -3,
            name: 'Adjudicator 3',
            //href: { to: `Adjudicator%203` },
            institutions: [1],
            available: true
          }, {
            id: -6,
            name: 'Adjudicator 6',
            //href: { to: `Adjudicator%206` },
            institutions: [1],
            available: true
          }, {
            id: -7,
            name: 'Adjudicator 7',
            //href: { to: `Adjudicator%207` },
            institutions: [2],
            available: true
          }, {
            id: -4,
            name: 'Adjudicator 4',
            //href: { to: `Adjudicator%204` },
            institutions: [1],
            available: true
          }]
          commit('adjudicators', { tournament: {tournament_name: 'PDA Tournament 2018'}, adjudicators })
          resolve()
      }, 1000)
    })
    },
    init_teams ({ state, commit, dispatch }, payload) {
        /*let p = state.tournaments.length === 0 ? dispatch('init_tournaments') : new Promise((resolve, reject) => resolve())
        return p
            .then(function() {
                for (let t of state.tournaments) {
                    fetch(API_BASE_URL+'/tournaments/'+t.id+'/teams')
                        .then(response => response.json())
                        .then(function (response) {
                            let teams = []
                            for (let t_fetched of response.data) {
                                let team = {
                                    id: t_fetched.id,
                                    name: t_fetched.name,
                                    details: t_fetched.details
                                }
                                teams.push(team)
                            }
                            commit('teams', { tournament: {tournament_name: t.tournament_name}, teams })
                        })
                }
            })
        */
      return new Promise(async (resolve, reject) => {
        if (state.tournaments.length === 0) {
          await dispatch('init_tournaments')
        }
        setTimeout(() => {
          const teams = [{
              id: 1,
              name: 'Super Duper Jumpin\' Long Team Name',
              speakers: [1, 2, 3],
              institutions: [1],
              available: true
            }, {
              id: 2,
              name: 'Team B',
              speakers: [4, 5, 6, 7],
              institutions: [1],
              available: true
            }, {
              id: 3,
              name: 'Team C',
              speakers: [8, 9],
              institutions: [2],
              available: true
            }, {
              id: 4,
              name: 'Team D',
              speakers: [10, 11],
              institutions: [],
              available: true
            }]
          commit('teams', { tournament: {tournament_name: 'PDA Tournament 2018'}, teams })
          resolve()
      }, 1000)
    })
    },
    login ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (state.auth.session) {
          await dispatch('logout', { session: state.auth.session })
        }
        let session = null
        if (payload.user_name === "admin" && payload.password === "nimda") {
          setTimeout(() => {
            session = 'c0rjqc+as-wAJwkfj2jrdKSDqce2-qo'
            commit('session', { session })
            resolve(true)
          }, 1000)
        } else {
          setTimeout(() => {
            resolve(false)
          }, 1000)
        }
      })
    },
    logout ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        let session = 'c0rjqc+as-wAJwkfj2jrdKSDqce2-qo';
        setTimeout(() => {
          commit('session', { session: null })
          resolve(true)
        }, 1000)
      })
    }
  },
  modules: {
    ballot,
    result
  }
}
