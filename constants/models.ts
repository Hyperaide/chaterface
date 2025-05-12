export const models = [
    // { id: 'openai/gpt-4o', name: 'GPT 4o', speed: 193, intelligence: 50, creditCost: 2 },
    // { id: 'openai/gpt-4o-mini', name: 'GPT 4o Mini', speed: 68, intelligence: 36, creditCost: 1 },
    { id: 'openai/gpt-4.1', name: 'GPT 4.1', speed: 132, intelligence: 53 },
    { id: 'openai/gpt-4.1-mini', name: 'GPT 4.1 Mini', speed: 229, intelligence: 53 },
    { id: 'openai/gpt-4.1-nano', name: 'GPT 4.1 Nano', speed: 293, intelligence: 41, free: true },
    { id: 'openai/o3', name: 'o3', speed: 130, intelligence: 72 },
    { id: 'openai/o4-mini', name: 'o4 Mini', speed: 139, intelligence: 70 },
    // { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', speed: 77, intelligence: 44, creditCost: 1 },
    { id: 'anthropic/claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', speed: 76, intelligence: 57 },
    { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', speed: 250, intelligence: 48, free: true },
    { id: 'google/gemini-2.5-pro-exp-03-25', name: 'Gemini 2.5 Pro Experimental', speed: 162, intelligence: 68 },
  ];


// pricing in dollars per 1M tokens
export const modelPricing = {
  "openai/gpt-4.1": {
    "input": 2.00,
    "output": 8.00
  },
  "openai/gpt-4.1-mini": {
    "input": 0.40,
    "output": 1.60
  },
  "openai/gpt-4.1-nano": {
    "input": 0.10,
    "output": 0.40
  },
  "openai/o3": {
    "input": 10.00,
    "output": 40.00
  },
  "openai/o4-mini": {
    "input": 1.10,
    "output": 4.40
  }

}

export const calculateCreditCost = (model: string, usage: any) => {
  // calculate the cost of the usage
  const pricing = modelPricing[model as keyof typeof modelPricing];
  const inputCost = pricing.input * (usage.promptTokens / 1000000);
  const outputCost = pricing.output * (usage.completionTokens / 1000000);
  const totalCost = inputCost + outputCost;

  const totalCostWithMarkup = totalCost * 2;

  // round up to the nearest mill
  const totalCostWithMarkupRounded = Math.ceil(totalCostWithMarkup * 1000) / 1000;

  // total credit cost
  const totalCreditCost = totalCostWithMarkupRounded * 1000;

  return totalCreditCost;
}
