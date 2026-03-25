import React, { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Edges, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PUBLIC_REPOS = [
  { owner: "facebook", repo: "react" }, { owner: "vercel", repo: "next.js" },
  { owner: "tailwindlabs", repo: "tailwindcss" }, { owner: "torvalds", repo: "linux" },
  { owner: "microsoft", repo: "vscode" }, { owner: "freeCodeCamp", repo: "freeCodeCamp" },
  { owner: "twbs", repo: "bootstrap" }, { owner: "angular", repo: "angular" },
  { owner: "ant-design", repo: "ant-design" }, { owner: "mui", repo: "material-ui" },
  { owner: "storybookjs", repo: "storybook" }, { owner: "grafana", repo: "grafana" },
  { owner: "elastic", repo: "elasticsearch" }, { owner: "supabase", repo: "supabase" },
  { owner: "kubernetes", repo: "kubernetes" }, { owner: "docker", repo: "docker" },
  { owner: "ansible", repo: "ansible" }, { owner: "django", repo: "django" },
  { owner: "laravel", repo: "laravel" }, { owner: "prettier", repo: "prettier" },
  { owner: "eslint", repo: "eslint" }, { owner: "webpack", repo: "webpack" },
  { owner: "vitejs", repo: "vite" }, { owner: "facebook", repo: "react-native" },
  { owner: "nodejs", repo: "node" }, { owner: "denoland", repo: "deno" },
  { owner: "vuejs", repo: "vue" }, { owner: "sveltejs", repo: "svelte" },
  { owner: "remix-run", repo: "remix" }, { owner: "nestjs", repo: "nest" }
];

const Building = ({ position, args, data, isMajor, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Only highly major reps get a permanent glowing tooltip, 
  // others show on hover to avoid chaos.
  const showTooltip = isMajor || hovered;

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover?.(data);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover?.(null);
        }}
      >
        <boxGeometry args={args} />
        <meshStandardMaterial 
            color={hovered ? "#3b82f6" : (isMajor ? "#27272a" : "#18181b")} // Major buildings are slightly lighter
            roughness={0.2}
            metalness={0.8}
            emissive={hovered ? "#3b82f6" : "#000000"}
            emissiveIntensity={hovered ? 0.3 : 0}
        />
        {/* Subtle edges emphasizing structure */}
        <Edges 
          linewidth={1} 
          threshold={15} 
          color={hovered ? "#93c5fd" : (isMajor ? "#52525b" : "#3f3f46")} 
        />
      </mesh>

      {/* Billboard label for top repos */}
      {showTooltip && (
        <Html position={[0, args[1] / 2 + (isMajor ? 1.5 : 0.8), 0]} center pointerEvents="none" zIndexRange={[100, 0]}>
          <div className={`backdrop-blur-md rounded-lg flex flex-col items-center animate-in fade-in transition-all px-3 py-1.5 min-w-max border
            ${isMajor && !hovered ? 'bg-[#18181b]/80 border-[#3f3f46] shadow-xl scale-100' : ''}
            ${hovered ? 'bg-[#09090b]/90 border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-110' : ''}
            ${!isMajor && !hovered ? 'hidden' : ''}
          `}>
             <div className="flex items-center space-x-1.5 mb-0.5">
               {isMajor && !hovered && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>}
               {hovered && <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse"></div>}
               <span className={`text-[9px] font-bold tracking-widest uppercase leading-none ${hovered ? 'text-[#93c5fd]' : 'text-[#a1a1aa]'}`}>
                 {data.owner}
               </span>
             </div>
             <span className={`text-[14px] font-[900] leading-none tracking-tight ${hovered ? 'text-white' : 'text-[#e4e4e7]'}`}>
               {data.repo}
             </span>
          </div>
          {/* Stem connector */}
          {isMajor && <div className={`w-px h-6 mx-auto ${hovered ? 'bg-gradient-to-t from-transparent to-[#3b82f6]' : 'bg-gradient-to-t from-transparent to-[#3f3f46]'}`}></div>}
        </Html>
      )}
    </group>
  );
};

const City = ({ onHoverBuilding }) => {
  const gridCount = 24; // Large area
  const spacing = 3.5; // Spread out so labels don't bunch up

  const buildings = useMemo(() => {
    const temp = [];
    for (let x = -gridCount / 2; x < gridCount / 2; x++) {
      for (let z = -gridCount / 2; z < gridCount / 2; z++) {
        const hash = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);
        
        // Ensure some roads
        if (Math.abs(x) % 6 === 0 || Math.abs(z) % 6 === 0) continue;
        if (rand > 0.3) { 
          // 4% of buildings are MAJOR and will hold permanent labels of top repos
          const isMajor = rand > 0.96;
          
          let height;
          if (isMajor) height = rand * 30 + 15; // Tall skyscrapers
          else if (rand > 0.8) height = rand * 12 + 6; // Mid
          else height = rand * 5 + 2; // Short
          
          let width = (isMajor ? 2.0 : 1.2) + (rand * 1.5);
          
          const posX = x * spacing + (rand - 0.5) * 1.5;
          const posZ = z * spacing + (rand - 0.5) * 1.5;
          
          const repoData = PUBLIC_REPOS[Math.floor(rand * PUBLIC_REPOS.length)];

          temp.push({
            id: `${x}-${z}`,
            position: [posX, height / 2, posZ],
            args: [width, height, width],
            data: repoData,
            isMajor: isMajor
          });
        }
      }
    }
    return temp;
  }, []);

  return (
    <group>
      {buildings.map((b) => (
        <Building key={b.id} {...b} onHover={onHoverBuilding} />
      ))}
      <gridHelper args={[150, 60, "#27272a", "#18181b"]} position={[0, -0.01, 0]} />
    </group>
  );
};

const CityScene = () => {
  const [hoveredData, setHoveredData] = useState(null);

  return (
    <div className="absolute inset-0 w-full h-full z-[0]">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [70, 60, 70], fov: 30 }} // Perfectly aimed isometric perspective
      >
        <color attach="background" args={['#000000']} />
        
        {/* Robust OrbitControls ensures it ALWAYS points right at the city */}
        <OrbitControls 
          makeDefault 
          target={[0, 0, 0]} 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2.5} 
          minPolarAngle={Math.PI / 3} 
        />

        <fog attach="fog" args={['#000000', 60, 180]} />
        
        {/* Clean, high-end illumination */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[40, 80, 20]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-40, 30, -40]} intensity={1} color="#60a5fa" />
        <pointLight position={[0, 40, 0]} intensity={1.5} color="#3b82f6" distance={100} />

        <City onHoverBuilding={setHoveredData} />
      </Canvas>
      {/* Heavy vignette to smoothly fade the edges into black */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_100%)] pointer-events-none"></div>
    </div>
  );
};

export default CityScene;
