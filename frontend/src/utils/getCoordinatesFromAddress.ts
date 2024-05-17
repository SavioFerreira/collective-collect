import axios from 'axios';
import { OPENCAGE_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface CachedCoordinates {
    coords: Coordinates;
    timestamp: number;
}

const CACHE_DURATION = 3600000; // Cache válido por 1 hora (3600 segundos * 1000 milissegundos)

export async function getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
    const cachedEntry = await AsyncStorage.getItem(address);
    if (cachedEntry) {
        const cachedData: CachedCoordinates = JSON.parse(cachedEntry);

        if (new Date().getTime() - cachedData.timestamp < CACHE_DURATION) {
            return cachedData.coords;
        }
    }

    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&pretty=1`;
        const response = await axios.get(url);
        const results = response.data.results;
        if (results.length > 0) {
            const coords = {
                latitude: results[0].geometry.lat,
                longitude: results[0].geometry.lng
            };
            console.log(coords)
            const newCacheEntry: CachedCoordinates = {
                coords: coords,
                timestamp: new Date().getTime()
            };
            await AsyncStorage.setItem(address, JSON.stringify(newCacheEntry));

            return coords;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        return null;
    }
};
