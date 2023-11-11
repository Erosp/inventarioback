let arr1 = [8, 3, 1];
let arr2 = [9, 6, 7, 2];

obtenerMediana(arr1, arr2);

function obtenerMediana(aArray, bArray){
    
    let arreglo = aArray.concat(bArray);
    arreglo.sort(function(a, b){
        if(a>b){
            return 1;
        }
        else if(a<b){
            return -1
        }
        return 0;
    });
    
    let longitud = arreglo.length;
    let stringArray = "[" + arreglo.toString(",") + "]"
    
    console.log("Para el arreglo");
    console.log(stringArray);
    
    if(verificarPar(longitud)){

        let index = longitud/2;
        let mediana1 = arreglo[index-1];
        let mediana2 = arreglo[index]
        console.log("Las medianas son: " + mediana1 + " y " + mediana2);
        
    }
    else{

        let index = Math.floor(longitud/2);
        let mediana = arreglo[index];
        console.log("La mediana es: ", mediana);

    }

}

function verificarPar(num){
    return (num % 2) == 0;
}