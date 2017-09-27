import ballot from 'pages/tournament/round/ballot/adjudicator/stores'

let API_BASE_URL = 'http://localhost:7024'

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
    isAuth: state => { return (state.auth && state.auth.session) ? true: false; },
    target_tournament: state => {
      return state.tournaments.find(t => t.tournament_name === state.route.params.tournament_name)
    },
    target_round: (state, getters) => {
      if (getters.target_tournament) {
        return getters.target_tournament.rounds ? getters.target_tournament.rounds.find(round => round.r === parseInt(state.route.params.r)) : null
      } else {
        return null
      }
    },
    target_adjudicator: (state, getters) => {
      return getters.target_tournament ? getters.target_tournament.adjudicators.find(adjudicator => adjudicator.name === state.route.params.adjudicator_name) : null
    },
    target_draw: (state, getters) => {
        return getters.target_tournament.draws.find(d => d.r === parseInt(state.route.params.r))
    },
    target_score_sheets: (state, getters) => {
        let allocation = getters.target_draw.allocation
        let score_sheets = []
        for (let square of allocation) {
            for (let adjudicator of [].concat(square.chairs).concat(square.panels)) {
                let score_sheet = {
                    done: false,
                    gov: square.teams[0],
                    opp: square.teams[1],
                    adjudicator,
                    venue: square.venue,
                    chair: adjudicator.id in square.chairs.map(c => c.id) ? true : false,
                    href: { to: adjudicator.name }
                }
                score_sheets.push(score_sheet)
            }
        }
        return score_sheets
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
      state.tournaments.push(payload.tournament)
    },
    delete_tournament (state, payload) {
      state.tournaments = state.tournaments.filter(t => t.tournament_name !== payload.tournament_name)
    },
    /* tournaments */
    rounds (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.rounds = payload.rounds
    },
    /*add_rounds (state, payload) {
      state.rounds += payload.rounds
    },*/
    add_round (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.rounds.push(payload.round)
    },
    delete_round (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.rounds = state.tournaments[payload.tournament.tournament_name].rounds.filter(x => x.r !== payload.round.r)
    },
    /* adjudicators */
    adjudicators (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.adjudicators = payload.adjudicators
    },
    add_adjudicators (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.adjudicators = tournament.adjudicators.concat(payload.adjudicators)
    },
    delete_adjudicator (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.adjudicators = tournament.adjudicators.filter(x => x.id !== payload.adjudicator.id)
    },
    /* teams */
    teams (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams = payload.teams
    },
    add_teams (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams = tournament.teams.concat(payload.teams)
    },
    delete_team (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams = tournament.teams.filter(x => x.id !== payload.team.id)
    }
  },
  actions: {
      add_tournament ({state, commit, dispatch}, payload) {

        fetch(API_BASE_URL+'/tournaments', {
            method: 'POST',
            body: JSON.stringify(payload.tournament),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }).then(() => commit('add_tournament', payload))
      },
      add_teams ({state, commit, dispatch}, payload) {
        let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
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

        fetch(API_BASE_URL+'/tournaments/'+tournament.id+'/teams', {
            method: 'POST',
            body: JSON.stringify(teams),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }).then(() => commit('add_teams', { tournament, teams }))
      },
      delete_team ({state, commit, dispatch}, payload) {
        let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
        fetch(API_BASE_URL+'/tournaments/'+tournament.id+'/teams/'+payload.team.id, {
            method: 'DELETE'
        }).then(() => commit('delete_team', { tournament, team: payload.team }))
      },
      add_adjudicators ({state, commit, dispatch}, payload) {
        let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
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

        fetch(API_BASE_URL+'/tournaments/'+tournament.id+'/adjudicators', {
            method: 'POST',
            body: JSON.stringify(adjudicators),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }).then(() => commit('add_adjudicators', { tournament, adjudicators }))
      },
      delete_adjudicator ({state, commit, dispatch}, payload) {
        let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
        fetch(API_BASE_URL+'/tournaments/'+tournament.id+'/adjudicators/'+payload.adjudicator.id, {
            method: 'DELETE'
        }).then(() => commit('delete_adjudicator', { tournament, adjudicator: payload.adjudicator }))
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
                name: "Speaker 1"
            }, {
                id: 2,
                name: "Speaker 2"
            }],
            institutions: [{
                id: 1,
                name: "Institution 1"
            }, {
                id: 2,
                name: "Institution 2"
            }],
            draws: [
                {
                    r: 1,
                    allocation: [{
                        venue: '101',
                        teams: {
                            0: {
                                id: 0,
                                name: 'Team A',
                                speakers: [{
                                    name: "s1",
                                    id: 1
                                },{
                                    name: "s2",
                                    id: 2
                                }]
                            },
                            1: {
                                id: 1,
                                name: 'Team B',
                                speakers: [{
                                    name: "s3",
                                    id: 3
                                },{
                                    name: "s4",
                                    id: 4
                                }]
                            },
                        },
                        chairs: [{
                            id: 0,
                            name: 'Adjudicator 1'
                        }],
                        panels: [{
                            id: 1,
                            name: 'Adjudicator 2'
                        }, {
                            id: 2,
                            name: 'Adjudicator 3'
                        }],
                        trainees: []
                    }]
                },{
                    r: 2,
                    allocation: [{
                        venue: '101',
                        teams: {
                            0: {
                                id: 0,
                                name: 'Team A'
                            },
                            1: {
                                id: 1,
                                name: 'Team B'
                            },
                        },
                        chairs: [{
                            id: 0,
                            name: 'Adjudicator 1'
                        }],
                        panels: [{
                            id: 1,
                            name: 'Adjudicator 2'
                        }, {
                            id: 2,
                            name: 'Adjudicator 3'
                        }],
                        trainees: []
                    }]
                }
            ],
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
            href: { to: `Adjudicator%201` }
          }, {
            id: -2,
            name: 'Adjudicator 2',
            href: { to: `Adjudicator%202` }
          }, {
            id: -5,
            name: 'Adjudicator 5',
            href: { to: `Adjudicator%205` }
          }, {
            id: -3,
            name: 'Adjudicator 3',
            href: { to: `Adjudicator%203` }
          }, {
            id: -6,
            name: 'Adjudicator 6',
            href: { to: `Adjudicator%206` }
          }, {
            id: -7,
            name: 'Adjudicator 7',
            href: { to: `Adjudicator%207` }
          }, {
            id: -4,
            name: 'Adjudicator 4',
            href: { to: `Adjudicator%204` }
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
              speakers: [{
                id: 1,
                name: 'Speaker 1'
              }, {
                id: 2,
                name: 'Speaker 2'
              }, {
                id: 3,
                name: 'Speaker 3'
              }]
            }, {
              id: 2,
              name: 'Team B',
              speakers: [{
                id: 4,
                name: 'Speaker 4'
              }, {
                id: 5,
                name: 'Speaker 5'
              }, {
                id: 6,
                name: 'Speaker 6'
              }, {
                id: 7,
                name: 'Speaker 7'
              }]
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
    ballot
  }
}
