import { useEffect, useState } from "react";
import Input from "./input";
import * as api from '@/api'

export default function SearchDocumentProperty({ type, placeholder, value, onInput }) {
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
            .search_document_property({ type, search: value })
            .then((data) => {
                console.log(data)
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

    const handleClick = (event) => {
        const { value } = event.target;
        if (value == '') {
            api
            .search_document_property({ type, search: '' })
            .then((data) => {
                console.log(data)
                if (data.data) {
                    setItems(data.data);
                    setShowList(data.data.length);
                }
            })
        }
    }

    return (
        <div className="relative">
            <Input
                label={(type=='type')?'Document Type':'Folder'}
                placeholder={placeholder}
                value={val}
                onClick={(event) =>handleClick(event)}
                onInput={(event) => handleInput(event)}
                autoComplete="off"
            />
            {
                showList ? (
                    <div className="absolute top-[100%]  text-[14px] left-0 bg-white z-[999] shadow p-3 w-full rounded cursor-pointer">
                        {
                            items.map((item, key) => {
                                return (
                                    <div key={key} onClick={() => handleSet(item)} className="hover:underline p-[3px] capitalize">
                                        {item}
                                    </div>
                                );
                            })
                        }
                    </div>
                ) : <></>
            }
        </div>
    );
}