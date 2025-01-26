
import { PiSmileySad } from "react-icons/pi";

const EmptyCard = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
        <div className='w-[5rem] h-[5rem] bg-blue-500 mt-10 rounded-full flex justify-center items-center'>
            <PiSmileySad className='text-white text-5xl'/>
        </div>
        <p className='mt-5 text-center text-4xl text-slate-500'> You don't have any notes! <br/> Click on the "Add" button  to get started!</p>
    </div>
  )
}

export default EmptyCard