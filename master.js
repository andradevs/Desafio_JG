
// GERA POSIÇÃO ALEATORIA NA ARENA
function ranPos(){
return Math.floor(Math.random() * 20)
}

// REMOVE O DIV #MENU
function someDiv(){
    const menu = document.getElementById('menu')
    menu.style.display = 'none'
}

// MOBILE
window.onload = () =>{
    if(window.innerWidth < 700){
        someDiv()
        singlePlayer()
        
    }
}
            //VISUAL DO JOGO E CONTROLADOR DE PONTOS
class Visual{
    constructor(contexto,arena,jogadores){
        this.ctx = contexto;
        this.arena = arena;
        this.jog = jogadores;
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.gameOver = false;
        this.pntFinal = 0;// pontuação antiga
        this.vencedor = ''
    }
    draw(){
        this.ctx.fillStyle = '#62e37e'; // cor da arena
        this.ctx.fillRect(0, 0, this.arena.width, this.arena.height); // prenchimento da arena
        
        this.ctx.fillStyle = '#ffff00'; 
        this.ctx.font = "14px Arial"; 
        this.ctx.fillText(`Jogador 1: ${this.scoreP1}`, 10, 20); // coordenada da localização da pontuação

        if(this.jog){
            this.ctx.fillStyle = '#000'; // cor do texto
            this.ctx.font = "14px Arial"; // tamanho e fonte do texto
            this.ctx.fillText(`Jogador 2: ${this.scoreP2}`, 400, 20); 
        }
        if(this.gameOver){ // texto de GAME OVER
            this.ctx.globalCompositeOperation = ""
            this.ctx.fillStyle = '#fff';
            this.ctx.font = " bold 30px Arial";
            this.ctx.fillText("FIM DE JOGO!", 105, 150);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillText(`Pontuação: ${this.pntFinal}`, 145, 180);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = "bold 15px Arial";
            this.ctx.fillText('Aperte Espaço!', 152, 250);
        }
    }
}

                //CLASSE COBRA
class Cobra{
    constructor(contexto,tp,visual,player){
        this.ctx = contexto;
        this.tp = tp;
        this.visual = visual;
        this.player = player;
        this.posX = ranPos();
        this.posY = ranPos();
        this.vel = 1;
        this.dirX = this.vel
        this.dirY = 0;
        this.sentido = false;
        this.percurso = [{"x": this.posX, "y": this.posY}];
        if(player == 1){
            this.cor = "#ffff00"
        }else{
            this.cor = "#000"
        }
    }

    setPercurso(){
        let i = this.percurso.length - 1;

        for(i; i >= 0; i--){
            if (i != 0){
              this.percurso[i] = this.percurso[i - 1]; // animação da peça
            }else{
              this.percurso[0] = {"x": this.posX, "y": this.posY}; // dessa forma ele só repete a posição 
            }
          }
    }
    
    limpaCalda(){
        while(this.percurso.length> 1){
            this.percurso.pop()// remove a calda
        }
    }

    gameOver(){
        for(let i = 0; i < this.percurso.length; i++){
        
            if(i != 0 && this.percurso[0].x == this.percurso[i].x &&
              this.percurso[0].y == this.percurso[i].y){
                
                this.dirX = this.dirY = 0;
                
                this.visual.gameOver = true;
                this.visual.pntFinal = this.visual.scoreP1; 
                if(this.visual.scoreP1 < this.visual.scoreP2){
                    this.visual.pntFinal = this.visual.scoreP2
                    this.visual.scoreP2 = 0;
                }
                this.visual.scoreP1 = 0;
                this.limpaCalda()
      
                document.getElementById('restart').style.display = 'block';        
      
                console.log("GAME OVER!!");
      
                return true;
            }  
        }
        return false;
    }
    draw(){
        this.movimento();
        this.setPercurso();
        this.gameOver();
        
        for(let i = 0; i < this.percurso.length; i++){
            if(i == 0){
              this.ctx.fillStyle =this.cor;
            }else{
              this.ctx.fillStyle =this.cor;
            }
            this.ctx.fillRect(this.percurso[i].x * this.tp, 
              this.percurso[i].y * this.tp, this.tp - 2, this.tp - 2); // determinão o prenchimento do quadrado 
          }
    
    }

