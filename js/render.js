import * as THREE from '/js/threejs/three.module.js'

import { OrbitControls } from '/js/threejs/OrbitControls.js'

let clock,header,highNote,lowNote,dialogMixer,fontMixer,newKnob,searchKnob,knobID,synthDevice,meshCount

function knob(id,setting) {
	
    this.id = id;
    this.setting = setting;
	
}

const keys = {
	
	attack: 0.05,
	decay: 0.3,
	sustain: 0.5,
	release: 0.35,
	
	colours: {
		
		red: 1,
		green: 1,
		blue: 1,
		
		expression: {
			
			red:0.6,
			green:0.6,
			blue:0.6
			
		}
		
	}

}

let colourSchemes = [
	['rgb(0,0,0)','rgb(163,163,163)'],
	['rgb(0, 0, 61)','rgb(134, 143, 186)'],
	['rgb(176,136,56)','rgb(0,0,61)'],
	['rgb(255,227,201)','rgb(48,22,56)']
]
	
//defaults

let midiInputs = []

let knobs = []

let hidden = false

let keysMapped = false

let rotating = true

let notesPlayed = 0

const cubeY = -15

// Set up scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 300 )

camera.position.x = 0
camera.position.y = 0
camera.position.z = 30

let cubeCollectionGroup = new THREE.Object3D()

const colourFamily = colourSchemes[parseInt(Math.random() * colourSchemes.length)]

let backgroundColour = colourFamily[0]

let foregroundColour = colourFamily[1]

//lights

const lightIntensity = 0.5
				
const lightF = new THREE.PointLight( 0xffffff, lightIntensity, 0, 2)

lightF.position.set( 0, 5, 30 )

scene.add( lightF )

const lightB = new THREE.PointLight( 0xffffff, lightIntensity, 0, 2)

lightB.position.set( 0, 5, -30 )

scene.add( lightB )

const lightL = new THREE.PointLight( 0xffffff, lightIntensity, 0, 2)

lightL.position.set( -30, 5, 0 )

scene.add( lightL )

const lightR = new THREE.PointLight( 0xffffff, lightIntensity, 0, 2)

lightR.position.set( 30,5, 0 )

scene.add( lightR )

//renderer

const renderer = new THREE.WebGLRenderer({antialias:true})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.setPixelRatio(window.devicePixelRatio)

document.body.append(renderer.domElement)

clock = new THREE.Clock()

//controls default

const controls = new OrbitControls( camera, renderer.domElement )

controls.enablePan = false

controls.autoRotateSpeed *= -0.666

controls.maxDistance = 75

controls.minDistance = 20

controls.rotateSpeed = 0.333

document.addEventListener("DOMContentLoaded", function () {
	
	if(window.innerWidth <= window.innerHeight) {
		
		document.getElementById('deviceType').style.display = 'none'
		
		const infoBox = document.getElementById('socials')
		
		document.body.append(infoBox)
		
		infoBox.id = 'infoBox'
				
		let p = document.createElement('p')
		
		p.style.color = 'white'
		
		let pText = document.createTextNode('Plug in a MIDI device to a computer to get started.') 
		
		p.append(pText)
		
		infoBox.prepend(p)
		
		p = document.createElement('p')
		
		p.style.color = 'white'
		
		pText = document.createTextNode('GIDI is a free, open source web application which incorporates MIDI messages and ThreeJS to display visual feedback in relation to what a musician is playing.')
		
		p.append(pText)
		
		infoBox.prepend(p)
		
		generateSplash()
		
	} else {
		
		Coloris({
			theme:'polaroid',
			themeMode: 'dark',
			alpha:false,
			format:'rgb',
		})
		
		header = document.createElement('h1')
		
		header.style.color = foregroundColour
		
		let headerText = document.createTextNode('What device are you using?') 
		
		header.append(headerText)
		
		document.getElementById('deviceType').prepend(header)
		
		setStyle(foregroundColour,backgroundColour)
	
	}
	
	animate()

})

