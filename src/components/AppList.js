import React from "react";
import {AutoSizer, List} from 'react-virtualized';

function AppList(props) {
    function appListRender({key, index, isScrolling, isVisible, style,}) {
        return (
            <div
                onClick={() => {
                    props.flyTo(props.selectedClient[index].coords)
                }}
                key={key}
                style={style}
                className="border my-1 p-2 cursor-pointer">
                <div>Тип: {props.selectedClient[index].type}</div>
                <div>Цена: {props.selectedClient[index].price} тенге</div>
            </div>
        );
    }

    return (
        <AutoSizer>
            {({height, width}) => (
                <List
                    width={width}
                    height={height}
                    rowCount={props.selectedClient.length}
                    rowHeight={75}
                    rowRenderer={appListRender}
                />
            )}
        </AutoSizer>
    );
}

export default AppList
