#!/usr/bin/env node

/**
 * Test script for the Property Marketing Description API
 * Demonstrates the marketing description generation functionality
 */

const axios = require('axios').default;

const API_BASE_URL = 'http://localhost:3001/api';

class MarketingAPITester {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Test the marketing description generation with sample properties
     */
    async runTests() {
        console.log('🏠 Testing Property Marketing Description API\n');
        console.log('=' .repeat(60));

        try {
            // Test 1: Luxury property
            console.log('\n📍 Test 1: Luxury Beverly Hills Home');
            console.log('-'.repeat(40));
            await this.testProperty({
                bedrooms: 4,
                bathrooms: 3.5,
                size: 3200,
                location: "Beverly Hills, CA",
                price: 1850000,
                propertyType: "house",
                amenities: ["pool", "wine cellar", "chef's kitchen", "3-car garage", "home theater"]
            });

            // Test 2: Urban condo
            console.log('\n📍 Test 2: Modern Downtown Condo');
            console.log('-'.repeat(40));
            await this.testProperty({
                bedrooms: 2,
                bathrooms: 2,
                size: 1200,
                location: "Downtown Chicago, IL",
                price: 485000,
                propertyType: "condo",
                amenities: ["gym", "rooftop deck", "concierge", "city views"]
            });

            // Test 3: Starter home
            console.log('\n📍 Test 3: Affordable Suburban Starter Home');
            console.log('-'.repeat(40));
            await this.testProperty({
                bedrooms: 3,
                bathrooms: 2,
                size: 1450,
                location: "Austin, TX",
                price: 320000,
                propertyType: "house",
                amenities: ["garage", "backyard", "updated kitchen"]
            });

            // Test 4: Waterfront property
            console.log('\n📍 Test 4: Waterfront Villa');
            console.log('-'.repeat(40));
            await this.testProperty({
                bedrooms: 5,
                bathrooms: 4,
                size: 4100,
                location: "Miami Beach, FL",
                price: 2750000,
                propertyType: "villa",
                amenities: ["private beach access", "infinity pool", "boat dock", "smart home automation"]
            });

            console.log('\n' + '=' .repeat(60));
            console.log('✅ All tests completed successfully!');

        } catch (error) {
            console.error('\n❌ Test failed:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                console.log('\n💡 Make sure the server is running:');
                console.log('   npm run server');
            }
        }
    }

    /**
     * Test a single property description generation
     */
    async testProperty(propertyData) {
        try {
            const response = await axios.post(`${this.baseUrl}/generate-description`, propertyData);
            
            if (response.data.success) {
                console.log(`Property: ${propertyData.bedrooms}BR/${propertyData.bathrooms}BA in ${propertyData.location}`);
                console.log(`Price: $${propertyData.price.toLocaleString()}`);
                console.log(`Size: ${propertyData.size ? propertyData.size.toLocaleString() + ' sq ft' : 'N/A'}`);
                console.log('\n📝 Generated Marketing Description:');
                console.log('-'.repeat(50));
                console.log(response.data.description);
                console.log('-'.repeat(50));
            } else {
                console.error('❌ Failed to generate description');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Test API endpoints
     */
    async testEndpoints() {
        console.log('🔍 Testing API Endpoints\n');

        try {
            // Test health endpoint
            console.log('Testing /health endpoint...');
            const healthResponse = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
            console.log('✅ Health check:', healthResponse.data.status);

            // Test sample properties endpoint
            console.log('\nTesting /api/sample-properties endpoint...');
            const samplesResponse = await axios.get(`${this.baseUrl}/sample-properties`);
            console.log(`✅ Sample properties: ${samplesResponse.data.sampleProperties.length} properties loaded`);

            // Test docs endpoint
            console.log('\nTesting /api/docs endpoint...');
            const docsResponse = await axios.get(`${this.baseUrl}/docs`);
            console.log('✅ API documentation loaded');

        } catch (error) {
            console.error('❌ Endpoint test failed:', error.message);
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const tester = new MarketingAPITester();

    if (args.includes('--endpoints')) {
        await tester.testEndpoints();
        return;
    }

    if (args.includes('--help')) {
        console.log(`
Property Marketing API Tester

Usage:
  node test-marketing-api.js           # Run full property description tests
  node test-marketing-api.js --endpoints # Test API endpoints only
  node test-marketing-api.js --help      # Show this help

Make sure the marketing server is running first:
  npm run server
        `);
        return;
    }

    await tester.runTests();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = MarketingAPITester;