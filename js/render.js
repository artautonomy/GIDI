import * as THREE from '/js/threejs/three.module.js'

import { FontLoader } from '/js/threejs/FontLoader.js'

import { OrbitControls } from '/js/threejs/OrbitControls.js'

import { TextGeometry } from '/js/threejs/TextGeometry.js'

let clock,header,mappingHeader,highNote,lowNote,dialogMixer,fontMixer,newKnob,searchKnob,knobID,synthDevice

function knob(id,setting) {
	
    this.id = id;
    this.setting = setting;
	
}

const keys = {
	
	attack: 0.05,
	decay: 0,
	sustain: 0,
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

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 )

camera.position.x = 0
camera.position.y = 0
camera.position.z = 30

let cubeCollectionGroup = new THREE.Object3D()

const colourFamily = colourSchemes[parseInt(Math.random() * colourSchemes.length)]

let backgroundColour = colourFamily[0]

let foregroundColour = colourFamily[1]

setStyle(foregroundColour,backgroundColour)

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

const lightFloor = new THREE.PointLight( 0xffffff, lightIntensity, 0, 2)

lightFloor.position.set( 0, -15, 0)

scene.add( lightFloor )

//renderer

const renderer = new THREE.WebGLRenderer({antialias:true})

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.append(renderer.domElement)

clock = new THREE.Clock()

//controls default

const controls = new OrbitControls( camera, renderer.domElement )

controls.autoRotateSpeed *= -0.666

controls.maxDistance = 75

controls.minDistance = 20

controls.rotateSpeed = 0.333

document.addEventListener("DOMContentLoaded", function () {
	
	if(window.innerWidth <= window.innerHeight) {
		
		document.getElementById('deviceType').style.display = 'none'
		
		generateMappingDialog('GIDI')
		
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

		
	} else {
		
		Coloris({
			theme:'polaroid',
			themeMode: 'dark',
			alpha:false,
			format:'rgb',
		})
		
		generateTitle('What device are you using?')

		generateMappingDialog('range mapping')
	
	}
	
	animate()
})

