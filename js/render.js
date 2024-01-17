import * as THREE from '/js/threejs/three.module.js'

import { OrbitControls } from '/js/threejs/OrbitControls.js'

let clock,header,highNote,lowNote,dialogMixer,fontMixer,newKnob,searchKnob,knobID,synthDevice,meshCount,p,p2,infoBox

class splashMesh {
	
	constructor(mesh,mixer,clip) {
		
		this.mesh = mesh
		
		this.mixer = mixer
		
		this.clip = clip
	
	}
	
}

class knob {
	
	constructor(id,setting,value) {
		
		this.id = id
		
		this.setting = setting
	
	}
	
}

const keys = {
	
	attack: 0.05,
	decay: 0.3,
	sustain: 0.5,
	release: 0.18,
	
	colours: {
		
		red: 1,
		green: 1,
		blue: 1,
		
		expression: {
			
			red:1,
			green:1,
			blue:1
			
		}
		
	}

}

class keyAnimation {
	
	constructor(key, riseMixer,riseClip) {
		
		this.key = key
		
		this.riseMixer = riseMixer
		
		this.riseClip = riseClip
		
		this.deallocate = function(mixer,clip) {
			
			mixer.uncacheClip(clip)
			
			mixer.uncacheAction(clip)
		
		}

	}
	
	assignRiseMixer(mixer,clip) {
	
		this.riseMixer = mixer
		
		this.riseClip = clip
		
	}
	
	assignFallMixer(mixer,clip) {
	
		this.fallMixer = mixer
		
		this.fallClip = clip
		
	}
	
	assignSparkMixer(mixer,clip) {
		
		if(this.sparkClip != undefined && this.sparkClip.isRunning()) {
			
			if(this.sparkClip2 != undefined && this.sparkClip2.isRunning()) {
				
				if(this.sparkClip3 != undefined && this.sparkClip3.isRunning()) {
					
					if(this.sparkClip4 != undefined && this.sparkClip4.isRunning()) {
						
						if(this.sparkClip5 != undefined && this.sparkClip5.isRunning()) {
							
							if(this.sparkClip6 != undefined && this.sparkClip6.isRunning()) {
								
								if(this.sparkClip7 != undefined && this.sparkClip7.isRunning()) {
									
									this.deallocate(this.sparkMixer7,this.sparkClip7)
							
									this.sparkClip8 = clip
									
									this.sparkMixer8 = mixer
									
								} else {
									
									this.deallocate(this.sparkMixer6,this.sparkClip6)
							
									this.sparkClip7 = clip
									
									this.sparkMixer7 = mixer
									
								}
								
							}
							
							else {
								
								this.deallocate(this.sparkMixer5,this.sparkClip5)
							
								this.sparkClip6 = clip
								
								this.sparkMixer6 = mixer
								
							}
						
						} else {
							
							this.deallocate(this.sparkMixer4,this.sparkClip4)
							
							this.sparkClip5 = clip
							
							this.sparkMixer5 = mixer
							
						}
					
					} else {
						
						this.deallocate(this.sparkMixer3,this.sparkClip3)
						
						this.sparkClip4 = clip
						
						this.sparkMixer4 = mixer
						
					}
				
				} else {
					
					this.deallocate(this.sparkMixer2,this.sparkClip2)
					
					this.sparkClip3 = clip
				
					this.sparkMixer3 = mixer
					
				}
			
			} else {
				
				this.deallocate(this.sparkMixer,this.sparkClip)
			
				this.sparkClip2 = clip
			
				this.sparkMixer2 = mixer
				
			}
			
		} else {
			
			this.sparkClip = clip
			
			this.sparkMixer = mixer
			
		}
	}
	
}

const colourSchemes = [
	['rgb(189, 157, 86)','rgb(38, 0, 255)','rgb(134, 45, 45)'],
	['rgb(0,0,39)','rgb(255,255,255)','rgb(255, 202, 96)'],

]

