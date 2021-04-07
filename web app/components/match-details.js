// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-header {
    text-align: center;
    font-size: 1.1em;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('match-details', {
    props: ['home_team', 'away_team', 'match_details'],
    template: `
    <div class="match-header">
        <h2> <span class="team-text"
                v-bind:style="{ 'text-decoration-color': home_team.color}">{{home_team.name}}</span>
            vs
            <span class="team-text"
                v-bind:style="{ 'text-decoration-color': away_team.color}">{{away_team.name}}</span>
        </h2>
        <h3>{{match_details.date}} - {{match_details.location}}</h3>
    </div>
    `
})
