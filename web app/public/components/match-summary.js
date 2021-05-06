// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-summary{
text-align:center;
}

.score-list{
    display: inline-block;
    padding: 15px;
    vertical-align: top;
    width:42%;
    font-size: 1.2em;
}

.home-score-list{
    text-align:right;
}

.away-score-list{
    text-align:left;
}

.score-box{
    font-size: 1.5em;
}

.score-box > h2{
    display: inline-block;
}

.score-box > div{
    display: inline-block;
    width: 40px;
    border-bottom: solid black 6px;
}

.score-box > div > h2{
    line-height: 0;
}

.score-list-center-line{
    display: inline-block;
    height: 100%;
    width: 1px;
    background-color: gray;
}

.player-score{
    margin: 5px;
}
.player-score > span{
    display: inline-block;
    margin-right: 5px;
    cursor: pointer;
}

.player-score > span:hover{
    text-decoration: underline;
}

.player-name{
    display: inline-block;
    margin: 0;

}

.player_score-lists{
    position:relative;
    margin-top: 15px;
}

.player_score-lists::after{
    content: '';
    position: absolute;
    width: 1px;
    background-color: black;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -0.5px;
    z-index:-1;
}

.assist{
    color: gray;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);





Vue.component('match-summary', {
    props: ["scores", "match_details"],
    data: function () {
        return {
            show_assists: true
        }
    },
    methods: {
        group_players_scores: function (scores) {
            `get all the scores grouped for each player`
            const output = {}

            scores.forEach(score => {

                const player_id = score.player ? score.player.id : null


                if (!(player_id in output))
                    output[player_id] = { ...score.player, 'scores': [] }

                output[player_id].scores.push(score)

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
        },
        jump_to_video: function(score){
            console.log(score)
            this.$emit('event-clicked', score)
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
            const output = [0,0]
            
            this.scores.forEach(score => {
                if (score.match_side == 'home')
                    output[0] += score.points
                else
                    output[1] += score.points
            })
            return output
        }
    },
    template: `
    <div class="match-summary">

        <div class="score-box">
            <div v-bind:style="{'border-bottom-color':match_details.home_team.color}"><h2>{{final_score[0]}}</h2></div>
            <h2>:</h2>
            <div v-bind:style="{'border-bottom-color':match_details.away_team.color}"><h2>{{final_score[1]}}</h2></div>
        </div>



        <div class="player_score-lists">
            <div class="score-list home-score-list">
                <div class="player-score"   v-for="player in home_scores"><h3 class="player-name">{{player.name ? player.name : 'Someone'}}</h3>
                    <span v-on:click="jump_to_video(score)" v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}  
                        <span v-if="score.points != 1">+{{score.points}}</span> <span class="assist" v-if="show_assists && score.assisting_player"> · {{score.assisting_player.name}} </span>) </span>
                </div>
            </div>
            
            <div class="score-list away-score-list">
                <div class="player-score"  v-for="player in away_scores"><h3 class="player-name">{{player.name ? player.name : 'Someone'}}</h3>
                    <span v-on:click="jump_to_video(score)" v-for="score in player.scores"> ('{{parseInt(score.video_seconds_exact/60)}}
                    <span v-if="score.points != 1">+{{score.points}}</span> <span class="assist" v-if="show_assists && score.assisting_player"> · {{score.assisting_player.name}} </span>) </span>

                
                </div>
            </div>
        </div>

        <br>
        <input type="checkbox" name="assists"  v-model="show_assists" checked>
        <label for="assists">Show assists</label>

    </div>
    `
})


