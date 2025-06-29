#!/usr/bin/env node

/**
 * Property Amenity Extractor
 * A utility script that extracts key amenities from property descriptions
 * and outputs them in a structured JSON format for real estate platforms.
 */

const fs = require('fs');
const path = require('path');

class PropertyAmenityExtractor {
    constructor() {
        this.amenityDatabase = {
            // Indoor Amenities
            kitchen: ['kitchen', 'chef kitchen', 'gourmet kitchen', 'updated kitchen', 'modern kitchen', 'granite countertops', 'stainless steel appliances', 'kitchen island'],
            bathroom: ['bathroom', 'bath', 'master bath', 'ensuite', 'powder room', 'half bath', 'full bath', 'jacuzzi', 'soaking tub', 'walk-in shower'],
            bedroom: ['bedroom', 'master bedroom', 'guest bedroom', 'suite', 'master suite'],
            livingArea: ['living room', 'family room', 'great room', 'den', 'study', 'office', 'library', 'media room', 'entertainment room'],
            storage: ['closet', 'walk-in closet', 'storage', 'pantry', 'basement', 'attic', 'garage storage'],
            flooring: ['hardwood floors', 'marble floors', 'tile floors', 'carpet', 'laminate', 'vinyl'],
            
            // Outdoor Amenities
            pool: ['pool', 'swimming pool', 'infinity pool', 'heated pool', 'salt water pool', 'lap pool'],
            garage: ['garage', 'parking', 'covered parking', 'carport', 'driveway'],
            garden: ['garden', 'landscaping', 'yard', 'backyard', 'front yard', 'patio', 'deck', 'balcony', 'terrace'],
            outdoor: ['outdoor kitchen', 'bbq area', 'fire pit', 'gazebo', 'pergola'],
            
            // Building Amenities
            gym: ['gym', 'fitness center', 'exercise room', 'workout room'],
            security: ['security', 'gated', 'doorman', 'concierge', 'alarm system', 'security system'],
            elevator: ['elevator', 'lift'],
            laundry: ['laundry', 'washer', 'dryer', 'laundry room', 'in-unit laundry'],
            
            // Technology & Utilities
            internet: ['wifi', 'internet', 'high-speed internet', 'fiber optic'],
            airConditioning: ['ac', 'air conditioning', 'central air', 'hvac', 'climate control'],
            heating: ['heating', 'fireplace', 'central heating', 'radiant heating'],
            
            // Location & Access
            waterfront: ['waterfront', 'ocean view', 'lake view', 'river view', 'water access', 'beachfront'],
            cityView: ['city view', 'skyline view', 'downtown view', 'panoramic view'],
            transportation: ['subway', 'bus stop', 'train station', 'metro', 'public transport'],
            
            // Luxury Features
            luxury: ['luxury', 'premium', 'high-end', 'designer', 'custom'],
            smartHome: ['smart home', 'home automation', 'smart thermostat', 'smart locks'],
            
            // Community Amenities
            clubhouse: ['clubhouse', 'community center', 'recreation center'],
            playground: ['playground', 'play area', 'kids area'],
            petFriendly: ['pet friendly', 'dog park', 'pet allowed', 'cats allowed', 'dogs allowed']
        };
    }

    /**
     * Extract amenities from a property description
     * @param {string} description - The property description text
     * @returns {Object} - Structured amenity data
     */
    extractAmenities(description) {
        if (!description || typeof description !== 'string') {
            throw new Error('Invalid description provided');
        }

        const normalizedDescription = description.toLowerCase();
        const foundAmenities = {};
        const amenityDetails = [];

        // Search for each amenity category
        Object.keys(this.amenityDatabase).forEach(category => {
            const categoryAmenities = [];
            
            this.amenityDatabase[category].forEach(amenity => {
                if (normalizedDescription.includes(amenity.toLowerCase())) {
                    categoryAmenities.push(amenity);
                }
            });

            if (categoryAmenities.length > 0) {
                foundAmenities[category] = categoryAmenities;
                amenityDetails.push(...categoryAmenities);
            }
        });

        // Extract numerical features
        const numericalFeatures = this.extractNumericalFeatures(description);

        return {
            amenities: foundAmenities,
            amenityList: [...new Set(amenityDetails)].sort(),
            numericalFeatures,
            summary: {
                totalAmenities: Object.keys(foundAmenities).length,
                categories: Object.keys(foundAmenities)
            },
            originalDescription: description
        };
    }

