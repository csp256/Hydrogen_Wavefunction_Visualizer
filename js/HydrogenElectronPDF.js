// Quantum Numbers
var n, l, m;


var F = [1];
function memoizeFactorials(n) {
	len = F.length;
	if (n < len) return;
	while (len <= n) {
		len = F.push(F[len-1] * len);
	}
}



var A;
function memoizeA(n,l,m) {
	var out = Math.pow(n, -(2+l));
	var sqrtPart = F[n+l] * F[n-l-1] * F[2*l+1] * F[l-m];
	sqrtPart /= F[l+m] * Math.PI;
	A = out * Math.sqrt(sqrtPart);
}


var B;
function calculateB(n,l,k) {
	var out = Math.pow((-2/n), k);
	out /= F[k] * F[n-l-1-k] * F[2*l+1+k];
	return out;
}
function memoizeB(n,l) {
	B = [];
	for (var k=0; k <= (n-l-1); k++) {
		B.push(calculateB(n,l,k));
	}
}


var C;
function fallingFactorial(a,b) {
	if (b <= 0) return 1;
	var out = 1;
	for (var i=0; i < b; i++) {
		out *= a-i;
	}
	return out;
}
function calculateC(l,m,k) {
	console.log("in C("+n+","+l+","+m+","+k+")" );
	if (l-2*k-m < 0) {
		console.log("bailing early: G = 0");
		return 0;
	}
	var out = Math.pow(-1, k);
		console.log(out);
	out /= F[k] * F[l-k];
		console.log(out);
	out *= fallingFactorial(2*(l-k), l+m);
		console.log(out);
	return out;
}
function memoizeC(l,m) {
	C = [];
	for (var k=0; k <= l; k++) {
		C.push(calculateC(l,m,k));
	}
}


function initializePDF(a,b,c) {
	n = a;
	l = b;
	m = c;

	memoizeFactorials(3 * n);
	memoizeA(n,l,m);
	memoizeB(n,l);
	memoizeC(l,m);
}


function PDF(r, theta, phi) {
	return Math.pow( Math.abs(psi(r,theta,phi)), 2);
}


function psi(r, theta, phi) {
	var out, sum;
	// constant part
	out = A;
	
	// radial part
	out *= Math.pow(Math.E, -r/n);
	out *= Math.pow(r, l);
	sum = 0;
	for (var k=0; k <= n-l-1; k++) {
		sum += B[k] * Math.pow(r, k);
	}
	out *= sum;
		

	// azimuthal part
	out *= Math.pow(Math.sin(theta), m);
	sum = 0;
	for (var k=0; k <= l; k++) {
		sum += C[k] * Math.pow(Math.cos(theta), l-(2*k)-m);
	}
	out *= sum;
	

	// planar part
	out *= Math.cos(m*phi);

	return out;
}