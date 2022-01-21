async function getInfo() {

    const stopID = document.getElementById(`stopId`).value;
    const stopName = document.getElementById(`stopName`);
    const timeTable = document.getElementById(`buses`);
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopID}`;

    try {
        stopName.textContent = `Loading...`
        timeTable.replaceChildren();

        const res = await fetch(url);
        if (res.ok == true && res.status != 200) {
            throw new Error(`Stop ID is not found!`)
        }
        const data = await res.json();
        stopName.textContent = data.name;

        Object.entries(data.buses).forEach(b => {
            const el = document.createElement(`li`);
            el.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`;
            timeTable.appendChild(el);
        })
    } catch (error) {
        stopName.textContent = `Error`;
    }


}