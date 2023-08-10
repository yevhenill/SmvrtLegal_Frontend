import { useState } from "react";
import Calendar from "./calendar";
import Input from "./input";
import calendarsvg from '@/assets/calendar.svg'
import moment from 'moment';

export default function DatePicker({ label, placeholder, value, reminder, onChange, onChangeReminderSettings }) {
    const [open, setOpen] = useState(false)
    const [reminderSettingsMode, setReminderSettingsMode] = useState(false);

    const [date, setDate] = useState(value ? moment(value).format('MM/DD/YYYY') : '')
    const handleSave = (value) => {
        if (reminderSettingsMode) {
            onChangeReminderSettings(value);
        } else {
            onChange(value);
            setDate(moment(value).format('MM/DD/YYYY'));
        }
        
        setOpen(false);
    }

    const handleClickReminderSettings = () => {
        setReminderSettingsMode(true);
        setOpen(true);
    }

    return (<div className="flex items-center relative z-[10]">
                <Input 
                    label={label}
                    placeholder={placeholder}
                    icon={calendarsvg}
                    className="min-w-[300px]"
                    name="datepicker"
                    type="text"
                    onFocus={() => { setReminderSettingsMode(false); setOpen(true)} }
                    onClick={() => { setReminderSettingsMode(false); setOpen(true)} }
                    value={date}
                    onChange={() => {}}
                    readOnly={true}
                />
                <a href="#" onClick={e => { e.preventDefault(); handleClickReminderSettings(); }} className="whitespace-nowrap text-[#1860CC] underline underline-offset-2 translate-y-[10px] ml-8 text-[14px]">Reminder setting</a>
                {
                    open ? 
                    <div className="absolute right-[0] translate-x-[50%] translate-y-[-50%] top-0 z-[20]">
                        <Calendar 
                            reminderMode={reminderSettingsMode} 
                            onSave={handleSave} 
                            onClose={() => setOpen(false)}
                            duedate={value}
                            reminder={reminder}
                        />
                    </div> : <></>
                }
            </div>);
}