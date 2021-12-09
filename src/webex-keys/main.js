// Ids
const PP_BTN = "playOrPause";
const SPEED_SETTINGS_BTN = "toSpeedSetting";
const SETTINGS_BTN = "playerSetting";
const FULLSCREEN_BTN = "fullScreen";
const TIME_INDICATOR = "timeIndicator";
const BASE_BAR = "baseBar";
const SCREEN = "screen_html5_api"

// Classes
const SPEEDS_CONTAINER_CLASS = "setting-item-speed";
const SPEED_ENTRY_CLASS = "setting-a";
const SLIDER_CLASS = "el-slider__button-wrapper";
const PLAYHEAD_CLASS = "el-slider__button";

// Keycodes (deprecated)
const SPACEBAR_KEY = 32;
const PAUSE_KEY = 179
const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;
const ARROW_DX_KEY = 39;
const ARROW_SX_KEY = 37;
const F_KEY = 70;

// Codes
const SPACEBAR_CODE = "Space";
const PAUSE_CODE = "MediaPlayPause"
const ARROW_UP_CODE = "ArrowUp";
const ARROW_DOWN_CODE = "ArrowDown";
const ARROW_DX_CODE = "ArrowRight";
const ARROW_SX_CODE = "ArrowLeft";
const F_CODE = "KeyF";
const TRACK_NEXT_CODE = "MediaTrackNext";
const TRACK_PREVIOUS_CODE = "MediaTrackPrevious";

// Other
const TIMEOUT = 60;
const SECONDS = 10;
const SECONDS_MEDIAKEYS = 300;
const TIME_SPLIT = ["&nbsp;/&nbsp;", ":"];

// Vars
var speed = 1.0;

document.body.onkeyup = function(event)
{
    if (!window.location.href.includes(".webex.com"))
        return;

    try {
        switch( (typeof event.code === "string" && event.code.length) ? event.code : event.keyCode)
        {
            case SPACEBAR_KEY:
            case SPACEBAR_CODE:
            case PAUSE_KEY:
            case PAUSE_CODE:
                document.getElementById(PP_BTN).click();
                break;
            case F_KEY:
            case F_CODE:
                document.getElementById(FULLSCREEN_BTN).click();
                break;
            case ARROW_UP_KEY:
            case ARROW_UP_CODE:
                if (speed < 2.0)
                    updateSpeed(1);
                break;
            case ARROW_DOWN_KEY:
            case ARROW_DOWN_CODE:
                if (speed > 0.5)
                    updateSpeed(-1);
                break;
            case ARROW_DX_KEY:
            case ARROW_DX_CODE:
                movePlayhead(1);
                break;
            case ARROW_SX_KEY:
            case ARROW_SX_CODE:
                movePlayhead(-1);
                break;
            case TRACK_NEXT_CODE:
                movePlayhead(1, SECONDS_MEDIAKEYS);
                break;
            case TRACK_PREVIOUS_CODE:
                movePlayhead(-1, SECONDS_MEDIAKEYS);
                break;
        }

    } catch (err) {
        console.error("[WebEx Automator -> parseKey] " + err.message)
    }
}

function clamp(value, min, max)
{
    if (value > max)
        return max;
    else if (value < min)
        return min;
    return value;
}

function movePlayhead(direction, seconds = SECONDS) 
{
    try {
		document.getElementById(SCREEN).dispatchEvent(new MouseEvent("mousemove"));
		setTimeout(function() {
			var rawTime = document.getElementById(TIME_INDICATOR).innerHTML.split(TIME_SPLIT[0])[1].split(TIME_SPLIT[1]);
			var videoLength = 0;
			var i;
			for (i = 0; i < rawTime.length; i ++)
				videoLength += parseInt(rawTime[rawTime.length - i - 1]) * Math.pow(60, i);
			var movement = (document.getElementById(BASE_BAR).getBoundingClientRect().width / videoLength) * seconds * direction;
			var box = document.getElementsByClassName(PLAYHEAD_CLASS)[0].getBoundingClientRect();
			var coords = [box.x + (box.width / 2), box.y + (box.height / 2)];
			var slider = document.getElementsByClassName(SLIDER_CLASS)[0];
			slider.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true, view: window, clientX: coords[0], clientY: coords[1]}));
			setTimeout(function() {
				slider.dispatchEvent(new MouseEvent("mousemove", {bubbles: true, cancelable: true, view: window, clientX: coords[0] + movement, clientY: coords[1]}));
				setTimeout(function() {
					slider.dispatchEvent(new MouseEvent("mouseup", {bubbles: true, cancelable: true, view: window, clientX: coords[0] + movement, clientY: coords[1]}));
				}, TIMEOUT);
			}, TIMEOUT);
		}, TIMEOUT);

    } catch (err) {
        console.error("[WebEx Automator -> movePlayhead] " + err.message)
    }
}

function updateSpeed(direction) 
{
    try {

        var offset = 0.25 * direction;
        speed += offset;
        if (speed == 1.75)
            speed += offset;
        speed = clamp(speed, 0.5, 2.0);

        var id = Math.round(speed / 0.25) - 1;
        if (speed == 2.0)
            id -= 1;
        
        document.getElementById(SETTINGS_BTN).click();
        setTimeout (function () {
            document.getElementById(SPEED_SETTINGS_BTN).click();
            setTimeout (function () {
                document.getElementsByClassName(SPEEDS_CONTAINER_CLASS)[0].getElementsByClassName(SPEED_ENTRY_CLASS)[id].click();
                setTimeout (function () {
                    document.getElementById(SETTINGS_BTN).click();
                }, TIMEOUT + 40);
            }, TIMEOUT);
        }, TIMEOUT);
    
    } catch (err) {
        console.error("[WebEx Automator -> updateSpeed] " + err.message)
    }
}