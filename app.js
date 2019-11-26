let console_style = "padding: 20px; font-weight: 900;";

let MainContainer;

$(document).ready(async() => {
    console.log("%cApp ready form execute stufs", console_style);
    MainContainer = $('#main');
    MainContainer.append(`<p>App infrastructure ready.</p>`);

    let first_message = await initApp();
    MainContainer.append(`<p>${first_message}</p>`);
});

async function initApp() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res('Inicializacion de la app terminada');
        }, 2000);
    });
}