//AMAZON REKOGNITON
//var a = [ 1.916, 1.357, 1.421, 1.722, 1.357 ]
//var b = [ 1.098, 1.029, 1.793, 1.331, 1.126 ]
//var a = [ 1.776, 1.387, 1.435, 1.367, 1.377 ]
//var b = [ 1.792, 1.031, 1.22, 1.314, 1.856 ]
//var a = [ 1.731, 2.029, 1.44, 1.738, 1.325 ]
//var b = [ 1.562, 1, 1.758, 2.042, 2.139 ]

//FREE OCR API
//var a = [ 1.872, 1.139, 0.991, 0.953, 1.059 ]
//var b = [ 1.922, 0.933, 0.84, 0.838, 1.064 ]
var a = [ 1.19, 1.017, 1.04, 0.997, 1.258 ]
var b = [ 2.002, 1.132, 0.801, 1.194, 0.92 ]

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    
const result = average( a ); 
console.log(result);

const resultb = average( b ); 
console.log(resultb);