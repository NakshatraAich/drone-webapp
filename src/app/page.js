"use client"
import { useEffect, useState } from 'react';

const Card = ({ drone }) => {
  return (
    <div className="border-1 border-stone-900 p-4 rounded-lg shadow-lg text-stone-100 w-full">
      <h3 className="font-semibold">UID: {drone.uid}</h3>

      {/* Battery Level Bar */}
      <p className="mb-2">
        <span className="text-xs text-stone-500 font-medium">Battery Level:</span>
        <br />
        {Math.floor(drone.batteryLevel)}%
      </p>
      <div className="relative w-full h-2 bg-stone-700 rounded-full">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-emerald-500 transition-transform duration-300 ease-in-out"
          style={{ width: `${drone.batteryLevel}%` }}
        ></div>
      </div>

      {/* Current and Target Position */}
      <p className="mt-2">
        <span className="text-xs text-stone-500 font-medium">Current Position:</span > <br />
        x: {Math.floor(drone.currentPosition.x)}, y: {Math.floor(drone.currentPosition.y)}, z: {Math.floor(drone.currentPosition.z)}
      </p>
      <p>
        <span className="text-xs text-stone-500 font-medium">Target Position:</span > <br />
        x: {Math.floor(drone.targetPosition.x)}, y: {Math.floor(drone.targetPosition.y)}, z: {Math.floor(drone.targetPosition.z)}
      </p>

      {/* Drone Status and Circular Indicator */}
      <div className="flex flex-col w-full mt-2">
          <div className="text-xs text-stone-500 font-medium">Status:</div>
          <div className='flex flex-row gap-4 items-center'>
            <div>{drone.isInUse ? 'In Use' : 'Available'}</div>
            <div className={`w-2 h-2 rounded-full ${drone.isInUse ? 'bg-yellow-500' : 'bg-emerald-500'}`} ></div>      
          </div>
      </div>

      {/* Recharge Button */}
      <button 
      onClick={async () => {
        try {
          if(!drone.isInUse){
            const response = await fetch('http://192.168.173.201:3000/drone/recharge', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ uid: drone.uid }), // optional data
            });
          }else{
            console.log("Drone not available");
          }
          
    
          const result = await response.json();
          console.log('✅ Response:', result);
          alert(result.message);
        } catch (error) {
          console.error('❌ Error sending recharge request:', error);
        }
      }}
      className="w-full bg-emerald-600 p-3 text-sm rounded mt-4 transition-transform active:scale-[93%] duration-300 ease-in-out font-medium">
        Recharge
      </button>
    </div>
  );
};


export default function Home() {
  
  const [droneData, setDroneData] = useState([]);

  useEffect(() => {
    const fetchDroneData = async () => {
      try {
        const response = await fetch('http://192.168.173.201:3000/drone/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        setDroneData(data.drones.drones);
      } catch (error) {
        console.error('❌ Error fetching drone data:', error.message);
      }
    };

    const intervalId = setInterval(fetchDroneData, 1000);
    fetchDroneData(); 
    return () => clearInterval(intervalId); 
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://192.168.173.201:3000/drone/recharge');
  //       if (!response.ok) throw new Error('Failed to fetch data');
  //       const data = await response.json();
        
  //       console.log(data);
  //     } catch (error) {
  //       console.error('❌ Error fetching data:', error.message);
  //     }
  //   };

  //   const intervalId = setInterval(fetchData, 1000);
  //   fetchData(); 
  //   return () => clearInterval(intervalId); 
  // }, []);

  useEffect(() => {
    if (droneData.length > 0) {
      console.log("Data updated");
    }
  }, [droneData]); 
  
  return (
    <div className="bg-stone-950 font-[family-name:var(--font-geist-sans)] min-h-screen text-stone-100 p-8 flex flex-col gap-4">
      <nav className="text-xl font-medium border-2 border-stone-900 p-4 rounded-lg">
        Drone Dashboard
      </nav>
      <main className="flex flex-row gap-8 flex-1">
        <div className="p-4 border-2 border-stone-900 border-dashed rounded-lg flex-1 flex flex-col gap-4">
          <div className="text-xs text-stone-500 font-semibold">
            In Shop
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {droneData.map((drone) => (
            <Card key={drone.uid} drone={drone} />
          ))}
          </div>
        </div>
        
      </main>
    </div>
  );
}
