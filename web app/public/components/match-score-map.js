// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-score-map{
    text-align:center;
}

.match-score-map-viz{
    border: solid black 2px;
    height:300px;
    width:500px;
    margin:auto;
    position:relative;
}

.map-score{
    position: absolute;
    background-color: black;
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

.info-text{
    background-color: #f3f3f3;
    display: inline-block;
    padding: 10px;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);





Vue.component('match-score-map', {
    props: ["scores", "match_details"],
    data: function () {
        return {
            show_home_team: true,
            show_away_team: true
        }
    },
    computed: {
        home_scores:function(){
            return this.scores.filter(score => score.match_side== "home")
        },
        away_scores:function(){
            return this.scores.filter(score => score.match_side== "away")
        }
    },
    template: `
    <div class="match-score-map">
        <p class="info-text">
        Showing where on the try line that scores happened and from what distance that scoring phase started.
        </p>

        <br>

        <input type="checkbox" name="home_team"  v-model="show_home_team"
        checked>
        <label for="home_team">{{match_details.home_team.name}} scores</label>

        <input type="checkbox" name="away_team" v-model="show_away_team"
        checked>
        <label for="away_team">{{match_details.away_team.name}} scores</label>

        <br><br>
        <match-score-map-viz-both v-bind:scores="scores" v-bind:match_details="match_details"
        v-bind:show_home_team="show_home_team" v-bind:show_away_team="show_away_team"> </match-score-map-viz-both>
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


Vue.component('match-score-map-viz-both', {
    props: ["scores", "match_details", "show_home_team", "show_away_team"],
    data: function () {
        return {
            offset: 0.2
        }
    },
    computed: {
        filtered_offset_scores(){

            var output = []

            if (this.show_home_team){
                output = output.concat(this.offset_scores(this.scores.filter(score => score.match_side =='home')))
            }

            if (this.show_away_team){
                output = output.concat(this.offset_scores(this.scores.filter(score => score.match_side =='away')))
            }

            return output

        }
    },
    methods: {
        offset_scores: function (scores) {
            `
            Offset score positions so that they don't overlap
            `
            var output_scores = []

            const poistions = new Set()

            scores.forEach(score => {

                var position_to_add = score.score_position

                while (poistions.has(position_to_add)) {
                    position_to_add += this.offset
                }

                poistions.add(position_to_add)

                output_scores.push({...score, 'score_position':position_to_add})

            })

            return output_scores
        },
        map_score_line_style: function (score) {
            var css = {}

            if (score.match_side == 'home'){
                css.right = "0"
                css['background-color'] = this.match_details.home_team.color
                css.top = ( (score.score_position * 9)+5 ).toString() + '%'

            }
            else{
                css.left = "0"
                css['background-color'] = this.match_details.away_team.color
                css.bottom = ( (score.score_position * 9)+5 ).toString() + '%'
            }

            

            css.width = (score.run_distance).toString() + '%'

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

        <div class="map-score" v-for="score in filtered_offset_scores" v-bind:style="map_score_line_style(score)">
        </div>
    </div>
    `
})

