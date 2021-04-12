// define style rules to be programtically loaded
var style = document.createElement('style');
style.innerHTML = `

.tmo-controls{
    margin:15px;
}

.tmo-controls > input{
    width: 100%;
}

.tmo-controls > input[type=range]{
    -webkit-appearance: none;
    padding: 20px 15px;

}  

.tmo-controls > input[type='range']::-webkit-slider-runnable-track {
    height: 2px;
    background-color: black;
}


.tmo-controls > input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    verticle-align: center;
    position:relative;
    top:-16px;
    cursor: ew-resize;
    height:34px;
    width:100px;
    background-image: url("data:image/png;base64,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");
    background-size: contain;
    background-color: white;
    background-position: center;
    border: black solid 2px;
  }

.tmo-controls > input[type=range]:focus::-webkit-slider-runnable-track, 
.tmo-controls > input[type=range]:focus {
    outline: none;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);


Vue.component('tmo-controls', {
    props: [''],
    template: `
    <div class="tmo-controls">
        <input type="range" name="playback_speed" min=-150 max=150 value=0 
        onmouseup="spring_back_tmo(event)" ontouchend="spring_back_tmo(event)" oninput="set_video_speed(this.value)">
 
    </div>
    `
})

var tmo_playback = false
var tmo_playback_rate = 0
var tmo_interval = null
const FPS = 30

function spring_back_tmo(event){
    tmo_playback = false
    event.target.value = 0
    app.current_video_element.pause()
    clearInterval(tmo_interval)
    tmo_interval = null
}

function set_video_speed(speed){
    tmo_playback = true
    tmo_playback_rate = speed/100

    if (!app.current_video_element.paused)
    app.current_video_element.pause()

    // create playback loop to update video time
    if (tmo_interval == null){
        tmo_interval = setInterval(function(){ 
            if(tmo_playback){
                app.current_video_element.currentTime = app.current_video_element.currentTime + (tmo_playback_rate * FPS)/1000
            }
        }, 1000/FPS);
    }
}