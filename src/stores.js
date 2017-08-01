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
    tournaments: [],
    rounds: [],
    teams: [],
    adjudicators: [],
    draw: [{
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
    }, {
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
  },
  getters: {
    isAuth: state => { return (state.auth && state.auth.session) ? true: false; },
    current_tournament: state => state.tournaments.find(tournament => tournament.name === state.route.params.tournament_name),
    current_round: state => state.rounds.find(round => round.name === state.route.params.round_name),
    current_adjudicator: state => state.adjudicators ? state.adjudicators.find(adjudicator => adjudicator.name === state.route.params.adjudicator_name) : null
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
    add_tournaments (state, payload) {
      state.tournaments += payload.tournaments
    },
    add_tournament (state, payload) {
      state.tournaments.push(payload.tournament)
    },
    delete_tournament (state, payload) {
      state.tournaments = state.tournaments.filter(x => x.id !== payload.tournament.id)
    },
    /* tournaments */
    rounds (state, payload) {
      state.rounds = payload.rounds
    },
    add_rounds (state, payload) {
      state.rounds += payload.rounds
    },
    add_round (state, payload) {
      state.rounds.push(payload.round)
    },
    delete_round (state, payload) {
      state.rounds = state.rounds.filter(x => x.round_num !== payload.round.round_num)
    },
    /* adjudicators */
    adjudicators (state, payload) {
      console.log(payload.adjudicators)
      state.adjudicators = payload.adjudicators
    },
    add_adjudicators (state, payload) {
      state.adjudicators += payload.adjudicators
    },
    add_adjudicator (state, payload) {
      state.adjudicators.push(payload.adjudicator)
    },
    delete_adjudicator (state, payload) {
      state.adjudicators = state.adjudicators.filter(x => x.id !== payload.adjudicator.id)
    },
    /* teams */
    teams (state, payload) {
      state.teams = payload.teams
    },
    add_teams (state, payload) {
      state.teams += payload.teams
    },
    add_team (state, payload) {
      state.teams.push(payload.team)
    },
    delete_team (state, payload) {
      state.teams = state.teams.filter(x => x.id !== payload.team.id)
    }
  },
  actions: {
    init_tournaments ({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const tournaments = [{
            id: 284,
            name: 'PDA Tournament 2018',
            href: { path: '/PDA Tournament 2018' },
            current_round_num: 1,
            total_round_num: 4,
            style: {
              name: 'PDA'
            }
          }, {
            id: 283,
            name: 'PDA Tournament 2017',
            href: { path: '/PDA Tournament 2017' }
          }]
          commit('tournaments', { tournaments })
          resolve()
        }, 2000)
      })
    },
    init_rounds ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (!state.tournaments || state.tournaments.length <= 0) {
          await dispatch('init_tournaments')
        }
        setTimeout(() => {
          const rounds = [{
            name: 'Round 1',
            href: { path: '/PDA Tournament 2018/Round 1' },
            round_num: 1,
            draw_opened: true,
            allocation_opened: true,
          }, {
            name: 'Round 2',
            href: { path: '/PDA Tournament 2018/Round 2' },
            round_num: 2,
            draw_opened: false,
            allocation_opened: false
          }]
          commit('rounds', { rounds })
          resolve()
        }, 2000)
      })
    },
    init_adjudicators ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (!state.tournaments || state.rounds.length <= 0) {
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
          commit('adjudicators', { adjudicators })
          resolve()
        }, 2000)
      })
    },
    init_teams ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (!state.tournaments || state.rounds.length <= 0) {
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
              id: 3,
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
          commit('teams', { teams })
          resolve()
        }, 2000)
      })
    },
    login ({ state, commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        if (state.auth.session) {
          await dispatch('logout', { session: state.auth.session })
        }
        let session = null;
        setTimeout(() => {
          session = 'c0rjqc+as-wAJwkfj2jrdKSDqce2-qo'
          commit('session', { session })
          resolve(true)
        }, 2000)
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