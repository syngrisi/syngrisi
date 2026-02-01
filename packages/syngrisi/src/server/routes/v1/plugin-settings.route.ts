/**
 * Plugin Settings Routes
 * API endpoints for managing plugin configurations.
 */

import { Router } from 'express';
import { ensureLoggedIn } from '@middlewares/ensureLogin/ensureLoggedIn';
import { authorization } from '@middlewares';
import * as pluginSettingsController from '../../controllers/plugin-settings.controller';

const router = Router();

// Debug logging for all requests to this route
router.use((req, res, next) => {
    console.log('[plugin-settings.route] Request received:', req.method, req.url);
    next();
});

// All routes require login and superadmin role
router.use(ensureLoggedIn());
router.use(authorization('admin'));

/**
 * GET /v1/plugin-settings
 * Get all plugins with their effective configuration
 */
router.get('/', pluginSettingsController.getAllPluginSettings);

/**
 * GET /v1/plugin-settings/:pluginName
 * Get single plugin settings
 */
router.get('/:pluginName', pluginSettingsController.getPluginSettings);

/**
 * PUT /v1/plugin-settings/:pluginName
 * Update plugin settings
 */
router.put('/:pluginName', pluginSettingsController.updatePluginSettings);

/**
 * POST /v1/plugin-settings/:pluginName/toggle
 * Toggle plugin enabled/disabled
 */
router.post('/:pluginName/toggle', pluginSettingsController.togglePlugin);

export default router;
