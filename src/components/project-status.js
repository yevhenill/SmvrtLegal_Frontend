import React, { useState, useEffect } from "react";
import * as api from '@/api'

export default function ProjectStatus({ id, type }) {
    const [status, setStatus] = useState(type || 'internalapproval');

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if(status === 'pending') {
            const interval = setInterval(() => {
                if (progress < 100) {
                    setProgress((prevProgress) => prevProgress + 1);
                } else if(progress === 100) {
                    setStatus('new');
                    api.update_project_status({id});
                    setProgress(101);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [progress]);

    const themes = {
        internalapproval: 'text-white bg-[#75DD7F]',
        inprogress: 'bg-[#E5FFE8] border-[#75DD7F] text-[#75DD7F] border',
        overdue: 'bg-[#FBE3E2] border-[#D94042] text-[#D94042] border',
        newversionreceived: 'text-white bg-[#297FFF]',
        tosign: 'text-white bg-[#FF9C64]',
        new: 'text-[#7A2CB8] bg-[#F2EBF8]',
        newversion: 'text-[#7A2CB8] bg-[#F2EBF8] font-Eina03',
    }

    if(status === 'pending') {
        return (
            <>
                {/* <span>{ status }</span> */}
                <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                        className="h-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </>
        )
    }
    return (
    <div 
        className={`${themes[status]} text-[12px] py-[3px] min-w-[102px] text-center font-bold rounded-[4px] flex items-center w-full justify-center`}
        style={{ textTransform: 'uppercase' }}>
        { status }
    </div>);
}