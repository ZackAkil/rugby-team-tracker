// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-summary{

}

.score-list{
    display: inline-block;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);





Vue.component('match-summary', {
    props: ["scores", "match_details"],
    data: function () {
        return {

        }
    },
    methods: {
        group_players_scores: function(scores){
            `get all the scores grouped for each player`
            const output = {}

            scores.forEach(score => {

                if  (!(score.player.id in output))
                    output[score.player.id] = {...score.player, 'scores':[]}

                output[score.player.id].scores.push(score)

            })

            return output
        }
    },
    computed: {
        home_scores: function () {
            return this.scores.filter(score => score.match_side == "home").sort(function(a, b) {
                return a.video_seconds_exact - b.video_seconds_exact
              })
        },
        away_scores: function () {
            return this.scores.filter(score => score.match_side == "away").sort(function(a, b) {
                return a.video_seconds_exact - b.video_seconds_exact
              })
        }
    },
    template: `
    <div class="match-summary">



        <div class="score-list">
            <div  v-for="player in group_players_scores(home_scores)">{{player.name}}
            <span v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}) </span>
            </div>
        </div>

        <div class="score-list">
            <div  v-for="player in group_players_scores(away_scores)">{{player.name}}
            <span v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}) </span>
            </div>
        </div>

    </div>
    `
})