const tipsArray = [
	'You can control the camera position by clicking and dragging the mouse',
	'To zoom in and out of a scene use the mousewheel',
	'There are 3 colour pickers to allow full customisation of the keys and background',
	'You can map sliders or knobs to ADSR (Attack, Decay, Sustain, Release), Auto Rotate, Key Smoke or Remap',
	'<u>Keyboard Shortcuts</u><br><br>H - Toggle Settings view<br>R - Toggle <b>Auto Rotate</b><br>M - Toggle <b>Remap MIDI Device</b>',
	'For feedback or bespoke projects enquiries message through the links below'
]

//defaults

let midiInputs = []

let knobs = []

let splashMeshs = []

let keyAnimations = []

let hidden = false

let keysMapped = false

let rotating = true

let keySmoke = true

let notesPlayed = 0

const cubeY = -15

let tipsI = 1

// Set up scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 300 )

camera.position.x = 0
camera.position.y = 0
camera.position.z = 30

let cubeCollectionGroup = new THREE.Object3D()

const colourFamily = colourSchemes[parseInt(Math.random() * colourSchemes.length)]

let backgroundColour = colourFamily[0]

let expressionColour = colourFamily[1]

let foregroundColour = colourFamily[2]

//set Coloris pickers to random colours
document.getElementById('keysColour').value = foregroundColour

document.getElementById('KeysExpressionColour').value = expressionColour

document.getElementById('backgroundColour').value = backgroundColour

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
	
	animate()
	
	createTips(tipsI)
	
	header = document.createElement('h1')
			
	header.style.color = foregroundColour
	
	let headerText = document.createTextNode('What device are you using?') 
	
	header.append(headerText)
	
	document.getElementById('deviceType').prepend(header)
	
	setStyle(foregroundColour,expressionColour,backgroundColour)
			
	document.getElementById('deviceType').style.display = 'none'
	
	infoBox = document.getElementById('socials')
	
	document.body.append(infoBox)
	
	infoBox.id = 'infoBox'
	
	if(window.innerWidth > window.innerHeight) {
		
		p = document.createElement('p')

		p.id = 'infoText'
		
		p.style.color = '#ffcd08'
		
		const pText = document.createTextNode('Connect a MIDI device to your computer and play to get started.') 

		p.append(pText)

		infoBox.prepend(p)
		
		generateSplash(7)
		
		
	} else {
		
		generateSplash(6)
		
		let p = document.createElement('p')

		p.id = 'infoText'
		
		let pText = document.createTextNode('It is not currently supported on mobile, however demos can be found in the links below.') 

		p.append(pText)

		infoBox.prepend(p)

	}
	
	p2 = document.createElement('p')

	p2.id = 'infoText'

	let p2Text = document.createTextNode('GIDI is a free, open source web application for musicians (combining MIDI and ThreeJS) to provide augmentation of a live performance.')

	p2.append(p2Text)

	infoBox.prepend(p2)
	
})

