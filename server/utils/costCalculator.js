// Calculadora de costos de tokens
const MODEL_PRICES = {
  // OpenAI
  "gpt-4o": {
    input: 2.5,
    output: 1.25
  },
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.075
  },
  // Claude
  "claude-3-7-sonnet-20240307": {
    input: 3.0,
    output: 15.0
  }
};

const calculateCost = (model, inputTokens, outputTokens) => {
  const safeInputTokens = parseInt(inputTokens || 0, 10);
  const safeOutputTokens = parseInt(outputTokens || 0, 10);
  
  const inputMillions = safeInputTokens / 1000000;
  const outputMillions = safeOutputTokens / 1000000;
  
  const modelPrices = MODEL_PRICES[model] || MODEL_PRICES["gpt-4o-mini"];
  
  const inputCost = inputMillions * modelPrices.input;
  const outputCost = outputMillions * modelPrices.output;
  
  return inputCost + outputCost;
};

module.exports = { calculateCost, MODEL_PRICES };
