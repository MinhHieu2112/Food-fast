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
                            <li>Created at: {new Date(order.createdAt).toLocaleString('vi-VN')}</li>
                            <li>From: {order.store.name}</li>
                            <li>Order ID: {order._id.slice(-5)}</li>
                            <li>Name: {order.name}</li>
                            <li>Address: {order.streetAddress}</li>
                            <li>City: {order.city}</li>
                            <li>Phone: {order.phone}</li>
                        </ul>
                        <h2 className="text-center font-semibold mb-2 mt-2">Order Information</h2>
                        {order.cartProducts?.map((product, index) => (
                            <li key={index} className="border-b pb-2 mt-2 list-none text-sm">
                                <div className="grow">
                                    <div className="flex justify-between">
                                        <strong>{product.name}</strong>
                                        <span>Price: ${product.basePrice}</span>
                                    </div>

                                    {/* Size */}
                                    {product.size && (
                                        <div className="flex justify-between">
                                            Size: {product.size.name}
                                            <span>+${product.size.price}</span>
                                        </div>
                                    )}
                                    
                                    {product.extras?.length > 0 && (
                                        <ul className="list-disc">
                                            {product.extras.map((extra, i) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{extra.name}</span> 
                                                    <span>+${extra.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
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