import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, ContainerMap, ContainerSeacher, ButtonPay, TextPay } from "./style";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import { Region } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../../../config.json'
import MapViewDirections from 'react-native-maps-directions';
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export function Home() {
    const [origin, setOrigin] = useState<Region | undefined>(undefined)
    const [destination, setDestination] = useState<Region | undefined>(undefined)
    const [distance, setDistance] = useState<Number>(0)

    const price = useMemo(() => {
        const valueToKm = 3
        return distance as Float * 3
    }, [distance])

    const mapEl = useRef(null)

    useEffect(() => {
        (async function () {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permissão negada");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            });
            })()
    }, [])
    
    return (
        <Container>
            <ContainerMap
                region={origin}
                showsUserLocation={true}
                ref={mapEl}
            >
            {destination &&
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={config.googleApiKey}
                    strokeWidth={4}
                    onReady={result => {
                        setDistance(result.distance)
                        mapEl.current?.fitToCoordinates(
                        result.coordinates,{
                            edgePadding:{
                                top: 50,
                                bottom: 50,
                                right: 50,
                                left: 50
                            }
                        }
                        )}}
                />
            }
                
            </ContainerMap>
            <ContainerSeacher>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2} // minimum length of text to search
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => {
                        console.log(data);
                        if (details){
                            setDestination({
                                latitude: details?.geometry.location.lat,
                                longitude: details?.geometry.location.lng,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008,
                            })
                        }
                    }}
        
                    query={{
                        key: config.googleApiKey,
                        language: 'pt-br',
                        types: '(cities)'
                    }}
        
                    styles={{
                        textInputContainer: {
                            width: '80%',
                            borderColor: '#c0c0c0',
                            borderWidth:1
                        },
                        description: {
                        fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                        color: '#1faadb'
                        },
                    }}
                />
                {distance&& 
                    <View>
                        <Text>{distance.toFixed(2).replace('.', ',')}km</Text>
                        <ButtonPay>
                            <TextPay>Pagar R$ {price.toFixed(2).replace('.', ',')}</TextPay>
                        </ButtonPay>
                    </View>
                }
            </ContainerSeacher>
        </Container>
    )
}