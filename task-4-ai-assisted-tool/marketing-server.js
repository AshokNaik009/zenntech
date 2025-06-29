const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Marketing Description Generator Class
class MarketingDescriptionGenerator {
    constructor() {
        this.locationAdjectives = {
            'downtown': ['vibrant', 'bustling', 'dynamic', 'urban', 'cosmopolitan'],
            'suburban': ['peaceful', 'family-friendly', 'quiet', 'residential', 'serene'],
            'waterfront': ['stunning', 'breathtaking', 'scenic', 'picturesque', 'tranquil'],
            'beachfront': ['pristine', 'luxurious', 'tropical', 'exclusive', 'oceanfront'],
            'mountain': ['majestic', 'panoramic', 'elevated', 'secluded', 'pristine'],
            'urban': ['convenient', 'accessible', 'modern', 'connected', 'sophisticated']
        };

        this.propertyTypes = {
            'house': 'home',
            'condo': 'condominium',
            'apartment': 'residence',
            'townhouse': 'townhome',
            'villa': 'estate'
        };
    }

    /**
     * Generate a compelling marketing description using AI
     */
    async generateDescription(propertyData) {
        const { bedrooms, bathrooms, size, location, price, propertyType = 'home', amenities = [] } = propertyData;

        // Create a detailed prompt for the AI
        const prompt = this.createMarketingPrompt(propertyData);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert real estate marketing copywriter. Create compelling, professional property descriptions that highlight key features and create emotional appeal. Keep descriptions to exactly one paragraph, around 100-150 words. Use vivid but professional language that would appeal to potential buyers."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.7,
                max_tokens: 200,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('Groq API Error:', error);
            // Fallback to template-based description if AI fails
            return this.generateFallbackDescription(propertyData);
        }
    }

    /**
     * Create a detailed prompt for the AI model
     */
    createMarketingPrompt(propertyData) {
        const { bedrooms, bathrooms, size, location, price, propertyType = 'home', amenities = [] } = propertyData;

        let prompt = `Write a compelling one-paragraph marketing description for this property:\n\n`;
        prompt += `Property Details:\n`;
        prompt += `- ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}, ${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}\n`;
        
        if (size) {
            prompt += `- ${size.toLocaleString()} square feet\n`;
        }
        
        prompt += `- Located in ${location}\n`;
        prompt += `- Price: $${price.toLocaleString()}\n`;
        prompt += `- Property type: ${propertyType}\n`;
        
        if (amenities && amenities.length > 0) {
            prompt += `- Key amenities: ${amenities.join(', ')}\n`;
        }

        prompt += `\nFocus on:\n`;
        prompt += `- The lifestyle this property offers\n`;
        prompt += `- Unique selling points and standout features\n`;
        prompt += `- The emotional appeal of the location and space\n`;
        prompt += `- Value proposition relative to the price point\n`;
        prompt += `\nWrite in a professional but engaging tone that would appeal to serious buyers.`;

        return prompt;
    }

    /**
     * Generate a fallback description using templates if AI fails
     */
    generateFallbackDescription(propertyData) {
        const { bedrooms, bathrooms, size, location, price, propertyType = 'home', amenities = [] } = propertyData;

        let description = `Discover this exceptional ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType} `;
        
        if (size) {
            description += `spanning ${size.toLocaleString()} square feet `;
        }
        
        description += `in the heart of ${location}. `;

        // Add size-based appeal
        if (size > 2500) {
            description += `This spacious residence offers generous living areas perfect for both daily comfort and entertaining. `;
        } else if (size > 1500) {
            description += `Thoughtfully designed spaces maximize every square foot for comfortable modern living. `;
        } else {
            description += `Efficiently designed with a focus on style and functionality. `;
        }

        // Add amenity highlights
        if (amenities && amenities.length > 0) {
            const topAmenities = amenities.slice(0, 3);
            description += `Notable features include ${topAmenities.join(', ')}. `;
        }

        // Add location appeal
        description += `Ideally situated in ${location}, this property offers the perfect blend of convenience and lifestyle. `;

        // Add value proposition
        if (price < 300000) {
            description += `Priced at $${price.toLocaleString()}, this represents an excellent opportunity for first-time buyers or investors.`;
        } else if (price < 750000) {
            description += `At $${price.toLocaleString()}, this property delivers exceptional value in today's market.`;
        } else {
            description += `This premium property is priced at $${price.toLocaleString()}, reflecting its superior quality and desirable location.`;
        }

        return description;
    }
}

