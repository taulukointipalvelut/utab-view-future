import ballot from 'pages/tournament/round/ballot/adjudicator/stores'

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
    },/*
    add_adjudicators (state, payload) {
      state.tournaments[payload.tournament.tournament_name].adjudicators += payload.adjudicators
    },*/
    add_adjudicator (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.adjudicators.push(payload.adjudicator)
    },
    delete_adjudicator (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.adjudicators = tournament.adjudicators.filter(x => x.id !== payload.adjudicator.id)
    },
    /* teams */
    teams (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams = payload.teams
    },/*
    add_teams (state, payload) {
      state.tournaments[payload.tournament.tournament_name].teams += payload.teams
    },*/
    add_team (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams.push(payload.team)
    },
    delete_team (state, payload) {
      let tournament = state.tournaments.find(t => t.tournament_name === payload.tournament.tournament_name)
      tournament.teams = tournament.teams.filter(x => x.id !== payload.team.id)
    }
  },
  actions: {
    init_tournaments ({ commit }) {
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
            draws: [
                {
                    r: 1,
                    allocation: [{
                        venue: '101',
                        gov: {
                          name: 'Team A'
                        },
                        opp: {
                          name: 'Team B'
                        },
                        chairs: [{
                          name: 'Adj A'
                        }],
                        panels: [{
                          name: 'Adj B'
                        }, {
                          name: 'Adj C'
                        }],
                        trainees: []
                    }]
                },{
                    r: 2,
                    allocation: [{
                        venue: '101',
                        gov: {
                          name: 'Team A'
                        },
                        opp: {
                          name: 'Team B'
                        },
                        chairs: [{
                          name: 'Adj A'
                        }],
                        panels: [{
                            name: 'Adj B'
                          }, {
                            name: 'Adj C'
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
        }, 2000)
      })
    },
    init_adjudicators ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (state.tournaments.length === 0) {
          await dispatch('init_tournaments')
        }
        setTimeout(() => {
          const adjudicators = [{
            done: false,
            name: 'Adjudicator 1',
            venue: 'E-204',
            href: { to: `Adjudicator%201` }
          }, {
            done: true,
            name: 'Adjudicator 2',
            venue: 'Table 8',
            href: { to: `Adjudicator%202` }
          }, {
            done: false,
            name: 'Adjudicator 5',
            venue: 'Table 13',
            href: { to: `Adjudicator%205` }
          }, {
            done: false,
            name: 'Adjudicator 3',
            venue: 'Table 14',
            href: { to: `Adjudicator%203` }
          }, {
            done: false,
            name: 'Adjudicator 6',
            venue: 'H-208',
            href: { to: `Adjudicator%206` }
          }, {
            done: true,
            name: 'Adjudicator 7',
            venue: 'H-102',
            href: { to: `Adjudicator%207` }
          }, {
            done: true,
            name: 'Adjudicator 4',
            venue: 'Riso H-286',
            href: { to: `Adjudicator%204` }
          }]
          commit('adjudicators', { tournament: {tournament_name: 'PDA Tournament 2018'}, adjudicators })
          resolve()
        }, 2000)
      })
    },
    init_teams ({ state, commit, dispatch }, payload) {
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
        }, 2000)
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
          }, 2000)
        } else {
          setTimeout(() => {
            resolve(false)
          }, 2000)
        }
      })
    },
    logout ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        let session = 'c0rjqc+as-wAJwkfj2jrdKSDqce2-qo';
        setTimeout(() => {
          commit('session', { session: null })
          resolve(true)
        }, 2000)
      })
    }
  },
  modules: {
    ballot
  }
}
