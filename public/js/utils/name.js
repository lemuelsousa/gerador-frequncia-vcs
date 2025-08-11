function isCompoundName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }

    // Trim whitespace and split by spaces
    const trimmedName = name.trim();

    const words = trimmedName.split(/\s+/);

    // Filter out empty strings and words that are just spaces
    const validWords = words.filter(word => word.length >= 2);

    // A compound name must have at least 2 valid words
    return validWords.length >= 2;
}

export const nameValidationRules = [
    {
      test: (value) => value.length >= 2,
      message: "ter no mínimo dois caracteres",
    },
    {
      test: (value) => value.length <= 50,
      message: "ter no máximo 50 caracteres",
    },
    {
      test: (value) => /^[\p{L}\s]+$/u.test(value),
      message: "deve conter apenas letras e espaçamentos",
    },
    {
      test: (value) => isCompoundName(value),
      message: "deve ser composto por ao menos dois nomes",
    }
  ];