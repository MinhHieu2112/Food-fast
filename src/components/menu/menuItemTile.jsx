//file này xử lý mấy thẻ xám xám hiển thị trên trang gồm hình ảnh, tên sản phẩm, mô tả, nút Add to cart
import AddToCartButton from "@/components/menu/addToCartButton"

export default function MenuItemTile({onAddToCart,...item}) {
    const {image, description, name, basePrice, sizes, extraIngredientPrices} = item
    const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0
    return (
        <div className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/75 transition-all">
            <div className="text-center">
                <img src={image} className="max-h-auto max-h-24 block mx-auto" alt={item.name} />
            </div>
            <h4 className="font-semibold text-xl my-3">{name}</h4>
                <p className="text-gray-500 text-sm max-h-[60px] truncate line-clamp">
                    {description}
                </p>
                <AddToCartButton 
                    hasSizesOrExtras={hasSizesOrExtras} 
                    onClick={onAddToCart}
                    basePrice={basePrice}/>
        </div>
    );
}