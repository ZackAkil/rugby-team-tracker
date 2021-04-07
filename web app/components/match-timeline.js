// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `
.match-timeline { 
    font-size: 20px; 
    // border: red solid 2px;
    max-width:600px;
    text-align: center;
    margin:auto;
    position: relative;
    padding: 20px;
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

.line{
    min-height:500px;
    border: gray solid 2px;
    width: 1px;
    background-color: gray;
    display: inline-block;
    border-radius: 15px;
    position: absolute;
    left:50%;
    height:100%;
}

.team-events{
    width: 49%;
    position: relative;
    display: inline-block;
}

.home-team-event {
    margin-right: 20%;
    border: black solid 2px;
    // box-shadow: -10px 0px 0px 0px blue;
    
}

.away-team-event {
    margin-left: 20%;
    border: black solid 2px;
    // box-shadow: 10px 0px 0px 0px red;
}

.match-event{
    margin-top: 15px;
    margin-bottom: 15px;
    padding:15px;
    background-color: white;
}

.match-event:hover{
    background-color:yellow;
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
    <div class="match-event" v-bind:class="{ 'home-team-event': event_data.team == 'home',  'away-team-event': event_data.team == 'away'}">
    
        <h3 class="scorer team-text"  v-bind:style="{ 'text-decoration-color': event_data.team == 'home' ? home_team_color : away_team_color }"> {{event_data.scorer}} </h3>
        <br>
        
        <span v-if="event_data.assist">
            assist from 
            {{event_data.assist}}
            <br>
        </span>

        <span class="time"> {{ parseInt(event_data.time_to/60)}}'</span>

        <span> {{ event_data.distance}}m</span>

        +{{event_data.points}}  

    </div>
    `
})


Vue.component('match-timeline', {
    props: ['match_events', 'home_team_color', 'away_team_color'],
    template: `
    <div class="match-timeline">
        <match-event v-for="event in match_events" 
        v-bind:event_data="event"
        v-bind:home_team_color="home_team_color"
        v-bind:away_team_color="away_team_color"
        ></match-event>
    </div>
    `
})