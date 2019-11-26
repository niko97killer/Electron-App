const traducciones = {
    "en_us" : "Ingles (USA)",
    "eu_es" : "Euskera"
}

export function traducir(name) {
    console.log(traductions);
    return traducciones[name] || name;
}