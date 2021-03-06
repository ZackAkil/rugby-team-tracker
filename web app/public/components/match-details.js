// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.match-header {
    text-align: center;
    font-size: 1.1em;
}

.match-header>h3{
    color: gray;
    font-weight: 400;
}

.match-header>h2{
    line-height: 1.4em;
}

.match-header>h2>span, .match-header>h3>span{
    display: inline-block;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('match-details', {
    props: ['match_details'],
    template: `
    <div class="match-header">
        <h2> <span class="team-text"
                v-bind:style="{ 'text-decoration-color': match_details.home_team.color}">{{match_details.home_team.name}}</span>
            vs
            <span class="team-text"
                v-bind:style="{ 'text-decoration-color': match_details.away_team.color}">{{match_details.away_team.name}}</span>
        </h2>
        <h3>
            <span>{{match_details.date.toDate().toString().split('GMT')[0].slice(0, -4)}}</span> - <span>{{match_details.location.name}}</span>
        </h3>
    </div>
    `
})
