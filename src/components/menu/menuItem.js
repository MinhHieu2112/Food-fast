import {CartContext} from "@/components/AppContext"
import {useContext, useState} from "react"
import MenuItemTile from "@/components/menu/menuItemTile"
import Image from "next/image" 
import toast from "react-hot-toast"

export default function MenuItem(menuItem) {
    const {addToCart} = useContext(CartContext)
    const {image, name, description, basePrice, sizes, extraIngredientPrices} = menuItem
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedExtras, setSelectedExtras] = useState([]);
    function handleAddToCartButtonClick() {
        const hasOption = sizes.length > 0 || extraIngredientPrices.length > 0;
            if (hasOption && !showPopup) {
                setShowPopup(true);
                return;
            } 
            addToCart(menuItem, selectedSize, selectedExtras);
            setShowPopup(false);
            toast.success('Added to cart!');
        }

    function handleExtraThingClick(ev, extraThing) {
        const checked = ev.target.checked;
            if (checked) {
                setSelectedExtras(prev => [...prev, extraThing]);
            } else {
                setSelectedExtras(prev => prev.filter(e => e.name !== extraThing.name));
        }
    }
    let selectedPrice = Number(basePrice);

    if (selectedSize) {
        selectedPrice += Number(selectedSize.price);
    }

    if (selectedExtras?.length > 0) {
        for (const extra of selectedExtras) {
            selectedPrice += Number(extra.price);
        }
    }

    return (
        <>
            {showPopup && (
                <div onClick={() => setShowPopup(false)} 
                    className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center">
                    <div onClick={ev => ev.stopPropagation()} 
                        className="my-8 bg-white p-4 rounded-lg max-w-md">
                        <div 
                            className="overflow-y-scroll p-2" 
                            style={{maxHeight:'calc(100vh - 100px)'}}>
                            <Image src={image} alt={name} width={300} height={200} className="mx-auto"/>
                                <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
                                <p className="text-center text-gray-500 text-sm mb-2">{description}</p>
                            {sizes?.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-center text-gray-700">Pick your size</h3>
                                    {sizes.map(size => (
                                        <label key={size._id} className="flex items-center gap-2 p-4 border rounded-md mb-1">
                                            <input 
                                                type="radio" 
                                                name="size"
                                                onChange={() => setSelectedSize(size)}
                                                checked={selectedSize?.name === size.name}/>
                                                
                                            {`${size.name} $${parseFloat(basePrice) + parseFloat(size.price)}`}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {extraIngredientPrices?.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-center text-gray-700">Any extra ?</h3>
                                    {extraIngredientPrices.map(extraThing => (
                                        <label key={extraThing._id} 
                                            className="flex items-center gap-2 p-4 border rounded-md mb-1">
                                            <input 
                                                type="checkbox" 
                                                name={extraThing.name}
                                                onChange={ev => handleExtraThingClick(ev, extraThing)}/>
                                            {`${extraThing.name} ${"+" + "$" + parseFloat(extraThing.price)}`}
                                        </label>
                                    ))}
                                </div>
                            )}
                            <button 
                                className="primary btn-register sticky bottom-2" 
                                type="button"
                                onClick={() => handleAddToCartButtonClick()}>
                                Add to cart ${selectedPrice}
                            </button>
                            <button className="btn-register sticky" onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem}/>
        </>
    );
}