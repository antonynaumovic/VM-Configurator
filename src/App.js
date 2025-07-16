import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, ContactShadows, Environment, OrbitControls, useTexture } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import { N8AO, EffectComposer } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"
import { degToRad } from "three/src/math/MathUtils.js"

const state = proxy({
  current: null,
  items: { laces: "#fff", mesh: "#fff", caps: "#fff", inner: "#fff", sole: "#fff", stripes: "#fff", band: "#fff", patch: "#fff" },
})

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }} className="min-h-screen min-w-screen" dpr={[1, 1.5]} gl={{ antialias: true }}>
        <EffectComposer  disableNormalPass multisampling={4}>
          {/* <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} /> */}
        </EffectComposer>
        <color attach="background" args={['#161616']} />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <VolumeMaster scale={10}/>
        <Environment preset="studio" environmentRotation={[0, degToRad(60), 0]} />
        <ContactShadows position={[0, -0.8, 0]} opacity={1} scale={10} blur={1.5} far={0.8} />
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={true} enablePan={false} />
      </Canvas>
      <Picker />
    </>
  )
}

function VolumeMaster(props) {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("VM.glb")
  const [hovered, set] = useState(null)

  const powderCoatedMetalProps = useTexture({
    map: "textures/powdercoated-metal/PowderCoatedMetal_1_Color.png",
    normalMap: "textures/powdercoated-metal/PowderCoatedMetal_3_Normal.png",
    roughnessMap: "textures/powdercoated-metal/PowderCoatedMetal_4_Roughness.png",
    aoMap: "textures/powdercoated-metal/PowderCoatedMetal_5_AO.png",
  })

  const brushedAluminiumProps = useTexture({
    map: "textures/brushed-aluminium/BrushedAluminium_1_Color.png",
    normalMap: "textures/brushed-aluminium/BrushedAluminium_3_Normal.png",
    roughnessMap: "textures/brushed-aluminium/BrushedAluminium_4_Roughness.png",
    metalnessMap: "textures/brushed-aluminium/BrushedAluminium_6_Metalness.png",
    aoMap: "textures/brushed-aluminium/BrushedAluminium_5_AO.png",
  })

  const aluminiumProps = useTexture({
    map: "textures/aluminium/Aluminium_1_Color.png",
    normalMap: "textures/aluminium/Aluminium_3_Normal.png",
    roughnessMap: "textures/aluminium/Aluminium_4_Roughness.png",
    metalnessMap: "textures/aluminium/Aluminium_6_Metalness.png",
    aoMap: "textures/aluminium/Aluminium_5_AO.png",
  })

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  useEffect(() => {
    //const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    //const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    // if (hovered) {
    //   //document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
    //   //return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    //   return () => (document.body.style.cursor = "pointer")
    // } else {
    //   return () => (document.body.style.cursor = "auto")
    // }
  }, [hovered])

  materials["Black Powdercoated Steel"] = new THREE.MeshStandardMaterial({
    name: "Black Powdercoated Steel",
    color: "#111",
    ...powderCoatedMetalProps,
  })

  materials["Brushed Aluminium"] = new THREE.MeshStandardMaterial({
    name: "Brushed Aluminium",
    color: "#eee",
    ...brushedAluminiumProps,
    metalness: 1,
  })

  materials.Aluminium = new THREE.MeshStandardMaterial({
    name: "Aluminium",
    ...aluminiumProps,
    metalness: 1,
  })

  materials.Pots = new THREE.MeshStandardMaterial({
    name: "Pots",
    ...aluminiumProps,
    metalness: 1,
  })

  materials["Black Rubber"] = new THREE.MeshStandardMaterial({
    name: "Black Rubber",
    color: "#000",
    roughness: 0.8,
    metalness: 0.0,
  })

  materials["Black Plastic"] = new THREE.MeshStandardMaterial({
    name: "Black Plastic",
    color: "#000",
    roughness: 0.4,
    metalness: 0.0,
  })
  materials["White Plastic"] = new THREE.MeshStandardMaterial({
    name: "White Plastic",
    color: "#fff",
    roughness: 0.4,
    metalness: 0.0,
  })

  return (
    <group
      {...props}
      dispose={null}
      ref={ref}
      onPointerOver={(e) => (
        e.stopPropagation(),
        console.log(e.object.parent.name),
        set(e.object.parent.name.trim() == "" ? e.object.parent.name : e.object.name)
      )}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.parent.name.trim() == "" ? e.object.name : e.object.parent.name))}
      >
        
      <mesh name="Body" geometry={nodes.Stock_Body.geometry} material={materials["Black Powdercoated Steel"]} />
      <mesh
        name="Face Plate"
        geometry={nodes.Stock_Face_Plate.geometry}
        material={materials["Black Powdercoated Steel"]}
        position={[0.055, 0, 0]}
      />
      <mesh
        name="Back Plate"
        geometry={nodes.Stock_Back_Plate.geometry}
        material={materials["Black Powdercoated Steel"]}
        position={[-0.055, 0, 0]}
      />
      <mesh name="Potentiometers" geometry={nodes.Pots.geometry} material={materials.Pots} />
      <mesh name="Front Screws" geometry={nodes.Front_Screws.geometry} material={materials["Black Powdercoated Steel"]} />
      <mesh name="Rear Screws" geometry={nodes.Rear_Screws.geometry} material={materials["Black Powdercoated Steel"]} />
      <mesh name="USB C" geometry={nodes.USB_C_Screws.geometry} material={materials.Aluminium} />
      <group position={[-0.056, -0.005, 0]} name="USB C">
        <mesh name="USB C" geometry={nodes.USB_C_1.geometry} material={materials.Aluminium} />
        <mesh name="USB C" geometry={nodes.USB_C_2.geometry} material={materials["Black Rubber"]} />
      </group>
      <group name="Feet">
        <mesh name="Feet" geometry={nodes.Stock_Feet_1.geometry} material={materials["Brushed Aluminium"]} />
        <mesh name="Feet Rubber" geometry={nodes.Stock_Feet_2.geometry} material={materials["Black Rubber"]} />
      </group>
      <group name="Knobs">
        <mesh name="Stock Knobs White" geometry={nodes.Stock_Knobs_1.geometry} material={materials["White Plastic"]} />
        <mesh name="Stock Knobs Black" geometry={nodes.Stock_Knobs_2.geometry} material={materials["Black Plastic"]} />
      </group>
    </group>
  )
}

function Picker() {
  const snap = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      {/* <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} /> */}
      <h1 className="text-white">{snap.current}</h1>
    </div>
  )
}
