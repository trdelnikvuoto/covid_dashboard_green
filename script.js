fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response => response.json())
.then(dati => {
    let sorted = dati.reverse();

    let lastUpdated = sorted[0].data;
    let lastUpdatedFormatted = lastUpdated.split("T")[0].split("-").reverse().join("/");
    document.querySelector('#data').innerHTML = lastUpdatedFormatted;

    let lastUpdatedData = sorted.filter(el => el.data == lastUpdated).sort((a,b) => b.nuovi_positivi - a.nuovi_positivi);

    let totalCases = lastUpdatedData.map(el => el.totale_casi).reduce((t,n) => t+n);
    document.querySelector('#totalCases').innerHTML = `Total Cases: ${totalCases}`;

    let totalHealed = lastUpdatedData.map(el => el.dimessi_guariti).reduce((t,n) => t+n);
    document.querySelector('#totalHealed').innerHTML = `Total Healed: ${totalHealed}`;

    let totalDead = lastUpdatedData.map(el => el.deceduti).reduce((t,n) => t+n);
    document.querySelector('#totalDead').innerHTML = `Total Dead: ${totalDead}`;

    let totalPositives = lastUpdatedData.map(el => el.totale_positivi).reduce((t,n) => t+n);
    document.querySelector('#totalPositives').innerHTML = `Total Positives: ${totalPositives}`;


    let regionWrapper = document.querySelector('#regionWrapper');
    lastUpdatedData.forEach(el => {
        
        let li = document.createElement('li')
        li.classList.add('mb-3')
        li.innerHTML = 
        `
        <button type="button" class="btn-custom" data-bs-toggle="modal" data-bs-target="#codice${el.codice_regione}">
            ${el.denominazione_regione}
        </button>
        : ${el.nuovi_positivi};
        <div class="modal fade" id="codice${el.codice_regione}" tabindex="-1" aria-labelledby="codice${el.codice_regione}Label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-main-color px-5 py-3">        
                    <h5 class="modal-title" id="codice${el.codice_regione}Label">${el.denominazione_regione}</h5>
                    <hr>
                    <p>Total Cases: ${el.totale_casi}</p>
                    <p>New Positives: ${el.nuovi_positivi}</p>
                    <p>Total Dead: ${el.deceduti}</p>
                    <p>Total Healed: ${el.dimessi_guariti}</p>
                    <p>Hospitalized With Symptoms: ${el.ricoverati_con_sintomi}</p>
                </div>
            </div>
        </div>
        `
        regionWrapper.appendChild(li)
    });

    let trendNew = document.querySelector('#trendNew');

    let lombardia = sorted.reverse().filter(el => el.denominazione_regione == "Lombardia").map(el => [el.data, el.nuovi_positivi]);

    let maxLombardia = Math.max(...lombardia.map(el => el[1]));

    lombardia.forEach(el => {
        let col = document.createElement('div')
        col.classList.add('d-inline-block', 'bg-green')
        col.style.width = "10px"
        col.style.marginRight = "1px"
        col.style.height = `${100 * el[1] / maxLombardia}%`

        trendNew.appendChild(col);

    });

    console.log(lombardia)
})