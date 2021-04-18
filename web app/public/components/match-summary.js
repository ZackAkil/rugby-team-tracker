// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-summary{
text-align:center;
}

.score-list{
    display: inline-block;
    padding: 15px;
}

.home-score-list{
    text-align:right;
    border-right: solid gray 1px;
}

.away-score-list{
    text-align:left;
}

.score-box > h2{
    display: inline-block;
}

.score-list-center-line{
    display: inline-block;
    height:100%;
    width: 1px;
    background-color: gray;
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
        group_players_scores: function (scores) {
            `get all the scores grouped for each player`
            const output = {}

            scores.forEach(score => {

                if (!(score.player.id in output))
                    output[score.player.id] = { ...score.player, 'scores': [] }

                output[score.player.id].scores.push(score)

            })

            return output
        },
        players_scores_by_side: function (scores, side) {

            return this.group_players_scores(
                scores.filter(score => score.match_side == side).sort(
                    function (a, b) {
                        return a.video_seconds_exact - b.video_seconds_exact
                    })
            )
        }
    },
    computed: {
        home_scores: function () {
            return this.players_scores_by_side(this.scores, 'home')
        },
        away_scores: function () {
            return this.players_scores_by_side(this.scores, 'away')
        },
        final_score: function () {
            return [3, 10]
        }
    },
    template: `
    <div class="match-summary">

        <div class="score-box">
            <h2>{{final_score[0]}}</h2>
            <h2>:</h2>
            <h2>{{final_score[1]}}</h2>
        </div>


        <div class="score-list home-score-list">
            <div  v-for="player in home_scores">{{player.name}}
            <span v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}) </span>
            </div>
        </div><div class="score-list away-score-list">
            <div  v-for="player in away_scores">{{player.name}}
            <span v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}) </span>
            </div>
        </div>

    </div>
    `
})


