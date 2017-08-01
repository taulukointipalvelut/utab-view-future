
export default class FormValidator {
  static validators (...fns) {
    return (rule, value, callback) => {
      if (fns.every((fn) => fn(value))) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
  }
  static not (fn) {
    return x => !fn(x)
  }
  static is_integer (x) {
    return Number.isInteger(Number(x))
  }
  static is_nonzero (x) {
    return Number(x) !== 0
  }
  static is_positive (x) {
    return Number(x) >= 0
  }
  static is_negative (x) {
    return Number(x) <= 0
  }
  static is_exists (lazy_list, key, cast=false) {
    return x => lazy_list.value.map(v => cast ? cast(v[key]) : v[key]).includes(cast ? cast(x) : x)
  }
}

export const validators = FormValidator.validators
export const not = FormValidator.not
export const is_integer = FormValidator.is_integer
export const is_nonzero = FormValidator.is_nonzero
export const is_positive = FormValidator.is_positive
export const is_exists = FormValidator.is_exists
