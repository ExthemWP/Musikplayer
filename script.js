var song = document.getElementById("song");
var MusikUrlInput = $("#MusikUrlInput");
var playButton = $("#playButton");
var pauseButton = $("#pauseButton");
var timeSlider = $("#timeSlider");
var volumeSlider = $("#volumeSlider");
var manualSeek = false;
//Settings
var SwitchAutoPlay = $("#SwitchAutoPlaySettings");
var SwitchTempo = $("#SwitchTempoSettings");
var SwitchRainbow = $("#SwitchRainbowSettings");
var SwitchPitch = $("#SwitchPitchSettings");

var jsmediatags = window.jsmediatags;

MusikUrlInput.keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        defineAudioSource();
    }
});

function defineAudioSource() {
    if(MusikUrlInput.val())
    {
        SongPlaybackRate = 1;
        if(song.playbackRate > 1 || song.playbackRate < 1) {
            SongPlaybackRate = song.playbackRate;
        }
        $("#album-cover").attr("src", MusikUrlInput.val().replace(".mp3", ".jpg"));
        $("#album-cover").on('error', function(){
            $("#album-cover").attr("src", "assets/default-album-art.png");
        });

        song.src = MusikUrlInput.val();
        song.play();
        song.onloadeddata = function() {
            fullPath = MusikUrlInput.val();
            var filename = fullPath.replace(/^.*[\\\/]/, '');
    		var filename = filename.replace(/%20/g, " ");
    		var filename = filename.replace(/_/g, " ");
    		var filename = filename.replace(/-/g, " ");
    		var filename = filename.replace(".mp3", "");
    		var filename = filename.replace(".mp4", "");
    		var filename = filename.replace(".opus", "");
    		var filename = filename.replace(".weba", "");
    		var filename = filename.replace(".webm", "");
    		var filename = filename.replace(".ogg", "");
    		var filename = filename.replace(".flac", "");
            $("#song-name").text("Titel: " + filename);
            playButton.addClass("disabled");
            pauseButton.removeClass("disabled");
            songDuration = formatTime(song.duration.toFixed(0));
            $("#songTime").text(songDuration);
            song.playbackRate = SongPlaybackRate;
            rebindSlider();
            volSlider();
        };
    }
    else
	{
		alert("Eingabe darf nicht leer sein");
	}
}

function loadDemoSong(demoSong) {
    MusikUrlInput.val("assets/" + demoSong + ".mp3");
    defineAudioSource();
}

function pauseSong() {
    if(!song.paused && song.readyState > 0) {
        song.pause();
        pauseButton.addClass("disabled");
        playButton.removeClass("disabled");
    }
}

function playSong() {
    if(song.paused && song.readyState > 0) {
        song.play();
        playButton.addClass("disabled");
        pauseButton.removeClass("disabled");
    }
}

function loopSong() {
    if(song.loop == false && song.readyState > 0) {
        song.loop = true;
        $("#loopButton").css("color", "royalblue");
        if(song.ended) {
            playSong();
        }
    }
    else if (song.loop && song.readyState > 0) {
        song.loop = false;
        $("#loopButton").css("color", "black");
    }
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(a => a)
        .join(':')
}

function rebindSlider() {
    var createSeek = function() {
        timeSlider.slider({
            value: 0,
            step: 0.1,
            orientation: "horizontal",
            range: "min",
            max: song.duration,
            animate: true,

            slide: function() {
                manualSeek = true;
            },

            stop: function(e, ui) {
                manualSeek = false;
                song.currentTime = ui.value;
            }
        });
    };

    createSeek();

    song.ontimeupdate = function() {
        if (!manualSeek) {
            timeSlider.slider('value', song.currentTime);
            currentTime = formatTime(song.currentTime.toFixed(0));
            $("#currentTime").text(currentTime);
        }
    }
}

function volSlider()
{
    volumeSlider.slider({
        value: 1,
        step: 0.01,
        orientation: "horizontal",
        range: "min",
        max: 1,
        animate: true,

        slide: function(e, ui) {
            song.volume = ui.value;
            volumeSlider.slider('value', song.volume);
            showVolIcon(song.volume);
        }
    })
}

function showVolIcon(volume) {
    if (volume >= 0.5) {
        $(".fa-volume-up").removeClass("disabled");
        $(".fa-volume-down").addClass("disabled");
        $(".fa-volume-off").addClass("disabled");
        $(".fa-volume-mute").addClass("disabled");
    } else if (volume < 0.49 && volume >= 0.1 ) {
        $(".fa-volume-up").addClass("disabled");
        $(".fa-volume-down").removeClass("disabled");
        $(".fa-volume-off").addClass("disabled");
        $(".fa-volume-mute").addClass("disabled");
    } else if (volume < 0.09 && volume >= 0.01) {
        $(".fa-volume-up").addClass("disabled");
        $(".fa-volume-down").addClass("disabled");
        $(".fa-volume-off").removeClass("disabled");
        $(".fa-volume-mute").addClass("disabled");
    } else {
        $(".fa-volume-up").addClass("disabled");
        $(".fa-volume-down").addClass("disabled");
        $(".fa-volume-off").addClass("disabled");
        $(".fa-volume-mute").removeClass("disabled");
    }
}

function changeTime(direction) {
    if (direction == "forward" && song.readyState > 0) {
        song.currentTime += 10;
    }
    else if (direction == "backward" && song.readyState > 0) {
        if (song.currentTime <= 10) {
            song.currentTime = 0;
        } else {
            song.currentTime -= 10;
        }
    }
}

SwitchAutoPlay.change(function() {
    if(this.checked) {

    }
});

SwitchTempo.change(function() {
    if(this.checked) {
        TempoSettings("enable");
        $("#TempoSettings").removeClass("disabled");
    } else {
        TempoSettings("disable");
        $("#TempoSettings").addClass("disabled");
    }
});

function TempoSettings(status) {
    var tempoSlider = $("#tempoSlider");
    tempoSlider.slider({
        value: 1,
        step: 0.01,
        orientation: "horizontal",
        range: "min",
        max: 4,
        min: 0.25,
        animate: true,

        slide: function(e, ui) {
            song.playbackRate = ui.value;
            tempoSlider.slider('value', song.playbackRate);
            $("#tempoAmount").text(song.playbackRate);
        }
    })
    if(status == "disable") {
        tempoSlider.slider("value", 1);
        song.playbackRate = 1;
        $("#tempoAmount").text(song.playbackRate);
    }
}

function ChangeTempoButton(speed) {
    if (speed >= 0.25 && speed <= 4 )
    {
        var tempoSlider = $("#tempoSlider");
        song.playbackRate = speed;
        tempoSlider.slider('value', speed);
        $("#tempoAmount").text(speed);
    }
}

SwitchRainbow.change(function() {
    if(this.checked) {

    }
});

SwitchPitch.change(function() {
    if(this.checked) {
        song.mozPreservesPitch = false;
        song.preservesPitch = false;
    } else
    {
        song.mozPreservesPitch = true;
        song.preservesPitch = true;
    }
});

song.onended = function() {
    if(song.paused) {
        pauseButton.addClass("disabled");
        playButton.removeClass("disabled");
    }
};