    setVel(tecla){
        let setXY = (x,y) => {
            this.dirX = x;
            this.dirY = y;
        }

        if(!this.visual.gameOver){
            if(this.player == 1){
                if((tecla == 37) && this.sentido){//esquerda
                setXY(-this.vel, 0);
                this.sentido = !this.sentido;
                }else if((tecla == 38) && !this.sentido){//cima
                setXY(0, -this.vel);
                this.sentido = !this.sentido;
                }else if((tecla == 39) && this.sentido){//direita
                setXY(this.vel, 0);
                this.sentido = !this.sentido;
                }else if((tecla == 40) && !this.sentido){//baixo
                setXY(0, this.vel);
                this.sentido = !this.sentido;
                }
            }else{
                if((tecla == 65) && this.sentido){//esquerda
                    setXY(-this.vel, 0);
                    this.sentido = !this.sentido;
                }else if((tecla == 87) && !this.sentido){//cima
                    setXY(0, -this.vel);
                    this.sentido = !this.sentido;
                }else if((tecla == 68 && this.sentido)){//direita
                    setXY(this.vel, 0);
                    this.sentido = !this.sentido;
                }else if((tecla == 83) && !this.sentido){//baixo
                    setXY(0, this.vel);
                    this.sentido = !this.sentido;
                }
            }    
      
          }else if(tecla == 32){
            this.visual.gameOver = false;
            this.dirX = this.vel;
            this.sentido = false;
            document.getElementById('restart').style.display = 'none';
          }  
    }

    movimento(){
        if(this.visual.gameOver){
            this.dirX = this.dirY = 0;
            this.limpaCalda()
        }
        this.posX += this.dirX;
        this.posY += this.dirY;
    
        if(this.posX > 19){ // passou da linha da direita
          this.posX = 0;
        }else if(this.posX < 0){ // passou da linha da esquerda
          this.posX = 19; 
        }
    
        if(this.posY > 19){ // passou da linha de baixo
          this.posY = 0;
        }else if(this.posY < 0){// passou da linha de cima
          this.posY = 19;
        }  
    }
}

                // CLASSE FRUTA
class Fruta{
    constructor(cobra1,cobra2,contexto,tp,visual){
        this.cobra1 = cobra1;
        this.cobra2 = cobra2;
        this.ctx = contexto;
        this.tp = tp;
        this.visual = visual;
        this.posX = ranPos();
        this.posY = ranPos();

    }
    
    frutaComida(){
        if(this.posX == this.cobra1.percurso[0].x &&
            this.posY == this.cobra1.percurso[0].y){
      
              this.cobra1.percurso.push({"x": '', "y": ''});
      
              this.visual.scoreP1 += 10;
      
              this.posX = ranPos();
              this.posY = ranPos();
              console.log(this.posX,this.posY)
          
        }
        if(this.cobra2){
            if(this.posX == this.cobra2.percurso[0].x &&
            this.posY == this.cobra2.percurso[0].y){
                this.cobra2.percurso.push({"x": '', "y": ''});
      
                this.visual.scoreP2 += 10;
      
                this.posX = ranPos();
                this.posY = ranPos();
                
            }
        }
    }

    draw(){
        this.frutaComida();
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.fillRect(this.posX * this.tp,this.posY *this.tp,this.tp -2,this.tp-2);
    }
    
}

    //CRIAÇÃO DA ARENA PARA 1 JOGADOR
function singlePlayer(){
    someDiv()
    const arena = document.getElementById('arena');
    arena.style.display = 'inline-flex'
    const contexto = arena.getContext('2d');
    const tamPeca = 20;
    console.log(contexto)
    const visual =  new Visual(contexto,arena,false)
    const cobra1 = new Cobra(contexto,tamPeca,visual,1)
    const fruta = new Fruta(cobra1,false,contexto,tamPeca,visual)

    setInterval(function(){
        visual.draw()
        cobra1.draw()
        fruta.draw()  
    },1000/13);

    document.addEventListener('keydown',() =>{
        console.log(event.keyCode);
        cobra1.setVel(event.keyCode);
        
    })

    const cima = document.getElementById('cima');
    cima.addEventListener('click', function(){
        cobra1.setVel(38);
    });

    const baixo = document.getElementById('baixo');
    baixo.addEventListener('click', function(){
        cobra1.setVel(40);
    });

    const esquerda = document.getElementById('esquerda');
    esquerda.addEventListener('click', function(){
        cobra1.setVel(37);
    });

    const direita = document.getElementById('direita');
    direita.addEventListener('click', function(){
        cobra1.setVel(39);
    });

    const restart = document.getElementById('restart');
    restart.addEventListener('click', function(){
        cobra1.setVel(32);
    }); 
}

// CRIAÇÃO DA ARENA PARA 2 JOGADORES
function multiPlayer(){
    someDiv()
    const arena = document.getElementById('arena');
    arena.style.display = 'inline-flex'
    arena.height = arena.width = 500
    const contexto = arena.getContext('2d');
    const tamPeca = 25;
    console.log(contexto)
    const visual =  new Visual(contexto,arena,true)
    const cobra1 = new Cobra(contexto,tamPeca,visual,1)
    const cobra2 = new Cobra(contexto,tamPeca,visual,2)
    const fruta = new Fruta(cobra1,cobra2,contexto,tamPeca,visual)

    setInterval(function(){
        visual.draw()
        cobra1.draw()
        cobra2.draw()
        fruta.draw()  
    },1000/13);

    document.addEventListener('keydown',() =>{
        console.log(event.keyCode);
        cobra1.setVel(event.keyCode);
        cobra2.setVel(event.keyCode);
        
    })
}
