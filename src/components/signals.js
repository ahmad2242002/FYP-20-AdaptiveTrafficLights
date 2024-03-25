import React,{useState,useEffect} from 'react'

function TrafficSignals({timer = 0}) {
  const [status, setStatus] = useState(null);
  useEffect(()=>{
    if (timer <= 0) {
      setStatus(0)
    } else if (timer <= 4) {
      setStatus(1)
    } else {
      setStatus(2)
    }
  },[timer])
 
  return (
    <div>
        <div className="flex flex-col space-y-2 p-2 h-fit bg-black rounded-lg border-2 border-black w-11 items-center">
              <div
                className={`rounded-full w-6 h-6 ${
                  status === 0 ? 'bg-red-500' : 'bg-red-900'
                }`}
              ></div>
              <div
                className={`rounded-full w-6 h-6 ${
                  status === 1 ? 'bg-yellow-400' : 'bg-yellow-900'
                }`}
              ></div>
              <div
                className={`rounded-full w-6 h-6 ${
                  status === 2 ? 'bg-green-400' : 'bg-green-900'
                }`}
              ></div>
            </div>
    </div>
  )
}

export default TrafficSignals