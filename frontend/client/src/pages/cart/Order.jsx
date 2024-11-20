
export default function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await OrderService.fetchOrders();
                setOrders(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error error={error} />;
    }

    return (
        <div className='container'>
            <h1 className='text-2xl font-bold'>Lịch sử đơn hàng</h1>
            <div className='flex flex-col mt-8'>
                {orders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}