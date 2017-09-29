
export default {
    namespaced: true,
    state: {
        raw_team_results: [{
            id: 1,
            r: 1,
            from_id: -1,
            win: 0,
            side: "gov",
            opponents: [2]
        },
        {
            id: 2,
            r: 1,
            from_id: -2,
            win: 1,
            side: "opp",
            opponents: [1]
        },
        {
            id: 4,
            r: 1,
            from_id: -3,
            win: 0,
            side: "gov",
            opponents: [3]
        },
        {
            id: 3,
            r: 1,
            from_id: -4,
            win: 1,
            side: "opp",
            opponents: [4]
        }],
        raw_speaker_results: [{
            id: 1,
            r: 1,
            from_id: -1,
            scores: [10, 0, 0, 5]
        }, {
            id: 2,
            r: 1,
            from_id: -1,
            scores: [0, 10, 0, 0]
        }, {
            id: 3,
            r: 1,
            from_id: -1,
            scores: [0, 0, 10, 0]
        }, {
            id: 4,
            r: 1,
            from_id: -1,
            scores: [10, 0, 0, 0]
        }, {
            id: 5,
            r: 1,
            from_id: -1,
            scores: [0, 10, 0, 0]
        }, {
            id: 6,
            r: 1,
            from_id: -1,
            scores: [0, 0, 10, 0]
        }, {
            id: 7,
            r: 1,
            from_id: -1,
            scores: [0, 0, 0, 5]
        }, {
            id: 8,
            r: 1,
            from_id: -1,
            scores: [10, 0, 0, 5]
        }, {
            id: 9,
            r: 1,
            from_id: -1,
            scores: [0, 10, 10, 0]
        }, {
            id: 10,
            r: 1,
            from_id: -1,
            scores: [0, 10, 10, 0]
        }, {
            id: 11,
            r: 1,
            from_id: -1,
            scores: [10, 0, 0, 5]
        }],
        compiled_team_results: {
            1: [{
                id: 1,
                win: 1,
                vote: 1,
                vote_rate: 0.3333333333333333,
                details: [
                    {
                        r: 1,
                        id: 1,
                        win: 1,
                        opponents: [
                            2
                        ],
                        side: "gov",
                        sum: 223,
                        vote: 1,
                        vote_rate: 0.6666666666666666,
                        acc: 3,
                        user_defined_data_collection: [],
                        margin: -5,
                        opponent_average: 228,
                        ranking: 1
                    }
                ],
                past_opponents: [
                    2
                ],
                past_sides: [
                    "gov"
                ],
                sum: 223,
                margin: -5,
                average_margin: -5,
                average: 223,
                sd: 0,
                opponent_average: 228,
                ranking: 1
            },
            {
                id: 2,
                win: 0,
                vote: -1,
                vote_rate: -0.3333333333333333,
                details: [
                    {
                        r: 1,
                        id: 2,
                        win: 0,
                        opponents: [
                            1
                        ],
                        side: "opp",
                        sum: 228,
                        vote: -1,
                        vote_rate: 0.3333333333333333,
                        acc: 3,
                        user_defined_data_collection: [],
                        margin: 5,
                        opponent_average: 223,
                        ranking: 3
                    }
                ],
                past_opponents: [
                    1
                ],
                past_sides: [
                    "opp"
                ],
                sum: 228,
                margin: 5,
                average_margin: 5,
                average: 228,
                sd: 0,
                opponent_average: 223,
                ranking: 3
            },
            {
                id: 3,
                win: 1,
                vote: 3,
                vote_rate: 1,
                details: [
                    {
                        r: 1,
                        id: 3,
                        win: 1,
                        opponents: [
                            4
                        ],
                        side: "opp",
                        sum: 218,
                        vote: 3,
                        vote_rate: 1,
                        acc: 3,
                        user_defined_data_collection: [],
                        margin: 31,
                        opponent_average: 187,
                        ranking: 2
                    }
                ],
                past_opponents: [
                    4
                ],
                past_sides: [
                    "opp"
                ],
                sum: 218,
                margin: 31,
                average_margin: 31,
                average: 218,
                sd: 0,
                opponent_average: 187,
                ranking: 2
            },
            {
                id: 4,
                win: 0,
                vote: -3,
                vote_rate: -1,
                details: [
                    {
                        r: 1,
                        id: 4,
                        win: 0,
                        opponents: [
                            3
                        ],
                        side: "gov",
                        sum: 187,
                        vote: -3,
                        vote_rate: 0,
                        acc: 3,
                        user_defined_data_collection: [],
                        margin: -31,
                        opponent_average: 218,
                        ranking: 4
                    }
                ],
                past_opponents: [
                    3
                ],
                past_sides: [
                    "gov"
                ],
                sum: 187,
                margin: -31,
                average_margin: -31,
                average: 187,
                sd: 0,
                opponent_average: 218,
                ranking: 4
            }]
        },
        compiled_speaker_results: {
            1: [{
                id: 1,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 2,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 3,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 4,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 5,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 6,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 7,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 8,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 9,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 10,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }, {
                id: 11,
                average: 74,
                sum: 74,
                sd: 0,
                details: [
                    {
                        r: 1,
                        id: 3,
                        scores: [
                            0,
                            0,
                            0,
                            74
                        ],
                        sum: 74,
                        average: 74,
                        user_defined_data_collection: [],
                        ranking: 1
                    }
                ],
                ranking: 1
            }]
        }
  },
  getters: {
    getter1 (state, getters, rootState, rootGetters) {
        //pass
    },
    raw_team_results_by_r (state) {
        return r_str => {
            return state.raw_team_results.filter(res => res.r === parseInt(r_str))
        }
    },
    raw_speaker_results_by_r (state) {
        return r_str => {
            return state.raw_speaker_results.filter(res => res.r === parseInt(r_str))
        }
    },
    compiled_team_results_by_r (state) {
        return r_str => {
            return state.compiled_team_results[parseInt(r_str)]
        }
    },
    compiled_speaker_results_by_r (state) {
        return r_str => {
            return state.compiled_speaker_results[parseInt(r_str)]
        }
    }
  },
  mutations: {
    mutation1 (state, payload) {
        //pass
    }
  },
  actions: {
    action1 ({ getters, state, commit, rootState }, payload) {
        //pass
    }
  }
}
