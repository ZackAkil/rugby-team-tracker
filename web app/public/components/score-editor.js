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
    methods: {
        save_event: function (data) {
            console.log('saving event', data.target[0])
            const player_id = data.target[0].value
            const points = data.target[1].value
            const distance = data.target[2].value
            const video_seconds_start = data.target[3].value
            const video_seconds_exact = data.target[4].value
            const video_seconds_end = data.target[5].value
            const team_home = data.target[6].checked
            const team_away = data.target[7].checked
            const score_position = data.target[8].value
            console.log(player_id, points, distance, video_seconds_start,video_seconds_exact,
                video_seconds_end, team_home, team_away, score_position)
            save_score_in_firestore(this.event_to_edit.id) 
            this.$emit('event-saved')
        }
    },
    template: `
    <div class="score-editor">

        <form v-if="event_to_edit" v-on:submit.prevent="save_event">
            player <select name="player" v-bind:value="event_to_edit.player.id">
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
            <br><br>

            <button type="submit" value="Submit">Save</button>
        </form>

    </div>
    `
})


function save_score_in_firestore(score_id) {


    var washingtonRef = db.collection("scores").doc(score_id);

    return washingtonRef.update({
        test_update: true
    }).then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}