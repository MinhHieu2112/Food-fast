import Plus from "@/components/icons/plus"
import Trash from "@/components/icons/trash"
import ChevronDown from "@/components/icons/chevronDown"
import { useState } from "react"
import ChevronUp from "@/components/icons/chevronUp"

export default function MenuItemPriceProps({name, addLabel, props, setProps}) {
    const [isOpen, setIsOpen] = useState(false);

    function addProp() {
        setProps(oldProps => {
            return [...oldProps, {name: '', price: 0}];
        })
    }
    
    function editProp(ev, index, prop) {
        const newValue = ev.target.value;
        setProps(prevSizes => {
            const newSized = [...prevSizes];
            newSized[index][prop] = newValue;
            return newSized;
    
        })
    }
    
    function removeProp(indexToRemove) {
        setProps(prev => prev.filter((v,index) => index !== indexToRemove));
    }

    return (
        <div className="bg-gray-100 p-3 rounded-md mb-3 text-sm">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="inline-flex p-1 gap-2 rounded-md hover:bg-gray-200"
                type="button">
                {isOpen && (
                    <ChevronUp className="w-4 h-4"/>
                )}
                {!isOpen && (
                <ChevronDown className="w-4 h-4"/>
                )}
                <span>{name}</span>
                <span>({props?.length})</span>
            </button>
            <div className={isOpen ? 'block' : 'hidden'}>
                {props?.length > 0 && props.map((size, index) => (
                    <div className="flex items-center gap-2 mb-2 mt-2" key={index}>
                            <div>
                                <label>{name}</label>
                                <input type="text" 
                                    placeholder="Size name" 
                                    value={size.name}
                                    onChange={ev => editProp(ev, index, 'name')}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label>Extra price</label>
                                <input type="text" 
                                    placeholder="Extra price" 
                                    value={size.price}
                                    onChange={ev => editProp(ev, index, 'price')}
                                    className="w-24 p-2 border border-gray-300 rounded-md"
                                    />
                            </div> 
                            <div>
                                <button 
                                    className="p-2 mt-2 bg-white rounded-md hover:bg-gray-200"
                                    onClick={() => removeProp(index)}
                                    >
                                    <Trash className="w-4 h-4 text-gray-600"/>
                                </button>
                            </div>
                    </div> 
                ))}
                <button
                    type="button"
                    onClick={addProp}
                    className="btn-register bg-white flex items-center hover:bg-gray-200">
                    <Plus className="w-4 h-4"/>
                    <span>{addLabel}</span>
                </button>
            </div>
        </div>
    );
}