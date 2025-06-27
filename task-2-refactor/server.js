const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const Joi = require('joi');
const winston = require('winston');
const { Readable } = require('stream');

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Mock Property model for demonstration
class Property {
  static async insertMany(properties) {
    // Simulate database batch insert
    logger.info(`Batch inserting ${properties.length} properties`);
    return properties.map((prop, index) => ({ ...prop, id: Date.now() + index }));
  }
}

// Mock authentication middleware
const authenticateUser = (req, res, next) => {
  req.user = { id: 'broker_123' }; // Mock user
  next();
};

// File upload configuration with security constraints
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  }
});

// Property validation schema
const propertySchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  price: Joi.number().positive().required(),
  projectId: Joi.string().trim().min(1).required()
});

// Stream-based CSV processing function
const processCSVStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let rowIndex = 0;

    const stream = Readable.from(buffer.toString())
      .pipe(csv())
      .on('data', (data) => {
        rowIndex++;
        
        // Validate each row
        const { error, value } = propertySchema.validate(data, { stripUnknown: true });
        
        if (error) {
          errors.push({
            row: rowIndex,
            data: data,
            error: error.details[0].message
          });
        } else {
          results.push(value);
        }
      })
      .on('end', () => {
        resolve({ validProperties: results, errors });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Refactored import endpoint
app.post("/import-properties", 
  authenticateUser,
  upload.single("properties-csv"), 
  async (req, res) => {
    const startTime = Date.now();
    
    try {
      // Input validation
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No CSV file provided'
        });
      }

      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Empty CSV file provided'
        });
      }

      logger.info('Starting CSV import', {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        brokerId: req.user.id
      });

      // Process CSV with streaming
      const { validProperties, errors } = await processCSVStream(req.file.buffer);

      if (validProperties.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid properties found in CSV',
          validationErrors: errors
        });
      }

      // Add brokerId to all valid properties
      const propertiesWithBroker = validProperties.map(property => ({
        ...property,
        brokerId: req.user.id,
        createdAt: new Date()
      }));

      // Batch insert - much more efficient than individual inserts
      const insertedProperties = await Property.insertMany(propertiesWithBroker);

      const processingTime = Date.now() - startTime;

      logger.info('CSV import completed successfully', {
        totalRows: validProperties.length + errors.length,
        successfulInserts: insertedProperties.length,
        errorCount: errors.length,
        processingTimeMs: processingTime,
        brokerId: req.user.id
      });

      // Return comprehensive response
      const response = {
        success: true,
        message: 'Import completed',
        summary: {
          totalProcessed: validProperties.length + errors.length,
          successful: insertedProperties.length,
          failed: errors.length,
          processingTimeMs: processingTime
        }
      };

      // Include validation errors if any exist
      if (errors.length > 0) {
        response.validationErrors = errors;
        response.message = `Import completed with ${errors.length} validation errors`;
      }

      res.status(200).json(response);

    } catch (error) {
      logger.error('CSV import failed', {
        error: error.message,
        stack: error.stack,
        brokerId: req.user?.id,
        fileName: req.file?.originalname
      });

      res.status(500).json({
        success: false,
        error: 'Internal server error during import',
        message: 'Please try again or contact support if the problem persists'
      });
    }
  }
);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB'
      });
    }
  }
  
  logger.error('Unhandled error', { error: error.message, stack: error.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;