    /**
     * Extract numerical features like bedrooms, bathrooms, etc.
     * @param {string} description - The property description text
     * @returns {Object} - Numerical features
     */
    extractNumericalFeatures(description) {
        const features = {};

        // Bedrooms
        const bedroomMatch = description.match(/(\d+)\s*(?:bed|bedroom|br)/i);
        if (bedroomMatch) features.bedrooms = parseInt(bedroomMatch[1]);

        // Bathrooms
        const bathroomMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba)/i);
        if (bathroomMatch) features.bathrooms = parseFloat(bathroomMatch[1]);

        // Square footage
        const sqftMatch = description.match(/(\d{1,4}(?:,\d{3})*)\s*(?:sq\.?\s*ft|square feet|sqft)/i);
        if (sqftMatch) features.squareFeet = parseInt(sqftMatch[1].replace(/,/g, ''));

        // Parking spaces
        const parkingMatch = description.match(/(\d+)\s*(?:car|parking|garage)/i);
        if (parkingMatch) features.parkingSpaces = parseInt(parkingMatch[1]);

        return features;
    }

    /**
     * Process a single property description and return formatted results
     * @param {string} description - Property description
     * @returns {string} - Formatted JSON result
     */
    processDescription(description) {
        try {
            const result = this.extractAmenities(description);
            return JSON.stringify(result, null, 2);
        } catch (error) {
            return JSON.stringify({ error: error.message }, null, 2);
        }
    }

    /**
     * Process multiple properties from a JSON file
     * @param {string} filePath - Path to JSON file containing property descriptions
     * @returns {Array} - Array of processed results
     */
    processFile(filePath) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const results = [];

            if (Array.isArray(data)) {
                data.forEach((property, index) => {
                    const description = property.description || property.desc || property.text || '';
                    results.push({
                        id: property.id || index,
                        ...this.extractAmenities(description)
                    });
                });
            } else if (data.description) {
                results.push(this.extractAmenities(data.description));
            }

            return results;
        } catch (error) {
            throw new Error(`Error processing file: ${error.message}`);
        }
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const extractor = new PropertyAmenityExtractor();

    if (args.length === 0) {
        console.log(`
Property Amenity Extractor - Real Estate Tool

Usage:
  node property-amenity-extractor.js "property description"
  node property-amenity-extractor.js --file input.json
  node property-amenity-extractor.js --demo

Examples:
  node property-amenity-extractor.js "Beautiful 3 bedroom, 2 bathroom home with pool and garage"
  node property-amenity-extractor.js --file properties.json
  node property-amenity-extractor.js --demo
        `);
        return;
    }

    if (args[0] === '--demo') {
        console.log('=== DEMO: Property Amenity Extraction ===\n');
        
        const demoProperties = [
            "Stunning 4 bedroom, 3 bathroom luxury home with swimming pool, 2-car garage, gourmet kitchen with granite countertops, hardwood floors throughout, and beautiful landscaping. Features include a master suite with walk-in closet, central air conditioning, and a large deck perfect for entertaining.",
            
            "Modern downtown condo with 2 bedrooms, 2 bathrooms, gym, concierge, rooftop pool, and city views. Unit includes in-unit laundry, stainless steel appliances, and secure parking. Building amenities include fitness center and 24/7 doorman.",
            
            "Charming single-family home featuring 3 bedrooms, 1.5 bathrooms, updated kitchen, fenced yard, and attached garage. Property includes hardwood floors, fireplace, and is located near public transportation."
        ];

        demoProperties.forEach((desc, index) => {
            console.log(`--- Property ${index + 1} ---`);
            console.log(`Description: "${desc}"\n`);
            console.log('Extracted Amenities:');
            console.log(extractor.processDescription(desc));
            console.log('\n' + '='.repeat(80) + '\n');
        });
        
        return;
    }

    if (args[0] === '--file') {
        if (!args[1]) {
            console.error('Error: Please provide a file path');
            process.exit(1);
        }

        try {
            const results = extractor.processFile(args[1]);
            console.log(JSON.stringify(results, null, 2));
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
        return;
    }

    // Process single description from command line
    const description = args.join(' ');
    console.log(extractor.processDescription(description));
}

// Export for use as module
module.exports = PropertyAmenityExtractor;

// Run CLI if called directly
if (require.main === module) {
    main();
}