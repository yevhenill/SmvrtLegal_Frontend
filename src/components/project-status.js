import React, { useState, useEffect } from "react";
import * as api from '@/api'

export default function ProjectStatus({ type }) {
    const [status, setSatus] = useState(type || 'internalapproval');

    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        if (progress < 100) {
          setProgress((prevProgress) => prevProgress + 10);
        } else {
            setSatus('new');
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }, [progress]);

    const themes = {
        internalapproval: 'text-white bg-[#75DD7F]',
        inprogress: 'bg-[#E5FFE8] border-[#75DD7F] text-[#75DD7F] border',
        overdue: 'bg-[#FBE3E2] border-[#D94042] text-[#D94042] border',
        newversionreceived: 'text-white bg-[#297FFF]',
        tosign: 'text-white bg-[#FF9C64]',
        new: 'text-white bg-[#75DD7F]',
    }

    if(status === 'pending') {
        return (
            <>
                <span>{ status }</span>
                <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </>
        )
    }
    return (<div className={`${themes[status]} text-[10px] py-[3px] min-w-[100px] text-center font-bold rounded-[25px] flex items-center w-full justify-center`}>
        { status }
    </div>);
}