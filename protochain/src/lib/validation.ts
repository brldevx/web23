/**
 * File name: validation.ts
 * Description: File responsible for implementing the validation class.
 * Author: brldevx
 * Creation date: 04/12/2024
 */

/**
 * Validation class
 */
class Validation {
  success: boolean;
  message: string;

  /**
   * Creates a new validation object
   * @param success If the validation is successful
   * @param message The validation message, if validation fails
   */
  constructor(success: boolean = true, message: string = "") {
    this.success = success;
    this.message = message;
  }
}

export default Validation;
