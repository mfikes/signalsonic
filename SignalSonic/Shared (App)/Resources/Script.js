var m = new jscw();

document.addEventListener('DOMContentLoaded', function() {
    var wpmSlider = setupSlider('wpm', 20, m.setWpm.bind(m));
    var effSlider = setupSlider('eff', 20, m.setEff.bind(m));
    setupSlider('freq', 600, m.setFreq.bind(m));
    setupSlider('volume', parseFloat(localStorage.getItem('jscwlib_vol')) * 100 || 100, m.setVolume.bind(m), true);

    function playInputText() {
        var textToPlay = document.getElementById('textInput').value;
        m.setText(textToPlay);
        m.play();
    }
    
    // Attach event listener to the play button
    document.getElementById('playButton').addEventListener('click', playInputText);
    
    function setupSlider(settingKey, defaultValue, updateFunction, isPercentage = false) {
        var initialValue = isPercentage ? defaultValue : (localStorage.getItem(settingKey) || defaultValue.toString());
        updateFunction(isPercentage ? initialValue / 100 : initialValue);
        var slider = document.getElementById(settingKey + 'Slider');
        var valueLabel = document.getElementById(settingKey + 'Value');
        slider.value = initialValue;
        valueLabel.textContent = formatLabel(settingKey, initialValue);

        slider.addEventListener('input', function() {
            var value = isPercentage ? parseInt(this.value, 10) / 100 : parseInt(this.value, 10);
            localStorage.setItem(settingKey, value.toString());
            valueLabel.textContent = formatLabel(settingKey, isPercentage ? this.value : value);
            updateFunction(value);

            // Ensure WPM is always >= EFF
            if (settingKey === 'wpm' && value < parseInt(effSlider.value, 10)) {
                effSlider.value = value;
                localStorage.setItem('eff', value);
                document.getElementById('effValue').textContent = formatLabel('fwpm', value);
                m.setEff(value);
            } else if (settingKey === 'eff' && value > parseInt(wpmSlider.value, 10)) {
                wpmSlider.value = value;
                localStorage.setItem('wpm', value);
                document.getElementById('wpmValue').textContent = formatLabel('wpm', value);
                m.setWpm(value);
            }

            restartPlayback();
        });

        return slider;
    }

    function formatLabel(settingKey, value) {
        if (settingKey === 'volume') {
            return Math.round(value) + '%';
        } else if (settingKey === 'freq') {
            return value + ' Hz';
        } else if (settingKey === 'eff') {
            return value + ' FWPM';
        } else {
            return value + ' ' + settingKey.toUpperCase();
        }
    }


    function restartPlayback() {
        m.stop();
        m.play();
    }
});

function show(platform, enabled, useSettingsInsteadOfPreferences) {
    
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "SignalSonic’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "SignalSonic’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on SignalSonic’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
