// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.video-container {
    margin: 30px 0 15px;
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
    font-family: 'Inconsolata', monospace;
    font-weight: 700;
    margin-left: 5px;
    color: gray;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);


Vue.component('match-video', {
    props: ['match_details', 'current_score', 'current_event'],
    data: function () {
        return {
            player: null
        }
    },
    template: `
    <div class="video-container">

    <div class="score">
        <div>
            <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.home_team.color}">{{current_score[0]}}</span> : 
            <span class="team-text" v-bind:style="{ 'text-decoration-color': match_details.away_team.color }">{{current_score[1]}}</span>
        </div>
    </div>

    <div class="current-event" v-if="current_event">
        <div>
            <h3 class="scorer team-text"
                v-bind:style="{ 'text-decoration-color': current_event.match_side == 'home' ? match_details.home_team.color : match_details.away_team.color }">
                {{current_event.player.name}} </h3>

            <span>{{ current_event.run_distance}}m</span>

            <a v-bind:href="current_event.video_clip_url" target="_blank">download clip</a>
        </div>
    </div>

    <video controls v-bind:src="match_details.video_source.gs_url" ontimeupdate="video_time_change()"></video>

   <!-- <div class="youtube-video" v-bind:id="match_details.id"></div> --!>

</div>
    `,
    mounted: function () {

        console.log('mounted video')
        app.current_video_element = document.querySelector('video')

        // for youtube
        // player = new YT.Player(this.match_details.id, {
        //     width: '100%',
        //     height: '400px',
        //     videoId: this.match_details.video_source.youtube_id,
        //     playerVars: {
        //         modestbranding: 1,
        //         rel: 0
        //     },
        //     events: {
        //         // onReady: initialize
        //     }
        // });
    }

})


// for youtube player current time
// var time_update_interval = setInterval(function () {
//     updateTimerDisplay();
// }, 1000)


function updateTimerDisplay() {
    // for youtube player
    // Update current time text display.
    console.log(player.getCurrentTime());
    // $('#duration').text(formatTime(player.getDuration()));
}

function seek_youtube_video(seconds) {
    // for youtube player
    player.seekTo(seconds)
    player.playVideo()
}


function video_time_change() {
    const video = document.querySelector('video')
    app.current_event = get_current_event(video.currentTime, app.match.scores)
    app.current_score = get_score_at_time(video.currentTime, app.match.scores)
}

function get_current_event(time, events) {
    var output = null
    for (let index = 0; index < events.length; index++) {
        const element = events[index]
        if ((element.video_seconds_start <= time) && (element.video_seconds_end >= time)) {
            return events[index]
        }
    }
    return output
}

function get_score_at_time(time, events) {

    var current_score = [0, 0]

    for (let index = 0; index < events.length; index++) {
        const element = events[index]
        if (element.video_seconds_exact <= time) {
            if (element.match_side == 'home')
                current_score[0] += element.points
            else
                current_score[1] += element.points
        }
    }
    return current_score
}

function jump_video_to_time(time) {
    const video = document.querySelector('video')
    video.currentTime = time
    video.play()
}