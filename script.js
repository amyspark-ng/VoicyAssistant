import { commands, joking } from "./comms.js"

// getting the dummy buttons
const btnStartRecord = document.querySelector("#btnStartRecord")
const btnStopRecord = document.querySelector("#btnStopRecord")
const textarea = document.querySelector("#text")
let badumtss = new Audio("badumtss.mp3")

// setting stuff up
export let recognition = new webkitSpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = true;
recognition.interimResults = false;

export let synth = window.speechSynthesis;
export let utterThis = new SpeechSynthesisUtterance();

synth.lang = 'es-ES';

btnStartRecord.addEventListener('click', () => {
	recognition.start()
})

btnStopRecord.addEventListener('click', () => {
	recognition.abort()
})

// what happens when it returns the things
recognition.onresult = (event) => {
	let results = event.results;
	let phrase = results[results.length - 1][0].transcript;
	textarea.value = phrase

	const deleteThese = /[!"#$%&'()*+,-./:;<=>¿?@[\]^_`{|}~\u0300-\u036f]/g;
	phrase = phrase.toLowerCase().replace(deleteThese, '')
	phrase = phrase.split(' ')

	let unknownCount = 0
	for (let i = 0; i < phrase.length; i++) {
		recognition.abort()
		
		if (commands[phrase[i]]) {
			commands[phrase[i]]()
			break
		}

		else {
			unknownCount++

			if (unknownCount == phrase.length) {
				utterThis.text = "Lo siento, no conozco ese comando"
				synth.speak(utterThis)			
				break
			}
		}
	}
}

recognition.onend = (event) => {
	console.log("He dejado de escuchar")
}

recognition.onerror = (event) => {
	console.log(event.error)
}

utterThis.onend = (event) => {
	if (joking) {
		badumtss.play()
	}
}

