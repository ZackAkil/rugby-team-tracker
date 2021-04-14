// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `
.match-timeline { 
    font-size: 20px; 
    max-width:600px;
    text-align: center;
    margin:auto;
    position: relative;
    padding: 20px 20px 0 20px;
}

.match-timeline::after{
    content: '';
    position: absolute;
    width: 3px;
    background-color: black;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
    z-index:-1;
}

.team-events{
    width: 49%;
    position: relative;
    display: inline-block;
}

.home-team-event {
    margin-right: 20%;
}

.away-team-event {
    margin-left: 20%;
}

.match-event, .timeline-score{
    border: black solid 2px;
    margin-top: 15px;
    margin-bottom: 15px;
    padding:15px;
    background-color: white;
}

.match-event > h3{
    margin: 0 15px;
}

.timeline-score{
    width: fit-content;
    margin: auto;
    border: none;
}

.timeline-score>span{
    font-style: italic;
}

.match-event:hover{
    border-style: dashed;
    cursor:pointer;
}

.scorer{
    display:inline-block;
    margin:0;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);





Vue.component('match-event', {
    props: ['event_data', 'home_team_color', 'away_team_color'],
    template: `
    <div class="match-event" 
    v-bind:class="{ 'home-team-event': event_data.match_side == 'home',  
    'away-team-event': event_data.match_side == 'away'}">

        <span> {{ parseInt(event_data.video_seconds_exact/60)}}'</span>

        <h3 class="scorer team-text"  
        v-bind:style="{'text-decoration-color': event_data.match_side == 'home' ? home_team_color : away_team_color}"> 
        {{event_data.player.name}} 
        </h3>

        <span> {{ event_data.run_distance}}m</span>

        <span v-if="event_data.points != 1">
        +{{event_data.points}}  
        </span>

        <br>

        <span v-if="event_data.asisted_from.length > 0">
            assist from 
            <span v-for="assistor in event_data.asisted_from" >{{assistor.name}}</span>
            <br>
        </span>

        



    </div>
    `
})


Vue.component('match-timeline', {
    props: ['match_details'],
    computed: {
        halftime_score: function () {
            return get_score_at_time(this.match_details.video_halftime_seconds, this.match_details.scores)
        },
        fulltime_score: function () {
            return get_score_at_time(Infinity, this.match_details.scores)
        },
        first_half_scores: function () {
            return this.match_details.scores.filter(event => event.video_seconds_exact <= this.match_details.video_halftime_seconds).sort(function (a, b) {
                return a.video_seconds_exact - b.video_seconds_exact;
            })
        },
        second_half_scores: function () {
            return this.match_details.scores.filter(event => event.video_seconds_exact > this.match_details.video_halftime_seconds).sort(function (a, b) {
                return a.video_seconds_exact - b.video_seconds_exact;
            })

        }
    },
    methods:{
        event_clicked:function(event_data){
            this.$emit('event-clicked', event_data)
        }
    },
    template: `
    <div class="match-timeline">

        <match-event v-for="event in first_half_scores" 
        :key="event.id"
        
        v-bind:event_data="event"
        v-bind:home_team_color="match_details.home_team.color"
        v-bind:away_team_color="match_details.away_team.color"

        v-on:click.native="event_clicked(event)"
        ></match-event>

        <div class="timeline-score"><span>Half time</span>
            <div>
                <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.home_team.color}">{{halftime_score[0]}}</span> : 
                <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.away_team.color}">{{halftime_score[1]}}</span>
            </div>
        </div>

        <match-event v-for="event in second_half_scores" 
        :key="event.id"
        v-bind:event_data="event"

        v-bind:home_team_color="match_details.home_team.color"
        v-bind:away_team_color="match_details.away_team.color"

        v-on:click.native="event_clicked(event)"
        ></match-event>

        <div class="timeline-score"><span>Full time</span>
            <div>
                <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.home_team.color}">{{fulltime_score[0]}}</span> : 
                <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.away_team.color}">{{fulltime_score[1]}}</span>
            </div>
        </div>

    </div>
    `
})