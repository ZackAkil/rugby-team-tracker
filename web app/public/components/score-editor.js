// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

button{
    background-color:white;
    border: solid black 2px;
    cursor:pointer;
}

button:focus{
    outline:none;
}

.score-editor{
    border: black 2px solid;
    padding:15px;
    margin:15px;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('score-editor', {
    props: ['match_details', 'event_to_edit'],
    computed: {
        all_players: function () {
            return [{ 'name': 'Unknown', 'id': null },
            { 'name': '---HOME TEAM---', 'id': null },
                ...this.match_details.home_team_players,
                { 'name': '---AWAY TEAM---', 'id': null },
                    ...this.match_details.away_team_players]
        }
    },
    template: `
    <div class="score-editor">

        <div v-if="event_to_edit">
            player <select name="cars" id="cars" v-bind:value="event_to_edit.player.id">
                <option v-for="player in all_players" v-bind:value="player.id">{{player.name}}</option>
            </select>
            <br>
            points <input type="number" name="points" value=1
            v-bind:value="event_to_edit.points">
            <br>
            distance <input type="number" name="distance" min=0 value=1
            v-bind:value="event_to_edit.run_distance">
            <br>
            segment start <input type="number" name="segment_start" min=0 
            v-bind:value="event_to_edit.video_seconds_start">
            <br>
            exact time <input type="number" name="exact_time" min=0 value=1
            v-bind:value="event_to_edit.video_seconds_exact">
            <br>
            segment end <input type="number" name="segment_end" min=0 value=1
            v-bind:value="event_to_edit.video_seconds_end">
            <br>

            home <input type="radio" name="team" value="home" 
            v-bind:checked="event_to_edit.match_side == 'home'">
            away <input type="radio" name="team" value="away"
            v-bind:checked="event_to_edit.match_side == 'away'">
            <br>
            try line position<input type="range" name="score_position" min=0 max=10 value=5
            v-bind:value="event_to_edit.score_position">
            <br>

            <button>Save</button>
        </div>

    </div>
    `
})



// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.score-segment-slider{
    border: black 2px solid;
    padding:15px;
    margin:15px;
    position:relative;
}

.score-segment-slider::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: black;
    top: 50%;
    left: 0;
    z-index:-1;
}

.segment-point{
    display: inline-block;
    background-color: red;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    cursor:grab;
    position:absolute;
    top:11px;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);

Vue.component('score-segment-slider', {
    props: [''],
    computed: {
    },
    template: `
    <div class="score-segment-slider">

        <div class="segment-point segment-start"></div>
        <div class="segment-point segment-exact"></div>
        <div class="segment-point segment-end"></div>

    </div>
    `
})


Vue.component('precise-slider', {
    props: [''],
    computed: {
    },
    template: `
    <div class="precise-slider">

        <div class="segment-point segment-start"></div>
        <div class="segment-point segment-exact"></div>
        <div class="segment-point segment-end"></div>

    </div>
    `
})

