const crypto = require('crypto');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const mongoose = require('mongoose');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/webhooks/razorpay
 *
 * Handles async Razorpay events as a server-side safety net.
 * This ensures payment + registration are confirmed even if the
 * client-side confirmPayment call fails (e.g. user closes browser
 * after paying).
 *
 * Razorpay signs the webhook payload with the webhook secret (set in
 * the Razorpay Dashboard). We verify the signature before processing.
 */
const handleRazorpayWebhook = asyncHandler(async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If a webhook secret is configured, verify the signature
    if (webhookSecret) {
        const razorpaySignature = req.headers['x-razorpay-signature'];
        if (!razorpaySignature) {
            return res.status(400).json({ error: 'Missing Razorpay signature header' });
        }

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }
    }

    const event = req.body.event;
    const payloadPayment = req.body.payload?.payment?.entity;

    if (!event || !payloadPayment) {
        return res.status(200).json({ received: true });
    }

    const razorpayOrderId = payloadPayment.order_id;
    const razorpayPaymentId = payloadPayment.id;

    // Find our payment record by the Razorpay order ID stored during initiation
    const payment = await Payment.findOne({ providerTransactionId: razorpayOrderId });

    if (!payment) {
        // Unknown payment — acknowledge and ignore
        return res.status(200).json({ received: true });
    }

    if (event === 'payment.captured') {
        // Only process if still in INITIATED state (idempotency)
        if (payment.status !== 'INITIATED') {
            return res.status(200).json({ received: true, note: 'Already processed' });
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const tournament = await Tournament.findById(payment.tournamentId).session(session);
            const existingRegistration = await Registration.findOne({
                userId: payment.userId,
                tournamentId: payment.tournamentId
            }).session(session);

            if (!existingRegistration && tournament) {
                const team = payment.teamId
                    ? await Team.findById(payment.teamId).session(session)
                    : null;

                tournament.filledSlots += 1;
                await tournament.save({ session });

                await Registration.create(
                    [{
                        userId: payment.userId,
                        tournamentId: payment.tournamentId,
                        teamId: team?._id || null,
                        paymentId: payment._id,
                        registeredAt: new Date()
                    }],
                    { session }
                );

                if (team) {
                    team.locked = true;
                    await team.save({ session });
                }
            }

            payment.status = 'SUCCESS';
            payment.providerTransactionId = razorpayPaymentId;
            payment.paidAt = new Date();
            payment.metadata = {
                ...payment.metadata,
                webhookEvent: event,
                webhookProcessedAt: new Date().toISOString()
            };
            await payment.save({ session });

            await session.commitTransaction();
            console.log(`[Webhook] Payment captured: ${razorpayPaymentId}, registration confirmed for user ${payment.userId}`);
        } catch (err) {
            await session.abortTransaction();
            console.error('[Webhook] Error processing payment.captured:', err);
            return res.status(500).json({ error: 'Webhook processing failed' });
        } finally {
            await session.endSession();
        }
    } else if (event === 'payment.failed') {
        if (payment.status === 'INITIATED') {
            payment.status = 'FAILED';
            payment.metadata = {
                ...payment.metadata,
                webhookEvent: event,
                failureReason: payloadPayment.error_description,
                webhookProcessedAt: new Date().toISOString()
            };
            await payment.save();
            console.log(`[Webhook] Payment failed: ${razorpayPaymentId}`);
        }
    }

    // Always acknowledge Razorpay
    return res.status(200).json({ received: true });
});

module.exports = { handleRazorpayWebhook };
