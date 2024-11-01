// components/OrdersTable.tsx
export default function OrdersTable() {
    const orders = [
      { name: 'John Latham', type: 'Fashion', delivered: 60, pending: 35, progress: 'green' },
      // More data here...
    ];
  
    return (
      <table className="orders-table">
        <thead><tr><th>Name</th><th>Type</th><th>Delivered</th><th>Pending</th><th>Progress</th></tr></thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td>{order.name}</td>
              <td>{order.type}</td>
              <td>{order.delivered}</td>
              <td>{order.pending}</td>
              <td><span className={`progress ${order.progress}`}></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  