import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-virtualized/styles.css';

import {Modal} from 'react-bootstrap';

import ClientList from './components/ClientList';
import Map from './components/Map';

function RelogComponent(props) {
    const [coordinates, setCoordinates] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function flyTo(data) {
        setCoordinates({lat: data.lat, long: data.long})
        handleClose();
    }

    return (
        <div className="container-fluid">
            <div className="relogMap row">
                <div className="d-lg-none">
                        <div className="menu-button" onClick={handleShow}>Меню</div>
                        <Modal fullscreen={true} show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <ClientList flyTo={flyTo}/>
                            </Modal.Body>
                        </Modal>
                    </div>
                <div className="col-12 col-lg-3 d-none d-lg-block">
                    <ClientList flyTo={flyTo}/>
                </div>
                <div className="col-12 col-lg-9 px-0">
                    <Map coordinates={coordinates}/>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <RelogComponent/>,
    document.getElementById('root')
);
