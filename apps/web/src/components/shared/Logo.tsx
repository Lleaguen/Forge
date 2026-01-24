import LogoDark from '../../public/Logo-DarkMode-removebg-preview.png';

export default function Logo() {
    return (
        <div className="flex items-center gap-2 mb-2">
          <img
            src={LogoDark.src}
            alt="Vexel logo"
            className="h-16 w-16 object-contain "
          />
          <div className='flex flex-col justify-center-safe align-center items-center'>
          <h1 className='font-bold text-2xl dark:text-brand-text'><span className='text-[#FF7A1A]'>V</span>exel</h1> 
          <p className='font-bold text-[#FF7A1A] '>GLOBAL</p>
          </div>
      
     </div>
    )
}