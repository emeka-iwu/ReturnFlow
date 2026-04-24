/**
 * BUSINESS RULE: Auto Populate Requested For
 *
 * Table:   Order Return (x_1974680_return_0_order_return)
 * When:    After
 * Insert:  true
 * Update:  false
 *
 * Purpose:
 * Automatically copies the requested_for field value from the
 * matched Order record onto the Order Return record after it
 * is created. This ensures the return record is always linked
 * to the correct customer without requiring manual input.
 *
 * How it works:
 * Queries the Order table using the order number submitted on
 * the return form. If a matching record is found, the
 * requested_for value is copied across to the Order Return record.
 */

(function executeRule(current, previous /*null when async*/) {

    // ─────────────────────────────────────────
    // Query Order table using order number
    // entered on the return form
    // ─────────────────────────────────────────
    var orderGR = new GlideRecord('x_1974680_return_0_order_item');
    orderGR.addQuery('number', current.getValue('order_number'));
    orderGR.setLimit(1);
    orderGR.query();

    if (orderGR.next()) {
        // ─────────────────────────────────────
        // Copy requested_for value from Order
        // record to Order Return record
        // ─────────────────────────────────────
        current.setValue('requested_for', orderGR.getValue('requested_for'));
        current.update();
    }

})(current, previous);
