$(function(){

socket = io('http://websocketpage:3000');
socket.on("conectedMessage", function(message){
    console.log(message+'\n'+'Connect'+socket.connected+'\n'+'ID: '+socket.id);
    document.getElementById('bolinha').src = '../img/bolinha_verde.png';
    //document.getElementById('message').innerHTML=`Conectado: ${socket.connected}<br>${message}<br>ID: ${socket.id}`;
});

socket.on('connect_error', (error) => {
    showdisconnect();
    console.log(error);
})

socket.on('reconnecting', (attemptNumber) =>{
    document.getElementById('bolinha').src='../img/bolinha_amarela.png';
    document.getElementById('message').innerHTML = 'Tentando reconectar';
    console.log(attemptNumber);
})

socket.on('disconnectedBroadcast', (data) =>{
    console.log(data);
})

/********************** Recebe um valor do servidor ********************/
socket.on('toggleButton', (response) => {
    if(response.permission == 'denied'){
        console.log('DENIED');
        return;
    }
    
    var buttonId = response.buttonId
    var button = $('#'+buttonId)

    if(response.status == 'enabled'){    //Verifica se o "status" é igual ao "enable".
        button.removeClass('disabled'); //Remove a class "disabled".
    }else{
        button.addClass('disabled');    //Adiciona a class "disabled" no botão
    }

   console.log(response)    //Mostra o tipo de saida
})

function showdisconnect(){ 
    document.getElementById('bolinha').src = '../img/bolinha.png';
    document.getElementById('message').innerHTML='Desconectado';
};


$(".buttons").click(function(){ //Evento de clique do botão
    let button = $(this);
        
        var buttonAction = button.hasClass("disabled") ? 'enabled' : 'disabled';  // Verifica se o valor é 'enabled' ou 'disabled'
        var buttonInfo = {  //Este objeto recebe os valores 'id' e 'status'.
            'id': button.attr('id'), 
            'status': buttonAction,
        }

        socket.emit('toggleButton', buttonInfo);    //Envia o resultado ao servidor websocket
});

/**************** EStá função recebe o valor do objeto do Websocket *******************/

    socket.on('buttonInfo', function (jsonObj){
        console.log(jsonObj);
        //var jsonObj = JSON.parse(response)
        for(key in jsonObj){    //Vai percorrer a posição do objeto.
            console.log(key);
            var buttonObj = jsonObj[key];   //Recebe o valor da posição do objeto
            var buttonId  = key;   //Recebe o valor do Id do objeto
            if(buttonObj.status == 'disabled') {    //Está linha faz a compração do status do objeto.
                $('#' + buttonId).addClass('disabled'); //Está linha seleciona o ID e muda o valor da Class do botão.
            } else {
                $('#' + buttonId).removeClass('disabled');  //Remove o valor da 'Class' que estava com o valor 'disabled'.
            }
        }
    }); 

});

