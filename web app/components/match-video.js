// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.video-container {
    margin: 30px 0;
    position: relative;
}

.current-event, .score {
    z-index: 1;
    width: 100%;
    position: absolute;
}

.score>div{
    width: fit-content;
    background-color: rgb(255, 255, 255);
    padding: 10px 14px;
    margin: 5px;
}

.current-event>div {
    width: fit-content;
    background-color: rgb(255, 255, 255);
    margin: 5px auto;
    padding: 10px 14px;
}

.current-event>div>h3 {
    margin-right: 10px;
}


.current-event>div>a {
    margin-left: 5px;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('match-video', {
    props: ['home_team', 'away_team', 'current_score', 'current_event'],
    template: `
    <div class="video-container">

    <div class="score">
        <div>
            <span class="team-text" v-bind:style="{ 'text-decoration-color': home_team.color}">{{current_score[0]}}</span> : 
            <span class="team-text" v-bind:style="{ 'text-decoration-color': away_team.color }">{{current_score[1]}}</span>
        </div>
    </div>

    <div class="current-event" v-if="current_event">
        <div>
            <h3 class="scorer team-text"
                v-bind:style="{ 'text-decoration-color': current_event.team == 'home' ? home_team.color : away_team.color }">
                {{current_event.scorer}} </h3>

            <span>{{ current_event.distance}}m</span>

            <a href="#">Download clip</a>
        </div>
    </div>

    <video controls src="rugby_test.mp4" ontimeupdate="video_time_change()"></video>

</div>
    `
})
