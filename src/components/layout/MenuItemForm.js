import { useState, useEffect} from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "./menuItemPriceProps";

export default function MenuItemForm({onSubmit, menuItem}) {
        const [image, setImage] = useState(menuItem?.image || '');
        const [name, setName] = useState(menuItem?.name || '');
        const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
        const [description, setDescription] = useState(menuItem?.description || '');
        const [sizes, setSizes] = useState(menuItem?.sizes || []);
        const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);
        const [category, setCategory] = useState(menuItem?.category || '');
        const [categories, setCategories] = useState(menuItem?.categories || []);

        useEffect(() => {
            fetch('/api/categories').then(res => {
                res.json().then(categories => {
                    setCategories(categories);
                });
            });
        }, []);

return (
    <form 
        onSubmit={ev => 
            onSubmit(ev, {
                image, name, description, basePrice, sizes, extraIngredientPrices,category
            })
        } 
        className="mt-8 max-w-2xl mx-auto">
        {/* Chia hàng ngang: UploadFile bên trái, form bên phải */}
        <div className="flex items-start gap-4">
            {/* BÊN TRÁI: Upload ảnh */}
            <div className="w-1/3">
                <EditableImage value= {image} onUpload={setImage} />
            </div>

                {/* BÊN PHẢI: Thông tin món ăn */}
            <div className="flex-1 flex-col gap-5">
                <label>Item name</label>
                <input type="text" value={name} onChange={ev => setName(ev.target.value)} />

                <label>Description</label>
                <textarea type="text" value={description} onChange={ev => setDescription(ev.target.value)} />

                <label>Category</label>
                <select
                value={category || ''}
                onChange={ev => setCategory(ev.target.value)}
                required
                >
                <option value="">-- Select category --</option>
                {categories?.map(c => (
                    <option key={c._id} value={c._id}>
                    {c.name}
                    </option>
                ))}
                </select>

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
                <button className="btn-register" type="submit">Save</button>
            </div>
        </div>
    </form>
    )
}