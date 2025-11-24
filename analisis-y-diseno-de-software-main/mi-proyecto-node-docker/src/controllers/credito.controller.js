/**
 * Credito Controller
 * Controlador para endpoints de créditos
 */

import creditoService from '../services/credito.service.js';

export class CreditoController {
    /**
     * POST /api/simulaciones
     * Simular crédito
     */
    async simular(req, res) {
        const { monto, tasaInteres, plazoMeses } = req.body;

        // Validar que los campos existan
        if (!monto || tasaInteres === undefined || !plazoMeses) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Monto, tasa de interés y plazo son requeridos'
            });
        }

        // Obtener clienteId si está autenticado (opcional)
        const clienteId = req.user?.clienteId || null;

        // Obtener IP y User Agent para tracking
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        const resultado = await creditoService.simular(
            { monto: parseFloat(monto), tasaInteres: parseFloat(tasaInteres), plazoMeses: parseInt(plazoMeses) },
            clienteId,
            ipAddress,
            userAgent
        );

        res.status(200).json({
            message: 'Simulación calculada exitosamente',
            data: resultado
        });
    }

    /**
     * POST /api/creditos
     * Solicitar crédito
     */
    async solicitar(req, res) {
        const clienteId = req.user.clienteId;
        const { monto, tasaInteres, plazoMeses, tipo, simulacionId, notas } = req.body;

        if (!monto || tasaInteres === undefined || !plazoMeses || !tipo) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Monto, tasa de interés, plazo y tipo son requeridos'
            });
        }

        const credito = await creditoService.solicitar(
            {
                monto: parseFloat(monto),
                tasaInteres: parseFloat(tasaInteres),
                plazoMeses: parseInt(plazoMeses),
                tipo,
                simulacionId,
                notas
            },
            clienteId
        );

        res.status(201).json({
            message: 'Solicitud de crédito creada exitosamente',
            data: credito
        });
    }

    /**
     * GET /api/creditos
     * Obtener todos los créditos del cliente autenticado
     */
    async obtenerCreditos(req, res) {
        const clienteId = req.user.clienteId;

        const creditos = await creditoService.obtenerCreditosCliente(clienteId);

        res.status(200).json({
            data: creditos
        });
    }

    /**
     * GET /api/creditos/:id
     * Obtener detalle de un crédito específico
     */
    async obtenerDetalle(req, res) {
        const creditoId = req.params.id;
        const clienteId = req.user.clienteId;

        const detalle = await creditoService.obtenerDetalle(creditoId, clienteId);

        res.status(200).json({
            data: detalle
        });
    }

    /**
     * POST /api/creditos/:id/aprobar
     * Aprobar un crédito (endpoint administrativo - futuro)
     */
    async aprobar(req, res) {
        const creditoId = req.params.id;
        const { montoAprobado } = req.body;

        const resultado = await creditoService.aprobar(creditoId, montoAprobado);

        res.status(200).json({
            message: 'Crédito aprobado exitosamente',
            data: resultado
        });
    }

    /**
     * POST /api/creditos/:id/desembolsar
     * Desembolsar un crédito aprobado (endpoint administrativo - futuro)
     */
    async desembolsar(req, res) {
        const creditoId = req.params.id;

        const resultado = await creditoService.desembolsar(creditoId);

        res.status(200).json({
            message: 'Crédito desembolsado exitosamente',
            data: resultado
        });
    }

    /**
     * POST /api/creditos/:id/rechazar
     * Rechazar un crédito (endpoint administrativo - futuro)
     */
    async rechazar(req, res) {
        const creditoId = req.params.id;
        const { motivo } = req.body;

        const resultado = await creditoService.rechazar(creditoId, motivo);

        res.status(200).json({
            message: 'Crédito rechazado',
            data: resultado
        });
    }

    /**
     * GET /api/simulaciones
     * Obtener historial de simulaciones del cliente
     */
    async obtenerHistorialSimulaciones(req, res) {
        const clienteId = req.user.clienteId;
        const limit = parseInt(req.query.limit) || 10;

        const simulaciones = await creditoService.obtenerHistorialSimulaciones(clienteId, limit);

        res.status(200).json({
            data: simulaciones
        });
    }

    /**
     * GET /api/creditos/estadisticas
     * Obtener estadísticas del cliente
     */
    async obtenerEstadisticas(req, res) {
        const clienteId = req.user.clienteId;

        const estadisticas = await creditoService.obtenerEstadisticas(clienteId);

        res.status(200).json({
            data: estadisticas
        });
    }
}

export default new CreditoController();
