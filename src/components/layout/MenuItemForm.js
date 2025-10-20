import { useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "./menuItemPriceProps";

export default function MenuItemForm({onSubmit, menuItem}) {
        const [image, setImage] = useState(menuItem?.image || '');
        const [name, setName] = useState(menuItem?.name || '');
        const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
        const [description, setDescription] = useState(menuItem?.description || '');
        const [sizes, setSizes] = useState(menuItem?.sizes || []);
        const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);

return (
    <form 
        onSubmit={ev => onSubmit(ev, {image, name, description, basePrice, sizes, extraIngredientPrices})} 
        className="mt-8 max-w-md mx-auto">
        {/* Chia hàng ngang: UploadFile bên trái, form bên phải */}
        <div className="flex items-start gap-4">
            {/* BÊN TRÁI: Upload ảnh */}
            <div className="w-1/3">
                <EditableImage value= {image} onUpload={setImage} />
            </div>

                {/* BÊN PHẢI: Thông tin món ăn */}
            <div className="flex-1 flex-col gap-4">
                <label>Item name</label>
                <input type="text" value={name} onChange={ev => setName(ev.target.value)} />

                <label>Description</label>
                <textarea type="text" value={description} onChange={ev => setDescription(ev.target.value)} />

                <label>Base Price</label>
                <input type="text" value={basePrice}  onChange={ev => setBasePrice(ev.target.value)} />

                <MenuItemPriceProps 
                    name={'Sizes'} 
                    addLabel={'Add item size'} 
                    props={sizes} 
                    setProps={setSizes} />
                <MenuItemPriceProps 
                    name={'Extra ingredients'} 
                    addLabel={'Add ingredients prices'} 
                    props={extraIngredientPrices} 
                    setProps={setExtraIngredientPrices} />
                <button className="bg-primary rounded-full text-white px-10 py-2 mt-4 self-start" type="submit">Save</button>
            </div>
        </div>
    </form>
    )
}