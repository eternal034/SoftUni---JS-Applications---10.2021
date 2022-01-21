function attachEvents() {
    const getLocationBtn = document.getElementById(`submit`).addEventListener(`click`, appendInfo);
}

attachEvents();

const locationInput = document.getElementById(`location`);
const requestEl = document.getElementById(`request`);
const forecastEl = document.getElementById(`forecast`);
const currentWeather = forecastEl.querySelector(`#current`);
const upcomingWeather = forecastEl.querySelector(`#upcoming`);

const symbols = {
    'Sunny': '\u2600',
    'Partly sunny': '\u26C5',
    'Overcast': '\u2601',
    'Rain': '\u2614',
    'Degrees': '\xB0'
}

async function getCode(name) {
    const url = `http://localhost:3030/jsonstore/forecaster/locations`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const location = data.find(l => l.name == name);

        if (res.status != 200 || location == undefined) {
            throw new Error('Invalid location entered!');
        }

        return location.code;

    } catch {
        alert(`Invalid location entered!`);
    }
}

async function getCurrent(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
}

async function getUpcoming(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
}

async function appendInfo() {
    const name = locationInput.value;
    const locationCode = await getCode(name);
    locationInput.value = '';
    const [current, upcoming] = await Promise.all([
        getCurrent(locationCode), getUpcoming(locationCode)
    ]);


    appendCurrent(current);
    appendUpcoming(upcoming);

    function appendCurrent(objCurrent) {

        let div = document.createElement(`div`);
        div.className = `forecasts`;
        let symbolSpan = document.createElement(`span`);
        symbolSpan.classList.add(`condition`);
        symbolSpan.classList.add(`symbol`);
        symbolSpan.textContent = `${symbols[objCurrent.forecast.condition]}`;
        let allConditionDatSpan = document.createElement(`span`);
        allConditionDatSpan.className = `condition`;
        let locationSpan = document.createElement(`span`);
        locationSpan.className = `forecast-data`;
        locationSpan.textContent = `${objCurrent.name}`;
        let tempSpan = document.createElement(`span`);
        tempSpan.classList.add(`forecast-data`);
        tempSpan.textContent = `${objCurrent.forecast.low}${symbols['Degrees']}/${objCurrent.forecast.high}${symbols['Degrees']}`;
        let conditionSpan = document.createElement(`span`);
        conditionSpan.className = `forecast-data`;
        conditionSpan.textContent = `${objCurrent.forecast.condition}`;

        allConditionDatSpan.append(locationSpan, tempSpan, conditionSpan);
        div.append(symbolSpan, allConditionDatSpan);

        forecastEl.style.display = `block`;
        currentWeather.appendChild(div);
    }

    function appendUpcoming(objUpcoming) {
        let div = document.createElement(`div`);
        div.className = `forecast-info`;

        objUpcoming.forecast.forEach(f => {
            let mainSpan = document.createElement(`span`);
            mainSpan.className = `upcoming`;
            mainSpan.innerHTML = `<span class="symbol">${symbols[f.condition]}</span>
<span class="forecast-data">${f.low}${symbols['Degrees']}/${f.high}${symbols['Degrees']}</span>
<span class="forecast-data">${f.condition}`;

            div.appendChild(mainSpan);
        });

        upcomingWeather.appendChild(div);
    }

}

