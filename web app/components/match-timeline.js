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
`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('match-event', {
    props: ['event_data'],
    template: `
    <div class="match-event" v-bind:class="{ 'home-team-event': event_data.team == 'home',  'away-team-event': event_data.team == 'away'}">
    
    +{{event_data.points}}  
    
    {{event_data.scorer}}
    from 
    {{event_data.assist}}
    
    </div>
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
        <match-event v-for="event in match_events" v-bind:event_data="event"></match-event>
    </div>
    `
})

/* <div class="home-team-events team-events"> home</div>
<div class="line"></div>
<div class="away-team-events team-events"> away</div> */