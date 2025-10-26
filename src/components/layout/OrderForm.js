export default function OrderForm({order}) {
    let subtotal = 0;
        if (order?.cartProducts?.length) {
            for (const p of order.cartProducts) {
                let productTotal = Number(p.basePrice);
                if (p.extras?.length > 0) {
                    for (const extra of p.extras) {
                    productTotal += Number(extra.price);
                }
            }
            subtotal += productTotal;
        }
    }
    return (
        <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-center font-semibold mb-2">Delivery Information</h2>
                        <ul className="text-sm mt-2">
                            <li>Name: {order.name}</li>
                            <li>Address: {order.streetAddress}</li>
                            <li>City: {order.city}</li>
                            <li>Phone: {order.phone}</li>
                        </ul>
                        <h2 className="text-center font-semibold mb-2 mt-2">Order Information</h2>
                        {order.cartProducts?.map((product, index) => (
                            <li key={index} className="border-b pb-2 mt-2 list-none text-sm">
                                <div className="flex justify-between">
                                    <strong>{product.name}</strong>
                                    <span>Price: ${product.basePrice}</span>
                                </div>
                                {product.extras?.length > 0 && (
                                    <ul className="ml-6 list-disc">
                                        {product.extras.map((extra, i) => (
                                            <li key={i} className="flex justify-between">
                                                <span>{extra.name}</span> 
                                                <span>+${extra.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        <div className="flex justify-between font-semibold text-sm mt-2">
                            <div>
                                Subtotal:<br />
                                Delivery:<br />
                                Total:
                            </div>
                            <div className="font-semibold pl-2 text-right">
                                ${subtotal}<br />
                                +$5 <br />
                                ${subtotal + 5}
                            </div>
                        </div>
                        {/* <Address addressProps={order}/> */}
                    </div>
    );
}