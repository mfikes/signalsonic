var m = new jscw();
window.m = m;
m.setStartDelay(0.2);

document.addEventListener('DOMContentLoaded', function() {
    var wpmSlider = setupSlider('wpm', 20, m.setWpm.bind(m));
    var effSlider = setupSlider('eff', 20, m.setEff.bind(m));
    setupSlider('freq', 600, m.setFreq.bind(m));
    setupSlider('volume', parseFloat(localStorage.getItem('jscwlib_vol')) * 100 || 100, m.setVolume.bind(m), true);

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
