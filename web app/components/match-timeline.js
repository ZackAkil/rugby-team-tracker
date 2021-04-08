// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `
.match-timeline { 
    font-size: 20px; 
    max-width:600px;
    text-align: center;
    margin:auto;
    position: relative;
    padding: 20px 0 0 0;
}

.match-timeline::after{
    content: '';
    position: absolute;
    width: 4px;
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
    v-bind:class="{ 'home-team-event': event_data.team == 'home',  'away-team-event': event_data.team == 'away'}"
    v-on:click="jump_video_to_time(event_data.time_from)"
    >
    
        <h3 class="scorer team-text"  v-bind:style="{ 'text-decoration-color': event_data.team == 'home' ? home_team_color : away_team_color }"> {{event_data.scorer}} </h3>
        <br>
        
        <span v-if="event_data.assist">
            assist from 
            {{event_data.assist}}
            <br>
        </span>

        <span> {{ parseInt(event_data.exact_time/60)}}'</span>

        <span> {{ event_data.distance}}m</span>

        +{{event_data.points}}  

    </div>
    `
})


Vue.component('match-timeline', {
    props: ['match_events', 'home_team_color', 'away_team_color', 'half_time_mark'],
    computed: {
        halftime_score: function () {
            return get_score_at_time(this.half_time_mark, this.match_events)
        },
        fulltime_score: function () {
            return get_score_at_time(Infinity, this.match_events)
        }
    },
    template: `
    <div class="match-timeline">

        <match-event v-for="event in match_events.filter(event => event.exact_time <= half_time_mark)" 
        v-bind:event_data="event"
        v-bind:home_team_color="home_team_color"
        v-bind:away_team_color="away_team_color"
        ></match-event>

        <div class="timeline-score"><span>Half time</span>
            <div>
                <span class="team-text" v-bind:style="{ 'text-decoration-color': home_team_color}">{{halftime_score[0]}}</span> : 
                <span class="team-text" v-bind:style="{ 'text-decoration-color': away_team_color}">{{halftime_score[1]}}</span>
            </div>
        </div>

        <match-event v-for="event in match_events.filter(event => event.exact_time > half_time_mark)" 
        v-bind:event_data="event"
        v-bind:home_team_color="home_team_color"
        v-bind:away_team_color="away_team_color"
        ></match-event>

        <div class="timeline-score"><span>Full time</span>
            <div>
                <span class="team-text" v-bind:style="{ 'text-decoration-color': home_team_color}">{{fulltime_score[0]}}</span> : 
                <span class="team-text" v-bind:style="{ 'text-decoration-color': away_team_color}">{{fulltime_score[1]}}</span>
            </div>
        </div>

    </div>
    `
})