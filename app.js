//Importamos el modulo fs que nos permitira gestionar ficheros locales
const fs = require('fs')
const { BrowserWindow } = require('electron')

let console_style = "padding: 20px; font-weight: 900;";

let MainContainer,
    Folio,
    SubWindow,
    EditorMain;

let colors = [
    "#9b59b6",
    "#2471a3",
    "#1abc9c",
    "#2ecc71",
    "#f1c40f",
    "#dc7633",
    "#e74c3c"
];

let clickedElem = null;

$(document).ready(async() => {
    loadApp();
});

async function loadAppPrueba() {
    console.log("%cApp ready form execute stufs", console_style);
    MainContainer = $('#main');
    MainContainer.append(`<h3>App infrastructure ready.</h3>`);

    var ul = $('<ul/>');
    MainContainer.append(ul);

    $('body').mousemove(function(event) {
        if (clickedElem != null) {
            let x = event.pageX - (clickedElem.width() / 3);
            let y = (event.pageY - $(window).scrollTop()) - (clickedElem.height() / 2)
            clickedElem.css({ left: x, top: y });
            console.log(event.pageX);
        }
    });

    let folder_data = await initApp();
    console.log(folder_data);
    //MainContainer.append(`<p>Carpeta leeida...</p>`);

    folder_data.forEach(async(elem) => {
        var li = $('<li/>').text(elem).css('color', colors[Math.floor(Math.random() * colors.length)]) //.css('border-bottom', '1px solid #ccc');
        if (elem.includes(".")) {
            li.prepend(`<i class="material-icons">insert_drive_file</i>`);
        } else {
            li.prepend(`<i class="material-icons">folder</i>`);
        }

        let file_stats = await getNodeData(elem);
        console.log(file_stats);
        let stats_list = $('<ul/>').css('border', 'none').css('color', '#fff');

        for (index in file_stats) {
            let stat_elem = $('<li/>').html(`<strong>${index}</strong> : ${file_stats[index]}`).css('border-bottom', '1px solid #ccc')
            stats_list.append(stat_elem);
        }

        //li.append(stats_list);
        li.hide();
        li.data("musecliked", false);
        li.mousedown(function(event) {
            $(this).data("musecliked", true)
            console.log($(this).data());
            clickedElem = $(this);
            clickedElem.addClass('clikado');

            let x = event.pageX - (clickedElem.width() / 3);
            let y = (event.pageY - $(window).scrollTop()) - (clickedElem.height() / 2)
            clickedElem.css({ left: x, top: y });
        }).mouseup(function() {
            $(this).data("musecliked", false)
            console.log($(this).data());
            clickedElem.removeClass('clikado');
            clickedElem = null;
        });
        ul.append(li);
        li.show('slow');
    })
}

async function loadApp() {
    let loading_res = await showLoader();

    abrirFolioEdicion();
}

let loadingPanel = $('<div/>', { class: 'loading-panel', text: 'Loading Content' });

async function showLoader() {
    return new Promise((res, rej) => {
        $('body').append(loadingPanel);

        loadingPanel.animate({
            padding: "20"
        }, 2000, () => {
            loadingPanel.hide();
            res(1);
        });
        //setTimeout(() => {
        //    
        //    res(1);
        //}, 2000);
    });
}

async function abrirFolioEdicion() {
    EditorMain = $('<div/>', {
        class: 'editor_main'
    });

    let MenuEditor = $('<div/>', { class: 'editor_left_menu' });
    MenuEditor.append($('<div/>', { class: 'editor_contenedor' }));

    let FolioEdicion = $('<div/>', { class: 'editor_folio_edicion' });
    FolioEdicion.append($('<div/>', { class: 'editor_contenedor' }).append(`<div id="start_message">
                                                                            <i class="material-icons">add_comment</i><br>
                                                                            Selecciona los componentes de la izquierda para empezar a diseñar
                                                                            </div>`));

    EditorMain.append(MenuEditor);
    EditorMain.append(FolioEdicion);

    //MainContainer.hide();
    Folio = $('<div/>', {
        class: 'folio',
        mousedown: function(e) {
            console.log(Folio.offset().left);
            let elem = $('<div/>', {
                class: 'begin_elem',
                css: {
                    top: e.clientY - 50,
                    left: e.clientX - 50 - Folio.offset().left
                }
            });
            console.log(elem);
            Folio.append(elem);
        }
    });
    $('body').css('background', '#ccc');
    $('body').append(EditorMain);
}

async function getNodeData(path) {
    return new Promise((res, rej) => {
        fs.stat(path, (err, stats) => {
            res(stats);
        })
    });
}

async function initApp() {
    return new Promise((res, rej) => {
        fs.readdir('./', (err, data) => {

            setTimeout(() => {
                res(data);
            }, 10);
        });

    });
}