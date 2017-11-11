<template lang="pug">
  team-slides(v-if="label === 'teams'", :max_ranking_rewarded="max_ranking_rewarded", :type="type", :credit="credit", :tournament="tournament", @close="$emit('close')")
  speaker-slides(v-else-if="label === 'speakers'", :max_ranking_rewarded="max_ranking_rewarded", :type="type", :credit="credit", :tournament="tournament", @close="$emit('close')")
  adjudicator-slides(v-else-if="label === 'adjudicators'", :max_ranking_rewarded="max_ranking_rewarded", :type="type", :credit="credit", :tournament="tournament", @close="$emit('close')")
  poi-slides(v-else-if="label === 'poi'", :max_ranking_rewarded="max_ranking_rewarded", :type="type", :credit="credit", :tournament="tournament", @close="$emit('close')")
  best-slides(v-else-if="label === 'best'", :max_ranking_rewarded="max_ranking_rewarded", :type="type", :credit="credit", :tournament="tournament", @close="$emit('close')")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import math from 'assets/js/math'
import team_slides from 'components/slides/team-slides'
import speaker_slides from 'components/slides/speaker-slides'
import adjudicator_slides from 'components/slides/adjudicator-slides'
import poi_slides from 'components/slides/poi-slides'
import best_slides from 'components/slides/best-slides'

export default {
  name: 'slides-wrapper',
  components: {
    'team-slides': team_slides,
    'speaker-slides': speaker_slides,
    'adjudicator-slides': adjudicator_slides,
    'poi-slides': poi_slides,
    'best-slides': best_slides
  },
  props: [
    'max_ranking_rewarded',
    'type',
    'credit',
    'label',
    'tournament'
  ]
}
</script>
