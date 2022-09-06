'use strict'

const savedLists = document.querySelector('.saved-lists');
const btnCreateListicle = document.querySelector('.create-listicle-button');
let listicleGeneratorForm = document.querySelector('#listicleGenerator');


let saveLocal = JSON.parse(localStorage.getItem('saveData'));
let ooo = [];
if (saveLocal !== null) {
    ooo = saveLocal.concat(ooo);
}

const saveToLocalStorage = function () {
    localStorage.setItem('saveData', JSON.stringify(ooo));
}


let parsedData;

const buttonsUpdateOnLaunch = async function () {

    const res = await fetch('/listicles');

    parsedData = await res.json();

    if (saveLocal !== null) {
        parsedData = parsedData.concat(saveLocal);

        const uniqueIds = [];

        const unique = parsedData.filter(element => {
            const isDuplicate = uniqueIds.includes(element.id);

            if (!isDuplicate) {
                uniqueIds.push(element.id);

                return true;
            }

            return false;
        });

        parsedData = unique;
    }

    for (let i = 0; i < parsedData.length; i++) {

        let htmlUpdateOnLaunch = `
    <div class="listicle-${parsedData[i].id}">
        <button type="button" class="listicle-button-${parsedData[i].id}">${parsedData[i].title}</button>
        <div class="listicle-items-${parsedData[i].id}"></div>
    </div><br>
`;

        savedLists.insertAdjacentHTML('beforeend', htmlUpdateOnLaunch);
    }

    for (let i = 0; i < parsedData.length; i++) {
        const btnRevealListicle = document.querySelector(`.listicle-button-${parsedData[i].id}`);
        btnRevealListicle.addEventListener('click', revealListicle);
    }

}

buttonsUpdateOnLaunch();

const revealListicle = function (e) {
    let elementClass = e.target.className.replace('listicle-button-', '');

    const divListicleItems = document.querySelector(`.listicle-items-${parsedData[elementClass].id}`);

    if (divListicleItems.innerHTML.length === 0) {

        let { id, title, ...listicleItems } = parsedData[elementClass];
        let htmlOutput = "";

        listicleItems = Object.entries(listicleItems);

        for (const [key, value] of listicleItems) {
            htmlOutput += `<p>${key}: ${value}</p>`;
        }

        divListicleItems.insertAdjacentHTML('afterbegin', htmlOutput);
    } else {
        divListicleItems.innerHTML = "";
    }
}

// POST

listicleGeneratorForm.addEventListener('submit', e => {
    e.preventDefault();
    const o = {};
    new FormData(listicleGeneratorForm).forEach((value, key) => o[key] = value);
    fetch(`new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(o)
    })
        .then(raw => raw.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
            newListicleAdded();
        });
})

const newListicleAdded = async function () {
    const res = await fetch('/listicles');
    parsedData = await res.json();

    if (saveLocal !== null) {
        parsedData = saveLocal.concat(parsedData);
    }

    ooo.push(parsedData[parsedData.length - 1]);
    saveToLocalStorage();

    let newListicle = `
    <div class="listicle-${parsedData[parsedData.length - 1].id}">
        <button type="button" class="listicle-button-${parsedData[parsedData.length - 1].id}">${parsedData[parsedData.length - 1].title}</button>
        <div class="listicle-items-${parsedData[parsedData.length - 1].id}"></div>
    </div><br>
`;

    savedLists.insertAdjacentHTML('beforeend', newListicle);

    const btnRevealListicle = document.querySelector(`.listicle-button-${parsedData[parsedData.length - 1].id}`);
    btnRevealListicle.addEventListener('click', revealListicle);

}