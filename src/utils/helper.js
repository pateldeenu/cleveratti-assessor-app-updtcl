import Geolocation from "@react-native-community/geolocation";
const GOOGLE_API_KEY = "AIzaSyDD-Gze8P_KTq2PVxk_j15RNQPJS0rqf58";

const getAddressFromCoordinates = async (latitude, longitude, apiKey) => {
    try {
        // if (!latitude || !longitude) {
        //     console.error('Invalid coordinates :', latitude, longitude);
        //     return null;
        // }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        //console.log(url);
        const response = await fetch(url);
        const json = await response.json();
        const result = json.results[0];

        if (!result) {
            console.error('No result found');
            return null;
        }

        return result;
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}

export const getLocation = () => {
    // console.log("getlocation");
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            async (info) => {
                // console.log("Position retrieved:", info);
                try {
                    const result = await getAddressFromCoordinates(
                        info?.coords?.latitude,
                        info?.coords?.longitude,
                        GOOGLE_API_KEY
                    );
                    // console.log("Address lookup successful:", result);
                    resolve({ latitude: info?.coords?.latitude, longitude: info?.coords?.longitude, result });
                } catch (error) {
                    // console.log("Error in address lookup:", error);
                    reject(error);
                }
            },
            (error) => {
                // console.log("Error getting position:", error);
                reject(error);
            },
        );
    });
};

export const getCoordinatesFromAddress = async (address) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`;
        //console.log(url);
        const response = await fetch(url);
        const json = await response.json();
        const result = json.results[0];

        if (!result) {
            console.error('No result found');
            return null;
        }

        return result;
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}