// Listen to MIDI
navigator.requestMIDIAccess().then(function(midiAccess) {
	
	const inputs = midiAccess.inputs.values()
	
	for (let input = inputs.next(); input && !input.done; input = inputs.next()) {

		input.value.onmidimessage = function(event) {
			
			if(notesPlayed == 0) {
								
				p.innerHTML = 'MIDI device connected'
				
				p.style.color = '#6fff6f'
				
				const startButton = document.createElement('button')
				
				startButton.id = 'start'
				
				const buttonText = document.createTextNode('Start')
				
				startButton.append(buttonText)
				
				infoBox.append(startButton)
				
				startButton.onclick = function() {
					
					p.remove()
					
					p2.remove()
					
					for(let i = 0; i < document.getElementsByTagName('img').length;i++) {
						
						document.getElementsByTagName('img')[i].style.display = 'inline-block'
						
					}
					
					startButton.remove()
					
					removeSplash(cubeCollectionGroup)  
						
					scene.remove(cubeCollectionGroup)	
						
					infoBox.id = 'socials'
					
					document.getElementById('deviceType').style.display = 'block'
				
					Coloris({
						theme:'polaroid',
						themeMode: 'dark',
						alpha:false,
						format:'rgb',
						
					})
					
					controls.autoRotate = false
					
					controls.enableZoom = true
					
					document.getElementById('settings').append(infoBox)
					
					infoBox.style.display = 'inline-block'
					
				}
				
				notesPlayed++
				
			}
			
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
									
									case 1:
																													
										header.innerHTML = 'Now press the highest key you will use'
										
										lowNote = note
											
										break
									
									case 2:
										
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
							
							if(notesPlayed == 1) {
								
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
														
								newKnob = new knob(status, ' - Select - ','0')
								
								searchKnob = newKnob
								
								activeKnob = newKnob
													
								knobs.push(newKnob)
								
								knobID = newKnob.id

								createKnob(knobID)
								
								break
							
							} 
							
							const value = Math.floor((velocity / 127) * 10)
							
							if(activeKnob.setting == 'Autorotate') {
								
								let autoRotateText
								
								if(!rotating == true) {
									
									autoRotateText = 'On'
									
								} else {
									
									autoRotateText = 'Off'
									
								}
								
								document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = autoRotateText
								
								
							} else if(activeKnob.setting == 'Keysmoke'){
								
								let smokeText
								
								if(keySmoke == true) {
									
									smokeText = 'On'
									
								} else {
									
									smokeText = 'Off'
									
								}
								
								document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = smokeText
								
							}	else {
								
								document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = value
								
							}	
							
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
									
									case 'Keysmoke':
									
										if(value == 10) {
										
											document.getElementById('keySmoke').checked = !keySmoke
										
											keySmoke = !keySmoke
										
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
	
	const currentKey = keyAnimations.find(element => element.key == key)
	
	//if note falling and note needs to rose halt/end key rise
	if(currentKey != undefined && currentKey.fallClip.isRunning()) {
				
		currentKey.fallClip.stop()
	
	}
		
	const amplify = (Math.floor((velocity / 127) * 3) + keys.sustain) * 3
		
	const [keyMixer, keyClip] = animateNoteOn(mesh,amplify,cubeY)
		
	if(currentKey == undefined) {
		
		let animation = new keyAnimation(key,keyMixer,keyClip)
		
		animation.assignRiseMixer(keyMixer,keyClip)
		
		keyAnimations.push( animation )
		
	} else {
		
		let index = keyAnimations.findIndex(element => element.key == key)

		keyAnimations[index].assignRiseMixer(keyMixer,keyClip)
		
	}
	
}

function noteOff(mesh,key,velocity){
	
	const currentKey = keyAnimations.find(element => element.key == key)
	
	const index = keyAnimations.findIndex(element => element.key == key)
	
	const amplify = (Math.floor((velocity / 127) * 3) + 0.75) * 3
		
	//if note rising and note needs to fall halt/end key rise
	if(currentKey != undefined && currentKey.riseClip.isRunning()) {
	
		currentKey.riseClip.halt(0.025)
		
		const [sparkMixer, sparkClip] = animateSparks(mesh,velocity,cubeY,amplify)
		
		if(keySmoke && index > -1) {
			
			keyAnimations[index].assignSparkMixer(sparkMixer,sparkClip)
			
		}
		
	}
	
	const [keyMixer, keyClip] = animateNoteOff(mesh,velocity,amplify)
		
	if(index > -1) {
		
		keyAnimations[index].assignFallMixer(keyMixer,keyClip)
	
	}
	
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

		const material = new THREE.MeshStandardMaterial( {color:boxColour,emissive: boxColour,emissiveIntensity:0.1} )
			
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
	camera.position.x = -midiInputs.length * 15
	camera.position.y = midiInputs.length * 15
	camera.position.z = midiInputs.length * 15

	controls.update()

}

function animateNoteOn(mesh,amplify,cubeY) {
	
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
		keys.colours.red + keys.colours.expression.red / 2, keys.colours.green + keys.colours.expression.green / 2, keys.colours.blue + keys.colours.expression.blue / 2,
		keys.colours.expression.red, keys.colours.expression.green, keys.colours.expression.blue
	]
	
	const cubeIncrease = new THREE.VectorKeyframeTrack( '.position', times, meshPosition )
	
	const cubeScale = new THREE.VectorKeyframeTrack( '.scale', times, meshScale )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', times, meshColours)
	
	const cubeClip = new THREE.AnimationClip( 'rise', -1, [ cubeIncrease, cubeScale, colorSweep] )
	
	let keyMixer = new THREE.AnimationMixer( mesh )
	
	let keyClip = keyMixer.clipAction( cubeClip )
		
	keyClip.clampWhenFinished = true
	
	keyClip.setLoop(THREE.LoopOnce)
	
	keyClip.play()
	
	return [keyMixer, keyClip]
	
}

function animateNoteOff(mesh,velocity,amplify) {
		
	const cubePosition = new THREE.VectorKeyframeTrack( '.position', [ 0, keys.release ], [ mesh.position.x, mesh.position.y, mesh.position.z, mesh.position.x, cubeY, mesh.position.z] )
	
	const cubeScale = new THREE.VectorKeyframeTrack( '.scale', [ 0, keys.release ], [ mesh.scale.x, mesh.scale.y, mesh.scale.z, mesh.scale.x, 1, mesh.scale.z] )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [ 0, keys.release ], [ keys.colours.expression.red, keys.colours.expression.green, keys.colours.expression.blue, keys.colours.red,keys.colours.green,keys.colours.blue])
	
	const cubeClip = new THREE.AnimationClip( 'fall', -1, [ cubePosition, cubeScale, colorSweep] )
	
	let keyMixer = new THREE.AnimationMixer( mesh )
				
	let keyClip = keyMixer.clipAction( cubeClip )
		
	keyClip.clampWhenFinished = true
	
	keyClip.setLoop(THREE.LoopOnce)
	
	keyClip.play()
	
	return [keyMixer, keyClip]
	
}

function animateSparks(mesh,velocity,cubeY,amplify){
	
	let spark = createSpark(mesh,cubeY,amplify)
	
	const sparkTimes = [
	
		0, 
		keys.attack * 2, 
		keys.attack + keys.decay * 2
	
	]
	
	const sparkPosition = [
	
		spark.position.x, cubeY + (amplify / 2) - 0.75 + 10, spark.position.z, 
		spark.position.x, cubeY + (amplify / 2) - 0.75 + 13, spark.position.z,
		spark.position.x, cubeY + (amplify / 2) - 0.75 + 17, spark.position.z
	
	]
	
	const sparkScaleDecrease = [
	
		spark.scale.x, spark.scale.y, spark.scale.z,
		spark.scale.x, spark.scale.y, spark.scale.z,
		spark.scale.x, 0, 0
	
	]
	
	const opacityKeyframes = [
		
		(127 / velocity) / 2,
		(127 / (velocity / 1.5) / 2),
		0
	
	]
	
	const meshColours = [
	
		keys.colours.red, keys.colours.green, keys.colours.blue, 
		keys.colours.red + keys.colours.expression.red / 2, keys.colours.green + keys.colours.expression.green / 2, keys.colours.green + keys.colours.expression.blue / 1.5,
		keys.colours.expression.red, keys.colours.expression.green , keys.colours.expression.blue
	]
	
	const sparkIncrease = new THREE.VectorKeyframeTrack( '.position', sparkTimes, sparkPosition )
	
	const disappear = new THREE.KeyframeTrack('.material.opacity', sparkTimes, opacityKeyframes )
	
	const sparkScale = new THREE.VectorKeyframeTrack( '.scale', sparkTimes, sparkScaleDecrease )
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', sparkTimes, meshColours)
	
	const sparksClip = new THREE.AnimationClip( 'spark', -1, [ sparkIncrease, colorSweep, disappear, sparkScale ] )
	
	let sparkMixer = new THREE.AnimationMixer( spark )
	
	let sparkClip = sparkMixer.clipAction( sparksClip )
	
	if(keySmoke) {

		sparkClip.clampWhenFinished = true
		
		sparkClip.setLoop(THREE.LoopOnce)
		
		sparkClip.play()
	
	}
	
	return [sparkMixer,sparkClip]
	
}


function createSpark(mesh) {
	
	let keyGeometry = new THREE.BoxGeometry(0.5,1,5)
	
	const boxColour = new THREE.Color(keys.colours.expression.red, keys.colours.expression.green, keys.colours.expression.blue)

	const material = new THREE.MeshStandardMaterial( { color: boxColour, emissive: boxColour,emissiveIntensity:0.3} )

	let spark = new THREE.Mesh(keyGeometry, material)
	
	spark.material.transparent = true
					
	spark.position.x = mesh.position.x
	
	spark.position.y = 1000
	
	spark.position.z = 0
	
	cubeCollectionGroup.add(spark)
	
	return spark
	
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
			
	notesPlayed = 1
	
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
	
	setStyle(foregroundColour,expressionColour,backgroundColour)
	
}

function setStyle(foregroundColour,expressionColour,backgroundColour) {
	
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
	
	setKeyExpressionColour(expressionColour)
}

function setKeyColour(rgb) {
		
	rgb = rgb.slice(4).replace(')','').split(',')
	
	keys.colours.red = rgb[0] / 255
	
	keys.colours.green = rgb[1] / 255
	
	keys.colours.blue = rgb[2] / 255
	
}

function setKeyExpressionColour(rgb) {
	
	console.log(rgb)
	
	let rgbSplit = rgb.slice(4).replace(')','').split(',')
			
	keys.colours.expression.red = rgbSplit[0] / 255

	keys.colours.expression.green = rgbSplit[1] / 255

	keys.colours.expression.blue = rgbSplit[2] / 255
			
}

function generateSplash(iterations) {
	
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
	
	let limit = iterations
	
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

function removeSplash(cubeCollectionGroup) {
	
	//remove cubes from scene, deallocate all
	for(let i = 0; i < splashMeshs.length; i++) {
		
		var selectedCube = splashMeshs[i]
			
		cubeCollectionGroup.remove( selectedCube.mesh )
		
		selectedCube.mesh.geometry.dispose()
		
		selectedCube.mesh.material.dispose()
		
		selectedCube.clip.stop()
		
		selectedCube.mixer.stopAllAction()
		
		selectedCube.mixer.uncacheClip(selectedCube.clip)
		
		selectedCube.mixer.uncacheAction(selectedCube.clip)
		
	}
		
	splashMeshs = []
	
}

function recursionKeyframe(mesh,x,y,z,i,r,g,b,step,width,iteration,limit){
	
	let currentTime = i / 100
	
	currentTime += 2

	let rE = r + 0.6

	let gE =  g + 0.3

	let bE = b - 0.2
	
	const colorSweep = new THREE.ColorKeyframeTrack( '.material.color', [  currentTime, currentTime  + 0.165, currentTime  + 10], [ r,g,b, rE, gE, bE, r, g, b])

	const cubeScale = new THREE.AnimationClip( 'cubePS', -1, [ colorSweep] )
	
	let mixer = new THREE.AnimationMixer( mesh )
	
	let clip = mixer.clipAction( cubeScale )
	
	clip.play()
	
	splashMeshs.push( new splashMesh(mesh,mixer,clip) )
	
}

function createTips(tipsI) {
	
	const tips = document.getElementById('tips')
		
	window.setInterval(function() { 
	
		tips.classList.toggle('disappear')
		
		window.setTimeout(function() { 
		
			tips.classList.toggle('disappear')
			
			tips.innerHTML = tipsArray[tipsI]
			
		}, 500)
		
		if(tipsI < tipsArray.length - 1) {
			
			tipsI++
			
		} else {
			
			tipsI = 0
			
		}

	}, 10000)
	
}

function animate() {

	const delta = clock.getDelta()
	
	for(let x = 0; x < keyAnimations.length; x++){ 
		
		if(keyAnimations[x].riseClip != undefined){
			
			keyAnimations[x].riseMixer.update( delta )
		
		}
		
		if(keyAnimations[x].fallClip != undefined){
			
			keyAnimations[x].fallMixer.update( delta )
			
		}
		
		if(keyAnimations[x].sparkClip != undefined){

			keyAnimations[x].sparkMixer.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip2 != undefined){

			keyAnimations[x].sparkMixer2.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip3 != undefined){

			keyAnimations[x].sparkMixer3.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip4 != undefined){

			keyAnimations[x].sparkMixer4.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip5 != undefined){

			keyAnimations[x].sparkMixer5.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip6 != undefined){

			keyAnimations[x].sparkMixer6.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip7 != undefined){

			keyAnimations[x].sparkMixer7.update( delta )
		
		}
		
		if(keyAnimations[x].sparkClip8 != undefined){

			keyAnimations[x].sparkMixer8.update( delta )
		
		}
		
	}
	
	for(let x = 0; x < splashMeshs.length; x++){ 
		
		if(splashMeshs[x].clip != undefined){

			splashMeshs[x].mixer.update( delta )
		
		}
	
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
		
		if(searchKnob.setting == 'Autorotate') {
								
			let autoRotateText
			
			if(!rotating == true) {
				
				autoRotateText = 'On'
				
			} else {
				
				autoRotateText = 'Off'
				
			}
			
			document.getElementsByName('knob' + searchKnob.id)[0].innerHTML = autoRotateText
			
			
		} else if(searchKnob.setting == 'Keysmoke'){
			
			let smokeText
			
			if(keySmoke == true) {
				
				smokeText = 'On'
				
			} else {
				
				smokeText = 'Off'
				
			}
			
			document.getElementsByName('knob' + searchKnob.id)[0].innerHTML = smokeText
			
		}	else {
			
			document.getElementsByName('knob' + searchKnob.id)[0].innerHTML = document.getElementById(this.value.toLowerCase()).value
			
		}	
	
	}
	
}, false)

document.getElementById('remap').addEventListener('click', function( event ) {
	
	animateSettings()
	
	remap()
	
}, false)

document.getElementById('autoRotate').addEventListener('change', function( event ) {
	
	controls.autoRotate = event.target.checked
	
	rotating = !rotating
	
	let activeKnob = knobs.find((element) => element.setting == 'Autorotate')
	
	if(activeKnob != undefined) {
		
		let autoRotateText
		
		if(!rotating == true) {
			
			autoRotateText = 'On'
			
		} else {
			
			autoRotateText = 'Off'
			
		}
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = autoRotateText
		
	}
	
}, false)

document.getElementById('keySmoke').addEventListener('change', function( event ) {
	
	keySmoke = event.target.checked
	
	let activeKnob = knobs.find((element) => element.setting == 'Keysmoke')
	
	if(activeKnob != undefined) {
		
		let smokeText
	
		if(keySmoke == true) {
			
			smokeText = 'On'
			
		} else {
			
			smokeText = 'Off'
			
		}
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = smokeText
	
	}
		
}, false)

document.getElementById('attack').addEventListener('input', function( event ) {
	
	keys.attack = event.target.value / 20
	
	const activeKnob = knobs.find((element) => element.setting == 'Attack')
	
	if(activeKnob != undefined) {
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = event.target.value
		
	}
	
}, false)

document.getElementById('decay').addEventListener('input', function( event ) {
		
	keys.decay = (parseInt(event.target.value) + 1) / 20
	
	const activeKnob = knobs.find((element) => element.setting == 'Decay')
	
	if(activeKnob != undefined) {
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = event.target.value 
		
	}
	
}, false)

document.getElementById('sustain').addEventListener('input', function( event ) {
	
	keys.sustain = event.target.value / 20
	
	const activeKnob = knobs.find((element) => element.setting == 'Sustain')
	
	if(activeKnob != undefined) {
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = event.target.value 
	
	}
	
}, false)

document.getElementById('release').addEventListener('input', function( event ) {
	
	keys.release = event.target.value / 20
	
	const activeKnob = knobs.find((element) => element.setting == 'Release')
	
	if(activeKnob != undefined) {
		
		document.getElementsByName('knob' + activeKnob.id)[0].innerHTML = event.target.value 
	
	}
	
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
			
			expressionColour = rgb
			
			setKeyExpressionColour(expressionColour)
			
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