// Listen to MIDI
navigator.requestMIDIAccess().then(function(midiAccess) {
	
	const inputs = midiAccess.inputs.values()
	
	for (let input = inputs.next(); input && !input.done; input = inputs.next()) {

		input.value.onmidimessage = function(event) {
		
			const [status, note, velocity] = event.data
			
			if(status != undefined && synthDevice != undefined) {	
			
				switch(status) {
					
					//note on
					case 144:
						
						//synth
						if(synthDevice) {
							
							if(keysMapped) {
								
								let ob = scene.getObjectByName(note)
																
								if (ob) {

									noteOn(ob,ob.name,velocity)
									
								}
							
							} else {
								
								switch(notesPlayed) {
									
									case 0:
																													
										header.innerHTML = 'Now press the highest key you will use'
										
										lowNote = note
											
										break
									
									case 1:
										
										header.style.display = 'none'
																				
										document.getElementById('hide').style.display = 'block'
										
										highNote = note
										
										for(let x = lowNote; x <= highNote; x++) {
											
											midiInputs.push(x)
											
										}
										
										mapInputs(midiInputs)
										
										keysMapped = true
									
										break
										
									
									default:
									
										break
									
									
								}
								
								notesPlayed++
								
							}
							
						} 
						//pad
						else {
							
							if(notesPlayed == 0) {
								
								document.getElementById('hide').style.display = 'block'
							}
							
							header.style.display = 'none'
														
							if(!midiInputs.includes(note)) {
						
								midiInputs.push(note)
								
								midiInputs.sort(function(a, b) {
									
									return a - b
								  
								})
							
								mapInputs(midiInputs)
								
								notesPlayed++
								
							} else {
								
								let ob = scene.getObjectByName(note)
								
								if (ob) {
									
									if(velocity > 0) {											
										
										noteOn(ob,ob.name,velocity)
										
									} else {
										
										noteOff(ob,ob.name,velocity)

									}
									
								}
							}
							
						}
						
						break
					
					//note off
					case 128:
						
						let ob = scene.getObjectByName(note)

						if (ob) {
							
							noteOff(ob,ob.name,velocity)

						}
					
						break
					
					
					case 248:
						
						break
					
					//knobs
					default:
						
						let activeKnob = knobs.find((element) => element.id == status)
						
						if(velocity != undefined) {
							
							if(activeKnob == undefined) {
																
								document.getElementById('knobsHelp').style.display = 'none'
														
								newKnob = new knob(status, ' - Select - ')
								
								searchKnob = newKnob
													
								knobs.push(newKnob)
								
								knobID = newKnob.id

								createKnob(knobID)
								
								break
												
							} 
														
							const value = Math.floor((velocity / 127) * 10)
													
							document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = value
												
							switch(activeKnob.setting) {
										
									case 'Attack':
															
										document.getElementById('attack').value = value
																															
										keys.attack = value / 20
						
										break
									
									case 'Decay':
															
										document.getElementById('decay').value = value
																															
										keys.decay = (parseInt(value) + 1) / 20
						
										break

									case 'Sustain':
															
										document.getElementById('sustain').value = value
																															
										keys.sustain = value / 20
						
										break
										
									case 'Release':
														
										document.getElementById('release').value = value
																									
										keys.release = value / 20
										
										break
														
									case 'Autorotate':
															
										if(value == 10) {
																
											controls.autoRotate = rotating
							
											document.getElementById('autoRotate').checked = rotating
																
											rotating = !rotating
										
										}
										
										break
										
									case 'Remap':
										
										if(value == 10) {
										
											remap()
										
										}
										
										break
										
									default:
									
										break
								}
							
						}
						
						break

					
				}
				
			}
				
		}
		
	} 
	  
});

