export const applyOperation = (left: number, operation: string, right: number): number => {
  switch (operation) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/":
      if (right === 0) throw new Error("Division by zero");
      return left / right;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
};