// Initialize the generator
const generator = new MarketingDescriptionGenerator();

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Generate marketing description endpoint
 * POST /api/generate-description
 */
app.post('/api/generate-description', async (req, res) => {
    try {
        const { bedrooms, bathrooms, size, location, price, propertyType, amenities } = req.body;

        // Validation
        if (!bedrooms || !bathrooms || !location || !price) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['bedrooms', 'bathrooms', 'location', 'price'],
                received: Object.keys(req.body)
            });
        }

        // Validate data types
        if (typeof bedrooms !== 'number' || typeof bathrooms !== 'number' || typeof price !== 'number') {
            return res.status(400).json({
                error: 'Invalid data types',
                message: 'bedrooms, bathrooms, and price must be numbers'
            });
        }

        if (bedrooms < 1 || bathrooms < 1 || price < 1) {
            return res.status(400).json({
                error: 'Invalid values',
                message: 'bedrooms, bathrooms, and price must be positive numbers'
            });
        }

        const propertyData = {
            bedrooms,
            bathrooms,
            size,
            location,
            price,
            propertyType: propertyType || 'home',
            amenities: amenities || []
        };

        console.log('Generating description for:', propertyData);

        const description = await generator.generateDescription(propertyData);

        res.json({
            success: true,
            description,
            propertyData,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating description:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Get sample property data for testing
 */
app.get('/api/sample-properties', (req, res) => {
    const sampleProperties = [
        {
            bedrooms: 3,
            bathrooms: 2,
            size: 1800,
            location: "Downtown Seattle",
            price: 650000,
            propertyType: "condo",
            amenities: ["gym", "rooftop terrace", "concierge"]
        },
        {
            bedrooms: 4,
            bathrooms: 3,
            size: 2400,
            location: "Beverly Hills",
            price: 1200000,
            propertyType: "house",
            amenities: ["pool", "garage", "gourmet kitchen", "hardwood floors"]
        },
        {
            bedrooms: 2,
            bathrooms: 1,
            size: 950,
            location: "Austin, TX",
            price: 285000,
            propertyType: "apartment",
            amenities: ["parking", "laundry", "balcony"]
        }
    ];

    res.json({
        success: true,
        sampleProperties,
        usage: "Use these sample properties to test the /api/generate-description endpoint"
    });
});

/**
 * API documentation endpoint
 */
app.get('/api/docs', (req, res) => {
    const documentation = {
        title: "Property Marketing Description API",
        version: "1.0.0",
        baseUrl: `http://localhost:${PORT}`,
        endpoints: {
            "POST /api/generate-description": {
                description: "Generate a compelling marketing description for a property",
                required: ["bedrooms", "bathrooms", "location", "price"],
                optional: ["size", "propertyType", "amenities"],
                example: {
                    request: {
                        bedrooms: 3,
                        bathrooms: 2,
                        size: 1800,
                        location: "Downtown Seattle",
                        price: 650000,
                        propertyType: "condo",
                        amenities: ["gym", "rooftop terrace", "concierge"]
                    },
                    response: {
                        success: true,
                        description: "Discover this exceptional 3-bedroom, 2-bathroom condo...",
                        propertyData: "{ ... }",
                        generatedAt: "2024-01-01T12:00:00.000Z"
                    }
                }
            },
            "GET /api/sample-properties": {
                description: "Get sample property data for testing"
            },
            "GET /health": {
                description: "Health check endpoint"
            }
        }
    };

    res.json(documentation);
});

// Start server
app.listen(PORT, () => {
    console.log(`🏠 Property Marketing Server running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    console.log(`🧪 Sample Data: http://localhost:${PORT}/api/sample-properties`);
});

module.exports = app;