// Listen to MIDI
navigator.requestMIDIAccess().then(function(midiAccess) {
	
	const inputs = midiAccess.inputs.values()
	
	for (let input = inputs.next(); input && !input.done; input = inputs.next()) {

		input.value.onmidimessage = function(event) {
		
			const status = event.data[0]
			
			const note = event.data[1]
			
			const velocity = event.data[2]
			
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
									
										scene.remove(header)
										
										generateTitle('Now press the highest key you will use')

										lowNote = note
											
										break
									
									case 1:
									
										scene.remove(header)
										
										scene.remove(mappingHeader)
										
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
							
							scene.remove(header)
							
							scene.remove(mappingHeader)
							
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
						
						if(activeKnob == undefined && velocity != undefined) {
												
							document.getElementById('knobsHelp').style.display = 'none'
													
							newKnob = new knob(status, ' - Select - ')
							
							searchKnob = newKnob
												
							knobs.push(newKnob)
							
							knobID = newKnob.id

							createKnob(knobID)
												
						} else if(velocity != undefined) {
																			
							const value = Math.floor((velocity / 127) * 10)
													
							document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = value
												
							switch(activeKnob.setting) {
										
									case 'Attack':
															
										document.getElementById('attack').value = value
																															
										keys.attack = value / 20
						
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
	
	let amplify = Math.floor((velocity / 127) * velocityRange) + 0.75
	
	amplify *= 3

	const cubePosition = new THREE.VectorKeyframeTrack( '.position', [ 0, keys.attack ], [ mesh.position.x, cubeY, mesh.position.z, mesh.position.x, cubeY + (amplify / 2), mesh.position.z] )
	
	const cubeScale = new THREE.VectorKeyframeTrack( '.scale', [ 0, keys.attack ], [ mesh.scale.x, 1, mesh.scale.z,mesh.scale.x, 1 + amplify, mesh.scale.z] )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [ 0, keys.attack ], [keys.colours.red, keys.colours.green, keys.colours.blue, keys.colours.red + keys.colours.expression.red, keys.colours.green + keys.colours.expression.green, keys.colours.blue + keys.colours.expression.blue])
	
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
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [ 0, keys.release ], [ keys.colours.red + keys.colours.expression.red,keys.colours.green + keys.colours.expression.green,keys.colours.blue + keys.colours.expression.blue, keys.colours.red,keys.colours.green,keys.colours.blue])
	
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
	
	if(notesPlayed < 1)
	{
		camera.position.x = -25
	}
	
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
			
	scene.remove(header)
	
	scene.remove(mappingHeader)
	
	generateMappingDialog('range mapping')
	
	notesPlayed = 0
	
	document.getElementById('autoRotate').checked = false
	
	rotating = !rotating
	
	controls.autoRotate = false
	
	scene.remove(cubeCollectionGroup)
	
	cubeCollectionGroup = new THREE.Object3D()
	
	if(synthDevice) {
		
		generateTitle('Press the lowest key you would like to map')
		
	} else {
		
		generateTitle('Play any pad')

	}
	
}

function animateSettings() {
	
	if(hidden) {
		
		document.getElementById('hide').innerHTML = '>'
				
		document.getElementById('settings').classList.toggle('hide')


	} else {
		
		document.getElementById('hide').innerHTML = '<'
		
		document.getElementById('settings').style.display = 'block'

		document.getElementById('settings').classList.toggle('hide')
		

	}

	hidden = !hidden
	
	setStyle(foregroundColour,backgroundColour)
	
}

function setStyle(foregroundColour,backgroundColour) {
	
	for(let x = 0; x < document.getElementsByClassName('buttons').length; x++) {

		document.getElementsByTagName('button')[x].style.backgroundColor = foregroundColour
		
		document.getElementsByTagName('button')[x].style.color = backgroundColour
	}
	
	document.getElementById('remap').style.backgroundColor = backgroundColour

	document.getElementById('remap').style.color = foregroundColour	
	
	document.getElementById('mapToOption').style.backgroundColor = backgroundColour

	document.getElementById('mapToOption').style.color = foregroundColour	
	
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

function generateTitle(words) {
	
	const loader = new FontLoader()
	
	//1278
	
	//let fontSize = 3
	
	
	let fontSize = window.innerWidth / (words.length * 100)
	
	loader.load('/js/fonts/Patua One_Regular.json', function ( font )
	{
		
		const matLite = new THREE.MeshBasicMaterial(
		{
			color: foregroundColour,
			transparent: true,
			opacity: 0,
			side: THREE.FrontSide,
			
			
		  
		} );
		
		const fontGeometry = new TextGeometry(words, {
			font: font,
			size: fontSize,
			height: 0.3,
			curveSegments: 50,
				
		} );
		
		fontGeometry.computeBoundingBox()

		const xMid = - 0.5 * ( fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x )
			
		fontGeometry.translate( xMid, 8, 0 )
			
		header = new THREE.Mesh( fontGeometry, matLite )
		
		header.position.z = -60
		
		controls.target.set( header.position.x,header.position.y,header.position.z )
		
		controls.update()
			
		scene.add(header)
		
		const appear = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 0.1, 0.5], [ 0, 0, 1] )
			
		const fontFade = new THREE.AnimationClip( 'fontAppear', -1, [ appear ] )
		
		fontMixer = new THREE.AnimationMixer( header )
		
		const clipFont = fontMixer.clipAction( fontFade )
		
		clipFont.setLoop(THREE.LoopOnce)
		
		clipFont.clampWhenFinished = true
		
		clipFont.play()
	
	}); 
		
}

function generateMappingDialog(words) {
	
	const loader = new FontLoader()
	
	//1278
	
	let fontSize = window.innerWidth / (words.length * 5)
	
	loader.load('/js/fonts/Libre39Text_Regular.json', function ( font )
	{
		
		const matLite = new THREE.MeshNormalMaterial(
		{

			transparent: false,
			opacity: 1,
			side: THREE.FrontSide,
			
			
		  
		} );
		
		const fontGeometry = new TextGeometry(words, {
			font: font,
			size: fontSize,
			height: 3.33,
			curveSegments: 50,
				
		} );
		
		fontGeometry.computeBoundingBox()

		const xMid = - 0.5 * ( fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x )
			
		fontGeometry.translate( xMid, 8, 0 )
			
		mappingHeader = new THREE.Mesh( fontGeometry, matLite )
		
		mappingHeader.position.z = -350
		
		mappingHeader.position.y = 90
		
		mappingHeader.rotation.y = 0.2
		
		scene.add(mappingHeader)
		
		const times = [0, 8, 10, 12]
		
		const xAxis = new THREE.Vector3(1, 0, 0);
		
		const r1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
		
		const r2 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
		
		const r3 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI - 0.2)
		
		const r4 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
		
		const values = [
		
		  r1.x + 0.333, r1.y, r1.z, r1.w,
		  r2.x - 0.1, r2.y, r2.z, r2.w,
		  r3.x + 0.01, r3.y, r3.z, r3.w,
		  r4.x + 0.333, r4.y, r4.z, r4.w

		  
		];

		const dialogPosition = new THREE.QuaternionKeyframeTrack( '.quaternion', times, values )
		
		dialogMixer = new THREE.AnimationMixer( mappingHeader )
		
		const dialogClip = new THREE.AnimationClip( 'dialog', -1, [ dialogPosition ] )
		
		const clipDialog = dialogMixer.clipAction( dialogClip )
		
		clipDialog.play()
		
	}); 
		
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
	
	document.getElementById('deviceType').style.display = 'none'
	
	synthDevice = true
	
	scene.remove(header)
	
	generateTitle('Press the lowest key you will use')

}, false)

document.getElementById('pad').addEventListener('click', function( event ) {
		
	document.getElementById('deviceType').style.display = 'none'
	
	synthDevice = false
	
	scene.remove(header)
	
	scene.remove(mappingHeader)
	
	generateTitle('To get started play any pad')
	
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
						
			mapInputs(midiInputs)
			
			foregroundColour = rgb
			
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