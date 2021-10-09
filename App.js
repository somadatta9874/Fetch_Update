import React, {useEffect, useState} from 'react';

const API_HOST = "http://localhost:3000";
const INVENTORY_API_URL = `${API_HOST}/inventory`;

function App() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetch(`${INVENTORY_API_URL}`)
            .then(res => res.json())
            .then(json => setData(json));
    }

    useEffect(() => {
        fetchData();
    }, []);


    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: null
    });

    const [status, setStatus] = useState(null);


    const onEdit = ({id, currentStatus}) => {
        setInEditMode({
            status: true,
            rowKey: id
        })
        setStatus(currentStatus);
    }

    const updateInventory = ({id, newStatus}) => {
        fetch(`${INVENTORY_API_URL}/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                unit_price: newStatus
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                
                onCancel();

                fetchData();
            })
    }


    const onSave = ({id, newStatus}) => {
        updateInventory({id, newStatus});
    }

    const onCancel = () => {
        
        setInEditMode({
            status: false,
            rowKey: null
        })
        
        setStatus(null);
    }

    return (
        <div className="container">
            <h1>GET AND UPDATE</h1>
            <table border="1">
                <thead>
                <tr>
                    <th>Name </th>
                    <th>ID </th>
                    <th> Subject</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                        <tr key={item.name}>
                            <td>{item.id}</td>
                            <td>{item.subject}</td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <input value={status}
                                               onChange={(event) => setStatus(event.target.value)}
                                        />
                                    ) : (
                                        item.status
                                    )
                                }
                            </td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <React.Fragment>
                                            <button
                                                className={"btn-success"}
                                                onClick={() => onSave({id: item.id, newStatus: status})}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className={"btn-secondary"}
                                                style={{marginLeft: 8}}
                                                onClick={() => onCancel()}
                                            >
                                                Cancel
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className={"btn-primary"}
                                            onClick={() => onEdit({id: item.id, currentStatus: item.status})}
                                        >
                                            Edit
                                        </button>
                                    )
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default App;