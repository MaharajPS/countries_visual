let speed=40;
const inc=document.getElementById("sp");
inc.addEventListener("change",increment);
function increment(e){
    let cvalue=Number(e.target.value);
    if(cvalue==1){
        speed=40;
    }
    else if(cvalue==2){
        speed=60;
    }
    else if(cvalue ==3){
        speed=80;
    }
    else if(cvalue==4){
        speed=90;
    }
    else if(cvalue==5){
        speed=10;
    }
    console.log(speed);
}

function slide(){
    const val=document.getElementById("ip").value;
    const content=document.getElementById("content");
    content.innerHTML="";
    let i=0;
    
    function type(){
        if(i<val.length){
            content.innerHTML+=val[i];
            i++;
            setTimeout(type,speed);
            console.log(speed);
            if(i==val.length){
            content.innerHTML="";
            i=0;
        }
        }
        
    }
    type();
}
