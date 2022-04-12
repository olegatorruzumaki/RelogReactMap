import React, {useState} from "react";
import jsonApps from "../assets/json/apps.json";
import jsonClients from "../assets/json/clients.json";

import AppList from './AppList'

import {AutoSizer, List} from 'react-virtualized';

function ClientList(props) {
    const [selectedClient, setSelectedClient] = useState([]);

    function flyToSec(coordinatesData) {
        props.flyTo(coordinatesData)
    }

    function clientListRender({key, index, isScrolling, isVisible, style,}) {
        return (
            <div
                onClick={() => setSelectedClient(jsonApps.filter(app => app.client_id === jsonClients[index].id))}
                key={key}
                style={style}
                className="border p-2 cursor-pointer">
                <div>{jsonClients[index].name}</div>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-7 list-block">
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            width={width}
                            height={height}
                            rowCount={jsonClients.length}
                            rowHeight={50}
                            rowRenderer={clientListRender}
                        />
                    )}
                </AutoSizer>
            </div>
            <div className="col-5 list-block">
                <AppList flyTo={flyToSec} selectedClient={selectedClient}/>
            </div>
        </div>
    );
}

export default ClientList
