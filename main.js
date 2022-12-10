
const delay = ms => new Promise(res => setTimeout(res, ms))

const colorPalette = [
	"#D5D7B6", "#FFF1E8", "#C5D6DB", "#CFB2DF", "#FF4DED", "#FF4242", "#FF7D00", 
	"#FF7D00", "#FFCF29", "#FFFF00", "#00F73A", "#5BE3E3", "#5BE3E3", "#29ADFF"
	];

const jitteringLetters = [
	"A","b","$$","x","e","%","G","H","j","J","*","L","m",
	"N","O","$","Q","|","!","&","U","V","@","X","(","x"
	];

const CONVERTER = 1;
const LIMPAR = 2;

async function animate(inputTextArea, outputTextArea, convType) {

	let originalText = inputTextArea.value;
	let convertedText = convertStringToType(originalText, convType);
	
	let words = Array.from(originalText); /* palavras separadas no texto original */
	let bytes = convertedText.split(' '); /* lista de bytes em string da conversão */
	
	let currentColorIndex = 0;
	
	for (let i = 0; i < bytes.length; i++) {
		
		/* pular para próxima linha depois de 6 bytes em sequência se for em binário, se for em hex, pula no 12 byte */
		if (i % ( convType != 'binary' ? 16 : 6 ) == 0)
			insert('typingBinaryContent', '<br>');
		
		/* selecionar a cor sequêncialmente e voltar para o indice 0 se for maior que o tamanho da paleta de cores */
		if (currentColorIndex > colorPalette.length)
			currentColorIndex=0;
		else
			currentColorIndex++;
		
		/* seleciona a cor da posição currentColorIndeex */
		currentColor = colorPalette[currentColorIndex];

		/* digitos binário do byte atual */		
		let bits = Array.from(bytes[i]);
	
        /* adicionar na tela o caracter do byte atual */
		let currentLetterName = "letter_" + i;
		insert('typingTextContent', '<font id="' + currentLetterName + '" color="' + currentColor + '"></font>');
		let currentLetterFontElement = document.getElementById(currentLetterName);
		
		/* criar um elemento de fonte para cada byte */
		let currentBitFontName = "byte_" + i;
		insert('typingBinaryContent', '<font id="'+currentBitFontName+'" color="'+currentColor+'" style="text-align:center;"></font>');
		let currentBitFontElement = document.getElementById(currentBitFontName);
		
		for (let j = 0; j < bits.length; j++) {
			
			/* jittering effect */
			for (let o = 0; o < 5; o++) {
				currentLetterFontElement.innerHTML = jitteringLetters[Math.floor(Math.random() * jitteringLetters.length)];
				await delay(1);
			}
			
			/* adicionar bit ao elemento do byte atual */
			currentBitFontElement.innerHTML += bits[j];
		}
		
		/* adicionar espaço para cada letra */
		currentLetterFontElement.innerHTML = words[i] + "&nbsp;&nbsp;";
		currentLetterFontElement = null;
		
		/* adicionar espaço para cada byte */
		insert('typingBinaryContent','&nbsp;&nbsp;');
	}
	changeButtonState('clearButton', 'block');
}

/* método para as ações dos buttons */
function executar(action) {
	
	/* achando tipo de conversão (hex/binary) */
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const convType = (urlParams.get('type') == null) ? 'binary' : urlParams.get('type'); 
	
	const inputTextArea = document.getElementById('inputTextArea');
	const outputTextArea = document.getElementById('outputTextArea');
	const outputContent = document.getElementById('outputContent');
	const inputContent = document.getElementById('inputContent');
	
	switch (action) {
		case CONVERTER:
			inputContent.classList.toggle('show');
			outputContent.classList.toggle('show');
			changeButtonState('clearButton', 'none');
			animate(inputTextArea, outputTextArea, convType);
			break;
		case LIMPAR:
			location.reload();
			break;
	}	
}

/* converter string para lista de bytes em binário  */
function convertStringToType(message, convType) {
	let output = "";
	for (let i = 0; i < message.length; i++) {
		let letter = message.charCodeAt(i);
		console.log(letter.charCode);
		if (convType == 'binary') {
			for (let bitPos = 1; bitPos <= 16; bitPos++) { /* para characteres de 16 bits */
				let mask = 0x10000 >> bitPos; /* 0x10000 = 2^16 */
				let bitState = (letter & mask) != 0;
				output += bitState ? '1' : '0';
			}
		}
		else if(convType == 'hex') {
			output += letter.toString(16);
		}
		output += ' ';
	}
	return output.trim();
}

/* mudar estado de um button */
function changeButtonState(buttonId, state) {
	document.getElementById(buttonId).style.display = state;
}

/* inserir elemento hmtl em uma div */
function insert(elementId, code) {
	return document.getElementById(elementId).insertAdjacentHTML('beforebegin', code);
}