function noteOn(mesh,key,velocity){
	
	const velocityRange = 3
	
	const releaseKey =  window['clipFall' + key]
	
	//if note falling and note needs to rose halt/end key rise
	if(releaseKey != undefined && releaseKey.isRunning()) {

		window['clipFall' + key].halt(0)
		
	}
	
	let amplify = Math.floor((velocity / 127) * velocityRange) + keys.sustain
	
	amplify *= 3
	
	const times = [
	
		0, 
		keys.attack, 
		keys.attack + keys.decay
	
	]
	
	const meshPosition = [
	
		mesh.position.x, cubeY, mesh.position.z, 
		mesh.position.x, cubeY + (amplify / 2), mesh.position.z,
		mesh.position.x, cubeY + (amplify / 2) - 0.75, mesh.position.z
	
	]
	
	const meshScale = [
	
		mesh.scale.x, 1, mesh.scale.z,
		mesh.scale.x, 1 + amplify, mesh.scale.z,
		mesh.scale.x, (1 + amplify) - 1.5, mesh.scale.z
	
	]
	
	const meshColours = [
	
		keys.colours.red, keys.colours.green, keys.colours.blue, 
		keys.colours.red + keys.colours.expression.red, keys.colours.green + keys.colours.expression.green, keys.colours.blue + keys.colours.expression.blue,
		keys.colours.red + (keys.colours.expression.red / 2), keys.colours.green + (keys.colours.expression.green / 2), keys.colours.blue + (keys.colours.expression.blue / 2)
	]

	const cubePosition = new THREE.VectorKeyframeTrack( '.position', times, meshPosition )
	
	const cubeScale = new THREE.VectorKeyframeTrack( '.scale', times, meshScale )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', times, meshColours)
	
	const cubeClip = new THREE.AnimationClip( 'rise', -1, [ cubePosition, cubeScale, colorSweep] )
	
	window['riseMixer' + key] = new THREE.AnimationMixer( mesh )
	
	window['clipRise' + key] = window['riseMixer' + key].clipAction( cubeClip )

	window['clipRise' + key].clampWhenFinished = true
	
	window['clipRise' + key].setLoop(THREE.LoopOnce)
	
	window['clipRise' + key].play()
	
}

function noteOff(mesh,key,velocity){
	
	const attackKey =  window['clipRise' + key]
	
	//if note rising and note needs to fall halt/end key rise
	if(attackKey != undefined && attackKey.isRunning()) {

		window['clipRise' + key].halt(0.025)
		
	}
	
	const velocityRange = 3
	
	let amplify = Math.floor((velocity / 127) * velocityRange) + 0.75
	
	amplify *= 3

	const cubePosition = new THREE.VectorKeyframeTrack( '.position', [ 0, keys.release ], [ mesh.position.x, mesh.position.y, mesh.position.z, mesh.position.x, cubeY, mesh.position.z] )
	
	const cubeScale = new THREE.VectorKeyframeTrack( '.scale', [ 0, keys.release ], [ mesh.scale.x, mesh.scale.y, mesh.scale.z, mesh.scale.x, 1, mesh.scale.z] )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [ 0, keys.release ], [ keys.colours.red + (keys.colours.expression.red / 2), keys.colours.green + (keys.colours.expression.green / 2), keys.colours.blue + (keys.colours.expression.blue / 2), keys.colours.red,keys.colours.green,keys.colours.blue])
	
	const cubeClip = new THREE.AnimationClip( 'fall', -1, [ cubePosition, cubeScale, colorSweep] )
	
	window['fallMixer' + key] = new THREE.AnimationMixer( mesh )
	
	window['clipFall' + key] = window['fallMixer' + key].clipAction( cubeClip )

	window['clipFall' + key].clampWhenFinished = true
	
	window['clipFall' + key].setLoop(THREE.LoopOnce)
	
	window['clipFall' + key].play()
}

function mapInputs(midiInputs) {

	scene.add( cubeCollectionGroup )
	
	let keyGeometry = new THREE.BoxGeometry(0.5,1,5)		
		
	for(let x = 0; x < midiInputs.length; x++){
		
		//find old ob
		let ob = cubeCollectionGroup.getObjectByName(midiInputs[x])
		
		//delete old ob
		if(ob) {
		
			cubeCollectionGroup.remove(ob)
		
		}
		
		const boxColour = new THREE.Color(keys.colours.red, keys.colours.green, keys.colours.blue)
	
		const material = new THREE.MeshStandardMaterial( { color: boxColour} )
			
		let mesh = new THREE.Mesh(keyGeometry, material)
				
		mesh.name = midiInputs[x]
		
		mesh.position.x = x
		
		mesh.position.y = cubeY
		
		cubeCollectionGroup.add(mesh)

	}
		
	//lock view to centre of keyboard	
	const centre = cubeCollectionGroup.getObjectByName(midiInputs[parseInt(midiInputs.length / 2)])
	
	controls.target.set( centre.position.x,centre.position.y,centre.position.z )
	
	//pan camera out depending number of notes
	camera.position.x = -midiInputs.length * 4
	camera.position.y = midiInputs.length * 4
	camera.position.z = midiInputs.length * 4

	controls.update()

}

