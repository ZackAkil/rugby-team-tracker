// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-score-map-viz{
    border: solid black 2px;
    height:300px;
    width:500px;
    margin:auto;
    position:relative;
}

.map-score{
    position: absolute;
    background-color: red;
    height: 2px;
}

.line{
    position: absolute;
    height:100%;
    width:1px;
    background-color:#e2e2e2;
}

.meter_10{
    left:10%;
}
.meter_20{
    left:30%;
}
.meter_50{
    left:50%;
    border-left: dashed black 1px;
}
.meter_70{
    left:70%;
}
.meter_90{
    left:90%;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);





Vue.component('match-score-map', {
    props: ["scores", "match_details"],
    computed: {
        home_scores:function(){
            return this.scores.filter(score => score.match_side== "home")
        },
        away_scores:function(){
            return this.scores.filter(score => score.match_side== "away")
        }
    },
    template: `
    <div>
        <match-score-map-viz v-bind:scores="home_scores"
        v-bind:line_color="match_details.home_team.color"> </match-score-map-viz>
        <br>
        <match-score-map-viz v-bind:scores="away_scores"
        v-bind:line_color="match_details.away_team.color"> </match-score-map-viz>
    </div>
    `
})


Vue.component('match-score-map-viz', {
    props: ["scores", "line_color"],
    data: function () {
        return {
            offset: 0.1
        }
    },
    computed: {
        offset_scores: function () {
            `
            Offset score positions so that they don't overlap
            `
            var output_scores = []

            const poistions = new Set()

            this.scores.forEach(score => {

                var position_to_add = score.score_position

                while (poistions.has(position_to_add)) {
                    position_to_add += this.offset
                }

                poistions.add(position_to_add)

                output_scores.push({...score, 'score_position':position_to_add})

            })

            return output_scores
        }
    },
    methods: {
        map_score_line_style: function (score) {
            var css = {}

            css.left = "0"

            css.top = ( (score.score_position * 9)+5 ).toString() + '%'

            css.width = (score.run_distance).toString() + '%'

            css['background-color'] = this.line_color

            return css
        }
    },
    template: `
    <div class="match-score-map-viz">

        <div class="line meter_10"></div>
        <div class="line meter_20"></div>
        <div class="line meter_50"></div>
        <div class="line meter_70"></div>
        <div class="line meter_90"></div>

        <div class="map-score" v-for="score in offset_scores" v-bind:style="map_score_line_style(score)">
        </div>
    </div>
    `
})


