import ballot from 'pages/tournament/round/ballot/adjudicator/stores'
import result from 'pages/admin/result/stores'

let API_BASE_URL = 'http://localhost:7024'

function find_tournament (state, payload) {
    return state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
}

function add_factory (label) {
    function add_entities (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[label] = tournament[label].concat(payload[label])
    }
    return add_entities
}

function delete_factory (label, label_singular, key='id') {
    function delete_entity (state, payload) {
        let tournament = find_tournament(state, payload)
        tournament[label] = tournament[label].filter(x => x[key] !== payload[label_singular][key])
    }
    return delete_entity
}

function fetch_post (url, data) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
}

function fetch_delete (url) {
    return fetch(url, {
        method: 'DELETE'
    })
}

function select_by_key_factory (label, key="id") {
    function select_by_key (state, getters) {
        return key_str => {
            let targets = getters.target_tournament[label]
            return targets.find(t => t[key] == parseInt(key_str))
        }
    }
    return select_by_key
}

function action_add_base_entities_factory (label) {
    function add_base_entities ({state, commit, dispatch}, payload) {
      let tournament = find_tournament(state, payload)
      let entities = []
      let id_diff = 1
      for (let e of payload[label]) {
          let entity = {
              id: tournament[label].length+id_diff,
              name: e.name,
              details: e.details
          }
          id_diff += 1
          entities.push(entity)
      }
      new_payload = { tournament }
      new_payload[label] = entities

      fetch_post(API_BASE_URL+'/tournaments/'+tournament.id+'/'+label, entities)
          .then(() => commit('add_'+label, new_payload))
    }
    return add_base_entities
}

function action_delete_base_entities_factory (label, label_singular) {
    function delete_base_entities ({state, commit, dispatch}, payload) {
        let tournament = find_tournament(state, payload)
        new_payload = { tournament }
        new_payload[label_singular] = payload[label_singular]
        fetch_delete(API_BASE_URL+'/tournaments/'+tournament.id+'/'+label+'/'+payload[label_singular].id)
            .then(() => commit('delete_'+label_singular, new_payload))
    }
    return delete_base_entities
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
    target_adjudicator: (state, getters) => {
      return getters.target_tournament ? getters.target_tournament.adjudicators.find(adjudicator => adjudicator.name === state.route.params.adjudicator_name) : null
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
                    href: { to: getters.adjudicator_by_id(id).name }
                }
                score_sheets.push(score_sheet)
            }
        }
        return score_sheets
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
    add_rounds: add_factory('rounds'),
    delete_round: delete_factory('rounds', 'round', 'r'),
    add_teams: add_factory('teams'),
    delete_team: delete_factory('teams', 'team'),
    add_adjudicators: add_factory('adjudicators'),
    delete_adjudicator: delete_factory('adjudicators', 'adjudicator'),
    add_speakers: add_factory('speakers'),
    delete_speaker: delete_factory('speakers', 'speaker'),
    add_venues: add_factory('venues'),
    delete_venue: delete_factory('venues', 'venue'),
    add_institutions: add_factory('institutions'),
    delete_institutions: delete_factory('institutions', 'institution')
  },
  actions: {
      add_rounds ({state, commit, dispatch}, payload) {
          commit('add_rounds', payload)
      },
      delete_round ({state, commit, dispatch}, payload) {
          commit('delete_round', payload)
      },
      add_tournament ({state, commit, dispatch}, payload) {
         fetch_post(API_BASE_URL+'/tournaments', payload.tournament)
            .then(() => commit('add_tournament', payload))
      },
      add_teams ({state, commit, dispatch}, payload) {
        let tournament = find_tournament(state, payload)
        let teams = []
        let id_diff = 1
        for (let t of payload.teams) {
            let team = {
                id: tournament.teams.length+id_diff,
                name: t.name,
                details: t.details
            }
            id_diff += 1
            teams.push(team)
        }

        fetch_post(API_BASE_URL+'/tournaments/'+tournament.id+'/teams', teams)
            .then(() => commit('add_teams', { tournament, teams }))
      },
      delete_team ({state, commit, dispatch}, payload) {
        let tournament = find_tournament(state, payload)
        fetch_delete(API_BASE_URL+'/tournaments/'+tournament.id+'/teams/'+payload.team.id)
            .then(() => commit('delete_team', { tournament, team: payload.team }))
      },
      add_adjudicators ({state, commit, dispatch}, payload) {
        let tournament = find_tournament(state, payload)
        let adjudicators = []
        let id_diff = 1
        for (let t of payload.adjudicators) {
            let adjudicator = {
                id: -tournament.adjudicators.length-id_diff,
                name: t.name,
                details: [{
                    r: 1,
                    conflicts: [
                        1
                    ],
                    institutions: [],
                    available: true
                }]
            }
            id_diff += 1
            adjudicators.push(adjudicator)
        }

        fetch_post(API_BASE_URL+'/tournaments/'+tournament.id+'/adjudicators', adjudicators)
            .then(() => commit('add_adjudicators', { tournament, adjudicators }))
      },
      delete_adjudicator ({state, commit, dispatch}, payload) {
        let tournament = find_tournament(state, payload)
        fetch_delete(API_BASE_URL+'/tournaments/'+tournament.id+'/adjudicators/'+payload.adjudicator.id)
            .then(() => commit('delete_adjudicator', { tournament, adjudicator: payload.adjudicator }))
      },
      add_speakes: action_add_base_entities_factory('speakers'),
      add_venues: action_add_base_entities_factory('venues'),
      add_institutions: action_add_base_entities_factory('institutions'),
      delete_speakes: action_delete_base_entities_factory('speakers', 'speaker'),
      delete_venues: action_delete_base_entities_factory('venues', 'venue'),
      delete_institutions: action_delete_base_entities_factory('institutions', 'institution'),
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
            }, {
                id: 12,
                name: "s12"
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
                                    draw_opened: true,
                                    allocation_opened: true
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
            draw_opened: true,
            allocation_opened: true,
          },
          {
            href: { path: '/PDA Tournament 2018/rounds/2' },
            r: 2,
            round_name: "Round 2",
            draw_opened: false,
            allocation_opened: false
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
            institutions: [1]
          }, {
            id: -2,
            name: 'Adjudicator 2',
            //href: { to: `Adjudicator%202` },
            institutions: [1]
          }, {
            id: -5,
            name: 'Adjudicator 5',
            //href: { to: `Adjudicator%205` },
            institutions: [1]
          }, {
            id: -3,
            name: 'Adjudicator 3',
            //href: { to: `Adjudicator%203` },
            institutions: [1]
          }, {
            id: -6,
            name: 'Adjudicator 6',
            //href: { to: `Adjudicator%206` },
            institutions: [1]
          }, {
            id: -7,
            name: 'Adjudicator 7',
            //href: { to: `Adjudicator%207` },
            institutions: [2]
          }, {
            id: -4,
            name: 'Adjudicator 4',
            //href: { to: `Adjudicator%204` },
            institutions: [1]
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
              institutions: [1]
            }, {
              id: 2,
              name: 'Team B',
              speakers: [4, 5, 6, 7],
              institutions: [1]
            }, {
              id: 3,
              name: 'Team C',
              speakers: [8, 9],
              institutions: [2]
            }, {
              id: 4,
              name: 'Team D',
              speakers: [10, 11],
              institutions: []
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