function createKnob(status) {
	
	const optionDiv = document.createElement('div')
	
	optionDiv.id = status
	
	optionDiv.setAttribute('class','knobOption')
	
	const knobs = document.getElementById("knobs")
	
	const knobLabel = document.createElement("label")

	const labelContent = document.createTextNode("Knob (" + status + ')')
		
	knobLabel.append(labelContent)

	const knobSpan = document.createElement("label")
	
	knobSpan.id = 'knob'
	
	knobSpan.setAttribute('name','knob' + status)

	const spanContent = document.createTextNode("0")
		
	knobSpan.append(spanContent)
	
	knobs.append(optionDiv)
	
	optionDiv.append(knobLabel)
	
	optionDiv.append(knobSpan)
	
	document.getElementById('mapToOption').style.display = 'block'
	
	document.getElementById('mapToOption').value = ' - Select - '
	
	optionDiv.append(document.getElementById('mapToOption'))
	
	if(!hidden) {
		
		optionDiv.classList.toggle('minimised')
		
	}
		
}

function removeKnob(selectedKnob) {
	
	const knobTargetIndex = knobs.findIndex((element) => element.id == selectedKnob)
	
	knobs.splice(knobTargetIndex, 1)

	document.getElementById('mapToOption').value = ''
		
	document.body.append(document.getElementById('mapToOption'))
	
	document.getElementById(selectedKnob).remove()
	
	if(knobs.length == 0) {
		
		document.getElementById('knobsHelp').style.display = 'block'
		
	}

}


function remap() {
	
	midiInputs = []
	
	keysMapped = false
	
	header.style.display = 'block'
			
	notesPlayed = 0
	
	document.getElementById('autoRotate').checked = false
	
	rotating = !rotating
	
	controls.autoRotate = false
	
	scene.remove(cubeCollectionGroup)
	
	cubeCollectionGroup = new THREE.Object3D()
	
	if(synthDevice) {
				
		header.innerHTML = 'Press the lowest key you would like to map'
		
	} else {
		
		header.innerHTML = 'Play any pad'

	}
	
}

function animateSettings() {
		
	let knobOptions = Array.from(document.getElementsByClassName('knobOption'))
	
	if(hidden) {
		
		document.getElementById('hide').innerHTML = '>'
		
		for(var i = 0; i < knobOptions.length; i++) {
			
			const currentOption = knobOptions[i]
			
			if(currentOption.children.mapToOption != undefined) {
			
				currentOption.children.mapToOption.style.display = 'none'
			
			}
			
			document.getElementById('minimisedSliders').append(currentOption)
			
			currentOption.classList.toggle('minimised')
			
		}
		

	} else {
		
		document.getElementById('hide').innerHTML = '<'

		for (let i = 0; i < knobOptions.length; i++) {
			
		    const currentOption = knobOptions[i]		  
			
			if(currentOption.children.mapToOption != undefined) {
			
				currentOption.children.mapToOption.style.display = 'block'
			
			}

			document.getElementById('knobs').append(currentOption)

			currentOption.classList.toggle('minimised')
		   
		}
				
		document.getElementById('settings').style.display = 'block'

	}
	
	document.getElementById('settings').classList.toggle('hide')
	
	hidden = !hidden
	
	setStyle(foregroundColour,backgroundColour)
	
}

function setStyle(foregroundColour,backgroundColour) {
	
	for(let x = 0; x < document.getElementsByClassName('buttons').length; x++) {

		document.getElementsByClassName('buttons')[x].style.backgroundColor = foregroundColour
		
		document.getElementsByClassName('buttons')[x].style.color = backgroundColour
		
	}
	
	document.getElementById('remap').style.backgroundColor = backgroundColour

	document.getElementById('remap').style.color = foregroundColour	
	
	document.getElementById('mapToOption').style.backgroundColor = backgroundColour

	document.getElementById('mapToOption').style.color = foregroundColour	
	
	header.style.color = foregroundColour
	
	scene.background = new THREE.Color(backgroundColour)

	setKeyColour(foregroundColour)
	
}

function setKeyColour(rgb) {
		
	rgb = rgb.slice(4).replace(')','').split(',')
	
	keys.colours.red = rgb[0] / 255
	
	keys.colours.green = rgb[1] / 255
	
	keys.colours.blue = rgb[2] / 255
	
}

