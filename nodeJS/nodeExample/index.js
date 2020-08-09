var rect =require('./rectangle');

//this way we rae forming a simple node module and we have used rectangle file for the exports and now we are using require for importing that file in our project
function solveRect(l,b) {
    console.log("Solving for rectangle with l = "
                + l + " and b = " + b);
    rect(l,b, (err,rectangle) => {
        if (err) {
	        console.log("ERROR: ", err.message);
	    }
        else {
            console.log("The area of the rectangle of dimensions l = "
                + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle of dimensions l = "
                + l + " and b = " + b + " is " + rectangle.perimeter());
        }
    });
    console.log("This statement after the call to rect()");
};

solveRect(2,4);
solveRect(8,5);
solveRect(0,-4);
solveRect(-2,4);solveRect(0,4);