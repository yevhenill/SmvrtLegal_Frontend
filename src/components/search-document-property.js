import { useEffect, useState } from "react";
import Input from "./input";
import * as api from '@/api'

export default function SearchDocumentProperty({ type, placeholder,  value, onInput }) {
    const [val, setValue] = useState(value);
    const [items, setItems] = useState([]);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        setValue(value);
    }, [value]);

    const handleInput = (e) => {
        const { value } = e.target;
        
        onInput(value);

        setValue(value);
        setItems([]);
        setShowList(false);

        api
            .search_document_property({ type, search: value})
            .then((data) => {
                if (data.data) {
                    setItems(data.data);
                    setShowList(data.data.length);
                }
            })
    }

    const handleSet = (item) => {
        setShowList(false);
        setValue(item)
        onInput(item);
    }

    return (
        <div className="relative">
           <Input 
                label={type.charAt(0).toUpperCase() + type.slice(1, type.length)}
                placeholder={placeholder}
                value={val}
                onInput={(event) => handleInput(event)}
            />
            {
                showList ? (
                    <div className="absolute top-[100%]  text-[14px] left-0 bg-white z-[999] shadow p-3 w-full rounded cursor-pointer">
                        {
                            items.map((item, key) => {
                                return (<div key={key} onClick={() => handleSet(item)} className="hover:underline">
                                            {item}
                                        </div>);
                            })
                        }
                    </div>
                ) : <></>
            }
        </div>
    );
}