function setKeyExpressionColour(rgb) {
	
	let rgbSplit = rgb.slice(4).replace(')','').split(',')
			
	keys.colours.expression.red = rgbSplit[0] / 255

	keys.colours.expression.green = rgbSplit[1] / 255

	keys.colours.expression.blue = rgbSplit[2] / 255
			
}

function generateSplash() {
	
	cubeCollectionGroup = new THREE.Object3D()

	meshCount = 0

	let width = 8

	let height = 8
	
	let i = 0
	
	let x = -8
	
	let y = -15
	
	let z = -8
	
	let step = width
	
	let iteration = 0
	
	let limit = 6
	
	controls.enableZoom = false
	
	controls.autoRotate = true
	
	camera.position.x = 200
	
	camera.position.y += 50
	
	burrow(x,y,z,width,height,step,iteration,limit)

	scene.add( cubeCollectionGroup )
	
}

function burrow(x,y,z,width,height,step,iteration,limit){
		
	let geometry = new THREE.BoxGeometry(step,step,step)		
	
	let p = 0
	
	let pY = z
	
	let startPositions = new Array(4)
	
	for (let g = 0; g < startPositions.length; g++) {
		
		startPositions[g] = new Array(2)
		
	}
	
	while(x < width) {
		
		z = pY
		
		while(z < height) {
			
			startPositions[p][0] = x

			startPositions[p][1] = z
		
			p++
			
			z += step
			
		}
		
		x += step
		
	}
	
	if(iteration < limit) {
		
		for(let d = 4; d > 1; d--) {
			
			let randomPosition = parseInt(Math.random() * d)
			
			let rgbSplit = foregroundColour.slice(4).replace(')','').split(',')
			
			let r = (rgbSplit[0] / 255) + (iteration / 10 + 1) / d
			
			let g = (rgbSplit[1] / 255) + (iteration / 10 + 1) / d
			
			let b = (rgbSplit[2] / 255) + (iteration / 10 + 1) / d
			
			const boxColour = new THREE.Color(r,g,b);
		
			const material = new THREE.MeshStandardMaterial( { color: boxColour, transparent: true, opacity: 1, metalness:0.1,roughness:0.1} )
				
			let mesh = new THREE.Mesh(geometry, material)
			
			mesh.name = meshCount
			
			mesh.position.x = startPositions[randomPosition][0] + (step / 2) 
			
			mesh.position.y = y + limit - (step * 1.5)
			
			mesh.position.z = startPositions[randomPosition][1] + (step / 2)
			
			cubeCollectionGroup.add(mesh)
			
			recursionKeyframe(mesh,startPositions[randomPosition][0],y,startPositions[randomPosition][1],meshCount,r,g,b,step,width,iteration,limit)
			
			meshCount++
			
			burrow(startPositions[randomPosition][0], y, startPositions[randomPosition][1], startPositions[randomPosition][0] + step, startPositions[randomPosition][1] + step, step / 2, iteration + 1, limit)
			
			startPositions.splice(randomPosition, 1)
			
		}
		
	} 	
		
}
	

function recursionKeyframe(mesh,x,y,z,i,r,g,b,step,width,iteration,limit){
	
	let currentTime = i / 100
	
	currentTime += 2

	let rE = r + 0.6

	let gE =  g + 0.3

	let bE = b - 0.2
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [  currentTime, currentTime  + 0.165, currentTime  + 10], [ r,g,b, rE, gE, bE, r, g, b])

	const cubeScale = new THREE.AnimationClip( 'cubePS', -1, [ colorSweep] )

	window['scaleMixer' + i] = new THREE.AnimationMixer( mesh )
	
	window['clipScale' + i] = window['scaleMixer' + i].clipAction( cubeScale )

}

