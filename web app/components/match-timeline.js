// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `
.match-timeline { 
    color: blue; 
    font-size: 20px; 
    border: red solid 2px;
    text-align: center;
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

.home-team-events {

}

.away-team-events {

}
`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('match-event', {
    props: ['event_data'],
    // data: function () {
    //     return {
            
    //     }
    // },
    template: `
    <div>{{event_data.team}} {{event_data.points}}  {{event_data.scorer}}</div>
    `
})


Vue.component('match-timeline', {
    props: ['match_events'],
    // data: function () {
    //     return {
            
    //     }
    // },
    template: `
    <div class="match-timeline">
        <div class="home-team-events team-events"> home</div>
        <div class="line"></div>
        <div class="away-team-events team-events"> away</div>
        <match-event v-for="event in match_events" v-bind:event_data="event"></match-event>
    </div>
    `

    // 
})