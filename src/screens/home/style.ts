import styled from "styled-components/native";
import MapView from "react-native-maps";

export const Container = styled.View`
    flex: 1;
`

export const ContainerMap = styled(MapView)`
    height: 70%;
`

export const ContainerSeacher = styled.View`
    height: 30%;
    justify-content: center;
    align-items: center;
    padding: 16px;
`

export const ButtonPay = styled.TouchableOpacity`
    background-color: black;
    padding: 6;
    border-radius: 4;
    margin-top: 30;
    justify-content: center;
    align-items: center;
`

export const TextPay = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 24px;
`