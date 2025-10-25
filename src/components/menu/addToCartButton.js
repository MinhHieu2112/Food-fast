//File này là nút bấm mua sản phẩm

export default function AddToCartButton ({hasSizesOrExtras, onClick, basePrice}) {
    return (
        <button 
            type="button"
            onClick={onClick}
            className="mt-4 bg-primary text-white rounded-full px-8 py-2">
                {hasSizesOrExtras ? (
                    <span>Add to cart ${basePrice}</span>
                ) : (
                    <span>Add to cart ${basePrice}</span>
                )}
        </button>
    )
}
