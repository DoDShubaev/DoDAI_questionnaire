import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { surveyService } from '../services/surveyService.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/surveys - Get all survey responses
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
  handleValidationErrors
], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const surveys = await surveyService.getAll(limit, offset);
    
    res.json({
      success: true,
      data: surveys,
      pagination: {
        limit,
        offset,
        total: surveys.length
      }
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/surveys/stats - Get survey statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await surveyService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/surveys/:id - Get survey response by ID
router.get('/:id', [
  param('id').notEmpty().withMessage('Survey ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const survey = await surveyService.getById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey response not found'
      });
    }
    
    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/surveys - Create new survey response
router.post('/', [
  body('age_group').optional().isString().trim(),
  body('current_activity').optional().isArray(),
  body('self_definition').optional().isString().trim(),
  body('known_ai_tools').optional().isArray(),
  body('ai_usage_level').optional().isString().trim(),
  body('ai_experience').optional().isString().trim(),
  body('ai_learning_method').optional().isArray(),
  body('main_ai_goal').optional().isString().trim(),
  body('biggest_ai_challenge').optional().isString().trim(),
  body('ai_creation_dream').optional().isString().trim(),
  body('future_ai_impact').optional().isString().trim(),
  body('monthly_spending').optional().isString().trim(),
  body('ai_barriers').optional().isArray(),
  body('community_interest').optional().isString().trim(),
  body('specific_ai_help').optional().isString().trim(),
  body('investment_willingness').optional().isString().trim(),
  body('platform_access').optional().isString().trim(),
  body('first_name').optional().isString().trim().isLength({ max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('completion_time').optional().isInt({ min: 0 }),
  body('ai_analysis').optional().isString().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    const surveyData = req.body;
    
    const newSurvey = await surveyService.create(surveyData);
    
    res.status(201).json({
      success: true,
      message: 'Survey response created successfully',
      data: newSurvey
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/surveys/:id - Update survey response
router.put('/:id', [
  param('id').notEmpty().withMessage('Survey ID is required'),
  body('age_group').optional().isString().trim(),
  body('current_activity').optional().isArray(),
  body('self_definition').optional().isString().trim(),
  body('known_ai_tools').optional().isArray(),
  body('ai_usage_level').optional().isString().trim(),
  body('ai_experience').optional().isString().trim(),
  body('ai_learning_method').optional().isArray(),
  body('main_ai_goal').optional().isString().trim(),
  body('biggest_ai_challenge').optional().isString().trim(),
  body('ai_creation_dream').optional().isString().trim(),
  body('future_ai_impact').optional().isString().trim(),
  body('monthly_spending').optional().isString().trim(),
  body('ai_barriers').optional().isArray(),
  body('community_interest').optional().isString().trim(),
  body('specific_ai_help').optional().isString().trim(),
  body('investment_willingness').optional().isString().trim(),
  body('platform_access').optional().isString().trim(),
  body('first_name').optional().isString().trim().isLength({ max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('completion_time').optional().isInt({ min: 0 }),
  body('ai_analysis').optional().isString().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    const surveyData = req.body;
    const updatedSurvey = await surveyService.update(req.params.id, surveyData);
    
    if (!updatedSurvey) {
      return res.status(404).json({
        success: false,
        message: 'Survey response not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Survey response updated successfully',
      data: updatedSurvey
    });
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/surveys/:id - Delete survey response
router.delete('/:id', [
  param('id').notEmpty().withMessage('Survey ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const deletedSurvey = await surveyService.delete(req.params.id);
    
    if (!deletedSurvey) {
      return res.status(404).json({
        success: false,
        message: 'Survey response not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Survey response deleted successfully',
      data: deletedSurvey
    });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router; 