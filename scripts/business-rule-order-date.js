/**
 * BUSINESS RULE: Auto Populate Order Date
 * 
 * Table:   Order (x_xxx_order)
 * When:    After
 * Insert:  true
 * Update:  false
 * 
 * Purpose:
 * Copies the sys_created_on value into the order_date field
 * after a new Order record is created.
 * 
 * Reason this exists:
 * ServiceNow does not allow sys_created_on to be manually edited.
 * The order_date field was created as a workaround so the 14 day
 * return window validation can be tested by backdating this field
 * without touching the system generated created date.
 */

(function executeRule(current, previous /*null when async*/) {

    current.setValue('order_date', current.getValue('sys_created_on'));
    current.update();

})(current, previous);
