/**
 * BUSINESS RULE: Order Return Validation
 *
 * Table:   Order Return (x_1974680_return_0_order_return)
 * When:    Before
 * Insert:  true
 * Update:  false
 *
 * Purpose:
 * Runs four checks before a return record is created.
 * If any check fails, the submission is blocked and the
 * customer sees an error message. The record is never
 * created until all checks pass.
 *
 * Checks performed:
 * 0 - Duplicate check: no existing return for this order number
 * 1 - Identity check: order number and email match a single Order record
 * 2 - Last name check: last name matches the last word of the
 *     requested_for display name on the matched Order record
 * 3 - Return window check: order_date is within the last 14 days
 *
 * Security note:
 * Error messages are deliberately vague and do not reveal which
 * specific field failed. This prevents bad actors from narrowing
 * down which detail is incorrect.
 */

(function executeRule(current, previous /*null when async*/) {

    // ─────────────────────────────────────────
    // Grab form values once, reuse throughout
    // ─────────────────────────────────────────
    var orderNumber = current.getValue('order_number');
    var email       = current.getValue('email');
    var lastName    = (current.getValue('last_name') || '').toLowerCase().trim();

    // ─────────────────────────────────────────
    // STEP 0: Prevent duplicate return requests
    // ─────────────────────────────────────────
    var dup = new GlideRecord(current.getTableName());
    dup.addQuery('order_number', orderNumber);
    dup.addQuery('sys_id', '!=', current.getUniqueValue());
    dup.setLimit(1);
    dup.query();

    if (dup.next()) {
        current.setAbortAction(true);
        gs.addErrorMessage('A return request has already been submitted for this order.');
        return;
    }

    // ─────────────────────────────────────────
    // STEP 1: Query Order item table
    // ─────────────────────────────────────────
    var orderGR = new GlideRecord('x_1974680_return_0_order_item');
    orderGR.addQuery('number', orderNumber);
    orderGR.addQuery('requested_for.email', email);
    orderGR.setLimit(1);
    orderGR.query();

    if (!orderGR.next()) {
        current.setAbortAction(true);
        gs.addErrorMessage('We could not verify your order. ' +
                           'Please check your order number, ' +
                           'last name, and email address.');
        return;
    }

    // ─────────────────────────────────────────
    // STEP 2: Extract last word from full name
    // and compare against submitted last name
    // ─────────────────────────────────────────
    var fullName        = orderGR.getDisplayValue('requested_for').toLowerCase().trim();
    var nameParts       = fullName.split(' ');
    var lastNameOnOrder = nameParts[nameParts.length - 1];

    if (lastNameOnOrder !== lastName) {
        current.setAbortAction(true);
        gs.addErrorMessage('We could not verify your order. ' +
                           'Please check your order number, ' +
                           'last name, and email address.');
        return;
    }

    // ─────────────────────────────────────────
    // STEP 3: Check 14 day return window
    // ─────────────────────────────────────────
    var orderCreated = new GlideDateTime(orderGR.getValue('order_date'));
    var now          = new GlideDateTime();
    var diff         = GlideDateTime.subtract(orderCreated, now);
    var daysDiff     = Math.abs(diff.getDayPart());

    if (daysDiff > 14) {
        current.setAbortAction(true);
        gs.addErrorMessage('The 14 day return window for this ' +
                           'order has passed. Please contact ' +
                           'customer service for assistance.');
        return;
    }

    // ─────────────────────────────────────────
    // STEP 4: All checks passed — allow insert
    // ─────────────────────────────────────────
    current.setValue('order_reference', orderGR.getValue('sys_id'));

})(current, previous);
