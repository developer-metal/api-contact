export const formateaRut = (rut) => {
    let actual = String(rut).replace(/^0+/, "");
    let sinPuntos = String(actual).replace(/\./g, "");
    let actualLimpio = String(sinPuntos).replace(/-/g, "");
    let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
    let rutPuntos: string = "";
    let i: number = 0;
    let j:number = 1;
    if (actual != '' && actual.length > 1) {
        for (i = inicio.length - 1; i >= 0; i--) {
            let letra = inicio.charAt(i);
            rutPuntos = letra + rutPuntos;
            if (j % 3 == 0 && j <= inicio.length - 1) {
                rutPuntos = "." + rutPuntos;
            }
            j++;
        }
        let dv = actualLimpio.substring(actualLimpio.length - 1);
        rutPuntos = rutPuntos + "-" + dv;
    }
    return rutPuntos;
}