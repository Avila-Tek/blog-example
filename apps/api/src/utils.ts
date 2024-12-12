export function getCodeAndMessageFromErrorString(candidate: string) {
  // All http codes are 3 digits nombers so in a `000-error` strin the index 3 must be the dash
  if (candidate.charAt(3) === '-') {
    const [_code, _error] = candidate.split('-');
    const code = Number.isNaN(Number(_code)) ? 500 : Number(_code);
    return {
      code,
      error: typeof _error === 'undefined' ? 'Internal server error' : _error,
    };
  }
  return {
    code: 500,
    error:
      typeof candidate === 'undefined' ? 'Internal server error' : candidate,
  };
}
