class EligibilityService {
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    const conditions = this.getConditions(criteria);

    /**
     * Example of list of conditions object
     * {
     *  basic: [],
     *  gt: [],
     *  lt: [],
     *  gte: [],
     *  lte: [],
     *  in: [],
     *  and: [ gt, lt, gte, lte, in, or, and ],
     *  or: [ gt, lt, gte, lte, in, or, and  ]
     * }
     */

    return this.validate(cart, conditions);
  }

  /**
   * mapping criterias with validation functions
   */
  validateCondition = {
    basic: this.validateBasicCondition.bind(this),
    gt: this.validateGtCondition.bind(this),
    lt: this.validateLtCondition.bind(this),
    gte: this.validateGteCondition.bind(this),
    lte: this.validateLteCondition.bind(this),
    in: this.validateInCondition.bind(this),
    and: this.validateAndCondition.bind(this),
    or: this.validateOrCondition.bind(this),
  }

  /**
   * Return all conditions from criteria JSON
   * @param criteria 
   * @returns {object}
   */
  getConditions(criteria) {
    return Object.entries(criteria).reduce((pre, [key, value]) => {
      if (value !== undefined && value !== null) {
        this.isBasicCondition(value) && pre.basic.push({
          [[key]]: value
        });
        
        this.isGtCondition(value) && pre.gt.push({
          [[key]]: value.gt
        });
  
        this.isLtCondition(value) && pre.lt.push({
          [[key]]: value.lt
        });
  
        this.isGteCondition(value) && pre.gte.push({
          [[key]]: value.gte
        });
  
        this.isLteCondition(value) && pre.lte.push({
          [[key]]: value.lte
        });
  
        this.isInCondition(value) && pre.in.push({
          [[key]]: value.in
        });
  
        this.isAndCondition(value) && pre.and.push({
          [[key]]: value.and
        });
  
        this.isOrCondition(value) && pre.or.push({
          [[key]]: value.or
        });
      }

      return pre;
    }, {
      basic: [],
      gt: [],
      lt: [],
      gte: [],
      lte: [],
      in: [],
      and: [],
      or: []
    });
  }

  /**
   * Check if the condition is basic condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isBasicCondition(condition) {
    return typeof condition !== 'object'
  }

  /**
   * Check if the condition is gt condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isGtCondition(condition) {
    return Object.keys(condition).length === 1 && condition.gt;
  }

  /**
   * Check if the condition is lt condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isLtCondition(condition) {
    return Object.keys(condition).length === 1 && condition.lt
  }

  /**
   * Check if the condition is gte condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isGteCondition(condition) {
    return Object.keys(condition).length === 1 && condition.gte
  }

  /**
   * Check if the condition is lte condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isLteCondition(condition) {
    return Object.keys(condition).length === 1 && condition.lte;
  }

  /**
   * Check if the condition is in condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isInCondition(condition) {
    return condition.in && Array.isArray(condition.in);
  }

  /**
   * Check if the condition is and condition
   * @param {*} condition 
   * @returns {boolean}
   */
  isAndCondition(condition) {
    return !!condition.and && Object.keys(condition.and).length >= 2;
  }

  /**
   * Check if the condition is or condition
   * @param {*} condition 
   * @returns {boolean} 
   */
  isOrCondition(condition) {
    return !!condition.or && Object.keys(condition.or).length >= 2;
  }

  /**
   * Validate the card by conditions
   * @param {*} cart 
   * @param {*} conditions 
   * @returns {boolean}
   */
  validate(cart, conditions) {
    return Object.keys(conditions).every(key => {
      return conditions[key].every(condition => {
        const [conditionKey, conditionValue] = Object.entries(condition).flat();
        const cartValues = this.getObjectValues(cart, conditionKey);
        
        // validate the condition
        return this.validateCondition[key](cartValues, conditionValue);
      });
    })
  }

  /**
   * Validates the basic condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateBasicCondition(cartValues, conditionValue) {
    return cartValues.find(cartValue => cartValue == conditionValue) === undefined
      ? false
      : true;
  }

  /**
   * Validates the gt condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateGtCondition(cartValues, conditionValue) {
    return cartValues.find(cartValue => cartValue > conditionValue) === undefined
      ? false
      : true;
  }

  /**
   * Validates the lt condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateLtCondition(cartValues, conditionValue) {
    return cartValues.find(cartValue => cartValue < conditionValue) === undefined
      ? false
      : true;
  }

  /**
   * Validates the gte condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateGteCondition(cartValues, conditionValue) {
    return cartValues.find(cartValue => cartValue >= conditionValue) === undefined
      ? false
      : true;
  }

  /**
   * Validates the lte condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateLteCondition(cartValues, conditionValue) {
    return cartValues.find(cartValue => cartValue <= conditionValue) === undefined
      ? false
      : true;
  }

  /**
   * Validates the in condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateInCondition(cartValues, conditionValue) {
    return conditionValue.find(value => cartValues.includes(value)) === undefined
      ? false
      : true;
  }

  /**
   * Validates the and condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateAndCondition(cartValues, conditionValue) {
    return Object.keys(conditionValue).every(key => {
      return this.validateCondition[key](cartValues, conditionValue[key]);
    });
  }

  /**
   * Validates the or condition
   * @param {*} cartValues 
   * @param {*} conditionValue 
   * @returns {boolean}
   */
  validateOrCondition(cartValues, conditionValue) {
    // FIXED with some
    return Object.keys(conditionValue).some(key => {
      return this.validateCondition[key](cartValues, conditionValue[key]);
    });
  }

  /**
   * Get an Array of object values, using flattened key
   * @param {*} cart 
   * @param {*} flattenedKey 
   * @returns {Array}
   */
  getObjectValues(cart, flattenedKey) {
    const res = flattenedKey.split('.').reduce((previous, key) => {
      return !previous 
        ? []
        : previous && Array.isArray(previous)
          ? previous.map(p => p[key])
          : previous[key]
    }, cart);

    return res == undefined
      ? []
      : Array.isArray(res) ? res : [res];
  }
}

module.exports = {
  EligibilityService,
};
