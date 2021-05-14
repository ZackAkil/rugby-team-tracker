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
            { 'name': '---HOME TEAM---', 'id': '---HOME TEAM---' },
            ...this.match_details.home_team_players,
            { 'name': '---AWAY TEAM---', 'id': '---AWAY TEAM---' },
            ...this.match_details.away_team_players]
        }
    },
    methods: {
        set_current_time: function (input_name) {
            const current_time = Math.round((app.current_video_element.currentTime) * 100) / 100
            document.getElementsByName(input_name)[0].value = current_time
            console.log(document.getElementsByName(input_name)[0])
            console.log(current_time)
        },
        new_event: function () {
            console.log('added score')
            new_score_in_firestore()
            this.$emit('event-new')
            // creae blank score record, add to match scores, open in edit mode
        },
        save_event: function (data) {
            console.log('saving event', data.target[0])
            const player_id = document.getElementsByName('player')[0].value
            const assisting_player_id = document.getElementsByName('assisting_player')[0].value
            const points = document.getElementsByName('points')[0].value
            const distance = document.getElementsByName('distance')[0].value
            const video_seconds_start = document.getElementsByName('segment_start')[0].value
            const video_seconds_exact = document.getElementsByName('exact_time')[0].value
            const video_seconds_end = document.getElementsByName('segment_end')[0].value
            const team_home = document.getElementsByName('team')[0].checked
            const team_away = document.getElementsByName('team')[1].checked
            const score_position = document.getElementsByName('score_position')[0].value
            console.log(player_id, points, distance, video_seconds_start, video_seconds_exact,
                video_seconds_end, team_home, team_away, score_position)

            const match_id = this.event_to_edit.match_id
            const video_clip_url = `https://storage.googleapis.com/rugby-app-videos/${match_id}/clips/${match_id}_${parseInt(video_seconds_start)}_${parseInt(video_seconds_end)}.mp4`

            const score_data = {
                'player': player_id ? db.collection("players").doc(player_id) : null,
                'assisting_player': assisting_player_id ? db.collection("players").doc(assisting_player_id) : null,
                'points': parseInt(points),
                'run_distance': parseInt(distance),
                'video_seconds_start': parseFloat(video_seconds_start),
                'video_seconds_exact': parseFloat(video_seconds_exact),
                'video_seconds_end': parseFloat(video_seconds_end),
                'match_side': team_home ? 'home' : 'away',
                'score_position': parseInt(score_position),
                'video_clip_url': video_clip_url
            }

            save_score_in_firestore(this.event_to_edit.id, score_data)
            this.$emit('event-saved')
        }
    },
    template: `
    <div class="score-editor">

        <div v-if="!event_to_edit">
            <button v-on:click="new_event">Add score</button>
        </div>

        <form v-if="event_to_edit" v-on:submit.prevent="save_event">
            player <select name="player" v-bind:value="event_to_edit.player ? event_to_edit.player.id : null">
                <option v-for="player in all_players" v-bind:value="player.id ">{{player.name}}</option>
            </select>
            <br>

            assisting player <select name="assisting_player" v-bind:value="event_to_edit.assisting_player ? event_to_edit.assisting_player.id : null">
                <option v-for="player in all_players" v-bind:value="player.id ">{{player.name}}</option>
            </select>

            <br>
            points <input type="number" name="points" value=1
            v-bind:value="event_to_edit.points">
            <br>
            distance <input type="number" name="distance" min=0 value=1
            v-bind:value="event_to_edit.run_distance">
            <br>
            segment start <input type="number" name="segment_start" min=0 step=0.01
            v-bind:value="event_to_edit.video_seconds_start"> <button type="button" v-on:click="set_current_time('segment_start')">set time</button>
            <br>
            exact time <input type="number" name="exact_time" min=0 value=1 step=0.01
            v-bind:value="event_to_edit.video_seconds_exact"> <button type="button" v-on:click="set_current_time('exact_time')">set time</button>
            <br>
            segment end <input type="number" name="segment_end" min=0 value=1 step=0.01
            v-bind:value="event_to_edit.video_seconds_end"> <button type="button" v-on:click="set_current_time('segment_end')">set time</button>
            <br>

            home <input type="radio" name="team" value="home" 
            v-bind:checked="event_to_edit.match_side == 'home'">
            away <input type="radio" name="team" value="away"
            v-bind:checked="event_to_edit.match_side == 'away'">
            <br>
            try line position<input type="range" name="score_position" min=0 max=10 value=5
            v-bind:value="event_to_edit.score_position">
            <br><br>

            <button type="submit" value="Submit">Save</button>
        </form>

    </div>
    `
})

function new_score_in_firestore() {

    var score_ref = db.collection("scores").doc()

    const current_time = Math.round((app.current_video_element.currentTime) * 100) / 100

    const score_data = {
        'match_id': app.match.id,
        'player': null,
        'points': 1,
        'run_distance': 15,
        'video_seconds_start': current_time - 15,
        'video_seconds_exact': current_time,
        'video_seconds_end': current_time + 3,
        'match_side': 'home',
        'score_position': 5
    }

    return score_ref.set(score_data).then((data) => {
        console.log("Document successfully added!", data);
    })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error adding document: ", error);
        });
}


function save_score_in_firestore(score_id, score_data) {

    var score_ref = db.collection("scores").doc(score_id)

    return score_ref.update(score_data).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}