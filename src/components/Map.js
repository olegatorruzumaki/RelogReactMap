import React from "react";
import jsonApps from "../assets/json/apps.json";
import jsonClients from "../assets/json/clients.json";

import mapboxgl from "mapbox-gl";

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
        };
    }

    flyTo(long, lat) {
        this.state.map.flyTo({
            center: [
                long,
                lat
            ],
            zoom: 18,
            essential: true
        })
    }

    getMap() {
        let appGeoJson = {"type": "FeatureCollection", "features": []};

        for (let point of jsonApps) {
            let coordinate = [parseFloat(point.coords.long), parseFloat(point.coords.lat)];
            let properties = point;
            delete properties.longitude;
            delete properties.latitude;
            let feature = {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": coordinate},
                "properties": properties
            }
            appGeoJson.features.push(feature);
        }

        this.state.map.on('load', () => {
            this.state.map.addSource('apps', {
                type: 'geojson',
                data: appGeoJson,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            this.state.map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'apps',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            this.state.map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'apps',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            this.state.map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'apps',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': 'red',
                    'circle-radius': 8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });

            this.state.map.on('click', 'clusters', (e) => {
                const features = this.state.map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                this.state.map.getSource('apps').getClusterExpansionZoom(
                    (err, zoom) => {
                        if (err) return;

                        this.state.map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
            });

            this.state.map.on('mouseenter', 'clusters', () => {
                this.state.map.getCanvas().style.cursor = 'pointer';
            });
            this.state.map.on('mouseleave', 'clusters', () => {
                this.state.map.getCanvas().style.cursor = '';
            });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            this.state.map.on('mouseenter', 'unclustered-point', (e) => {
                this.state.map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                popup
                    .setLngLat(coordinates)
                    .setHTML(
                        `ID заказа: ${e.features[0].properties.id}
                        <br>Имя клиента: ${jsonClients.find(client => client.id === e.features[0].properties.client_id).name}
                        <br>Цена заказа: ${e.features[0].properties.price} тенге`
                    )
                    .addTo(this.state.map);
            });
            this.state.map.on('mouseleave', 'unclustered-point', () => {
                this.state.map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });
    }

    initializeMap() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib2xlZ2t1cmJhdG92IiwiYSI6ImNsMHMwcGs2dDAyYXUza281ZWZzOTMweTEifQ.qQmKfhReh4wtcW38MCh_qw';
        this.state.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [76.889709, 43.238949],
            zoom: 11
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.coordinates !== this.props.coordinates)
            this.flyTo(this.props.coordinates.long, this.props.coordinates.lat);
    }

    componentDidMount() {
        this.initializeMap();
        this.getMap();
    }

    render() {
        return (
            <div id="map"/>
        );
    }
}

export default Map
