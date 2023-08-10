'use client'

import Input from "@/components/input";
import Textarea from "@/components/textarea";
import DatePicker from "@/components/datepicker";
import { useState } from "react";
import { useNewProject } from '@/context/new-project'
import moment from "moment";
import { useEffect } from "react";

export default function NewProject() {
    const {project, setProject} = useNewProject();
   
    const handleChange = (value, field) => {
        setProject({
            ...project,
            [field]: value
        })
    }

    const handleAddDueDate = (date) => {
        setProject({
            ...project,
            duedate: moment(date).format('MM/DD/YYYY')
        })
    }

    const onChangeReminderSettings = (date) => {
        setProject({
            ...project,
            reminderdate: moment(date).format('MM/DD/YYYY')
        })
    }

    return (
        <div>
            <h3 className="font-Eina03 font-bold text-[20px] text-[#222] mt-[56px] mb-[24px]">Project details</h3>
            <div className="mb-[16px]">
                <Input 
                    label="Project name"
                    placeholder="Input project name here"
                    value={project.name}
                    onChange={(event) => handleChange(event.target.value, 'name')}
                />
            </div>
            <div className="mb-[16px]">
                <DatePicker 
                    label="Due Date"
                    placeholder="01/10/2023"
                    onChange={handleAddDueDate}
                    onChangeReminderSettings={onChangeReminderSettings}
                    value={project.duedate}
                    reminder={project.reminderdate}
                />
            </div>
            <Textarea 
                label="Notes (Quick Summary)"
                placeholder="Provide a brief description of your project here."
                className="resize-none"
                maxLength="300"
                value={project.notes}
                onChange={(event) => handleChange(event.target.value, 'notes')}
            />
        </div>
    );
}