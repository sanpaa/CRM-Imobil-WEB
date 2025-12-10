/**
 * Geocoding Utilities
 * Converts addresses to latitude/longitude coordinates using Nominatim (OpenStreetMap)
 */
const axios = require('axios');

// Configuration constants
const GEOCODING_TIMEOUT_MS = 5000; // 5 second timeout for geocoding API calls
const MIN_ADDRESS_PARTS = 2; // Minimum address components needed (typically city and state)

/**
 * Geocode an address to get latitude and longitude coordinates
 * Uses multiple geocoding strategies for better success rate
 * @param {string} address - The full address to geocode
 * @returns {Promise<{lat: number, lng: number}|null>} - Coordinates or null if geocoding fails
 */
async function geocodeAddress(address) {
    if (!address || typeof address !== 'string' || address.trim() === '') {
        return null;
    }

    try {
        // Try geocoding with the full address
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'CRMImobil/1.0'
            },
            timeout: GEOCODING_TIMEOUT_MS
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            // Validate that we got valid numbers
            if (!isNaN(lat) && !isNaN(lng)) {
                console.log('✅ Geocoding successful:', address, '→', { lat, lng });
                return { lat, lng };
            }
        }
        
        console.warn('⚠️ No geocoding results for address:', address);
        return null;
    } catch (error) {
        console.warn('❌ Geocoding failed for address:', address, '- Error:', error.message);
        return null;
    }
}

/**
 * Build a full address from property data components
 * @param {Object} propertyData - Property data containing address fields
 * @returns {string|null} - Full address string or null if insufficient data
 */
function buildAddressFromPropertyData(propertyData) {
    const addressParts = [
        propertyData.street,
        propertyData.neighborhood,
        propertyData.city,
        propertyData.state,
        'Brasil'
    ].filter(part => part && typeof part === 'string' && part.trim() !== '');

    // Need at least city and state to geocode (MIN_ADDRESS_PARTS components)
    if (addressParts.length < MIN_ADDRESS_PARTS) {
        return null;
    }

    return addressParts.join(', ');
}

/**
 * Check if coordinates are valid (not null, not undefined, not NaN)
 * @param {number|null|undefined} lat - Latitude value
 * @param {number|null|undefined} lng - Longitude value
 * @returns {boolean} - True if coordinates are valid
 */
function hasValidCoordinates(lat, lng) {
    return lat !== null && 
           lat !== undefined && 
           lng !== null && 
           lng !== undefined && 
           typeof lat === 'number' && 
           typeof lng === 'number' &&
           !isNaN(lat) && 
           !isNaN(lng);
}

/**
 * Try multiple geocoding strategies with fallback
 * This improves geocoding success rate by trying progressively less specific addresses
 * @param {Object} propertyData - Property data containing address fields
 * @returns {Promise<{lat: number, lng: number}|null>} - Coordinates or null if all strategies fail
 */
async function geocodeWithFallback(propertyData) {
    const strategies = [];
    
    // Strategy 1: Full address (street, neighborhood, city, state, Brasil)
    if (propertyData.street || propertyData.neighborhood || propertyData.city) {
        const fullAddress = [
            propertyData.street,
            propertyData.neighborhood,
            propertyData.city,
            propertyData.state,
            'Brasil'
        ].filter(part => part && typeof part === 'string' && part.trim() !== '').join(', ');
        
        if (fullAddress) {
            strategies.push({ name: 'Full address', address: fullAddress });
        }
    }
    
    // Strategy 2: City + State + Postal Code (often more reliable in Brazil)
    if (propertyData.zipCode && propertyData.city && propertyData.state) {
        const zipAddress = `${propertyData.zipCode}, ${propertyData.city}, ${propertyData.state}, Brasil`;
        strategies.push({ name: 'Postal code', address: zipAddress });
    }
    
    // Strategy 3: Without street (neighborhood, city, state, Brasil) 
    if (propertyData.neighborhood && propertyData.city) {
        const noStreetAddress = [
            propertyData.neighborhood,
            propertyData.city,
            propertyData.state,
            'Brasil'
        ].filter(part => part && typeof part === 'string' && part.trim() !== '').join(', ');
        
        if (noStreetAddress) {
            strategies.push({ name: 'Without street', address: noStreetAddress });
        }
    }
    
    // Strategy 4: City + State only (fallback to city center)
    if (propertyData.city && propertyData.state) {
        const cityAddress = `${propertyData.city}, ${propertyData.state}, Brasil`;
        strategies.push({ name: 'City only', address: cityAddress });
    }
    
    // Try each strategy in order until one succeeds
    for (const strategy of strategies) {
        console.log(`🗺️ Trying geocoding strategy: ${strategy.name} - ${strategy.address}`);
        
        const coords = await geocodeAddress(strategy.address);
        
        if (coords) {
            console.log(`✅ Geocoding succeeded with strategy: ${strategy.name}`);
            return coords;
        }
        
        // Add a small delay between requests to respect Nominatim rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.warn('❌ All geocoding strategies failed for property');
    return null;
}

/**
 * Automatically geocode property data if it doesn't have valid coordinates
 * @param {Object} propertyData - Property data to geocode
 * @returns {Promise<Object>} - Property data with coordinates (if geocoding succeeded)
 */
async function autoGeocodePropertyData(propertyData) {
    // Check if property already has valid coordinates
    if (hasValidCoordinates(propertyData.latitude, propertyData.longitude)) {
        console.log('Property already has valid coordinates, skipping geocoding');
        return propertyData;
    }

    console.log('🗺️ Starting auto-geocoding for property...');
    
    // Try geocoding with fallback strategies
    const coords = await geocodeWithFallback(propertyData);
    
    if (coords) {
        console.log('✅ Auto-geocoding successful:', coords);
        return {
            ...propertyData,
            latitude: coords.lat,
            longitude: coords.lng
        };
    } else {
        console.warn('⚠️ Auto-geocoding failed - property will be saved without coordinates');
        return propertyData;
    }
}

module.exports = {
    geocodeAddress,
    geocodeWithFallback,
    buildAddressFromPropertyData,
    hasValidCoordinates,
    autoGeocodePropertyData
};
