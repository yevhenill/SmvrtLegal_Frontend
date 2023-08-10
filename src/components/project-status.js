export default function ProjectStatus({ children, type }) {
    type  = type || 'internalapproval'

    const themes = {
        internalapproval: 'text-white bg-[#75DD7F]',
        inprogress: 'bg-[#E5FFE8] border-[#75DD7F] text-[#75DD7F] border',
        overdue: 'bg-[#FBE3E2] border-[#D94042] text-[#D94042] border',
        newversionreceived: 'text-white bg-[#297FFF]',
        tosign: 'text-white bg-[#FF9C64]',
        new: 'text-white bg-[#75DD7F]',
    }
    return (<div className={`${themes[type]} text-[10px] py-[3px] min-w-[100px] text-center font-bold rounded-[25px] flex items-center w-full justify-center`}>
        { children }
    </div>);
}