function animate() {

	const delta = clock.getDelta()
	
	for(let x = 0; x < midiInputs.length; x++){ 
		
		const midiInputName = midiInputs[x]
		
		if(window['riseMixer' + midiInputName] != undefined) {
						
			window['riseMixer' + midiInputName].update( delta )
	
		}
		
		if(window['fallMixer' + midiInputName] != undefined) {
			
			window['fallMixer' + midiInputName].update( delta )
		
		}

	}
	
	for(let x = 0; x < meshCount; x++){ 
		
		if(window['clipScale' + x] != undefined) {
			
			window['clipScale' + x].play()
			
		}
	
	}

	for(let x = 0; x < meshCount; x++){ 
	
		if(window['scaleMixer' + x] != undefined) {
			
			window['scaleMixer'+ x].update( delta )
			
		}
		
	}
		
	
	if(dialogMixer != undefined) {

		dialogMixer.update( delta )

	}
	
	if (fontMixer != undefined) {
			
		fontMixer.update( delta )
			
	}
	
	requestAnimationFrame(animate)
		
	controls.update()
	
	renderer.render(scene, camera)	
	
}

document.getElementById('synth').addEventListener('click', function( event ) {
	
	document.getElementById('synth').style.display = 'none'
	
	document.getElementById('pad').style.display = 'none'
	
	synthDevice = true
		
	header.innerHTML = 'Press the lowest key you will use'

}, false)

document.getElementById('pad').addEventListener('click', function( event ) {
		
	document.getElementById('synth').style.display = 'none'
	
	document.getElementById('pad').style.display = 'none'

	synthDevice = false
	
	header.innerHTML = 'To get started play any pad'
	
}, false)

document.querySelector('#knobs').addEventListener('click',function ( event ) {
			
	if (event.target.classList.contains('knobOption')) {
		
		knobID = event.target.id

        searchKnob = knobs.find((element) => element.id == knobID)
		
        document.getElementById('mapToOption').value = searchKnob.setting

		document.getElementById(knobID).append(document.getElementById('mapToOption'))
		
	}

})

document.getElementById('mapToOption').addEventListener('change', function() {
	
	if(this.value == 'Remove') {
		
		removeKnob(knobID)
		
	} else {
		
		document.getElementById(knobID).children[0].innerHTML = this.value

        searchKnob.setting = this.value
	
	}
	
}, false)

document.getElementById('remap').addEventListener('click', function( event ) {
	
	animateSettings()
	
	remap()
	
}, false)

document.getElementById('autoRotate').addEventListener('change', function( event ) {
	
	controls.autoRotate = event.target.checked
	
	rotating = !rotating
	
}, false)

document.getElementById('attack').addEventListener('input', function( event ) {
	
	keys.attack = event.target.value / 20
	
}, false)

document.getElementById('decay').addEventListener('input', function( event ) {
		
	keys.decay = (parseInt(event.target.value) + 1) / 20
	
}, false)

document.getElementById('sustain').addEventListener('input', function( event ) {
	
	keys.sustain = event.target.value / 20
	
}, false)

document.getElementById('release').addEventListener('input', function( event ) {
	
	keys.release = event.target.value / 20
	
}, false)

document.getElementById('hide').addEventListener('click', function( event ) {
	
	animateSettings()
	
}, false)

document.addEventListener('keydown', function(event) {
	
	if (event.key.toLowerCase() === 'h') {
		
		animateSettings()
	
	}
  
	if (event.key.toLowerCase() === 'r') {
		
		controls.autoRotate = rotating
		
		document.getElementById('autoRotate').checked = rotating
		
		rotating = !rotating	

	}
	
	if (event.key.toLowerCase() === 'm') {
				
		remap()
		
	}

});

document.addEventListener('coloris:pick', event => {
	
	const pickerID = event.detail.currentEl.id
	
	let rgb = event.detail.color
	
	switch(pickerID) {
		
		case 'keysColour':
		
			setKeyColour(rgb)
			
			foregroundColour = rgb
			
			for(let x = 0; x < midiInputs.length; x++){
			
				//find key
				let ob = cubeCollectionGroup.getObjectByName(midiInputs[x])
				
				ob.material.color.setRGB(keys.colours.red, keys.colours.green, keys.colours.blue)				

			}
	
			break
		
		case 'KeysExpressionColour':
			
			setKeyExpressionColour(rgb)
			
			break
		
		case 'backgroundColour':
		
			scene.background = new THREE.Color(rgb)
			
			backgroundColour = rgb
		
			break
		
		default:
		
			break
		
	}
  
})

window.addEventListener('resize', function(){
	
	camera.aspect = window.innerWidth / window.innerHeight

	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio(window.devicePixelRatio)
	
})