//Importamos el modulo fs que nos permitira gestionar ficheros locales
const fs = require('fs')
const { BrowserWindow } = require('electron')

let console_style = "padding: 20px; font-weight: 900;";

let loading_elem = $('<div/>', {
    class: "loading_element"
})

let MainContainer,
    Folio,
    SubWindow,
    EditorMain,
    MenuEditor;

let colors = [
    "#9b59b6",
    "#2471a3",
    "#1abc9c",
    "#2ecc71",
    "#f1c40f",
    "#dc7633",
    "#e74c3c"
];

let menuConfig;

let clickedElem = null;

$(document).ready(async() => {
    loadApp();
    //loadAppPrueba();
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

    createLeftMenu().then((res) => {
        MenuEditor.children('.editor_contenedor').children('.loading_element').remove();
        MenuEditor.children('.editor_contenedor').children('.editor-menu-opt').show();
    });
    //abrirFolioEdicion();
}

let loadingPanel = $('<div/>', { class: 'loading-panel', text: 'Loading Content' });

async function showLoader() {
    return new Promise((res, rej) => {
        $('body').append(loadingPanel);

        loadingPanel.animate({
            padding: "20"
        }, 1000, () => {
            abrirFolioEdicion();
            loadingPanel.animate({
                left: "-50%",
                display: "toggle"
            }, 1000, () => {
                //loadingPanel.hide();
                res(1);
            })
        });
    });
}

async function createLeftMenu() {
    return new Promise((res, rej) => {
        fs.readFile('./appData/left_menu.json', 'utf8', (err, data) => {
            if(err) throw err;
            console.log(data);
            menuConfig = JSON.parse(data);
            
            menuConfig.forEach(elem => {
                let el = $('<div/>', {
                    class: 'editor-menu-opt',
                    text: elem.name,
                    
                })

                MenuEditor.children('.editor_contenedor').append(el)
                
                if(elem.hasOwnProperty('items')) {
                    let items_container = $('<div/>', {
                        data: {
                            container: elem.name
                        },
                        class: "items_container"
                    })
                    el.click(() => {
                        items_container.toggle('slow');
                    });
                    MenuEditor.children('.editor_contenedor').append(items_container)

                    elem.items.forEach(elem => {
                        let it = $('<div/>', {
                            class: 'selectable-item',
                            click: function() {

                            },
                            css: {
                                backgroundImage: `url(${elem.avatar})`
                            }
                        });
                        items_container.append(it);
                    });
                }
                
                
            });
            setTimeout(() => {
                res(1);
            }, 500);
        });

        
    });
    
}

async function abrirFolioEdicion() {
    EditorMain = $('<div/>', {
        class: 'editor_main'
    });

    MenuEditor = $('<div/>', { class: 'editor_left_menu' });
    MenuEditor.append($('<div/>', { class: 'editor_contenedor' }).append(loading_elem));

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
    EditorMain.animate({
        margin: 0,
        opacity: 1
    }, 1000);
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