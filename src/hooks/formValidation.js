import { useState, useCallback } from "react";

function useFormWithValidation(defaultValues = {}) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(defaultValues);
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (evt) => {
    const { name, value, type } = evt.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    setIsValid(evt.target.form.checkValidity());
  };
  const setServerError = useCallback((fieldName, message) => {
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  });
  const validateForm = useCallback((form) => {
    if (!form) {
      return;
    }
    const newErrors = {};

    const password = form.elements["password"];
    const confirmPass = form.elements["confirmPass"];
    if (password && confirmPass) {
      if (password.value !== confirmPass.value) {
        password.setCustomValidity("Passwords must match");
        confirmPass.setCustomValidity("Passwords must match");
      } else {
        password.setCustomValidity("");
        confirmPass.setCustomValidity("");
      }
    }
    Array.from(form.elements).forEach((el) => {
      if (el.name) {
        el.checkValidity();
        newErrors[el.name] = el.validationMessage;
      }
    });
    setErrors(newErrors);
    setIsValid(form.checkValidity());
  }, []);
  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [],
  );
  return {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    validateForm,
    setServerError,
  };
}

export { useFormWithValidation };
