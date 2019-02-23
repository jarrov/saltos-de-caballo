/**
 * Constantes y variables globales
 */
const N=8;
const ncuad=N*N;
const ejex=[-1,-2,-2,-1, 1, 2, 2, 1];
const ejey=[-2,-1, 1, 2, 2, 1,-1,-2];
// nombre - coordenada
var str_int_int_asoc;
// coordenada - nombre
var int_int_str_asoc;
// iteracion - nombre
var control_paso;
  var ultimo=0;

/**
 * Inicia las matrices asociativas 
 *	[ string ] => (int, int)
 *	(int, int) => [ string ]
 */
function iniciar() {
	str_int_int_asoc=new Array(ncuad);
	int_int_str_asoc=new Array(N);
	var clave="";
	var u=0, v=0;

	for(var i=0; i<N; i++) {
		int_int_str_asoc[i] = new Array(N);
	}

	for(var i=1;i<=64;i++){	
		//if(i%8==1){process.stdout.write("\n");}
		//if(i%2!=l%2){k=" bgcolor='#FFFFFF'";}
		clave="c"+(64-i);
		str_int_int_asoc[clave]=new Array(2);
		str_int_int_asoc[clave][0]=u;
		str_int_int_asoc[clave][1]=v;
		int_int_str_asoc[u][v]=clave;
		//process.stdout.write("c"+(64-i)+"=>("+u+","+v+")\t");
		v++;
		if(i%8==0){
			//process.stdout.write("\n");
			u++; v=0;
		}
	}
}

/**
 * Forma la matriz de pasos necesarios para encontrar la solución
 * [int=>string] iteracion => casilla
 */
function control() {
	control_paso=new Array(ncuad);
	var pos=[769, 3329, 5889, 8449, 13569, 1025, 3073, 8961, 11009, 7937, 2049, 9985, 16129]; //, 16385
	var cas=["c9", "c54", "c11", "c36", "c34", "c3", "c60", "c31", "c32", "c63", "c7", "c0", "c56"];
	var i=0, con=1;

	do{
		for(var j=0; j<pos.length; j++)
			if(pos[j]==con) {
				control_paso[i]=cas[j];
				//console.log("\t[" + i + " - " + con + ", " + cas[j] + "]");
				break;
			} else {
				control_paso[i]="cxx";
			}
		//console.log("(" + i+ " ," + con + ")");
		i++;
		con += 256;
	}while(con<16385);
}

/**
 * Adaptación función C mover
 * TODO: q es una variable de entrada salida, en C un puntero, en js ¿?
 */
function mover_p(tablero, i, pos_x, pos_y){
  var k, u, v;

  k = 0;
  q = 0;
  do {
    u = pos_x + ejex[k]; v = pos_y + ejey[k]; /* seleccionar candidato */
    if (u >= 0 && u < N && v >= 0 && v < N) { /* esta dentro de los limites? */
      if (tablero[u][v] == 0) {  /* es valido? */
        tablero[u][v] = i;  /* anota el candidato */
        if (i < ncuad) {  /* llega al final del recorrido? */
          mover(tablero,i+1,u,v);
          if (!q) tablero[u][v] = 0; /* borra el candidato */
        }
        else q = 1; /* hay solucion */
      }
    }
    k++;
  } while (!q && k < 8);
  return q;
}

/**
 * Muestra todas las soluciones posibles del algoritmo vuelta atrás
 */
function mover(tablero, iter, pos_x, pos_y) {
	//console.log("=> iter: "+iter);
	//console.log("\t=> ("+pos_x+", "+pos_y+")");
  var k, u, v;
  var nom="";
  for (k = 0; k < 8; k++) {
    u = pos_x + ejex[k]; v = pos_y + ejey[k];
    if (u >= 0 && u < N && v >= 0 && v < N) { /* esta dentro de los limites */
      if (tablero[u][v] == 0) {
      	nom=int_int_str_asoc[u][v];
      	if(control_paso[iter+1]=="cxx" || control_paso[iter+1]==nom) {
        	tablero[u][v] = iter+1;
        	if(iter>60) {
        		process.stdout.write("\n -- \n");
        		muestra_tablero(tablero);
        	}
        	if (iter < ncuad)
        	  mover(tablero,iter+1,u,v);
        	else { muestra_tablero(tablero); console.log("\n--- SOLUCION --"); }
        	tablero[u][v] = 0;
    	}
    	// else 
    	// 	process.stdout.write(nom+" ");

      }
    }
  }
}

/**
 * Muestra el tablero
 */
function muestra_tablero(tablero) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++)
      	if(tablero[i][j]<10)
        	process.stdout.write(" " + tablero[i][j] + " ");
        else
        	process.stdout.write(tablero[i][j] + " ");
    process.stdout.write("\n");
    }
}

/**
 * Adaptación función C vuelta
 */
function vuelta() {
	var tablero=new Array(N);
	var i, j, q;

	for(i=0; i<N; i++) {
		tablero[i]=new Array(N);
		for(j=0; j<N; j++)
			tablero[i][j]=0;
	}

	//tablero[2][6]=1;
	mover(tablero,0,0,7);
	// q=mover(tablero,2,0,7);

	// if (q) { /* hay solucion: la muestra. */
	// 	muestra_tablero(tablero);
 //  }
 //  else
 //    console.log("\nNo existe solucion\n");
}

//vuelta();
	iniciar();
//--process.stdout.write("c56 => ("+str_int_int_asoc["c56"][0]+", "+str_int_int_asoc["c56"][1]+")\n");
//--process.stdout.write("(3, 6) => [ "+int_int_str_asoc[3][6]+" ]\n");
	control();
for(var h=0; h<ncuad; h++) {
	process.stdout.write(h+"=>"+control_paso[h]+"\n");
}
	vuelta();
