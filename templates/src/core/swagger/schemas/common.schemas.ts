/**
 * @swagger
 * components:
 *   schemas:
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Numéro de page actuel
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Nombre d'éléments par page
 *           example: 10
 *         total:
 *           type: integer
 *           description: Nombre total d'éléments
 *           example: 100
 *         totalPages:
 *           type: integer
 *           description: Nombre total de pages
 *           example: 10
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items: {}
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     HealthCheck:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "ok"
 *         timestamp:
 *           type: string
 *           format: date-time
 *         uptime:
 *           type: number
 *           description: Temps de fonctionnement en secondes
 */

export {};
