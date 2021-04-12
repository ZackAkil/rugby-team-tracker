// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.score-editor{
    border: black 2px solid;
    padding:15px;
    margin:15px;
}



`;
document.getElementsByTagName('head')[0].appendChild(style);



Vue.component('score-editor', {
    props: ['match_details'],
    template: `
    <div class="score-editor">

    player <select name="cars" id="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
    </select>
    <br>
    points <input type="number" name="points" value=1>
    <br>
    distance <input type="number" name="distance" min=0 value=1>
    <br>
    segment start <input type="number" name="segment_start" min=0 value=1>
    <br>
    exact time <input type="number" name="exact_time" min=0 value=1>
    <br>
    segment end <input type="number" name="segment_end" min=0 value=1>
    <br>

    home <input type="radio" name="team" value="home">
    away <input type="radio" name="team" value="away">
    <br>
    try line position<input type="range" name="score_position" min=0 max=10 value=5>
    <br>

    </div>
    `
})
